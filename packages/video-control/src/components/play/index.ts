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
        this.init();
    }

    init () {
        this.render();
    }

    onPlay () {
        this.icon.updatePathBySvgName('small-pause');
    }

    onPause () {
        this.icon.updatePathBySvgName('small-play');
    }

    private render () {
        this.root
            .addClass('play--button icon--container')
            .append(this.icon.getInstance());
        return this;
    }

}


export default ControlPlayButton;
