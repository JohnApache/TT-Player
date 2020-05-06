import TTPlayerVideoControl from '../../index';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { TTPlayerScreenshot } from '@dking/ttplayer-core';

class ControlScreenshot extends TTPlayerScreenshot {

    static screenshotImageName: string = 'TTPlayer2.png';
    public icon: SVGIcons;
    constructor (control: TTPlayerVideoControl) {
        super(control.media);
        this.icon = SVGIcons.createSvg('camera');
        this.icon.init();
        this.root.append(this.icon.getInstance());
    }

    beforeRender () {
        this.root
            .addClass('screenshot--button icon--container');
    }

    render () {
        super.render();
    }

}

export default ControlScreenshot;
