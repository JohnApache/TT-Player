import Movable from '@dking/movable';
import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerVolume from '../volume';
import utils, { DOMUtils } from '@dking/ttplayer-utils';

enum EDirection {
    VERTICAL,
    HORIZONTAL
}

abstract class TTPlayerVolumeBar<T extends TMediaType> extends TTPlayerVolume<T> {

    public outter: DOMUtils<HTMLDivElement>;
    public inner: DOMUtils<HTMLDivElement>;
    public thumb: DOMUtils<HTMLDivElement>;
    public direction: EDirection;

    private ugs: Function[] = [];
    constructor (direction: EDirection, media: TTPlayerMedia<T>) {
        super(media);
        this.direction = direction;
        this.outter = DOMUtils.createUtilDom('div');
        this.inner = DOMUtils.createUtilDom('div');
        this.thumb = DOMUtils.createUtilDom('div');
        this.handleClickVolumeBar = this.handleClickVolumeBar.bind(this);
    }

    beforeMount () {
        super.beforeMount();
        this.logger.info('TTPlayerVolumeBar beforeMount');
        this.init();
        this.renderVolumeBar();
    }

    mounted () {
        super.mounted();
        this.logger.info('TTPlayerVolumeBar mounted');
        this.bindVolumeBarEvents();
    }

    beforeDestroy () {
        super.beforeDestroy();
        this.logger.info('TTPlayerVolumeBar beforeDestroy');
        this.removeVolumeBarEvents();
    }

    onVolumeChange () {
        const rate = this.volume;
        this.inner.width(utils.floatToPercent(rate));
        this.thumb.css('left', `${ this.outter.width() * rate }px`);
        this.updateVolumeBar(rate);
    }

    abstract renderVolumeBar(): any;
    abstract updateVolumeBar(rate: number): any;

    private init () {
        this.outter
            .append(this.inner.getInstance())
            .append(this.thumb.getInstance());
        this.root
            .append(this.outter.getInstance());
    }

    private bindVolumeBarEvents () {
        // 拖拽视频进度切换
        const removeMovable = Movable(
            this.thumb.getInstance(),
            {
                minX : 0,
                maxX : this.outter.width(),
                moveX: this.direction === EDirection.HORIZONTAL,
                minY : 0,
                maxY : this.outter.height(),
                moveY: this.direction === EDirection.VERTICAL,
            }, {
                onMouseMove: () => {
                    const offsetX = parseFloat(this.thumb.getComputedStyle('left'));
                    const offsetY = parseFloat(this.thumb.getComputedStyle('top'));
                    let rate: number;
                    if (this.direction === EDirection.HORIZONTAL) {
                        rate = offsetX / this.outter.width();
                    } else {
                        rate = offsetY / this.outter.height();
                    }
                    this.mediaDom.volume = rate;
                },

                onMouseUp: () => {},

                onMouseDown: (e: Event) => {
                    e.stopPropagation();
                },
            },
        );

        this.ugs.push(
            removeMovable,
            this.outter.on('click', this.handleClickVolumeBar),
        );

    }

    private removeVolumeBarEvents () {
        this.ugs.forEach(ug => ug());
    }

    private handleClickVolumeBar (e: Event) {
        this.logger.info('click volume bar');
        if (e.target === this.thumb.getInstance()) return;
        /* eslint-disable */
        const offsetX = (e as MouseEvent).offsetX;
        const offsetY = (e as MouseEvent).offsetY;
        /* eslint-enable */
        let rate: number;
        if (this.direction === EDirection.HORIZONTAL) {
            rate = offsetX / this.outter.width();
        } else {
            rate = offsetY / this.outter.height();
        }
        this.mediaDom.volume = rate;
        return this;
    }

}

abstract class TTPlayerVerticalVolumeBar<T extends TMediaType> extends TTPlayerVolumeBar<T> {

    constructor (media: TTPlayerMedia<T>) {
        super(EDirection.VERTICAL, media);
    }

}

abstract class TTPlayerHorizontalVolumeBar<T extends TMediaType> extends TTPlayerVolumeBar<T> {

    constructor (media: TTPlayerMedia<T>) {
        super(EDirection.HORIZONTAL, media);
    }

}

export {
    TTPlayerVerticalVolumeBar,
    TTPlayerHorizontalVolumeBar,
};

export default TTPlayerHorizontalVolumeBar;
