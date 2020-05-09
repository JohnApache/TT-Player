export interface VideoControlAttributes {
    height: number | string;
}


export interface VideoControlOptionsType extends Partial<VideoControlAttributes>{
    [key: string]: any;
}
