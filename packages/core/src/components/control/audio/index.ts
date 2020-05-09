import TTPlayerAudioComponentsGroup, {
    AudioComponentCtor,
    TTPlayerAudioComponentsGroupFactory,
    AudioGroupComponentCtor,
} from '../../components-group/audio';
import TTPlayerAudio from '../../../media/audio';
import AudioControlOptions from './options';
import { DOMUtils } from '@dking/ttplayer-utils';


const TTPlayerAudioLeftGroup = TTPlayerAudioComponentsGroupFactory();
const TTPlayerAudioCenterGroup = TTPlayerAudioComponentsGroupFactory();
const TTPlayerAudioRightGroup = TTPlayerAudioComponentsGroupFactory();

TTPlayerAudioLeftGroup.className = 'ttplayer__media__component__control--left';
TTPlayerAudioCenterGroup.className = 'ttplayer__media__component__control--center';
TTPlayerAudioRightGroup.className = 'ttplayer__media__component__control--top';

class TTPlayerAudioControl extends TTPlayerAudioComponentsGroup {

    static className: string = 'ttplayer__media__component--control';
    static groupComponentsCtor: AudioGroupComponentCtor[] = [
        TTPlayerAudioLeftGroup,
        TTPlayerAudioCenterGroup,
        TTPlayerAudioRightGroup,
    ];

    public leftControl: DOMUtils<HTMLDivElement>;
    public centerControl: DOMUtils<HTMLDivElement>;
    public rightControl: DOMUtils<HTMLDivElement>;
    public options: AudioControlOptions;

    constructor (media: TTPlayerAudio) {
        super(media);
        this.options = new AudioControlOptions(media.options.audioControl);
        this.leftControl = this.groupComponents[0].root;
        this.centerControl = this.groupComponents[1].root;
        this.rightControl = this.groupComponents[2].root;
    }

    static useInLeft (ctor: AudioComponentCtor) {
        const LG = this.groupComponentsCtor[0];
        LG.use(ctor);
        return this;
    }

    static useInCenter (ctor: AudioComponentCtor) {
        const CG = this.groupComponentsCtor[1];
        CG.use(ctor);
        return this;
    }

    static useInRight (ctor: AudioComponentCtor) {
        const RG = this.groupComponentsCtor[2];
        RG.use(ctor);
        return this;
    }

    componentWillMount () {
        super.componentWillMount();
        this.logger.debug('TTPlayerAudioControl componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerAudioControl componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.logger.debug('TTPlayerAudioControl componentWillUnmount');
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    render () {
        const { height } = this.options;
        this.root.height(height);
        this.logger.debug('TTPlayerAudioControl render');
    }

}

const TTPlayerAudioControlFactory = (): typeof TTPlayerAudioControl => {
    const LG = TTPlayerAudioComponentsGroupFactory();
    const CG = TTPlayerAudioComponentsGroupFactory();
    const RG = TTPlayerAudioComponentsGroupFactory();

    LG.className = 'ttplayer__media__component__control--left';
    CG.className = 'ttplayer__media__component__control--center';
    RG.className = 'ttplayer__media__component__control--top';

    class T extends TTPlayerAudioControl {

        static className: string = 'ttplayer__media__component--control';
        static groupComponentsCtor: AudioGroupComponentCtor[] = [
            LG,
            CG,
            RG,
        ];

    }

    return T;
};

export { TTPlayerAudioControlFactory };

export default TTPlayerAudioControl;
