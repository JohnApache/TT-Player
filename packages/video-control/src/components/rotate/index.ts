import TTPlayerVideoControl from '../../index';
import { TTPlayerRotateButton } from '@dking/ttplayer-core';

class ControlRotate extends TTPlayerRotateButton {

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__rotate--button');
    }

    render () {
        super.render();
    }

}

export default ControlRotate;
