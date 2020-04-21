import initFlvMSE from './mse/flv';
import initHlsMSE from './mse/hls';
import initDashMSE from './mse/dash';
import initWebTorrentMSE from './mse/webtorrent';
import VideoOptions from './options';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import {
    TTPlayerMedia, TTPlayerCore, TMediaType, TTPlayerMediaComponent,
} from '@dking/ttplayer-core';

const MEDIA_TYPE: TMediaType = 'Video';

interface TTPlayerVideoComponentCtor {
    new (video: TTPlayerVideo): TTPlayerMediaComponent<'Video'>;
}

class TTPlayerVideo extends TTPlayerMedia<'Video'> {

    static mediaType = MEDIA_TYPE;
    static videoComponentsCtor: TTPlayerVideoComponentCtor[] = [];

    public video: DOMUtils<HTMLVideoElement>;
    public options: VideoOptions;
    public videoComponents: TTPlayerMediaComponent<'Video'>[] = []

    private __flv__: FlvJs.Player | null = null;
    private __hls__: Hls | null = null;
    private __dash__: dashjs.MediaPlayerClass | null = null;
    private __webtorrent__: WebTorrent.Instance | null = null;

    constructor (player: TTPlayerCore) {
        super(MEDIA_TYPE, player);
        this.video = this.media;

        this.options = new VideoOptions({
            ...player.options.media,
            ...player.options.video,
        });

        this.handleInitMSEError = this.handleInitMSEError.bind(this);
    }

    static use (videoComponentCtor: TTPlayerVideoComponentCtor) {
        this.videoComponentsCtor.push(videoComponentCtor);
        return this;
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

    get poster (): string {
        return this.mediaDom.poster;
    }

    set poster (poster: string) {
        this.logger.info(`TTPlayerVideo set poster ${ poster }`);
        this.mediaDom.poster = poster;
    }

    getMediaInstance () {
        if (!this.video) this.video = DOMUtils.createUtilDom('video');
        return this.video.getInstance();
    }

    beforeMount () {
        this.poster = this.options.poster;
        this.media.addClass('ttplayer--video');
        this.initVideoComponents();
    }

    mounted () {
        this.videoComponents.forEach(comp => {
            comp.mounted();
        });
    }

    beforeDestroy () {
        this.videoComponents.forEach(comp => comp.beforeDestroy());
    }

    private initVideoComponents () {
        TTPlayerVideo.videoComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.beforeMount();
            this.root.append(comp.root.getInstance());
            this.videoComponents.push(comp);
        });
        return this;
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

        constructor (player: TTPlayerCore) {
            super(player);
        }

    }

    return T;
};

abstract class TTPlayerVideoComponent extends TTPlayerMediaComponent<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

}

export {
    TTPlayerVideo, VideoOptions, TTPlayerVideoComponent,
};
export default TTPlayerVideoFactory;
