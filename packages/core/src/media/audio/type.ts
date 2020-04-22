import { TMediaPreload } from '../options';

export interface SpecialAudioAttributes {

    // playsinline: boolean;
    // 'webkit-playsinline': boolean;
    // 'x5-playsinline': boolean;
    // 'x5-video-player-type': 'h5';
    // 'x5-video-player-fullscreen': boolean;
    // 'x5-video-orientation': VideoOrientation;
    // airplay: 'allow';
    // 'webkit-airplay': 'allow';
    // 'x-webkit-airplay': 'allow';
    // 'tabindex': number;
}

export interface VideoAttributes {
    src: string;
    width: number | string;
    height: number | string;
    volume: number;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    preload: TMediaPreload;
    tabindex: number;
    controls: boolean;
}


export interface IAudioOptions extends Partial<VideoAttributes>, Partial<SpecialAudioAttributes> {
    [key: string]: any;
}
