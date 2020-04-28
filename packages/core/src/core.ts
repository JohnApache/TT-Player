import EventEmitter from 'eventemitter3';
import Options, { OptionsType } from './options';
import PlayerHooks from './hooks';
import TTPlayerVideo from './media/video/index';
import TTPlayerAudio from './media/audio/index';
import CreateLogger, { ILogger } from './logger';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';


type TTPlayerMediaCtor = typeof TTPlayerVideo | typeof TTPlayerAudio;

class TTPlayerCore {

    static Hooks = PlayerHooks;
    static mediasCtor: TTPlayerMediaCtor[] = [];

    public event: EventEmitter;
    public options: Options;
    public root: DOMUtils<HTMLDivElement>;
    public container: HTMLElement;
    public logger: ILogger;
    public medias: (TTPlayerVideo | TTPlayerAudio)[] = [];
    private ugs: Function[] = [];

    constructor (options: Partial<OptionsType>) {
        this.event = new EventEmitter();
        this.options = new Options(options);
        this.container = this.options.root;
        this.logger = CreateLogger(this.options.logger);
        this.root = DOMUtils.createUtilDom('div');
    }

    static use (ctor: TTPlayerMediaCtor) {
        this.mediasCtor.push(ctor);
        return this;
    }

    public init () {
        this.bindEvents();
        this.logger.info('TTPlayerCore init');
        this.event.emit(PlayerHooks.BeforeInit);
        this.installMedias()
            .render()
            .ready();
        return this;
    }

    public destroy () {
        this.removeEvents();
        this.logger.info('TTPlayerCore destroy');
        this.event.emit(PlayerHooks.BeforeDestroy);
        this.medias.forEach(media => media.destroy());
        this.event.emit(PlayerHooks.Destroyed);
        return this;
    }

    private render () {
        const { width, height } = this.options;
        this.logger.info('TTPlayerCore beforeRender');
        this.event.emit(PlayerHooks.BeforeRender);

        this.root
            .addClass('ttplayer--container')
            .css({ width, height })
            .prependTo(this.container);

        this.medias.forEach(media => media.mounted());
        this.event.emit(PlayerHooks.Rendered);

        this.logger.info('TTPlayerCore rendered');
        return this;
    }

    private ready () {
        this.logger.info('TTPlayerCore ready');
        this.event.emit(PlayerHooks.Ready);
        return this;
    }

    private installMedias (): TTPlayerCore {
        /* eslint-disable */
        const mediasCtor = (this.constructor as typeof TTPlayerCore).mediasCtor;
         /* eslint-enable */
        this.logger.debug('TTPlayerCore installMediasCtor:', mediasCtor);
        mediasCtor.forEach(mediaCtor => {
            const media = new mediaCtor(this);
            media.init();
            media.beforeMount();
            this.medias.push(media);
        });
        return this;
    }

    private bindEvents () {
        this.event.on(PlayerHooks.DynamicUpdateConfig, () => {
            // TODO 动态更新配置
        });
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
