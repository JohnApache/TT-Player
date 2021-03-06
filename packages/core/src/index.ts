import PlayerHooks from './hooks';
import TTPlayerCore, { TTPlayerCoreFactory } from './core';
import TTPlayerMedia, {
    TMediaType,
    IMediaTypeMap,
    TTPlayerMediaOptions,
    TTPlayerMediaComponent,
} from './media/media';
import TTPlayerVideo, {
    TTPlayerVideoFactory,
    TTPlayerVideoOptions,
    VideoMSE,
} from './media/video';
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

import {
    TTPlayerQualitySwitch,
    TTPlayerQualityList,
    TTPlayerBaseQuality,
} from './components/quality-switch';

import {
    TTPlayerPlaySwitch,
    TTPlayerPlayList,
    TTPlayerBasePlayList,
} from './components/play-list';

import {
    TTPlayerPlaybackRateList,
    TTPlayerPlaybackRateSwitch,
    TTPlayerBasePlaybackRate,
} from './components/playbackRate-swtich';

import TTPlayerPlayNext from './components/play-next';
import TTPlayerPlayPrev from './components/play-prev';
import TTPlayerRotateButton from './components/rotate-button';
import TTPlayerDownload from './components/download';
import TTPlayerComponentsGroup from './components/components-group';
import TTPlayerControl from './components/control';
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

    VideoMSE,
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
    TTPlayerQualityList,
    TTPlayerBaseQuality,

    TTPlayerPlaySwitch,
    TTPlayerPlayList,
    TTPlayerBasePlayList,

    TTPlayerPlaybackRateList,
    TTPlayerPlaybackRateSwitch,
    TTPlayerBasePlaybackRate,

    TTPlayerPlayNext,
    TTPlayerPlayPrev,
    TTPlayerRotateButton,
    TTPlayerDownload,
    TTPlayerComponentsGroup,

    TTPlayerControl,
};

export default TTPlayerCoreFactory;
