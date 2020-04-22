import { TTPlayerMediaComponent } from '@dking/ttplayer-core/src';
import TTPlayerVideo from '@dking/ttplayer-video';

abstract class TTPlayerControlComponents extends TTPlayerMediaComponent<'Video'> {

    constructor (media: TTPlayerVideo) {
        super(media);
    }

}

export default TTPlayerControlComponents;
