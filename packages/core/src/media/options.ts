import { BaseOptions } from '../options';

type TMediaPreload = 'auto' | 'meta' | 'none';

const DEFAULT_OPTIONS = {
    src     : '',
    volume  : 0.6,
    autoplay: false,
    muted   : false,
    loop    : false,
    controls: false,
    preload : 'auto' as TMediaPreload,
};

interface IMediaOptions {
    src: string;
    volume: number;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
    preload: TMediaPreload;
    [key: string]: any;
}

class TTPlayerMediaOptions extends BaseOptions {

    public src: string;
    public volume: number;
    public autoplay: boolean;
    public muted: boolean;
    public loop: boolean;
    public controls: boolean;
    public preload: TMediaPreload;

    constructor (options: Partial<IMediaOptions> = {}) {
        super();
        this.src = options.src || DEFAULT_OPTIONS.src;
        this.volume = options.volume || DEFAULT_OPTIONS.volume;
        this.autoplay = options.autoplay || DEFAULT_OPTIONS.autoplay;
        this.muted = options.muted || DEFAULT_OPTIONS.muted;
        this.loop = options.loop || DEFAULT_OPTIONS.loop;
        this.controls = options.controls || DEFAULT_OPTIONS.controls;
        this.preload = options.preload || DEFAULT_OPTIONS.preload;

        this.storeExtraOptions(options);
    }

}

export { IMediaOptions, TMediaPreload };

export default TTPlayerMediaOptions;
