import EventEmitter from 'eventemitter3';
import { Movable } from '@dking/movable';
import TTPlayerVideoControl from '../../index';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import { DispatchAction } from '@dking/ttplayer-video';

class ControlProgress {

    public componentName: string = 'ControlProgressComponent'

    public progress: DOMUtils<HTMLDivElement>;
    public outter: DOMUtils<HTMLDivElement>;
    public inner: DOMUtils<HTMLDivElement>;
    public thumb: DOMUtils<HTMLDivElement>;
    public event: EventEmitter;

    public durationTime: number = 0;
    public currentTime: number = 0;

    public lock: boolean = false;

    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (controller: TTPlayerVideoControl) {
        this.event = controller.event;
        this.progress = DOMUtils.createUtilDom('div', 'progress__bar--container');
        this.outter = DOMUtils.createUtilDom('div', 'progress__bar--outter');
        this.inner = DOMUtils.createUtilDom('div', 'progress__bar--inner');
        this.thumb = DOMUtils.createUtilDom('div', 'progress--thumb');
        this.init();
    }

    init () {
        this.render();
    }

    onReady () {
        this.bindEvents()
            .bindActions();
    }

    destroy () {
        this.ugs.forEach(ug => ug());
        this.actUgs.forEach(ug => ug());
    }

    getInstance () {
        return this.progress.getInstance();
    }

    render () {
        this.outter
            .append(this.inner.getInstance())
            .append(this.thumb.getInstance());

        this.progress
            .append(this.outter.getInstance());

        return this;
    }

    private bindEvents () {

        // 监视时间变化
        const handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.event.on('timeupdate', handleTimeUpdate);
        this.ugs.push(() => {
            this.event.off('timeupdate', handleTimeUpdate);
        });

        // 监视视频总时间变化
        const handleDurationChange = this.handleDurationChange.bind(this);
        this.event.on('durationchange', handleDurationChange);
        this.ugs.push(() => {
            this.event.off('durationchange', handleDurationChange);
        });

        return this;
    }

    private bindActions () {

        // 拖拽视频进度切换
        const removeMovable = Movable(
            this.thumb.getInstance(),
            {
                minX : 0,
                maxX : this.outter.width(),
                moveX: true,
            }, {
                onMouseMove: () => {
                    const curLeft = parseFloat(this.thumb.getComputedStyle('left'));
                    const rate = curLeft / this.outter.width();
                    this.inner.width(`${ this.floatToPercent(rate) }`);
                    this.currentTime = rate * this.durationTime;
                },

                onMouseUp: () => {
                    this.seek(this.currentTime);
                    this.lock = false; // 滑动结束的时候关开启自动变化
                },

                onMouseDown: (e: Event) => {
                    e.stopPropagation();
                    this.lock = true;  // 滑动的时候关闭自动变化
                },
            },
        );

        this.actUgs.push(

            // 阻止事件冲突
            this.thumb.on('click', e => e.stopPropagation()),

            // 拖拽视频进度切换
            removeMovable,

            // 点击视频进度 切换
            this.progress.on('click', this.handleClickSeekBar.bind(this)),
        );

        return this;
    }

    private handleClickSeekBar (ev: Event) {
        if (ev.target === this.thumb.getInstance()) return;
        /* eslint-disable */
        const offsetX = (ev as MouseEvent).offsetX;
        /* eslint-disable */

        const rate = offsetX / this.progress.width();
        const seekTime = rate * this.durationTime;

        this.seek(seekTime);
        return this;
    }

    private handleDurationChange (e: Event) {
        const video = e.target as HTMLVideoElement;
        this.durationTime = video.duration;
        this.changeProgress();
        return this;
    }

    private handleTimeUpdate (e: Event) {
        const video = e.target as HTMLVideoElement;
        this.currentTime = video.currentTime;
        this.changeProgress();
        return this;
    }

    private changeProgress () {
        const {
            durationTime, currentTime, lock,
        } = this;
        const rate = currentTime / durationTime;
        const width = this.outter.width() * rate;
        !lock && this.inner.width(width);
        !lock && this.thumb.css('left', `${ width }px`);

        return this;
    }

    private floatToPercent (num: number): string {
        const MAX_PERCENT = 100;
        let percent = num * MAX_PERCENT;
        if (percent < 0) percent = 0;
        if (percent > MAX_PERCENT) percent = MAX_PERCENT;
        return `${ percent }%`;
    }

    private seek (time: number) {
        DispatchAction.DispatchSeekAction(this.event, time);
        return this;
    }

}

export default ControlProgress;
