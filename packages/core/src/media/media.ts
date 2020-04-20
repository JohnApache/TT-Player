import EventEmitter from 'eventemitter3';
import { TTPlayerCore } from '../core';
import { ILogger } from '../logger';
import { MEDIA_NATIVE_EVENTS } from './events';
import MediaOptions, { TMediaPreload } from './options';
import TTPlayerMediaComponent from './component';
import { DOMUtils } from '@dking/ttplayer-utils';

interface IMediaTypeMap {
    'Video': HTMLVideoElement;
    'Audio': HTMLAudioElement;
}

type TMediaType = keyof IMediaTypeMap;


abstract class TTPlayerMedia<T extends TMediaType> {

    static mediaType: TMediaType;
    public mediaType: TMediaType;
    public player: TTPlayerCore;
    public root: DOMUtils<HTMLElement>;
    public media: DOMUtils<IMediaTypeMap[T]>;
    public mediaDom: IMediaTypeMap[T];
    public logger: ILogger;
    public evs = MEDIA_NATIVE_EVENTS
    public ugs: Function[] = [];
    public event: EventEmitter;
    public options: MediaOptions;

    constructor (mediaType: TMediaType, player: TTPlayerCore) {
        this.mediaType = mediaType;
        this.player = player;
        this.root = this.player.root;
        this.event = player.event;
        this.logger = this.player.logger;
        const mediaElement = this.getMediaInstance();
        this.mediaDom = mediaElement;
        this.media = new DOMUtils(mediaElement);
        this.options = new MediaOptions(player.options.media);
    }

    abstract getMediaInstance(): IMediaTypeMap[T];
    abstract beforeMount(): any;
    abstract mounted(): any;
    abstract beforeDestroy(): any;

    public init () {
        this.bindEvents()
            .render();
        return this;
    }

    public render () {
        const {
            src,
            volume,
            muted,
            loop,
            autoplay,
            controls,
            preload,
        } = this.options;

        this.media
            .addClass('ttplayer__media--component');

        this.src = src;
        this.volume = volume;
        this.muted = muted;
        this.loop = loop;
        this.autoplay = autoplay;
        this.controls = controls;
        this.preload = preload;
        this.root.prepend(this.mediaDom);
        return this;
    }

    public destroy () {
        this.beforeDestroy();
        this.removeEvents();
        return this;
    }

    get src (): string {
        return this.mediaDom.src;
    }

    set src (src: string) {
        this.mediaDom.src = src;
    }

    get autoplay (): boolean {
        return this.mediaDom.autoplay;
    }

    set autoplay (autoplay: boolean) {
        this.mediaDom.autoplay = autoplay;
    }

    get controls (): boolean {
        return this.mediaDom.controls;
    }

    set controls (controls: boolean) {
        this.mediaDom.controls = controls;
    }

    get volume (): number {
        return this.mediaDom.volume;
    }

    set volume (volume: number) {
        this.mediaDom.volume = volume;
        this.event.emit('volumechange');

        /* Bugs: 使用 JavaScript 直接更改音量，没有界面操作行为，不会触发 volumechange 事件。 */
    }

    get muted (): boolean {
        return this.mediaDom.muted;
    }

    set muted (muted: boolean) {
        this.mediaDom.muted = muted;
        this.event.emit('volumechange');

        /* Bugs: 使用 JavaScript 直接更改音量，没有界面操作行为，不会触发 volumechange 事件。 */
    }

    get preload (): TMediaPreload {
        return this.mediaDom.preload as TMediaPreload;
    }

    set preload (preload: TMediaPreload) {
        this.mediaDom.preload = preload;
    }

    get loop (): boolean {
        return this.mediaDom.loop;
    }

    set loop (loop: boolean) {
        this.mediaDom.loop = loop;
    }

    get playbackRate (): number {
        return this.mediaDom.playbackRate;
    }

    set playbackRate (playbackRate: number) {
        this.mediaDom.playbackRate = playbackRate;
    }

    public play (): Promise<void> {
        return this.mediaDom.play();
    }

    public pause () {
        this.mediaDom.pause();
    }

    public seek (time: number) {
        const media = this.media.getInstance();
        let nextTime = time;
        if (nextTime < 0) nextTime = 0;
        if (nextTime > media.duration) nextTime = media.duration;
        media.currentTime = nextTime;
        return this;
    }

    private spreadMediaNativeEvent (ev: string, data: any) {
        this.event.emit(ev, data);
        return this;
    }

    protected bindEvents () {
        const media = this.media.getInstance();
        this.evs.forEach(ev => {
            const fn = this.spreadMediaNativeEvent.bind(this, ev);
            media.addEventListener(ev, fn);
            this.ugs.push(() => {
                media.removeEventListener(ev, fn);
            });
        });

        this.event.once('canplay', () => {
            const { autoplay } = this.options;
            if (!autoplay) return;
            const prom = this.play();
            prom
                .then(() => {
                    this.event.emit('AutoplaySuccess');
                })
                .catch(() => {
                    this.event.emit('AutoplayFailed');
                });
        });
        return this;
    }

    protected removeEvents () {
        this.ugs.forEach(ug => ug());
        this.ugs = [];
        return this;
    }

}

export {
    IMediaTypeMap,
    TMediaType,
    MediaOptions,
    TTPlayerMediaComponent,
};

export default TTPlayerMedia;
