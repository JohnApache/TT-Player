import TTPlayerVideoControl from '../..';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { TTPlayerPlayButton } from '@dking/ttplayer-core';

class ControlPlayButton extends TTPlayerPlayButton<'Video'> {

    public componentName: string = 'ControlPlayComponent'
    public icon: SVGIcons;

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
        this.icon = SVGIcons.createSvg('small-play');
        this.icon.init();
        this.root.append(this.icon.getInstance());
    }

    renderPlay () {
        this.icon.updatePathBySvgName('small-pause');
    }

    renderPause () {
        this.icon.updatePathBySvgName('small-play');
    }

    beforeRender () {
        super.beforeRender();
        this.root
            .addClass('play--button icon--container');
    }

}


export default ControlPlayButton;
