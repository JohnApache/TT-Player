import {
    VideoOptionsType, VideoPreload, VideoSource,
} from './type';

const DEFAULT_OPTIONS = {
    src     : '',
    width   : 600,
    height  : 300,
    volume  : 0.6,
    autoplay: false,
    muted   : false,
    loop    : false,
    preload : 'none',
    poster  : '',
    tabindex: 2,
    controls: false,
};

class VideoOptions {

    public src: string | VideoSource[];
    public width: number | string;
    public height: number | string;
    public volume: number;
    public autoplay: boolean;
    public muted: boolean;
    public loop: boolean;
    public preload: VideoPreload;
    public poster: string;
    public tabindex: number;
    public controls: boolean;
    [key: string]: any;

    constructor (options: VideoOptionsType) {

        this.src = options.src || DEFAULT_OPTIONS.src;
        this.width = options.width || DEFAULT_OPTIONS.width;
        this.height = options.height || DEFAULT_OPTIONS.height;
        this.volume = options.volume || DEFAULT_OPTIONS.volume;
        this.autoplay = options.autoplay || DEFAULT_OPTIONS.autoplay;
        this.muted = options.muted || DEFAULT_OPTIONS.muted;
        this.loop = options.loop || DEFAULT_OPTIONS.loop;
        this.preload = options.preload || 'none';
        this.poster = options.poster || DEFAULT_OPTIONS.poster;
        this.tabindex = options.tabindex || DEFAULT_OPTIONS.tabindex;
        this.controls = options.controls || DEFAULT_OPTIONS.controls;

        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined') return;
            this[item] = options[item];
        });
    }

}

export default VideoOptions;
