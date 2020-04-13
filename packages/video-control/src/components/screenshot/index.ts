import TTPlayerVideoControl from '../../index';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { TTPlayerScreenshot } from '@dking/ttplayer-core';

class ControlScreenshot extends TTPlayerScreenshot {

    public icon: SVGIcons;
    constructor (control: TTPlayerVideoControl) {
        super(control.media);
        this.icon = SVGIcons.createSvg('camera');
    }

    getScreenshotImageName () {
        return 'TTPlayer.png';
    }

    renderScreenshot () {
        this.icon.init();
        this.root
            .addClass('screenshot--button icon--container')
            .append(this.icon.getInstance());
    }

}

export default ControlScreenshot;
