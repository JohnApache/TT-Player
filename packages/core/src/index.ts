import PlayerHooks from './hooks';
import TTPlayerCoreFactory, { TTPlayerCore } from './core';
import TTPlayerMedia, {
    TMediaType,
    IMediaTypeMap,
    MediaOptions,
    TTPlayerMediaComponent,
} from './media/media';
import TTPlayerPlayButton from './components/play-button';
import TTPlayerTime from './components/time';
import TTPlayerProgress from './components/progress';
import TTPlayerVolume from './components/volume';
import TTPlayerVolumeButton from './components/volume-button';
import TTPlayerFullscreen from './components/fullscreen';
import TTPlayerScreenshot from './components/screenshot';

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
    MediaOptions,
    TTPlayerMediaComponent,
    TTPlayerPlayButton,
    TTPlayerTime,
    TTPlayerProgress,
    TTPlayerVolume,
    TTPlayerVolumeButton,
    TTPlayerHorizontalVolumeBar,
    TTPlayerVerticalVolumeBar,
    TTPlayerFullscreen,
    TTPlayerScreenshot,
    TTPlayerComponentsGroup,
};

export default TTPlayerCoreFactory;
