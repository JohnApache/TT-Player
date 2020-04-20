import TTPlayerVideoControl from '../../index';
import { TTPlayerProgress } from '@dking/ttplayer-core';

class ControlProgress extends TTPlayerProgress<'Video'> {

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
    }

    renderProgress () {
        this.root.addClass('ttplayer__progress--container');
        this.durationProgress.addClass('ttplayer__progress--duration');
        this.cacheProgress.addClass('ttplayer__progress--cache');
        this.currentProgress.addClass('ttplayer__progress--current');
        this.thumb.addClass('ttplayer__progress--thumb');
    }

    updateProgress () {}

}

export default ControlProgress;
