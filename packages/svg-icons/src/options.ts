import { SVGOptionsType } from './type';
import utils from '@dking/ttplayer-utils';

const MAX_SIZE = 100;
const DEFAULT_OPTIONS = {
    viewBox: [
        0,
        0,
        MAX_SIZE,
        MAX_SIZE,
    ],
    width  : `${ MAX_SIZE }px`,
    height : `${ MAX_SIZE }px`,
    path   : '',
    svgName: '',
};

class SVGOptions {

    public viewBox: number[];
    public path: string;
    public svgName: string;
    public width: string;
    public height: string;

    [key: string]: any;
    constructor (options: SVGOptionsType) {
        this.viewBox = options.viewBox || DEFAULT_OPTIONS.viewBox;
        this.path = options.path || '';
        this.svgName = options.svgName || '';

        this.width = utils.isUndefined(options.width) ? DEFAULT_OPTIONS.width :
            utils.isString(options.width) ? options.width : `${ options.width }px`;

        this.height = utils.isUndefined(options.height) ? DEFAULT_OPTIONS.height :
            utils.isString(options.height) ? options.height : `${ options.height }px`;

        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined') return;
            this[item] = options[item];
        });
    }

}


export default SVGOptions;
