import Movable from '@dking/movable';
import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerVolume from '../volume';
import utils, { DOMUtils } from '@dking/ttplayer-utils';

enum EDirection {
    VERTICAL,
    HORIZONTAL
}

class TTPlayerVolumeBar<T extends TMediaType> extends TTPlayerVolume<T> {

    static className: string = 'ttplayer__media__component--volume-bar';
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
        this.outter
            .append(this.inner.getInstance())
            .append(this.thumb.getInstance());
        this.root
            .append(this.outter.getInstance());
        this.handleClickVolumeBar = this.handleClickVolumeBar.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.logger.info('TTPlayerVolumeBar componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.info('TTPlayerVolumeBar componentDidMount');
        this.bindVolumeBarEvents();
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.logger.info('TTPlayerVolumeBar componentWillUnmount');
        this.removeVolumeBarEvents();
    }

    beforeRender () {
        this.root.addClass(this.className);
        this.outter.addClass(`${ this.className }-outter`);
        this.inner.addClass(`${ this.className }-inner`);
        this.thumb.addClass(`${ this.className }-thumb`);
    }

    render () {
        const rate = this.volume;
        this.inner.width(utils.floatToPercent(rate));
        this.thumb.css('left', `${ this.outter.width() * rate }px`);
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
                    this.media.volume = rate;
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
        this.media.volume = rate;
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
