import { NormalObject } from './type';
declare class Options {
    root: HTMLElement;
    width: number | string;
    height: number | string;
    [key: string]: any;
    constructor(options: Partial<OptionsType>);
}
export declare type Selector = 'string';
export interface OptionsType extends NormalObject {
    root: Selector | HTMLElement;
    width: number | string;
    height: number | string;
}
export default Options;
