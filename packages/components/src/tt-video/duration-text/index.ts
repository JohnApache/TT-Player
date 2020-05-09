import { TTPlayerTime, TTPlayerMedia } from '@dking/ttplayer-core';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

class TTVideoDurationText extends TTPlayerTime<'Video'> {

    public currentText: DOMUtils<HTMLSpanElement>;
    public durationText: DOMUtils<HTMLSpanElement>;
    public splitLine: DOMUtils<HTMLSpanElement>;

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.currentText = DOMUtils.createUtilDom('span');
        this.durationText = DOMUtils.createUtilDom('span');
        this.splitLine = DOMUtils.createUtilDom('span');
        this.root
            .append(this.currentText.getInstance())
            .append(this.splitLine.getInstance())
            .append(this.durationText.getInstance());
    }

    onDurationChange () {
        if (this.formatTime(this.duration) === this.durationText.html()) return;
        this.durationText.html(this.formatTime(this.duration));
    }

    onTimeUpdate () {
        if (this.formatTime(this.currentTime) === this.currentText.html()) return;
        this.currentText.html(this.formatTime(this.currentTime));
    }

    beforeRender () {
        super.beforeRender();
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
            .addClass('time__text--wrapper icon--container');
    }

    render () {
        super.render();
        this.renderDurationText();
        this.renderCurrentText();
        this.renderSplitLine();
    }

    renderDurationText () {
        if (this.formatTime(this.duration) === this.durationText.html()) return;
        this.durationText.html(this.formatTime(this.duration));
    }

    renderCurrentText () {
        if (this.formatTime(this.currentTime) === this.currentText.html()) return;
        this.currentText.html(this.formatTime(this.currentTime));
    }

    renderSplitLine () {
        if (this.splitLine.html() === '/') return;
        this.splitLine.html('/');
    }

}


export default TTVideoDurationText;
