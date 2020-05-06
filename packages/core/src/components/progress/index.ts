import { Movable } from '@dking/movable';
import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerTime from '../time';
import utils, { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerProgress<T extends TMediaType> extends TTPlayerTime<T> {

    static className = 'ttplayer__media__component--progress';
    public cacheProgress: DOMUtils<HTMLDivElement>;
    public currentProgress: DOMUtils<HTMLDivElement>;
    public durationProgress: DOMUtils<HTMLDivElement>;

    public thumb: DOMUtils<HTMLDivElement>;
    public targetTime: number = 0;
    public lock: boolean = false;
    public progressRate: number = 0;

    private ugs: Function[] = [];
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.cacheProgress = DOMUtils.createUtilDom('div');
        this.currentProgress = DOMUtils.createUtilDom('div');
        this.durationProgress = DOMUtils.createUtilDom('div');
        this.thumb = DOMUtils.createUtilDom('div');

        this.durationProgress
            .append(this.cacheProgress.getInstance())
            .append(this.currentProgress.getInstance())
            .append(this.thumb.getInstance());

        this.root
            .append(this.durationProgress.getInstance());

        this.handleClickProgress = this.handleClickProgress.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.logger.debug('TTPlayerProgress componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerProgress componentDidMount');
        this.bindProgressEvents();
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.logger.info('TTPlayerProgress componentWillUnmount');
        this.removeProgressEvents();
    }

    beforeRender () {
        this.root.addClass(this.className);
        this.durationProgress.addClass(`${ this.className }-duration`);
        this.cacheProgress.addClass(`${ this.className }-cache`);
        this.currentProgress.addClass(`${ this.className }-current`);
        this.thumb.addClass(`${ this.className }-thumb`);
    }

    render () {
        const rate = this.currentTime / this.duration;
        this.updateProgress(rate);
    }

    updateProgress (rate: number) {
        this.currentProgress.width(utils.floatToPercent(rate));
        this.thumb.css('left', `${ this.durationProgress.width() * rate }px`);
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
                },

                onMouseUp: () => {
                    this.logger.info('mouse up from progress thumb');
                    this.lock = false; // 滑动结束的时候关开启自动变化
                    this.media.seek(this.targetTime);
                },

                onMouseDown: (e: Event) => {
                    this.logger.info('mouse down from progress thumb');
                    this.lock = true;  // 滑动的时候关闭自动变化
                    e.stopPropagation();
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
        this.logger.info('click progress bar');
        if (e.target === this.thumb.getInstance()) return;
        /* eslint-disable */
        const offsetX = (e as MouseEvent).offsetX;
        /* eslint-enable */

        const rate = offsetX / this.durationProgress.width();
        this.updateProgress(rate);
        this.targetTime = rate * this.duration;
        this.media.seek(this.targetTime);
        return this;
    }

}

export default TTPlayerProgress;
