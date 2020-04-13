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
    }

    static use (videoComponentCtor: TTPlayerVideoComponentCtor) {
        this.videoComponentsCtor.push(videoComponentCtor);
        return this;
    }

    set src (src: string) {
        this.options.src = src;
        this.mediaDom.src = src;
        this.initMSE();
    }

    get poster (): string {
        return this.mediaDom.poster;
    }

    set poster (poster: string) {
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
        this.clearMSE();
        let {
            type, src, flvjs, hlsjs, dashjs, webtorrent,
        } = this.options;
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

        this.options.type = type;

        try {
            switch (type) {
                case 'flv':
                    this.__flv__ = initFlvMSE(src, video, flvjs);
                    break;
                case 'hls':
                    this.__hls__ = initHlsMSE(src, video, hlsjs);
                    break;
                case 'dash':
                    this.__dash__ = initDashMSE(src, video, dashjs);
                    break;
                case 'webtorrent':
                    this.__webtorrent__ = initWebTorrentMSE(src, video, webtorrent);
                    break;
                default:
            }
        } catch (error) {
            console.log(error);
            throw error;
        }

        return this;
    }

    private clearMSE () {
        const {
            __flv__, __hls__, __dash__, __webtorrent__,
        } = this;

        __flv__ && __flv__.destroy();
        __hls__ && __hls__.destroy();
        __dash__ && __dash__.reset();
        __webtorrent__ && __webtorrent__.destroy();

        this.__flv__ = this.__hls__ = this.__dash__ = this.__webtorrent__ = null;
        return this;
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
