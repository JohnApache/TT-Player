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
    }

    renderFullscreen () {
        this.icon.init();
        this.root
            .addClass('fullscreen--button icon--container')
            .append(this.icon.getInstance());
    }

    onFullscreenChange () {
        if (this.isFullscreen) {
            this.control.media.root.addClass('fullscreen');
        } else {
            this.control.media.root.removeClass('fullscreen');
        }
    }

    getFullscreenContainer () {
        return this.control.media.root.getInstance();
    }

}

export default ControlFullScreen;
