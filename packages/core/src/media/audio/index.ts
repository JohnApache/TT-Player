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
    }

    renderAudio () {}

    static use (audioComponentCtor: TTPlayerAudioComponentCtor) {
        this.audioComponentsCtor.push(audioComponentCtor);
        return this;
    }


    getMediaInstance () {
        if (!this.audio) this.audio = DOMUtils.createUtilDom('audio');
        return this.audio.getInstance();
    }

    beforeMount () {
        this.renderAudio();
        this.initAudioComponents();
    }

    mounted () {
        this.audioComponents.forEach(comp => {
            comp.mounted();
        });
    }

    beforeDestroy () {
        this.audioComponents.forEach(comp => comp.beforeDestroy());
    }

    private initAudioComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerAudio).audioComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.beforeMount();
            this.root.append(comp.root.getInstance());
            this.audioComponents.push(comp);
        });
         /* eslint-enable */
        return this;
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
