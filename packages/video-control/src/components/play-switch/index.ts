import TTPlayerVideoControl from '../../index';
import { TTPlayerPlaySwitch } from '@dking/ttplayer-core';

class ControlPlaySwitch extends TTPlayerPlaySwitch<'Video'> {

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__play--container');
        this.playSwitch.addClass('ttplayer__play__switch');
        this.playListRoot.addClass('ttplayer__play--list');
        this.playListItems.forEach(dom => {
            dom.addClass('ttplayer__play--item');
        });
    }

    render () {
        super.render();
    }

}

export default ControlPlaySwitch;
