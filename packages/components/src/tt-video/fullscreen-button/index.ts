import SVGIcons from '@dking/ttplayer-svg-icons';
import { TTPlayerFullscreen, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoFullScreenButton extends TTPlayerFullscreen {

    public icon: SVGIcons;
    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.icon = SVGIcons.createSvg('fullscreen');
        this.icon.init();
        this.root.append(this.icon.getInstance());
    }

    renderFullscreen () {
        this.media.root.addClass('fullscreen');
    }

    hideFullscreen () {
        this.media.root.removeClass('fullscreen');
    }

    getFullscreenContainer () {
        return this.media.root.getInstance();
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('fullscreen--button icon--container');
    }

}

export default TTVideoFullScreenButton;
