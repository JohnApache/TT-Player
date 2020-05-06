import EventEmitter from 'eventemitter3';
import TTPlayerCore from '../core';
import { ILogger } from '../logger';
import Hooks from '../hooks';
import { LifeCycle } from '../base';
import { MEDIA_NATIVE_EVENTS } from './events';
import TTPlayerMediaOptions, { TMediaPreload } from './options';
import TTPlayerMediaComponent from './component';
import { DOMUtils } from '@dking/ttplayer-utils';

interface IMediaTypeMap {
    'Video': HTMLVideoElement;
    'Audio': HTMLAudioElement;
}

type TMediaType = keyof IMediaTypeMap;


abstract class TTPlayerMedia<T extends TMediaType> extends LifeCycle {

    static className: string = 'ttplayer__media--component'
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
    public options: TTPlayerMediaOptions;

    constructor (mediaType: TMediaType, player: TTPlayerCore) {
        super();
        this.mediaType = mediaType;
        this.player = player;
        this.root = this.player.root;
        this.event = player.event;
        this.logger = this.player.logger;
        const mediaElement = this.getMediaInstance();
        this.mediaDom = mediaElement;
        this.media = new DOMUtils(mediaElement);
        this.options = new TTPlayerMediaOptions(player.options.media);
        this.logger.info('TTPlayerMedia type', this.mediaType);
        this.logger.info('TTPlayerMedia options', this.options);
    }

    abstract getMediaInstance(): IMediaTypeMap[T];

    componentWillMount () {
        this.logger.debug(`TTPlayerMedia componentWillMount`);
        this.bindEvents();
    }

    componentDidMount () {
        this.logger.debug(`TTPlayerMedia componentDidMount`);
    }

    componentWillUnmount () {
        this.logger.debug(`TTPlayerMedia componentWillUnmount`);
        this.removeEvents();
    }

    beforeRender () {
        this.media
            .addClass(this.className);
    }

    render () {
        const {
            src,
            volume,
            muted,
            loop,
            autoplay,
            controls,
            preload,
        } = this.options;

        this.src = src;
        this.volume = volume;
        this.muted = muted;
        this.loop = loop;
        this.autoplay = autoplay;
        this.controls = controls;
        this.preload = preload;

        this.logger.debug(`TTPlayerMedia render`);
    }

    public destroy () {
        this.logger.debug(`TTPlayerMedia destroy`);
        this.componentWillUnmount();
        this.removeEvents();
        return this;
    }

    get src (): string {
        return this.mediaDom.src;
    }

    set src (src: string) {
        this.logger.debug(`media set src ${ src }`);
        this.mediaDom.src = src;
        this.options.src = src;
    }

    get autoplay (): boolean {
        return this.mediaDom.autoplay;
    }

    set autoplay (autoplay: boolean) {
        this.logger.debug(`media set autoplay ${ autoplay }`);
        this.mediaDom.autoplay = autoplay;
    }

    get controls (): boolean {
        return this.mediaDom.controls;
    }

    set controls (controls: boolean) {
        this.logger.debug(`media set controls ${ controls }`);
        this.mediaDom.controls = controls;
    }

    get volume (): number {
        return this.mediaDom.volume;
    }

    set volume (volume: number) {
        this.logger.debug(`media set volume ${ volume }`);
        this.mediaDom.volume = volume;
        this.event.emit('volumechange');

        /* Bugs: 使用 JavaScript 直接更改音量，没有界面操作行为，不会触发 volumechange 事件。 */
    }

    get muted (): boolean {
        return this.mediaDom.muted;
    }

    set muted (muted: boolean) {
        this.logger.debug(`media set muted ${ muted }`);
        this.mediaDom.muted = muted;
        this.event.emit('volumechange');

        /* Bugs: 使用 JavaScript 直接更改音量，没有界面操作行为，不会触发 volumechange 事件。 */
    }

    get preload (): TMediaPreload {
        /* Tips: 当preload 为 none 时不会触发 canplay 事件 */
        return this.mediaDom.preload as TMediaPreload;
    }

    set preload (preload: TMediaPreload) {
        this.logger.debug(`media set preload ${ preload }`);
        this.mediaDom.preload = preload;
    }

    get loop (): boolean {
        return this.mediaDom.loop;
    }

    set loop (loop: boolean) {
        this.logger.debug(`media set loop ${ loop }`);
        this.mediaDom.loop = loop;
    }

    get playbackRate (): number {
        return this.mediaDom.playbackRate;
    }

    set playbackRate (playbackRate: number) {
        this.logger.debug(`media set playbackRate ${ playbackRate }`);
        this.mediaDom.playbackRate = playbackRate;
    }

    get currentTime (): number {
        return this.mediaDom.currentTime;
    }

    set currentTime (currentTime: number) {
        this.logger.debug(`media set currentTime ${ currentTime }`);
        this.mediaDom.currentTime = currentTime;
    }

    get duration (): number {
        return this.mediaDom.duration;
    }

    public play (): Promise<void> {
        this.logger.info(`media run play`);
        return this.mediaDom.play();
    }

    public pause () {
        this.logger.info(`media run pause`);
        this.mediaDom.pause();
    }

    public seek (time: number) {
        // 当seek的时间不是标准时间的时候不能seek
        if (time === Infinity || Number.isNaN) return;
        let nextTime = time;
        if (nextTime < 0) nextTime = 0;
        if (nextTime > this.duration) nextTime = this.duration;
        this.currentTime = nextTime;
        this.logger.info(`media run seek`);
        this.logger.debug(`media seek time ${ nextTime }`);
        return this;
    }

    protected spreadMediaNativeEvent (ev: string, data: any) {
        // this.logger.debug(`media trigger event: ${ ev }`);
        this.event.emit(ev, data);
        return this;
    }

    protected bindEvents () {
        this.evs.forEach(ev => {
            const fn = this.spreadMediaNativeEvent.bind(this, ev);
            this.mediaDom.addEventListener(ev, fn);
            this.ugs.push(() => {
                this.mediaDom.removeEventListener(ev, fn);
            });
        });

        this.event.once('canplay', () => {
            const { autoplay } = this.options;
            if (!autoplay) return;
            const prom = this.play();
            prom
                .then(() => {
                    this.logger.info('media autoplay success');
                    this.event.emit(Hooks.AutoPlaySuccess);
                    this.event.emit('AutoplaySuccess');
                })
                .catch(() => {
                    this.logger.warn('media autoplay failed');
                    this.event.emit(Hooks.AutoPlayError);
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
    TTPlayerMediaOptions,
    TTPlayerMediaComponent,
};

export default TTPlayerMedia;
