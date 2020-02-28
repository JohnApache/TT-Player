import EventEmitter from 'eventemitter3';
import { PLUGIN_NAME } from './config';
import VideoControlOptions from './options';
import ControlPlayButton from './component/play-button';
import { ControlComponent } from './type';
import TTPlayerCore, { Plugin } from '@dking/ttplayer-core';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerVideoControl extends Plugin {

    static pluginName: string = PLUGIN_NAME;
    public pluginName: string = PLUGIN_NAME;
    public player: TTPlayerCore;
    public event: EventEmitter;
    public root: DOMUtils<HTMLElement>;
    public control: DOMUtils<HTMLDivElement>;
    public leftControl: DOMUtils<HTMLDivElement>;
    public rightControl: DOMUtils<HTMLDivElement>;
    public options: VideoControlOptions;
    public leftComponents: ControlComponent[] = [];
    public rightComponents: ControlComponent[] = [];

    constructor (player: TTPlayerCore) {
        super();
        this.player = player;
        this.event = player.event;
        this.root = player.root;
        this.control = DOMUtils.createUtilDom('div');
        this.leftControl = DOMUtils.createUtilDom('div');
        this.rightControl = DOMUtils.createUtilDom('div');
        this.options = new VideoControlOptions(player.options.videoControl);
    }

    init () {
        this.bindEvents()
            .bindActions()
            .initControl()
            .loadControlComponents()
            .render();
        return this;
    }

    render () {
        this.root.append(this.control.getInstance());
        return this;
    }

    destroy () {
        this.removeEvents()
            .removeActions()
            .unloadControlComponents();
        return this;
    }

    private initControl () {
        this.control
            .addClass('video--control')
            .append(this.leftControl.getInstance())
            .append(this.rightControl.getInstance());

        this.leftControl
            .addClass('left--container');

        this.rightControl
            .addClass('right--container');

        return this;
    }

    private loadControlComponents () {
        const { playButton } = this.options;

        playButton && this.leftComponents.push(new ControlPlayButton(this));

        this.leftComponents.forEach(comp => {
            comp.init();
            this.leftControl.append(comp.getInstance());
        });

        this.rightComponents.forEach(comp => {
            comp.init();
            this.rightControl.append(comp.getInstance());
        });

        return this;
    }

    private unloadControlComponents () {
        this.leftComponents.forEach(comp => comp.destroy());
        this.rightComponents.forEach(comp => comp.destroy());
        this.leftComponents = [];
        this.rightComponents = [];
        return this;
    }

    private bindEvents () {
        return this;
    }

    private bindActions () {
        return this;
    }

    private removeEvents () {
        return this;
    }

    private removeActions () {
        return this;
    }

}

export default TTPlayerVideoControl;
