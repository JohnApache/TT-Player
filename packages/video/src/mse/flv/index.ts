import { FlvJsOption } from '../../type';
import FlvJs from './flv';

declare global {
    interface Window {
        flvjs: typeof FlvJs;
    }
}


const initFlvMSE = (url: string, video: HTMLVideoElement, flvjsOption: Partial<FlvJsOption>): FlvJs.Player => {

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
    flv.attachMediaElement(video);
    flv.load();
    return flv;
};

export default initFlvMSE;
