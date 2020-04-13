import { Movable } from '@dking/movable';
import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerTime from '../time';
import utils, { DOMUtils } from '@dking/ttplayer-utils';

abstract class TTPlayerProgress<T extends TMediaType> extends TTPlayerTime<T> {

    public cacheProgress: DOMUtils<HTMLDivElement>;
    public currentProgress: DOMUtils<HTMLDivElement>;
    public durationProgress: DOMUtils<HTMLDivElement>;

    public thumb: DOMUtils<HTMLDivElement>;
    public targetTime: number = 0;
    public lock: boolean = false;

    private ugs: Function[] = [];
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.cacheProgress = DOMUtils.createUtilDom('div');
        this.currentProgress = DOMUtils.createUtilDom('div');
        this.durationProgress = DOMUtils.createUtilDom('div');
        this.thumb = DOMUtils.createUtilDom('div');
        this.init();
        this.handleClickProgress = this.handleClickProgress.bind(this);
    }

    beforeMount () {
        super.beforeMount();
        this.renderProgress();
    }

    renderTime () {}

    mounted () {
        super.mounted();
        this.bindProgressEvents();
    }

    beforeDestroy () {
        super.beforeMount();
        this.removeProgressEvents();
    }

    onTimeUpdate () {
        const rate = this.currentTime / this.duration;
        this.currentProgress.width(utils.floatToPercent(rate));
        this.thumb.css('left', `${ this.durationProgress.width() * rate }px`);
        this.updateProgress(rate);
    }

    onDurationChange () {
        const rate = this.currentTime / this.duration;
        this.currentProgress.width(utils.floatToPercent(rate));
        this.thumb.css('left', `${ this.durationProgress.width() * rate }px`);
        this.updateProgress(rate);
    }

    abstract renderProgress(): any;
    abstract updateProgress(rate: number): any;

    private init () {
        this.durationProgress
            .append(this.cacheProgress.getInstance())
            .append(this.currentProgress.getInstance())
            .append(this.thumb.getInstance());
        this.root
            .append(this.durationProgress.getInstance());
    }

    private bindProgressEvents () {
        // 拖拽视频进度切换
        const removeMovable = Movable(
            this.thumb.getInstance(),
            {
                minX : 0,
                maxX : this.durationProgress.width(),
                moveX: true,
            }, {
                onMouseMove: () => {
                    const curLeft = parseFloat(this.thumb.getComputedStyle('left'));
                    const rate = curLeft / this.durationProgress.width();
                    this.currentProgress.css('width', utils.floatToPercent(rate));
                    this.targetTime = this.duration * rate;
                    this.updateProgress(rate);
                },

                onMouseUp: () => {
                    this.media.seek(this.targetTime);
                    this.lock = false; // 滑动结束的时候关开启自动变化
                },

                onMouseDown: (e: Event) => {
                    e.stopPropagation();
                    this.lock = true;  // 滑动的时候关闭自动变化
                },
            },
        );

        this.ugs.push(
            removeMovable,
            this.durationProgress.on('click', this.handleClickProgress),
        );

    }

    private removeProgressEvents () {
        this.ugs.forEach(ug => ug());
    }

    private handleClickProgress (e: Event) {
        if (e.target === this.thumb.getInstance()) return;
        /* eslint-disable */
        const offsetX = (e as MouseEvent).offsetX;
        /* eslint-enable */

        const rate = offsetX / this.durationProgress.width();
        this.currentProgress.width(utils.floatToPercent(rate));
        this.thumb.css('left', `${ this.durationProgress.width() * rate }px`);
        this.targetTime = rate * this.duration;
        this.media.seek(this.targetTime);
        this.updateProgress(rate);
        return this;
    }

}

export default TTPlayerProgress;
