import VideoControlOptions from './options';

import ControlVolume from './components/volume';
import ControlPlay from './components/play';
import ControlDurationText from './components/duration';
import ControlProgress from './components/progress';
import ControlScreenShot from './components/screenshot';
import ControlFullscreen from './components/fullscreen';
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

    beforeMount () {
        this.logger.info('TTPlayerVideoControl beforeMount');
        this.initControlComponents()
            .render();
    }

    mounted () {
        this.logger.info('TTPlayerVideoControl mounted');
        this.controlComponents.forEach(comp => {
            comp.mounted();
        });
    }

    beforeDestroy () {
        this.logger.info('TTPlayerVideoControl beforeDestroy');
        this.removeControlComponents();
    }

    render () {

        this.leftControl
            .addClass('left--container');

        this.rightControl
            .addClass('right--container');

        this.root
            .addClass('video--control')
            .append(this.leftControl.getInstance())
            .append(this.rightControl.getInstance());

        this.logger.info('TTPlayerVideoControl render');
        return this;
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
            comp.beforeMount();
            this.controlComponents.push(comp);
            this.leftControl.append(comp.root.getInstance());
        });

        rightComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.beforeMount();
            this.controlComponents.push(comp);
            this.rightControl.append(comp.root.getInstance());
        });

        controlComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.beforeMount();
            this.controlComponents.push(comp);
            this.root.append(comp.root.getInstance());
        });

        return this;
    }

    private removeControlComponents () {
        this.controlComponents.forEach(comp => comp.beforeDestroy());
        return this;
    }

}


TTPlayerVideoControl
    .useInLeft(ControlPlay)
    .useInLeft(ControlVolume)
    .useInLeft(ControlDurationText)
    .useInRight(ControlFullscreen)
    .useInRight(ControlScreenShot)
    .use(ControlProgress);

export default TTPlayerVideoControl;
