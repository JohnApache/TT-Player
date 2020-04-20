import VideoControlOptions from './options';

import ControlVolume from './components/volume';
import ControlPlay from './components/play';
import ControlDurationText from './components/duration';
import ControlProgress from './components/progress';
import ControlScreenShot from './components/screenshot';
import ControlFullscreen from './components/fullscreen';

import TTPlayerControlComponents from './component';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import { TTPlayerVideo, TTPlayerVideoComponent } from '@dking/ttplayer-video';

interface ControlComponentCtor {
    new (control: TTPlayerVideoControl): TTPlayerVideoComponent;
}

class TTPlayerVideoControl extends TTPlayerVideoComponent {

    static leftComponentsCtor: ControlComponentCtor[] = [];
    static rightComponentsCtor: ControlComponentCtor[] = [];
    static controlComponentsCtor: ControlComponentCtor[] = [];

    public leftControl: DOMUtils<HTMLDivElement>;
    public rightControl: DOMUtils<HTMLDivElement>;
    public options: VideoControlOptions;
    public controlComponents: TTPlayerControlComponents[] = [];

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
        this.initControlComponents()
            .render();
    }

    mounted () {
        this.controlComponents.forEach(comp => {
            comp.mounted();
        });
    }

    beforeDestroy () {
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
        return this;
    }

    private initControlComponents () {
        const {
            leftComponentsCtor,
            rightComponentsCtor,
            controlComponentsCtor,
        } = TTPlayerVideoControl;

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
