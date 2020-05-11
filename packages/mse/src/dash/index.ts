import { MediaPlayerClass } from './dash';
import { VideoMSE, TTPlayerVideo } from '@dking/ttplayer-core';

declare global {
    interface Window {
        dashjs: MediaPlayerClass;
    }
}

class DashMSE extends VideoMSE {

    static MSE_TYPE: string = 'dash';
    public MSE_TYPE: string;
    public __dash__: MediaPlayerClass | null = null;

    constructor (video: TTPlayerVideo) {
        super(video);
        this.handleMSEError = this.handleMSEError.bind(this);
        /* eslint-disable */
        this.MSE_TYPE = (this.constructor as typeof DashMSE).MSE_TYPE || 'auto';
        /* eslint-enable */
    }

    checkType (url: string, type: string = 'auto'): boolean {
        if (type === this.MSE_TYPE) return true;
        return type === 'auto' && !!(/.mpd(#|\?|$)/i).exec(url);
    }

    initMSE (url: string, dashOption?: any) {
        const dashjs = window.dashjs;
        if (!dashjs) throw new Error(`can't find dashjs`);
        const dash = dashjs.MediaPlayer().create();
        dashOption && dash.updateSettings(dashOption);
        dash.initialize(this.video.mediaDom, url, false);
        dash.on('error', this.handleMSEError);
        this.__dash__ = dash;
    }

    clearMSE () {
        if (this.__dash__) {
            this.__dash__.off('error', this.handleMSEError);
            this.__dash__.reset();
        }
        this.__dash__ = null;
    }

    private handleMSEError (error: any) {
        this.video.event.emit('error', error);
    }

}

export default DashMSE;
