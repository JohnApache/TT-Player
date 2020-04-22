

import { TTPlayerMediaOptions } from '../media';
import { IVideoOptions } from './type';

const DEFAULT_OPTIONS = {
    src     : '',
    width   : 600,
    height  : 300,
    poster  : '',
    tabindex: 2,
};

class TTPlayerVideoOptions extends TTPlayerMediaOptions {

    public width: number | string;
    public height: number | string;
    public poster: string;
    public tabindex: number;

    constructor (options: IVideoOptions = {}) {
        super(options);
        this.width = options.width || DEFAULT_OPTIONS.width;
        this.height = options.height || DEFAULT_OPTIONS.height;
        this.poster = options.poster || DEFAULT_OPTIONS.poster;
        this.tabindex = options.tabindex || DEFAULT_OPTIONS.tabindex;

        this.storeExtraOptions(options);
    }

}

export default TTPlayerVideoOptions;
