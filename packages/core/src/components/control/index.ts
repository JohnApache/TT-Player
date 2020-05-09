import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';
import TTPlayerAudioControl, { TTPlayerAudioControlFactory } from './audio';
import TTPlayerVideoControl, { TTPlayerVideoControlFactory } from './video';

class TTPlayerControl<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static Video: typeof TTPlayerVideoControl = TTPlayerVideoControl;
    static Audio: typeof TTPlayerAudioControl = TTPlayerAudioControl;
    static VideoFactory = TTPlayerVideoControlFactory;
    static AudioFactory = TTPlayerAudioControlFactory;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
    }

}

export default TTPlayerControl;
