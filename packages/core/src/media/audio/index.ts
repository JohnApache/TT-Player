import TTPlayerCore from '../../core';
import TTPlayerMedia, { TMediaType } from '../media';
import TTPlayerMediaComponent from '../component';
import TTPlayerAudioOptions from './option';
import { DOMUtils } from '@dking/ttplayer-utils';

const AUDIO_MEDIA_TYPE: TMediaType = 'Audio';

interface TTPlayerAudioComponentCtor {
    new (audio: TTPlayerAudio): TTPlayerMediaComponent<'Audio'>;
}

class TTPlayerAudio extends TTPlayerMedia<'Audio'> {

    static className: string = 'ttplayer__audio--component';
    static mediaType = AUDIO_MEDIA_TYPE;
    static audioComponentsCtor: TTPlayerAudioComponentCtor[] = [];

    public audio: DOMUtils<HTMLAudioElement>;
    public options: TTPlayerAudioOptions;
    public audioComponents: TTPlayerMediaComponent<'Audio'>[] = []


    constructor (player: TTPlayerCore) {
        super(AUDIO_MEDIA_TYPE, player);
        this.audio = this.media;
        this.options = new TTPlayerAudioOptions({
            ...player.options.media,
            ...player.options.audio,
        });
        this.initAudioComponents();
    }

    static use (audioComponentCtor: TTPlayerAudioComponentCtor) {
        this.audioComponentsCtor.push(audioComponentCtor);
        return this;
    }


    getMediaInstance () {
        if (!this.audio) this.audio = DOMUtils.createUtilDom('audio');
        return this.audio.getInstance();
    }

    componentWillMount () {
        super.componentWillMount();
        this.renderAudioComponents();
    }

    componentDidMount () {
        super.componentDidMount();
        this.audioComponents.forEach(comp => {
            comp.componentDidMount();
        });
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.audioComponents.forEach(comp => comp.componentWillUnmount());
    }

    beforeRender () {
        super.beforeRender();
        this.audio
            .addClass(this.className);
    }

    render () {
        super.render();
    }

    private initAudioComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerAudio).audioComponentsCtor.forEach(ctor => {
            this.audioComponents.push(new ctor(this));
        });
         /* eslint-enable */
        return this;
    }

    private renderAudioComponents () {
        this.audioComponents.forEach(comp => {
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.root.append(comp.root.getInstance());
        });
    }

}

const TTPlayerAudioFactory = (): typeof TTPlayerAudio => {
    class T extends TTPlayerAudio {

        static audioComponentsCtor: TTPlayerAudioComponentCtor[] = [];
        constructor (player: TTPlayerCore) {
            super(player);
        }

    }
    return T;
};

export {
    TTPlayerAudioComponentCtor,
    TTPlayerAudioFactory,
    TTPlayerAudioOptions,
};

export default TTPlayerAudio;
