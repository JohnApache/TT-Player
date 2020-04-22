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

    renderVideo () {}

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

    beforeMount () {
        this.renderVideo();
        this.initVideoComponents();
    }

    mounted () {
        this.videoComponents.forEach(comp => {
            comp.mounted();
        });
    }

    beforeDestroy () {
        this.videoComponents.forEach(comp => comp.beforeDestroy());
    }

    private initVideoComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerVideo).videoComponentsCtor.forEach(ctor => {
            const comp = new ctor(this);
            comp.beforeMount();
            this.root.append(comp.root.getInstance());
            this.videoComponents.push(comp);
        });
         /* eslint-enable */
        return this;
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
