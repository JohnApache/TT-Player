import EventEmitter from 'eventemitter3';
import TTPlayerVideoControl from '../../index';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import TTPlayerCore from '@dking/ttplayer-core';
import { DispatchAction } from '@dking/ttplayer-video';

class ControlScreenShot {

    public componentName: string = 'ControlScreenShot';
    public controller: TTPlayerVideoControl;
    public control: DOMUtils<HTMLElement>;
    public camera: DOMUtils<HTMLDivElement>;
    public event: EventEmitter;
    public icon: SVGIcons;
    public paused: boolean = true;
    public player: TTPlayerCore

    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (controller: TTPlayerVideoControl) {
        this.controller = controller;
        this.control = controller.control;
        this.event = controller.event;
        this.player = controller.player;
        this.camera = DOMUtils.createUtilDom('div');
        this.icon = SVGIcons.createSvg('camera');
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
        return this.camera.getInstance();
    }

    private render () {
        this.icon.init();
        this.camera
            .addClass('screenshot--button icon--container')
            .append(this.icon.getInstance());
        return this;
    }

    private bindEvents () {
        return this;
    }

    private bindActions () {
        this.actUgs.push(this.camera.on('click', this.handleClick.bind(this)));
        return this;
    }

    private handleClick () {
        DispatchAction.DispatchScreenShotAction(this.event);
        return this;
    }

}

export default ControlScreenShot;
