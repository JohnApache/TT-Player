import {
    TTPlayerHorizontalVolumeBar,
    TMediaType,
    TTPlayerMedia,
} from '@dking/ttplayer-core';


class TTVideoVolumeBar extends TTPlayerHorizontalVolumeBar<'Video'> {

    constructor (media: TTPlayerMedia<TMediaType>) {
        super(media as TTPlayerMedia<'Video'>);
    }

    beforeRender () {
        super.beforeRender();
        this.thumb
            .addClass('volume--thumb');
        this.inner
            .addClass('volume__bar--inner');
        this.outter
            .addClass('volume__bar--outter');
        this.root
            .addClass('volume__bar--wrapper');
    }

    render () {
        super.render();
        this.muted ?
            this.outter.addClass('muted') :
            this.outter.removeClass('muted');
    }

}

export default TTVideoVolumeBar;
