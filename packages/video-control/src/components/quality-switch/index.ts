import TTPlayerVideoControl from '../../index';
import { TTPlayerQualitySwitch } from '@dking/ttplayer-core';

class ControlQualitySwitch extends TTPlayerQualitySwitch<'Video'> {

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
    }

    beforeRender () {
        super.beforeRender();
        this.root.addClass('ttplayer__quality--container');
        this.qualitySwitch.addClass('ttplayer__quality--switch');
        this.qualityListRoot.addClass('ttplayer__quality--list');
        this.qualityListItems.forEach(dom => {
            dom.addClass('ttplayer__quality--item');
        });
    }

    render () {
        super.render();
    }

}

export default ControlQualitySwitch;
