import { VideoControlOptionsType } from './type';
import utils from '@dking/ttplayer-utils';

const DEFAULT_OPTIONS = { height: '50px' };

class VideoControlOptions {

    public height: string;
    [key: string]: any;

    constructor (options: VideoControlOptionsType = {}) {
        const { height } = options;
        const { isUndefined } = utils;

        if (isUndefined(height)) {
            this.height = DEFAULT_OPTIONS.height;
        } else if (utils.isString(height)) {
            this.height = height;
        } else {
            this.height = `${ height }px`;
        }

        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined') return;
            this[item] = options[item];
        });
    }

}

export default VideoControlOptions;
