import TTPlayerVideoControl from '../../index';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { TTPlayerFullscreen } from '@dking/ttplayer-core';

class ControlFullScreen extends TTPlayerFullscreen {

    public icon: SVGIcons;
    public control: TTPlayerVideoControl;
    constructor (control: TTPlayerVideoControl) {
        super(control.media);
        this.control = control;
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

export default ControlFullScreen;
