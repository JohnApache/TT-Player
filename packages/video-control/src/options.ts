import { VideoControlOptionsType } from './type';
import utils from '@dking/ttplayer-utils';

const DEFAULT_OPTIONS = { height: '100px' };

class VideoControlOptions {

    public height: string;
    public playButton: boolean;

    [key: string]: any;

    constructor (options: VideoControlOptionsType = {}) {
        const { height, playButton } = options;
        const { isUndefined } = utils;

        if (isUndefined(height)) {
            this.height = DEFAULT_OPTIONS.height;
        } else if (utils.isString(height)) {
            this.height = height;
        } else {
            this.height = `${ height }px`;
        }

        if (isUndefined(playButton)) {
            this.playButton = true;
        } else {
            this.playButton = !!playButton;
        }

        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined') return;
            this[item] = options[item];
        });
    }

}

export default VideoControlOptions;
