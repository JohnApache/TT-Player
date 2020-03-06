import EventEmitter from 'eventemitter3';
import { Movable } from '@dking/movable';
import TTPlayerVideoControl from '../../index';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { DispatchAction } from '@dking/ttplayer-video';

/* eslint-disable */
enum VOLUME_LEVEL {
    Lv0 = 0,
    Lv1 = 0.3,
    Lv2 = 0.7
}
/* eslint-disable */

class ControlVolume {

    public componentName: string = 'ControlVolumeComponent'
    public volumeBtn: DOMUtils<HTMLDivElement>;
    public control: DOMUtils<HTMLElement>;
    public volumeBar: DOMUtils<HTMLDivElement>;
    public barInner: DOMUtils<HTMLDivElement>;
    public thumb: DOMUtils<HTMLDivElement>;
    public event: EventEmitter;
    public icon: SVGIcons;
    public iconDom: DOMUtils<HTMLDivElement>
    public muted: boolean = false;
    public volume: number = VOLUME_LEVEL.Lv2;

    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (controller: TTPlayerVideoControl) {
        this.volumeBtn = DOMUtils.createUtilDom('div');
        this.volumeBar = DOMUtils.createUtilDom('div');
        this.barInner = DOMUtils.createUtilDom('div');
        this.thumb = DOMUtils.createUtilDom('div');
        this.control = controller.control;
        this.event = controller.event;
        this.icon = SVGIcons.createSvg('volume-lv0');
        this.iconDom = this.icon.icon;
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
        return this.volumeBtn.getInstance();
    }

    render () {

        this.icon
            .init();

        this.thumb
            .addClass('volume--thumb');

        this.barInner
            .addClass('volume__bar--inner')
            .append(this.thumb.getInstance());

        this.volumeBar
            .addClass('volume__bar--outer')
            .append(this.barInner.getInstance());

        this.volumeBtn
            .addClass('volume--button icon--container')
            .append(this.icon.getInstance())
            .append(this.volumeBar.getInstance());
        return this;
    }

    private handleVolumeChange (e: Event) {
        const video = e.target as HTMLVideoElement;
        const { volume, muted } = video;

        this.barInner.css('width', `${ volume * 100 }%`);
        this.thumb.css('left', `${ this.volumeBar.width() * volume }px`);

        const { Lv1, Lv2 } = VOLUME_LEVEL;

        if (this.volume < Lv2 && volume >= Lv2) {
            this.icon.animatePathBySvgName('volume-lv2');
        }

        if (
            (this.volume >= Lv2 || this.volume < Lv1) &&
            (volume >= Lv1 && volume < Lv2)
        ) {
            this.icon.animatePathBySvgName('volume-lv1');
        }

        if (this.volume > Lv1 && volume <= Lv1) {
            this.icon.animatePathBySvgName('volume-lv0');
        }

        this.volume = volume;
        this.muted = muted;
    }

    private handelClickVolumeBar (ev: Event) {
        if (ev.target === this.thumb.getInstance()) {
            return;
        }

        /* eslint-disable */
        const offsetX = (ev as MouseEvent).offsetX;
        /* eslint-disable */
        const rate = offsetX / this.volumeBar.width();

        this.changeVolume(rate);
        return this;
    }

    private switchMuted () {
        const { DispatchMuteAction } = DispatchAction;
        DispatchMuteAction(this.event, !this.muted);
        return this;
    }

    private changeVolume (volume: number) {
        const { DispatchVolumeAction } = DispatchAction;
        DispatchVolumeAction(this.event, volume);
        return this;
    }

    private bindEvents () {
        const handleVolumeChange = this.handleVolumeChange.bind(this);
        this.event.on('volumechange', handleVolumeChange);

        const offHandleVolumeChange = () => {
            this.event.off('volumechange', handleVolumeChange);
        };

        this.ugs.push(offHandleVolumeChange);

        return this;
    }

    private bindActions () {

        this.actUgs.push(

            // 阻止事件冲突
            this.thumb.on('click', (e) => e.stopPropagation()),

            // 切换静音
            this.iconDom.on('click', this.switchMuted.bind(this)),

            // 调整声音
            this.volumeBar.on('click', this.handelClickVolumeBar.bind(this))
            
        );

        const removeMovable = Movable(
            this.thumb.getInstance(),
            {
                minX : 0,
                maxX : 100,
                moveX: true,
            }, {
                onMouseMove: () => {
                    const curLeft = parseFloat(this.thumb.getComputedStyle('left'));
                    const rate = curLeft / this.volumeBar.width();
                    this.changeVolume(rate);
                },
            },
        );

        this.actUgs.push(removeMovable);

        return this;
    }

}

export default ControlVolume;
