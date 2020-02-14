import TTPlayerCore from '@dking/ttplayer-core';
import EventEmitter from 'eventemitter3';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import { VideoSource, VideoPreload } from './type';
import VideoOptions from './options';
declare class TTPlayerVideo {
    static pluginName: string;
    player: TTPlayerCore;
    event: EventEmitter;
    video: DOMUtils<HTMLVideoElement>;
    options: VideoOptions;
    constructor(player: TTPlayerCore);
    private init;
    private initVideoStyle;
    private initVideoMedia;
    setVideoSrc(src: string | VideoSource[]): this;
    setVolume(volume: number): this;
    setMuted(muted: boolean): this;
    setPreload(preload: VideoPreload): this;
    private bindEvents;
}
export default TTPlayerVideo;
