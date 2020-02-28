export interface VideoControlAttributes {
    height: number | string;
    playButton: boolean;
}


export interface VideoControlOptionsType extends Partial<VideoControlAttributes>{
    [key: string]: any;
}


export abstract class ControlComponent {

    abstract init(): any;
    abstract destroy(): any;
    abstract getInstance(): HTMLElement

}
