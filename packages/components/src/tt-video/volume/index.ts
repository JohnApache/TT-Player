import TTVideoVolumeButton from './button';
import TTVideoVolumeBar from './bar';
import {
    TTPlayerComponentsGroup,
    TTPlayerMedia,
} from '@dking/ttplayer-core';

class TTVideoVolume extends TTPlayerComponentsGroup.Video {

    static groupComponentsCtor = [];

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('control__volume--container');
    }

}

TTVideoVolume
    .use(TTVideoVolumeButton)
    .use(TTVideoVolumeBar);

export default TTVideoVolume;
