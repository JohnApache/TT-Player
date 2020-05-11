import TTPlayerCore from '../../core';
import TTPlayerMedia, { TMediaType } from '../media';
import TTPlayerMediaComponent from '../component';
import TTPlayerVideoOptions from './option';
import VideoMSE, { IMSECtor } from './mse';
import { DOMUtils } from '@dking/ttplayer-utils';

const VIDEO_MEDIA_TYPE: TMediaType = 'Video';

interface TTPlayerVideoComponentCtor {
    new (video: TTPlayerVideo): TTPlayerMediaComponent<'Video'>;
}

class TTPlayerVideo extends TTPlayerMedia<'Video'> {

    static className: string = 'ttplayer__video--component';
    static mediaType = VIDEO_MEDIA_TYPE;
    static videoComponentsCtor: TTPlayerVideoComponentCtor[] = [];
    static msesCtor: IMSECtor[] = [];

    public mses: VideoMSE[] = [];
    public currentMSE: VideoMSE | null = null;
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
        this.initVideoComponents();
        this.initMSE();
    }

    static use (videoComponentCtor: TTPlayerVideoComponentCtor) {
        this.videoComponentsCtor.push(videoComponentCtor);
        return this;
    }

    static useMSE (ctor: IMSECtor) {
        this.msesCtor.push(ctor);
        return this;
    }

    get src (): string {
        return this.mediaDom.src;
    }

    set src (src: string) {
        this.logger.debug(`media set src ${ src }`);
        this.mediaDom.src = src;
        this.options.src = src;
        this.createMSE(src);
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
        this.renderVideoComponents();
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
        this.clearMSE();
    }

    beforeRender () {
        super.beforeRender();
        this.video
            .addClass(this.className);
    }

    render () {
        super.render();
    }

    private initMSE () {
        /* eslint-disable */
        const msesCtor = (this.constructor as typeof TTPlayerVideo).msesCtor || [];
        /* eslint-enable */
        msesCtor.forEach(ctor => {
            this.mses.push(new ctor(this));
        });
    }

    private createMSE (src: string, type: string = 'auto') {
        const mses = this.mses;
        for (let i = 0; i < mses.length; i++) {
            const mse = mses[i];
            if (!mse.checkType(src, type)) continue;
            mse.initMSE(src);
            this.currentMSE = mse;
            break; // 初始化直接跳过后续检查
        }
    }

    private clearMSE () {
        if (!this.currentMSE) return;
        this.currentMSE.clearMSE();
    }

    private initVideoComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerVideo).videoComponentsCtor.forEach(ctor => {
            this.videoComponents.push(new ctor(this));
        });
        /* eslint-enable */
    }

    private renderVideoComponents () {
        this.videoComponents.forEach(comp => {
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.root.append(comp.root.getInstance());
        });
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
    VideoMSE,
};

export default TTPlayerVideo;
