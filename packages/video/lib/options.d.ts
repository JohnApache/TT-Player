import { VideoOptionsType, VideoPreload, VideoSource } from './type';
declare class VideoOptions {
    src: string | VideoSource[];
    width: number | string;
    height: number | string;
    volume: number;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    preload: VideoPreload;
    poster: string;
    tabindex: number;
    controls: boolean;
    [key: string]: any;
    constructor(options: VideoOptionsType);
}
export default VideoOptions;
