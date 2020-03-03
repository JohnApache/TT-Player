import EventEmitter from 'eventemitter3';
import { PLUGIN_NAME } from './config';
import VideoControlOptions from './options';
import ControlVolume from './components/volume';
import ControlPlay from './components/play';
import ControlDurationText from './components/duration';
import TTPlayerCore, { Plugin } from '@dking/ttplayer-core';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

abstract class ControlComponent {

    abstract componentName: string;
    abstract init: ()=> any;
    abstract destroy: ()=> any;
    abstract getInstance: ()=> HTMLElement;

}

interface ControlComponentCtor {
    new (control: TTPlayerVideoControl): ControlComponent;
}

class TTPlayerVideoControl extends Plugin {

    static pluginName: string = PLUGIN_NAME;
    static leftComponentsCtor: ControlComponentCtor[] = [];
    static rightComponentsCtor: ControlComponentCtor[] = [];

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
            .renderControlComponents()
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
            .removeControlComponents();
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

    private addLeftControlComponent (controlComponent: ControlComponent) {
        controlComponent.init();
        this.leftComponents.push(controlComponent);
        return this;
    }

    private addRightControlComponent (controlComponent: ControlComponent) {
        controlComponent.init();
        this.rightComponents.push(controlComponent);
        return this;
    }

    private renderControlComponents () {
        const { leftComponentsCtor, rightComponentsCtor } = TTPlayerVideoControl;
        leftComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.init();
            this.leftComponents.push(comp);
            this.leftControl.append(comp.getInstance());
        });

        rightComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.init();
            this.rightComponents.push(comp);
            this.rightControl.append(comp.getInstance());
        });
        return this;
    }

    private removeControlComponents () {
        this.leftComponents.forEach(comp => comp.destroy());
        this.rightComponents.forEach(comp => comp.destroy());
        this.leftComponents = [];
        this.rightComponents = [];
        return this;
    }

    private removeLeftControlComponent (componentName: string) {
        this.leftComponents = this.leftComponents.filter(comp => {
            if (comp.componentName === componentName) {
                comp.destroy();
                return false;
            }
            return true;
        });
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

    static useInLeft (controlComponentCtor: ControlComponentCtor) {
        this.leftComponentsCtor.push(controlComponentCtor);
        return this;
    }

    static useInRight (controlComponentCtor: ControlComponentCtor) {
        this.leftComponentsCtor.push(controlComponentCtor);
        return this;
    }

}

TTPlayerVideoControl
    .useInLeft(ControlPlay)
    .useInLeft(ControlVolume)
    .useInLeft(ControlDurationText);

export default TTPlayerVideoControl;
