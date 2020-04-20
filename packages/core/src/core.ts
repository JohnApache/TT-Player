import EventEmitter from 'eventemitter3';
import Options, { OptionsType } from './options';
import PlayerHooks from './hooks';
import TTPlayerMedia, { TMediaType } from './media/media';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

interface TTPlayerMediaCtor<T extends TMediaType> {
    new (player: TTPlayerCore): TTPlayerMedia<T>;
}

class TTPlayerCore {

    static playerHooks = PlayerHooks;
    static mediasCtor: TTPlayerMediaCtor<TMediaType>[] = [];

    public event: EventEmitter;
    public options: Options;
    public root: DOMUtils<HTMLDivElement>;
    public container: HTMLElement;
    public medias: TTPlayerMedia<TMediaType>[] = [];

    constructor (options: Partial<OptionsType>) {
        this.event = new EventEmitter();
        this.options = new Options(options);
        this.container = this.options.root;
        this.root = DOMUtils.createUtilDom('div');
    }

    static use (ctor: TTPlayerMediaCtor<TMediaType>) {
        this.mediasCtor.push(ctor);
        return this;
    }

    public init () {
        this.event.emit(PlayerHooks.BeforeInit);
        this.installMedias()
            .render()
            .ready();
        return this;
    }

    public destroy () {
        this.event.emit(PlayerHooks.BeforeDestroy);
        this.medias.forEach(media => media.destroy());
        this.event.emit(PlayerHooks.Destroyed);
        return this;
    }

    private render () {
        const { width, height } = this.options;

        this.event.emit(PlayerHooks.BeforeRender);

        this.root
            .addClass('ttplayer--container')
            .css({ width, height })
            .prependTo(this.container);

        this.medias.forEach(media => media.mounted());
        this.event.emit(PlayerHooks.Rendered);

        return this;
    }

    private ready () {
        this.event.emit(PlayerHooks.Ready);
        return this;
    }

    private installMedias (): TTPlayerCore {
        TTPlayerCore.mediasCtor.forEach(mediaCtor => {
            const media = new mediaCtor(this);
            media.init();
            media.beforeMount();
            this.medias.push(media);
        });
        return this;
    }

}

const TTPlayerCoreFactory = (): typeof TTPlayerCore => {
    class T extends TTPlayerCore {

        static mediasCtor: TTPlayerMediaCtor<TMediaType>[] = [];
        constructor (options: Partial<OptionsType>) {
            super(options);
        }

    }

    return T;
};

export { TTPlayerMediaCtor, TTPlayerCore };

export default TTPlayerCoreFactory;
