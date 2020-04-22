export type VideoPreload = 'auto' | 'meta' | 'none';

export type VideoOrientation = 'portraint' | 'landscape';

export interface NormalObject {
    [key: string]: any;
}

export interface VideoSource {
    src: string;
    type?: string;
}

export interface SpecialVideoAttributes {
    playsinline: boolean;
    'webkit-playsinline': boolean;
    'x5-playsinline': boolean;
    'x5-video-player-type': 'h5';
    'x5-video-player-fullscreen': boolean;
    'x5-video-orientation': VideoOrientation;
    airplay: 'allow';
    'webkit-airplay': 'allow';
    'x-webkit-airplay': 'allow';
    'tabindex': number;
}

export interface VideoAttributes {
    src: string;
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
}


export interface IVideoOptions extends Partial<VideoAttributes>, Partial<SpecialVideoAttributes> {
    [key: string]: any;
}

export interface VideoActionsType {
    [key: string]: string;
}
