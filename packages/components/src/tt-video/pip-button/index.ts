import { TTPlayerPIP, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoPIPButtion extends TTPlayerPIP {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('pip--button');
    }

    renderPIP () {
        this.root
            .html('画中画');
    }

    hidePIP () {
        this.root
            .html('取消画中画');
    }

}

export default TTVideoPIPButtion;
