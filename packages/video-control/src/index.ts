import EventEmitter from 'eventemitter3';
import { PLUGIN_NAME } from './config';
import VideoControlOptions from './options';
import ControlVolume from './components/volume';
import ControlPlay from './components/play';
import ControlDurationText from './components/duration';
import ControlProgress from './components/progress';
import ControlScreenShot from './components/screenshot';
import ControlFullscreen from './components/fullscreen';
import TTPlayerCore, { Plugin, PlayerHooks } from '@dking/ttplayer-core';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

abstract class ControlComponent {

    abstract componentName: string;
    abstract destroy: ()=> any;
    abstract getInstance: ()=> HTMLElement;
    abstract onReady?: ()=> any;

}

interface ControlComponentCtor {
    new (control: TTPlayerVideoControl): ControlComponent;
}

class TTPlayerVideoControl extends Plugin {

    static pluginName: string = PLUGIN_NAME;
    static leftComponentsCtor: ControlComponentCtor[] = [];
    static rightComponentsCtor: ControlComponentCtor[] = [];
    static controlComponentsCtor: ControlComponentCtor[] = [];

    public pluginName: string = PLUGIN_NAME;
    public player: TTPlayerCore;
    public event: EventEmitter;
    public root: DOMUtils<HTMLElement>;
    public control: DOMUtils<HTMLDivElement>;
    public leftControl: DOMUtils<HTMLDivElement>;
    public rightControl: DOMUtils<HTMLDivElement>;
    public options: VideoControlOptions;
    public controlComponents: ControlComponent[] = [];

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
        this.controlComponents.push(controlComponent);
        this.leftControl.append(controlComponent.getInstance());
        return this;
    }

    private addRightControlComponent (controlComponent: ControlComponent) {
        this.controlComponents.push(controlComponent);
        this.rightControl.append(controlComponent.getInstance());
        return this;
    }

    private renderControlComponents () {
        const {
            leftComponentsCtor, rightComponentsCtor, controlComponentsCtor,
        } = TTPlayerVideoControl;

        leftComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            this.controlComponents.push(comp);
            this.leftControl.append(comp.getInstance());
        });

        rightComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            this.controlComponents.push(comp);
            this.rightControl.append(comp.getInstance());
        });

        controlComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            this.controlComponents.push(comp);
            this.control.append(comp.getInstance());
        });

        return this;
    }

    private removeControlComponents () {
        this.controlComponents.forEach(comp => comp.destroy());
        return this;
    }

    private removeControlComponent (componentName: string) {
        this.controlComponents = this.controlComponents.filter(comp => {
            if (comp.componentName === componentName) {
                comp.destroy();
                return false;
            }
            return true;
        });
        return this;
    }

    private bindEvents () {
        this.event.once(PlayerHooks.Ready, () => {
            this.controlComponents.forEach(comp => comp.onReady && comp.onReady());
        });

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
        this.rightComponentsCtor.push(controlComponentCtor);
        return this;
    }

    static use (controlComponentCtor: ControlComponentCtor) {
        this.controlComponentsCtor.push(controlComponentCtor);
        return this;
    }

}

TTPlayerVideoControl
    .useInLeft(ControlPlay)
    .useInLeft(ControlVolume)
    .useInLeft(ControlDurationText)
    .useInRight(ControlScreenShot)
    .useInRight(ControlFullscreen)
    .use(ControlProgress);

export default TTPlayerVideoControl;
