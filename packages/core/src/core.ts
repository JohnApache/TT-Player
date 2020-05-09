import EventEmitter from 'eventemitter3';
import Options, { OptionsType } from './options';
import PlayerHooks from './hooks';
import TTPlayerVideo from './media/video/index';
import TTPlayerAudio from './media/audio/index';
import CreateLogger, { ILogger } from './logger';
import Base from './base';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';


type TTPlayerMediaCtor = typeof TTPlayerVideo | typeof TTPlayerAudio;

class TTPlayerCore extends Base {

    static Hooks = PlayerHooks;
    static className: string = 'ttplayer--container';
    static mediasCtor: TTPlayerMediaCtor[] = [];

    public event: EventEmitter;
    public options: Options;
    public root: DOMUtils<HTMLDivElement>;
    public container: HTMLElement;
    public logger: ILogger;
    public medias: (TTPlayerVideo | TTPlayerAudio)[] = [];
    private ugs: Function[] = [];

    constructor (options: Partial<OptionsType>) {
        super();
        this.event = new EventEmitter();
        this.options = new Options(options);
        this.container = this.options.root;
        this.logger = CreateLogger(this.options.logger);
        this.root = DOMUtils.createUtilDom('div');
        this.initMedias();
    }

    static use (ctor: TTPlayerMediaCtor) {
        this.mediasCtor.push(ctor);
        return this;
    }

    public init () {
        this.bindEvents();
        this.logger.debug('TTPlayerCore init');
        this.event.emit(PlayerHooks.BeforeInit);
        this.renderMedias()
            .render()
            .ready();
        return this;
    }

    public destroy () {
        this.removeEvents();
        this.logger.debug('TTPlayerCore destroy');
        this.event.emit(PlayerHooks.BeforeDestroy);
        this.medias.forEach(media => media.componentWillUnmount());
        this.event.emit(PlayerHooks.Destroyed);
        return this;
    }

    private render () {
        const { width, height } = this.options;
        this.logger.debug('TTPlayerCore beforeRender');
        this.event.emit(PlayerHooks.BeforeRender);

        this.root
            .addClass(this.className)
            .css({ width, height })
            .prependTo(this.container);

        this.medias.forEach(media => media.componentDidMount());
        this.event.emit(PlayerHooks.Rendered);

        this.logger.debug('TTPlayerCore rendered');
        return this;
    }

    private ready () {
        this.logger.debug('TTPlayerCore ready');
        this.event.emit(PlayerHooks.Ready);
        return this;
    }

    private initMedias () {
        /* eslint-disable */
        const mediasCtor = (this.constructor as typeof TTPlayerCore).mediasCtor;
        /* eslint-enable */
        this.logger.debug('TTPlayerCore initMediasCtor:', mediasCtor);
        mediasCtor.forEach(mediaCtor => {
            this.medias.push(new mediaCtor(this));
        });
    }

    private renderMedias (): TTPlayerCore {
        this.logger.debug('TTPlayerCore renderMedias');
        this.medias.forEach(media => {
            media.componentWillMount();
            media.beforeRender();
            media.render();
            this.root.prepend(media.media.getInstance());
        });
        return this;
    }

    private bindEvents () {
        Object.keys(PlayerHooks).forEach(hook => {
            const HookName = PlayerHooks[hook as keyof typeof PlayerHooks];
            const fn = () => {
                this.logger.debug('TTPlayer trigger event: ', HookName);
            };
            this.event.on(HookName, fn);
            this.ugs.push(() => {
                this.event.off(HookName, fn);
            });
        });
    }

    private removeEvents () {
        this.ugs.forEach(ug => ug());
        this.ugs = [];
    }

    public dynamicUpdateOption (newOptions: Options) {
        /**
         * TODO 是否考虑动态更新配置? 怎么样通知每个组件去更新
         */
        super.dynamicUpdateOption(newOptions);
        this.event.emit(PlayerHooks.DynamicUpdateOptions, newOptions);
    }

}

const TTPlayerCoreFactory = (): typeof TTPlayerCore => {

    class T extends TTPlayerCore {

        static mediasCtor: TTPlayerMediaCtor[] = [];
        constructor (options: Partial<OptionsType>) {
            super(options);
        }

    }

    return T;
};

export { TTPlayerMediaCtor, TTPlayerCoreFactory };

export default TTPlayerCore;
