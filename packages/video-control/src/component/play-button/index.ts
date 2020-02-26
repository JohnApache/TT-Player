import TTPlayerVideoControl from '../../index';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

class ControlPlayButton {

    public controller: TTPlayerVideoControl;
    public control: DOMUtils<HTMLElement>
    constructor (controller: TTPlayerVideoControl) {
        this.controller = controller;
        this.control = controller.control;
    }

    private render () {
        return this;
    }

}
