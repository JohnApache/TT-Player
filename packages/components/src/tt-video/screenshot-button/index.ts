import SVGIcons from '@dking/ttplayer-svg-icons';
import { TTPlayerScreenshot, TTPlayerMedia } from '@dking/ttplayer-core';

class TTVideoScreenshotButton extends TTPlayerScreenshot {

    static screenshotImageName: string = 'TTPlayer2.png';
    public icon: SVGIcons;
    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
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

export default TTVideoScreenshotButton;
