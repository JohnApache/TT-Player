import PlayerHooks from './hooks';
import TTPlayerCore, { TTPlayerCoreFactory } from './core';
import TTPlayerMedia, {
    TMediaType,
    IMediaTypeMap,
    TTPlayerMediaOptions,
    TTPlayerMediaComponent,
} from './media/media';
import TTPlayerVideo, { TTPlayerVideoFactory, TTPlayerVideoOptions } from './media/video';
import TTPlayerAudio, { TTPlayerAudioFactory, TTPlayerAudioOptions } from './media/audio';
import TTPlayerPlayButton from './components/play-button';
import TTPlayerTime from './components/time';
import TTPlayerProgress from './components/progress';
import TTPlayerVolume from './components/volume';
import TTPlayerVolumeButton from './components/volume-button';
import TTPlayerFullscreen from './components/fullscreen';
import TTPlayerScreenshot from './components/screenshot';
import TTPlayerLoading from './components/loading';
import TTPlayerError from './components/error';
import TTPlayerPIP from './components/pip';
import TTPlayerQualitySwitch from './components/quality-switch';
import TTPlayerPlayList from './components/playList';
import TTPlayerBasePlayList from './components/playList/base';
import TTPlayerPlayNext from './components/play-next';
import TTPlayerPlayPrev from './components/play-prev';
import TTPlayerRotateButton from './components/rotate-button';
import TTPlayerComponentsGroup from './components/components-group';
import {
    TTPlayerHorizontalVolumeBar,
    TTPlayerVerticalVolumeBar,
} from './components/volume-bar';

import { BaseOptions } from './options';

export {
    PlayerHooks,
    TTPlayerCore,
    TTPlayerCoreFactory,

    TTPlayerMedia,
    TMediaType,
    IMediaTypeMap,
    BaseOptions,
    TTPlayerMediaOptions,
    TTPlayerMediaComponent,

    TTPlayerVideo,
    TTPlayerVideoFactory,
    TTPlayerVideoOptions,

    TTPlayerAudio,
    TTPlayerAudioFactory,
    TTPlayerAudioOptions,

    TTPlayerPlayButton,
    TTPlayerTime,
    TTPlayerProgress,
    TTPlayerVolume,
    TTPlayerVolumeButton,
    TTPlayerHorizontalVolumeBar,
    TTPlayerVerticalVolumeBar,
    TTPlayerFullscreen,
    TTPlayerScreenshot,
    TTPlayerLoading,
    TTPlayerError,
    TTPlayerPIP,
    TTPlayerQualitySwitch,
    TTPlayerPlayList,
    TTPlayerBasePlayList,
    TTPlayerPlayNext,
    TTPlayerPlayPrev,
    TTPlayerRotateButton,

    TTPlayerComponentsGroup,
};

export default TTPlayerCoreFactory;
