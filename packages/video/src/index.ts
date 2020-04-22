import {
    initFlvMSE,
    initHlsMSE,
    initDashMSE,
    initWebTorrentMSE,
} from './mse';
import VideoOptions from './options';
import { TTPlayerVideo as TTPlayerVideoBase, TTPlayerCore } from '@dking/ttplayer-core';

class TTPlayerVideo extends TTPlayerVideoBase {

    private __flv__: FlvJs.Player | null = null;
    private __hls__: Hls | null = null;
    private __dash__: dashjs.MediaPlayerClass | null = null;
    private __webtorrent__: WebTorrent.Instance | null = null;

    constructor (player: TTPlayerCore) {
        super(player);
        this.options = new VideoOptions(this.options);
        this.handleInitMSEError = this.handleInitMSEError.bind(this);
    }

    get src (): string {
        return this.mediaDom.src;
    }

    set src (src: string) {
        this.options.src = src;
        this.mediaDom.src = src;
        this.logger.info(`TTPlayerVideo set src ${ src }`);
        this.initMSE();
    }

    beforeMount () {
        super.beforeMount();
    }

    mounted () {
        super.mounted();
    }

    beforeDestroy () {
        super.beforeDestroy();
        this.clearMSE();
    }

    renderVideo () {
        this.media.addClass('ttplayer--video');
    }

    private initMSE () {
        this.logger.info('TTPlayerVideo init MSE');
        this.clearMSE();
        let {
            type, src, flvjs, hlsjs, dashjs, webtorrent,
        } = this.options;
        this.logger.debug('TTPlayerVideo init options', this.options);
        const video = this.video.getInstance();
        if (type === 'auto') {
            if ((/m3u8(#|\?|$)/i).exec(src)) {
                type = 'hls';
            } else if ((/.flv(#|\?|$)/i).exec(src)) {
                type = 'flv';
            } else if ((/.mpd(#|\?|$)/i).exec(src)) {
                type = 'dash';
            } else {
                type = 'normal';
            }
        }

        // 能直接播放hls的 不需要解析
        if (
            type === 'hls' &&
            (
                video.canPlayType('application/x-mpegURL') ||
                video.canPlayType('application/vnd.apple.mpegURL')
            )
        ) {
            type = 'normal';
        }

        this.logger.info('TTPlayerVideo current mse type', type);
        this.options.type = type;

        try {
            switch (type) {
                case 'flv':
                    this.__flv__ = initFlvMSE(src, video, flvjs);
                    this.__flv__.on('error', this.handleInitMSEError);
                    break;
                case 'hls':
                    this.__hls__ = initHlsMSE(src, video, hlsjs);
                    this.__hls__.on('hlsError', this.handleInitMSEError);
                    break;
                case 'dash':
                    this.__dash__ = initDashMSE(src, video, dashjs);
                    this.__dash__.on('error', this.handleInitMSEError);
                    break;
                case 'webtorrent':
                    this.__webtorrent__ = initWebTorrentMSE(src, video, webtorrent);
                    this.__webtorrent__.on('error', this.handleInitMSEError);
                    break;
                default:
            }

            this.logger.info('TTPlayerVideo current src', this.src);

        } catch (error) {
            this.logger.error(error);
            throw error;
        }

        return this;
    }

    private clearMSE () {
        this.logger.info('TTPlayerVideo clear MSE');
        const {
            __flv__, __hls__, __dash__, __webtorrent__,
        } = this;
        __flv__ && __flv__.off('error', this.handleInitMSEError) && __flv__.destroy();
        __hls__ && __hls__.off('hlsError', this.handleInitMSEError) && __hls__.destroy();
        __dash__ && __dash__.off('error', this.handleInitMSEError) && __dash__.reset();
        __webtorrent__ && __webtorrent__.off('error', this.handleInitMSEError) && __webtorrent__.destroy();

        this.__flv__ = this.__hls__ = this.__dash__ = this.__webtorrent__ = null;
        return this;
    }

    private handleInitMSEError (data: any) {
        this.event.emit('error', data);
    }

}


const TTPlayerVideoFactory = (): typeof TTPlayerVideo => {
    class T extends TTPlayerVideo {

        static videoComponentsCtor = [];
        constructor (player: TTPlayerCore) {
            super(player);
        }

    }

    return T;
};


export { TTPlayerVideoFactory, VideoOptions };

export default TTPlayerVideo;
