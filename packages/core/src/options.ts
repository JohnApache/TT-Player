import { NormalObject } from './type';

type Selector = 'string';
type MediaType = 'video' | 'audio';

interface ILoggerOptions {
    info: boolean;
    debug: boolean;
    log: boolean;
    error: boolean;
    warn: boolean;
}

interface OptionsType extends NormalObject {
    root: Selector | HTMLElement;
    width: number | string;
    height: number | string;
    mediaType: MediaType;
    logger: boolean | Partial<ILoggerOptions>;
}

const DEFAULT_OPTIONS = {
    root     : '' as Selector,
    width    : 600,
    height   : 300,
    mediaType: 'video' as MediaType,
    logger   : false,
};

class BaseOptions {

    [key: string]: any;
    storeExtraOptions (options: NormalObject) {
        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined') return;
            this[item] = options[item];
        });
    }

}

class Options extends BaseOptions {

    public root: HTMLElement;
    public width: number | string;
    public height: number | string;
    public mediaType: MediaType;
    public logger: boolean | Partial<ILoggerOptions>;
    constructor (options: Partial<OptionsType>) {
        super();
        if (!options.root) throw new Error(`root can't be empty`);
        if (typeof options.root === 'string') {
            const root = document.querySelector(options.root);
            if (!root) throw new Error(`root can't be empty`);
            this.root = root as HTMLElement;
        } else {
            this.root = options.root;
        }

        this.width = options.width || DEFAULT_OPTIONS.width;
        this.height = options.height || DEFAULT_OPTIONS.height;

        if (typeof this.width === 'number') {
            this.width = `${ this.width }px`;
        }

        if (typeof this.height === 'number') {
            this.height = `${ this.height }px`;
        }

        this.mediaType = options.mediaType || DEFAULT_OPTIONS.mediaType;
        this.logger = options.logger || DEFAULT_OPTIONS.logger;
        this.storeExtraOptions(options);
    }

}

export {
    BaseOptions,
    OptionsType,
    Selector,
    MediaType,
};


export default Options;
