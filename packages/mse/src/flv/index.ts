import FlvJs from './flv';
import { VideoMSE, TTPlayerVideo } from '@dking/ttplayer-core';

declare global {
    interface Window {
        flvjs: typeof FlvJs;
    }
}

class FlvMSE extends VideoMSE {

    static MSE_TYPE: string = 'flv';
    public MSE_TYPE: string;
    public __flv__: FlvJs.Player | null = null;
    constructor (video: TTPlayerVideo) {
        super(video);
        this.handleFlvError = this.handleFlvError.bind(this);
        /* eslint-disable */
        this.MSE_TYPE = (this.constructor as typeof FlvMSE).MSE_TYPE || 'auto';
        /* eslint-enable */
    }

    checkType (url: string, type: string = 'auto'): boolean {
        if (type === this.MSE_TYPE) return true;
        return type === 'auto' && !!(/.flv(#|\?|$)/i).exec(url);
    }

    initMSE (url: string, flvjsOption?: any) {
        const {
            mediaDataSource = {},
            config = {},
        } = flvjsOption || {};
        const flvjs = window.flvjs;
        if (!flvjs) throw new Error(`can't find flvjs`);
        if (!flvjs.isSupported()) throw new Error(`flv is not supported`);

        const options = {
            url : url,
            type: 'flv',
            ...mediaDataSource,
        };

        const flv = flvjs.createPlayer(options, config);
        flv.attachMediaElement(this.video.mediaDom);
        flv.load();
        flv.on('error', this.handleFlvError);
        this.__flv__ = flv;
    }

    clearMSE () {
        if (this.__flv__) {
            this.__flv__.off('error', this.handleFlvError);
            this.__flv__.destroy();
        }
        this.__flv__ = null;
    }

    private handleFlvError (error: any) {
        this.video.event.emit('error', error);
    }

}

export default FlvMSE;
