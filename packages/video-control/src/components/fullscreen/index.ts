import EventEmitter from 'eventemitter3';
import TTPlayerVideoControl from '../../index';
import {
    getFullScreenApi,
    requestFullscreen,
    isFullscreen,
    exitFullscreen,
    FullScreenApiType,
} from './fullscreen';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import TTPlayerCore from '@dking/ttplayer-core';

class ControlFullScreen {

    public componentName: string = 'ControlScreenShot';
    public controller: TTPlayerVideoControl;
    public control: DOMUtils<HTMLElement>;
    public screen: DOMUtils<HTMLDivElement>;
    public event: EventEmitter;
    public icon: SVGIcons;
    public paused: boolean = true;
    public player: TTPlayerCore;
    public API: FullScreenApiType;

    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (controller: TTPlayerVideoControl) {
        this.controller = controller;
        this.control = controller.control;
        this.event = controller.event;
        this.player = controller.player;
        this.screen = DOMUtils.createUtilDom('div');
        this.icon = SVGIcons.createSvg('fullscreen');
        this.API = getFullScreenApi();
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
        return this.screen.getInstance();
    }

    private render () {
        this.icon.init();
        this.screen
            .addClass('fullscreen--button icon--container')
            .append(this.icon.getInstance());
        return this;
    }

    private bindEvents () {
        const handleFScreenChange = this.handleFullscreenChange.bind(this);
        document.addEventListener(this.API.fullscreenchange, handleFScreenChange);
        this.ugs.push(() => document.removeEventListener(this.API.fullscreenchange, handleFScreenChange));
        return this;
    }

    private bindActions () {
        this.actUgs.push(this.screen.on('click', this.handleClick.bind(this)));
        return this;
    }

    private handleFullscreenChange () {
        return this;
    }

    private handleClick () {
        isFullscreen() ? this.exitFullscreen() : this.requestFullscreen();
    }

    private requestFullscreen (): Promise<void> {
        const container = this.player.root.getInstance();
        return requestFullscreen(container);
    }

    private exitFullscreen (): Promise<void> {
        return exitFullscreen();
    }

}

export default ControlFullScreen;
