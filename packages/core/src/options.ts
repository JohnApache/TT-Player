import { NormalObject } from './type';


const DEFAULT_OPTIONS = {
    root     : '' as Selector,
    width    : 600,
    height   : 300,
    mediaType: 'video' as MediaType,
};

class Options {

    public root: HTMLElement;
    public width: number | string;
    public height: number | string;
    public mediaType: MediaType;
    [key: string]: any;

    constructor (options: Partial<OptionsType>) {
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
            this.width = `${ this.width }px`;
        }

        this.mediaType = options.mediaType || DEFAULT_OPTIONS.mediaType;

        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined') return;
            this[item] = options[item];
        });
    }

}

export type Selector = 'string';
export type MediaType = 'video' | 'audio';

export interface OptionsType extends NormalObject {
    root: Selector | HTMLElement;
    width: number | string;
    height: number | string;
    mediaType: MediaType;
}

export default Options;
