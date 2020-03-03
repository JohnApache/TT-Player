import EventEmitter from 'eventemitter3';
import TTPlayerVideoControl from '../../index';
import { DispatchAction } from '@dking/ttplayer-video';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

class ControlPlayButton {

    public componentName: string = 'ControlPlayComponent'
    public controller: TTPlayerVideoControl;
    public control: DOMUtils<HTMLElement>;
    public button: DOMUtils<HTMLDivElement>;
    public event: EventEmitter;
    public icon: SVGIcons;
    public paused: boolean = true;

    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (controller: TTPlayerVideoControl) {
        this.controller = controller;
        this.control = controller.control;
        this.event = controller.event;
        this.button = DOMUtils.createUtilDom('div');
        this.icon = new SVGIcons({ svgName: 'small-play' });
        this.icon.init();
    }

    init () {
        this.bindEvents()
            .bindActions()
            .render();
    }

    destroy () {
        this.ugs.forEach(ug => ug());
        this.actUgs.forEach(ug => ug());
    }

    getInstance () {
        return this.button.getInstance();
    }

    private render () {
        this.button
            .addClass('play--button icon--container')
            .append(this.icon.getInstance());
        return this;
    }

    private handlePause () {
        if (this.paused) return;
        this.paused = true;
        this.renderPlaySvg();
        return this;
    }

    private handlePlay () {
        if (!this.paused) return;
        this.paused = false;
        this.renderPausedSvg();
        return this;
    }

    private handleClick () {
        const { DispatchPlayAction, DispatchPauseAction } = DispatchAction;
        this.paused ? DispatchPlayAction(this.event) : DispatchPauseAction(this.event);
        return this;
    }

    private renderPausedSvg () {
        this.icon.updatePathBySvgName('small-pause');
        return this;
    }

    private renderPlaySvg () {
        this.icon.updatePathBySvgName('small-play');
        return this;
    }

    private bindEvents () {
        const handlePlay = this.handlePlay.bind(this);
        const handlePause = this.handlePause.bind(this);
        this.event.on('play', handlePlay);
        this.event.on('pause', handlePause);

        const offHandlePlay = () => {
            this.event.off('play', handlePlay);
        };

        const offHandlePause = () => {
            this.event.off('pause', handlePause);
        };

        this.ugs.push(offHandlePlay, offHandlePause);

        return this;
    }

    private bindActions () {
        const handle = this.handleClick.bind(this);
        this.button.on('click', handle);

        this.actUgs.push(() => {
            this.button.off('click', handle);
        });

        return this;
    }

}


export default ControlPlayButton;
