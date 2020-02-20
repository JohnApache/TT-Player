import EventEmitter from 'eventemitter3';
import { VideoSource, VideoPreload } from './type';
import VideoOptions from './options';
import VIDEO_EVENTS from './events';
import VideoActions from './actions';
import { PLUGIN_NAME } from './config';
import { dUtils as DOMUtils, bUtils } from '@dking/ttplayer-utils';
import TTPlayerCore, { Plugin } from '@dking/ttplayer-core';

class TTPlayerVideo extends Plugin {

    static pluginName: string = PLUGIN_NAME;

    public pluginName: string = PLUGIN_NAME;
    public player: TTPlayerCore;
    public event: EventEmitter;
    public video: DOMUtils<HTMLVideoElement>;
    public root: DOMUtils<HTMLElement>;
    public options: VideoOptions
    public evs: string[] = VIDEO_EVENTS;

    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (player: TTPlayerCore) {
        super();
        this.player = player;
        this.root = this.player.root;
        this.event = this.player.event;
        this.video = DOMUtils.createUtilDom('video');
        this.options = new VideoOptions(player.options);
    }

    init () {
        this.bindEvents()
            .bindActions()
            .initVideoStyle()
            .initVideoMedia();
        return this;
    }

    render () {
        this.root.prepend(this.video.getInstance());
    }

    destroy () {
        this.removeEvents()
            .removeActions();
        return this;
    }

    private play (): Promise<void> {
        return this.video.getInstance().play();
    }

    private pause () {
        this.video.getInstance().pause();
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

    private setVideoSrc (src: string | VideoSource[]) {
        const video = this.video.getInstance();

        if (!src || src.length <= 0) {
            this.spreadVideoNativeEvent('error', new Error('invalid video src.'));
            return this;
        }

        if (typeof src === 'string') {
            video.src = src;
            return this;
        }

        src.forEach(item => {
            const source = bUtils.CreateDom('source');
            source.setAttribute('src', item.src);
            source.setAttribute('type', item.type || '');
            this.video.append(source);
        });

        return this;
    }

    private setVolume (volume: number) {
        const video = this.video.getInstance();
        video.volume = volume;
        return this;
    }

    private setMuted (muted: boolean) {
        const video = this.video.getInstance();
        video.muted = muted;
        return this;
    }

    private setPreload (preload: VideoPreload) {
        const video = this.video.getInstance();
        video.preload = preload;
        return this;
    }

    private setPoster (poster: string) {
        const video = this.video.getInstance();
        video.poster = poster;
        return this;
    }

    private setLoop (loop: boolean) {
        const video = this.video.getInstance();
        video.loop = loop;
        return this;
    }

    private spreadVideoNativeEvent (ev: string, data: any) {
        this.event.emit(`${ PLUGIN_NAME }${ ev.charAt(0).toUpperCase() }${ ev.slice(1) }`, data);
    }

    private bindEvents () {
        const video = this.video.getInstance();
        this.evs.forEach(ev => {
            const fn = this.spreadVideoNativeEvent.bind(this, ev);
            video.addEventListener(ev, fn);
            this.ugs.push(() => {
                video.removeEventListener(ev, fn);
            });
        });

        return this;
    }

    private removeEvents () {
        this.ugs.forEach(ug => ug());
        return this;
    }

    private bindActions () {
        Object.keys(VideoActions).forEach(actionName => {
            const fn = (data: any) => {
                switch (actionName) {
                    case VideoActions.PlayAction:
                        this.play();
                        break;
                    case VideoActions.PauseAction:
                        this.pause();
                        break;
                    case VideoActions.VolumeAction:
                        this.setVolume(data);
                        break;
                    case VideoActions.MuteAction:
                        this.setMuted(data);
                        break;
                    case VideoActions.PreloadAction:
                        this.setPreload(data);
                        break;
                    case VideoActions.PosterAction:
                        this.setPoster(data);
                        break;
                    case VideoActions.LoopAction:
                        this.setLoop(data);
                        break;
                    case VideoActions.DestroyAction:
                        this.destroy();
                        break;
                    default:
                }
            };

            this.event.on(actionName, fn);
            this.actUgs.push(() => {
                this.event.off(actionName, fn);
            });
        });

        return this;
    }

    private removeActions () {
        this.actUgs.forEach(ug => ug());
        return this;
    }

}

export default TTPlayerVideo;
