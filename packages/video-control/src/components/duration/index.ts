import EventEmitter from 'eventemitter3';
import TTPlayerVideoControl from '../../index';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

class ControlDurationText {

    public componentName: string = 'ControlDurationText';
    public text: DOMUtils<HTMLDivElement>;
    public current: DOMUtils<HTMLSpanElement>;
    public duration: DOMUtils<HTMLSpanElement>;
    public splitLine: DOMUtils<HTMLSpanElement>;
    public event: EventEmitter;
    public currentTime: number = 0;
    public durationTime: number = 0;
    public ugs: Function[] = [];

    constructor (control: TTPlayerVideoControl) {
        this.text = DOMUtils.createUtilDom('div');
        this.current = DOMUtils.createUtilDom('span');
        this.duration = DOMUtils.createUtilDom('span');
        this.splitLine = DOMUtils.createUtilDom('span');
        this.event = control.event;
    }

    init () {
        this.bindEvents()
            .render();
    }

    destroy () {
        this.ugs.forEach(ug => ug());
    }

    getInstance () {
        return this.text.getInstance();
    }

    private render () {
        this.splitLine
            .addClass('split--line')
            .html('/');

        this.duration
            .addClass('duration--time')
            .html('00:00');

        this.current
            .addClass('current--time')
            .html('00:00');

        this.text
            .addClass('time__text--wrapper icon--container')
            .append(this.current.getInstance())
            .append(this.splitLine.getInstance())
            .append(this.duration.getInstance());

        return this;
    }

    private bindEvents () {

        const handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.event.on('timeupdate', handleTimeUpdate);
        this.ugs.push(() => {
            this.event.off('timeupdate', handleTimeUpdate);
        });

        const handleDurationChange = this.handleDurationChange.bind(this);
        this.event.on('durationchange', handleDurationChange);
        this.ugs.push(() => {
            this.event.off('durationchange', handleDurationChange);
        });

        return this;
    }

    private handleDurationChange (e: Event) {
        const video = e.target as HTMLVideoElement;
        const duration = Math.floor(video.duration);

        if (this.durationTime === duration) return;
        this.durationTime = duration;
        this.duration.html(this.formatTime(duration));
        return this;
    }

    private handleTimeUpdate (e: Event) {
        const video = e.target as HTMLVideoElement;
        const current = Math.floor(video.currentTime);

        if (this.currentTime === current) return;
        this.currentTime = current;
        this.current.html(this.formatTime(current));
        return this;
    }

    formatTime (second: number): string {
        if (!second || second <= 0) return '00:00';

        const ONE_HOUR = 3600;
        const ONE_MINUTE = 60;

        let h = 0,
            m = 0,
            s = 0;

        if (second >= ONE_HOUR) {
            h = Math.floor(second / ONE_HOUR);
        }
        if (second >= ONE_MINUTE) {
            m = Math.floor((second - h * ONE_HOUR) / ONE_MINUTE);
        }

        s = Math.floor(second - h * ONE_HOUR - m * ONE_MINUTE);

        return (
            h === 0 ?
                `${ this.fillTime(m) }:${ this.fillTime(s) }` :
                `${ this.fillTime(h) }:${ this.fillTime(m) }:${ this.fillTime(s) }`
        );
    }

    fillTime (t: number): string {
        const MIN_DOUBLE_NUM = 10;
        return t >= MIN_DOUBLE_NUM ? `${ t }` : `0${ t }`;
    }

}


export default ControlDurationText;
