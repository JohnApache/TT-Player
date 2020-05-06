import TTPlayerCore from '../../core';
import TTPlayerMedia, { TMediaType } from '../media';
import TTPlayerMediaComponent from '../component';
import TTPlayerVideoOptions from './option';
import { DOMUtils } from '@dking/ttplayer-utils';


const VIDEO_MEDIA_TYPE: TMediaType = 'Video';

interface TTPlayerVideoComponentCtor {
    new (video: TTPlayerVideo): TTPlayerMediaComponent<'Video'>;
}

class TTPlayerVideo extends TTPlayerMedia<'Video'> {

    static className: string = 'ttplayer__video--component';
    static mediaType = VIDEO_MEDIA_TYPE;
    static videoComponentsCtor: TTPlayerVideoComponentCtor[] = [];

    public video: DOMUtils<HTMLVideoElement>;
    public options: TTPlayerVideoOptions;
    public videoComponents: TTPlayerMediaComponent<'Video'>[] = []


    constructor (player: TTPlayerCore) {
        super(VIDEO_MEDIA_TYPE, player);
        this.video = this.media;
        this.options = new TTPlayerVideoOptions({
            ...player.options.media,
            ...player.options.video,
        });
    }

    static use (videoComponentCtor: TTPlayerVideoComponentCtor) {
        this.videoComponentsCtor.push(videoComponentCtor);
        return this;
    }

    get poster (): string {
        return this.mediaDom.poster;
    }

    set poster (poster: string) {
        this.logger.info(`TTPlayerVideo set poster ${ poster }`);
        this.mediaDom.poster = poster;
    }

    getMediaInstance () {
        if (!this.video) this.video = DOMUtils.createUtilDom('video');
        return this.video.getInstance();
    }

    componentWillMount () {
        super.componentWillMount();
        this.initVideoComponents();
    }

    componentDidMount () {
        super.componentDidMount();
        this.videoComponents.forEach(comp => {
            comp.componentDidMount();
        });
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.videoComponents.forEach(comp => comp.componentWillUnmount());
    }

    beforeRender () {
        super.beforeRender();
        this.video
            .addClass(this.className);
    }

    render () {
        super.render();
    }

    private initVideoComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerVideo).videoComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.root.append(comp.root.getInstance());
            this.videoComponents.push(comp);
        });
         /* eslint-enable */
    }

}

const TTPlayerVideoFactory = (): typeof TTPlayerVideo => {
    class T extends TTPlayerVideo {

        static videoComponentsCtor: TTPlayerVideoComponentCtor[] = [];
        constructor (player: TTPlayerCore) {
            super(player);
        }

    }
    return T;
};


export {
    TTPlayerVideoComponentCtor,
    TTPlayerVideoFactory,
    TTPlayerVideoOptions,
};

export default TTPlayerVideo;
