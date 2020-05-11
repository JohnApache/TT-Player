import Hls from './hls';
import { VideoMSE, TTPlayerVideo } from '@dking/ttplayer-core';

declare global {
    interface Window {
        Hls: Hls;
    }
}

class HlsMSE extends VideoMSE {

    static MSE_TYPE: string = 'hls';
    public MSE_TYPE: string;
    public __hls__: Hls | null = null;
    constructor (video: TTPlayerVideo) {
        super(video);
        this.handleFlvError = this.handleFlvError.bind(this);
        /* eslint-disable */
        this.MSE_TYPE = (this.constructor as typeof HlsMSE).MSE_TYPE || 'auto';
        /* eslint-enable */
    }

    checkType (url: string, type: string = 'auto'): boolean {
        if (type === this.MSE_TYPE) return true;
        if (
            this.video.mediaDom.canPlayType('application/x-mpegURL') ||
            this.video.mediaDom.canPlayType('application/vnd.apple.mpegURL')
        ) return false; // 能播放hls 的时候不需要用解析器
        return type === 'auto' && !!(/.m3u8(#|\?|$)/i).exec(url);
    }

    initMSE (url: string, hlsOption?: any) {
        const hlsjs = window.Hls;
        if (!hlsjs) throw new Error(`can't find hlsjs`);
        if (!hlsjs.isSupported()) throw new Error(`hlsjs is not supported`);

        const hls = new hlsjs(hlsOption);
        hls.loadSource(url);
        hls.attachMedia(this.video.mediaDom);
        this.__hls__ = hls;
    }

    clearMSE () {
        if (this.__hls__) {
            this.__hls__.off('hlsError', this.handleFlvError);
            this.__hls__.destroy();
        }
        this.__hls__ = null;
    }

    private handleFlvError (error: any) {
        this.video.event.emit('error', error);
    }

}

export default HlsMSE;
