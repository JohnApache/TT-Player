export interface AudioControlAttributes {
    height: number | string;
}


export interface AudioControlOptionsType extends Partial<AudioControlAttributes>{
    [key: string]: any;
}
