import TTPlayerVideoControl from '../../index';
import { TTPlayerTime } from '@dking/ttplayer-core';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

class ControlDurationText extends TTPlayerTime<'Video'> {

    public currentText: DOMUtils<HTMLSpanElement>;
    public durationText: DOMUtils<HTMLSpanElement>;
    public splitLine: DOMUtils<HTMLSpanElement>;

    constructor (control: TTPlayerVideoControl) {
        super(control.media);
        this.currentText = DOMUtils.createUtilDom('span');
        this.durationText = DOMUtils.createUtilDom('span');
        this.splitLine = DOMUtils.createUtilDom('span');
    }

    onDurationChange () {
        if (this.formatTime(this.duration) === this.durationText.html()) return;
        this.durationText.html(this.formatTime(this.duration));
    }

    onTimeUpdate () {
        if (this.formatTime(this.currentTime) === this.currentText.html()) return;
        this.currentText.html(this.formatTime(this.currentTime));
    }

    renderTime () {
        this.splitLine
            .addClass('split--line')
            .html('/');

        this.durationText
            .addClass('duration--time')
            .html('00:00');

        this.currentText
            .addClass('current--time')
            .html('00:00');

        this.root
            .addClass('time__text--wrapper icon--container')
            .append(this.currentText.getInstance())
            .append(this.splitLine.getInstance())
            .append(this.durationText.getInstance());
    }

}


export default ControlDurationText;
