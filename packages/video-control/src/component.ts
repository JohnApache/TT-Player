import { TTPlayerVideo, TTPlayerVideoComponent } from '@dking/ttplayer-video';

abstract class TTPlayerControlComponents extends TTPlayerVideoComponent {

    constructor (media: TTPlayerVideo) {
        super(media);
    }

}

export default TTPlayerControlComponents;
