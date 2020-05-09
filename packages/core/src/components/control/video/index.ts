import TTPlayerVideoComponentsGroup, {
    VideoComponentCtor,
    VideoGroupComponentCtor,
    TTPlayerVideoComponentsGroupFactory,
} from '../../components-group/video';
import TTPlayerVideo from '../../../media/video';
import VideoControlOptions from './options';
import { DOMUtils } from '@dking/ttplayer-utils';


const TTPlayerVideoLeftGroup = TTPlayerVideoComponentsGroupFactory();
const TTPlayerVideoCenterGroup = TTPlayerVideoComponentsGroupFactory();
const TTPlayerVideoRightGroup = TTPlayerVideoComponentsGroupFactory();

TTPlayerVideoLeftGroup.className = 'ttplayer__media__component__control--left';
TTPlayerVideoCenterGroup.className = 'ttplayer__media__component__control--center';
TTPlayerVideoRightGroup.className = 'ttplayer__media__component__control--top';

class TTPlayerVideoControl extends TTPlayerVideoComponentsGroup {

    static className: string = 'ttplayer__media__component--control';
    static groupComponentsCtor: VideoGroupComponentCtor[] = [
        TTPlayerVideoLeftGroup,
        TTPlayerVideoCenterGroup,
        TTPlayerVideoRightGroup,
    ];

    public leftControl: DOMUtils<HTMLDivElement>;
    public centerControl: DOMUtils<HTMLDivElement>;
    public rightControl: DOMUtils<HTMLDivElement>;
    public options: VideoControlOptions;

    constructor (media: TTPlayerVideo) {
        super(media);
        this.options = new VideoControlOptions(media.options.audioControl);
        this.leftControl = this.groupComponents[0].root;
        this.centerControl = this.groupComponents[1].root;
        this.rightControl = this.groupComponents[2].root;
    }

    static useInLeft (ctor: VideoComponentCtor) {
        const LG = this.groupComponentsCtor[0];
        LG.use(ctor);
        return this;
    }

    static useInCenter (ctor: VideoComponentCtor) {
        const CG = this.groupComponentsCtor[1];
        CG.use(ctor);
        return this;
    }

    static useInRight (ctor: VideoComponentCtor) {
        const RG = this.groupComponentsCtor[2];
        RG.use(ctor);
        return this;
    }

    componentWillMount () {
        super.componentWillMount();
        this.logger.debug('TTPlayerVideoControl componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerVideoControl componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.logger.debug('TTPlayerVideoControl componentWillUnmount');
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    render () {
        const { height } = this.options;
        this.root.height(height);
        this.logger.debug('TTPlayerVideoControl render');
    }

}

const TTPlayerVideoControlFactory = (): typeof TTPlayerVideoControl => {
    const LG = TTPlayerVideoComponentsGroupFactory();
    const CG = TTPlayerVideoComponentsGroupFactory();
    const RG = TTPlayerVideoComponentsGroupFactory();

    LG.className = 'ttplayer__media__component__control--left';
    CG.className = 'ttplayer__media__component__control--center';
    RG.className = 'ttplayer__media__component__control--top';
    class T extends TTPlayerVideoControl {

        static className: string = 'ttplayer__media__component--control';
        static groupComponentsCtor: VideoGroupComponentCtor[] = [
            LG,
            CG,
            RG,
        ];

    }
    return T;
};

export { TTPlayerVideoControlFactory };

export default TTPlayerVideoControl;
