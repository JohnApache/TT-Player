import VideoControlOptions from './options';

import ControlVolume from './components/volume';
import ControlPlay from './components/play';
import ControlDurationText from './components/duration';
import ControlProgress from './components/progress';
import ControlScreenShot from './components/screenshot';
import ControlFullscreen from './components/fullscreen';
import ControlQualitySwitch from './components/quality-switch';
import ControlPlaySwitch from './components/play-switch';

import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import { TTPlayerVideo, TTPlayerMediaComponent } from '@dking/ttplayer-core';

interface ControlComponentCtor {
    new (control: TTPlayerVideoControl): TTPlayerMediaComponent<'Video'>;
}

class TTPlayerVideoControl extends TTPlayerMediaComponent<'Video'> {

    static leftComponentsCtor: ControlComponentCtor[] = [];
    static rightComponentsCtor: ControlComponentCtor[] = [];
    static controlComponentsCtor: ControlComponentCtor[] = [];

    public leftControl: DOMUtils<HTMLDivElement>;
    public rightControl: DOMUtils<HTMLDivElement>;
    public options: VideoControlOptions;
    public controlComponents: TTPlayerMediaComponent<'Video'>[] = [];

    constructor (media: TTPlayerVideo) {
        super(media);
        this.leftControl = DOMUtils.createUtilDom('div');
        this.rightControl = DOMUtils.createUtilDom('div');
        this.options = new VideoControlOptions(media.options.videoControl);
        this.root
            .append(this.leftControl.getInstance())
            .append(this.rightControl.getInstance());
    }

    static use (controlComponentCtor: ControlComponentCtor) {
        this.controlComponentsCtor.push(controlComponentCtor);
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

    componentWillMount () {
        this.logger.debug('TTPlayerVideoControl componentWillMount');
        this.initControlComponents()
            .render();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerVideoControl componentDidMount');
        this.controlComponents.forEach(comp => {
            comp.componentDidMount();
        });
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerVideoControl componentWillUnmount');
        this.removeControlComponents();
    }

    beforeRender () {
        this.leftControl
            .addClass('left--container');

        this.rightControl
            .addClass('right--container');

        this.root
            .addClass('video--control');
    }

    render () {
        const { height } = this.options;
        this.root.height(height);
        this.logger.debug('TTPlayerVideoControl render');
    }

    private initControlComponents () {
        const {
            leftComponentsCtor,
            rightComponentsCtor,
            controlComponentsCtor,
        } = TTPlayerVideoControl;

        this.logger.info('TTPlayerVideoControl init control components');
        leftComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.controlComponents.push(comp);
            this.leftControl.append(comp.root.getInstance());
        });

        rightComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.controlComponents.push(comp);
            this.rightControl.append(comp.root.getInstance());
        });

        controlComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.root.append(comp.root.getInstance());
            this.controlComponents.push(comp);
        });

        return this;
    }

    private removeControlComponents () {
        this.controlComponents.forEach(comp => comp.componentWillUnmount());
        return this;
    }

}


TTPlayerVideoControl
    .useInLeft(ControlPlay)
    .useInLeft(ControlVolume)
    .useInLeft(ControlDurationText)
    .useInRight(ControlFullscreen)
    .useInRight(ControlScreenShot)
    .useInRight(ControlQualitySwitch)
    .useInRight(ControlPlaySwitch)
    .use(ControlProgress);

export default TTPlayerVideoControl;
