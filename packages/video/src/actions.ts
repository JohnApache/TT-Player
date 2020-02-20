import { PLUGIN_NAME } from './config';
import utils from '@dking/ttplayer-utils';

const action = (actionName: string) => `${ PLUGIN_NAME }_${ utils.PascalCase(actionName) }`;

const VideoActions = {
    PlayAction   : action('play'),
    PauseAction  : action('pause'),
    VolumeAction : action('volume'),
    MuteAction   : action('mute'),
    LoopAction   : action('loop'),
    PreloadAction: action('preload'),
    PosterAction : action('poster'),
    DestroyAction: action('destroy'),
};

export default VideoActions;
