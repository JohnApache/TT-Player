import TTPlayerCore from '@dking/ttplayer-core';
import EventEmitter from 'eventemitter3';
import { dUtils as DOMUtils, bUtils } from '@dking/ttplayer-utils';
import { VideoSource, VideoPreload } from './type';
import { VideoError } from './hooks';
import VideoOptions from './options';

class TTPlayerVideo {

    static pluginName: string = 'TTPlayerVideo';
    public player: TTPlayerCore;
    public event: EventEmitter;
    public video: DOMUtils<HTMLVideoElement>;
    public options: VideoOptions

    constructor (player: TTPlayerCore) {
        this.player = player;
        this.event = this.player.event;
        this.video = DOMUtils.createUtilDom('video');
        this.options = new VideoOptions(player.options);

        this.init();
    }

    private init () {
        this.bindEvents()
            .initVideoStyle()
            .initVideoMedia();
        return this;
    }

    private initVideoStyle () {
        this.video
            .addClass('ttplayer--video');
        return this;
    }

    private initVideoMedia () {
        const {
            src, volume, muted,
        } = this.options;

        this.setVideoSrc(src)
            .setVolume(volume)
            .setMuted(muted);
        return this;
    }

    setVideoSrc (src: string | VideoSource[]) {
        const video = this.video.getInstance();

        if (!src || src.length <= 0) {
            this.event.emit(VideoError, new Error('invalid options.'));
            return this;
        }

        if (typeof src === 'string') {
            video.src = src;
            return this;
        }

        src.forEach(item => {
            const source = bUtils.createDom('source');
            source.setAttribute('src', item.src);
            source.setAttribute('type', item.type || '');
            this.video.appendChild(source);
        });

        return this;
    }

    setVolume (volume: number) {
        const video = this.video.getInstance();
        video.volume = volume;
        return this;
    }

    setMuted (muted: boolean) {
        const video = this.video.getInstance();
        video.muted = muted;
        return this;
    }

    setPreload (preload: VideoPreload) {
        const video = this.video.getInstance();
        video.preload = preload;
        return this;
    }

    private bindEvents () {
        return this;
    }

}

export default TTPlayerVideo;
