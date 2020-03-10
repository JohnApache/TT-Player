import { DashJsOption } from '../../type';
import { MediaPlayerClass } from './dash';

declare global {
    interface Window {
        dashjs: MediaPlayerClass;
    }
}

const initDashMSE = (
    url: string,
    video: HTMLVideoElement,
    dashOption?: DashJsOption,
): MediaPlayerClass => {
    const dashjs = window.dashjs;
    if (!dashjs) throw new Error(`can't find dashjs`);
    const dash = dashjs.MediaPlayer().create();
    dashOption && dash.updateSettings(dashOption);
    dash.initialize(video, url, false);
    return dash;
};

export default initDashMSE;
