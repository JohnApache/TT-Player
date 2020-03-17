import EventEmitter from 'eventemitter3';
import {
    VideoActionsType, VideoSource, VideoPreload,
} from './type';
import VideoOptions from './options';
import { VIDEO_NATIVE_EVENTS } from './events';
import VideoActions from './actions';
import { PLUGIN_NAME } from './config';
import * as DispatchAction from './dispatch';
import initFlvMSE from './mse/flv';
import initHlsMSE from './mse/hls';
import initDashMSE from './mse/dash';
import initWebTorrentMSE from './mse/webtorrent';
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
    public evs: string[] = VIDEO_NATIVE_EVENTS;

    private ugs: Function[] = [];
    private actUgs: Function[] = [];
    private __flv__: FlvJs.Player | null = null;
    private __hls__: Hls | null = null;
    private __dash__: dashjs.MediaPlayerClass | null = null;
    private __webtorrent__: WebTorrent.Instance | null = null;

    constructor (player: TTPlayerCore) {
        super();
        this.player = player;
        this.root = this.player.root;
        this.event = this.player.event;
        this.video = DOMUtils.createUtilDom('video');
        this.options = new VideoOptions(player.options.video);
    }

    init () {
        this.bindEvents()
            .bindActions()
            .initVideoStyle()
            .initVideoMedia()
            .initMSE()
            .render();
        return this;
    }

    render () {
        this.root.prepend(this.video.getInstance());
        return this;
    }

    destroy () {
        this.clearMSE()
            .removeEvents()
            .removeActions();
        return this;
    }

    protected initVideoStyle () {
        this.video
            .addClass('ttplayer--video');
        return this;
    }

    protected initVideoMedia () {
        const {
            src, volume, muted,
        } = this.options;

        this.setVideoSrc(src)
            .setVolume(volume)
            .setMuted(muted);
        return this;
    }

    private play (): Promise<void> {
        return this.video.getInstance().play();
    }

    private pause () {
        this.video.getInstance().pause();
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

    private seek (time: number) {
        const video = this.video.getInstance();
        let nextTime = time;
        if (nextTime < 0) nextTime = 0;
        if (nextTime > video.duration) nextTime = video.duration;
        video.currentTime = nextTime;
        return this;
    }

    private screenshot () {
        const canvas = document.createElement('canvas');
        const width = this.video.width();
        const height = this.video.height();
        canvas.width = width;
        canvas.height = height;
        const cvs = canvas.getContext('2d');
        if (!cvs) throw new Error('canvas not support');
        cvs.drawImage(this.video.getInstance(), 0, 0, width, height);
        canvas.toBlob(blob => {
            if (!blob) return;
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'TTPlayer.png';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        });
    }

    private spreadVideoNativeEvent (ev: string, data: any) {
        this.event.emit(ev, data);

        // this.event.emit(`${ PLUGIN_NAME }${ ev.charAt(0).toUpperCase() }${ ev.slice(1) }`, data);
        return this;
    }

    protected bindEvents () {
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

    protected removeEvents () {
        this.ugs.forEach(ug => ug());
        this.ugs = [];
        return this;
    }

    protected bindActions () {
        const VVideoActions: VideoActionsType = VideoActions;
        Object.keys(VVideoActions).forEach(item => {
            const actionName = VVideoActions[item];
            const fn = (data: any) => {
                switch (actionName) {
                    case VideoActions.PlayAction:
                        this.play();
                        break;
                    case VideoActions.PauseAction:
                        this.pause();
                        break;
                    case VideoActions.SeekAction:
                        this.seek(data);
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
                    case VideoActions.ScreenShotAction:
                        this.screenshot();
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

    protected removeActions () {
        this.actUgs.forEach(ug => ug());
        this.actUgs = [];
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

export { DispatchAction };
export default TTPlayerVideo;
