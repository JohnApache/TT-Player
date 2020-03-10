import { HlsJsOption } from '../../type';
import Hls from './hls';

declare global {
    interface Window {
        Hls: Hls;
    }
}

const initHlsMSE = (url: string, video: HTMLVideoElement, hlsOption?: Partial<HlsJsOption>): Hls => {
    const hlsjs = window.Hls;
    if (!hlsjs) throw new Error(`can't find hlsjs`);
    if (!hlsjs.isSupported()) throw new Error(`hlsjs is not supported`);

    const hls = new hlsjs(hlsOption);
    hls.loadSource(url);
    hls.attachMedia(video);
    return hls;
};

export default initHlsMSE;
