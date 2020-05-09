import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';
import TTPlayerVideoComponentsGroup, { TTPlayerVideoComponentsGroupFactory } from './video';
import TTPlayerAudioComponentsGroup, { TTPlayerAudioComponentsGroupFactory } from './audio';

class TTPlayerComponentsGroup<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static Video: typeof TTPlayerVideoComponentsGroup = TTPlayerVideoComponentsGroup;
    static Audio: typeof TTPlayerAudioComponentsGroup = TTPlayerAudioComponentsGroup;
    static VideoFactory: ()=> typeof TTPlayerVideoComponentsGroup = TTPlayerVideoComponentsGroupFactory;
    static AudioFactory: ()=> typeof TTPlayerAudioComponentsGroup = TTPlayerAudioComponentsGroupFactory;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
    }

}

export default TTPlayerComponentsGroup;

