interface FullScreenApiType {
    fullscreenEnabled: 'fullscreenEnabled' | 'webkitFullscreenEnabled' | 'mozFullScreenEnabled' | 'msFullscreenEnabled';
    fullscreenElement: 'fullscreenElement' | 'webkitFullscreenElement' | 'mozFullScreenElement' | 'msFullscreenElement';
    requestFullscreen: 'requestFullscreen' | 'webkitRequestFullscreen' | 'mozRequestFullScreen' | 'msRequestFullscreen';
    exitFullscreen: 'exitFullscreen' | 'webkitExitFullscreen' | 'mozCancelFullScreen' | 'msExitFullscreen';
    fullscreenchange: 'fullscreenchange' | 'webkitfullscreenchange' | 'mozfullscreenchange' | 'MSFullscreenChange';
    fullscreenerror: 'fullscreenerror' | 'webkitfullscreenerror' | 'mozfullscreenerror' | 'MSFullscreenError';
    fullscreen: 'fullscreen' | '-webkit-full-screen' | '-moz-full-screen' | '-ms-fullscreen';
}

declare global {
    interface Document {
        readonly fullscreenEnabled: boolean;
        readonly webkitFullscreenEnabled: boolean;
        readonly mozFullScreenEnabled: boolean;
        readonly msFullscreenEnabled: boolean;

        readonly fullscreenElement: Element | null;
        readonly webkitFullscreenElement: Element | null;
        readonly mozFullScreenElement: Element | null;
        readonly msFullscreenElement: Element | null;

        exitFullscreen: ()=> Promise<void>;
        webkitExitFullscreen: ()=> Promise<void>;
        mozCancelFullScreen: ()=> Promise<void>;
        msExitFullscreen: ()=> Promise<void>;
    }

    interface HTMLElement {
        requestFullscreen: ()=> Promise<void>;
        webkitRequestFullscreen: ()=> Promise<void>;
        mozRequestFullScreen: ()=> Promise<void>;
        msRequestFullscreen: ()=> Promise<void>;
    }
}

const standard: FullScreenApiType = {
    fullscreenEnabled: 'fullscreenEnabled',
    fullscreenElement: 'fullscreenElement',
    requestFullscreen: 'requestFullscreen',
    exitFullscreen   : 'exitFullscreen',
    fullscreenchange : 'fullscreenchange',
    fullscreenerror  : 'fullscreenerror',
    fullscreen       : 'fullscreen',
};

const webkit: FullScreenApiType = {
    fullscreenEnabled: 'webkitFullscreenEnabled',
    fullscreenElement: 'webkitFullscreenElement',
    requestFullscreen: 'webkitRequestFullscreen',
    exitFullscreen   : 'webkitExitFullscreen',
    fullscreenchange : 'webkitfullscreenchange',
    fullscreenerror  : 'webkitfullscreenerror',
    fullscreen       : '-webkit-full-screen',
};

const moz: FullScreenApiType = {
    fullscreenEnabled: 'mozFullScreenEnabled',
    fullscreenElement: 'mozFullScreenElement',
    requestFullscreen: 'mozRequestFullScreen',
    exitFullscreen   : 'mozCancelFullScreen',
    fullscreenchange : 'mozfullscreenchange',
    fullscreenerror  : 'mozfullscreenerror',
    fullscreen       : '-moz-full-screen',
};

const ms: FullScreenApiType = {
    fullscreenEnabled: 'msFullscreenEnabled',
    fullscreenElement: 'msFullscreenElement',
    requestFullscreen: 'msRequestFullscreen',
    exitFullscreen   : 'msExitFullscreen',
    fullscreenchange : 'MSFullscreenChange',
    fullscreenerror  : 'MSFullscreenError',
    fullscreen       : '-ms-fullscreen',
};

const getFullScreenApi = (): FullScreenApiType => {
    if (standard.fullscreenEnabled in document) return standard;
    if (webkit.fullscreenEnabled in document) return webkit;
    if (moz.fullscreenEnabled in document) return moz;
    if (ms.fullscreenEnabled in document) return ms;
    return standard;
};

const api = getFullScreenApi();

export { getFullScreenApi, FullScreenApiType };

export const fullscreenEnabled = (): boolean => document[api.fullscreenEnabled] as boolean;

export const fullscreenElement = (): Element | null => document[api.fullscreenElement] as Element | null;

export const requestFullscreen = (el: HTMLElement): Promise<void> => el[api.requestFullscreen]();

export const exitFullscreen = (): Promise<void> => document[api.exitFullscreen]();

export const isFullscreen = (): boolean => !!fullscreenElement();


