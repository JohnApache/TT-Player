

import { TTPlayerMediaOptions } from '../media';
import { IAudioOptions } from './type';

// const DEFAULT_OPTIONS = {};

class TTPlayerAudioOptions extends TTPlayerMediaOptions {

    constructor (options: IAudioOptions = {}) {
        super(options);
        this.storeExtraOptions(options);
    }

}

export default TTPlayerAudioOptions;
