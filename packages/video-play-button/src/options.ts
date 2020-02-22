import { PlayButtonOptionsType } from './type';

const DEFAULT_OPTIONS = { size: 100 };

class PlayButtonOptions {

    public size: number;
    [key: string]: any;

    constructor (options: PlayButtonOptionsType = {}) {
        this.size = options.size || DEFAULT_OPTIONS.size;

        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined') return;
            this[item] = options[item];
        });
    }

}

export default PlayButtonOptions;
