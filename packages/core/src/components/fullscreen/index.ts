import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';
import {
    requestFullscreen,
    exitFullscreen,
    getFullScreenApi,
    FullScreenApiType,
    isFullscreen,
} from './fullscreen';

abstract class TTPlayerFullscreen extends TTPlayerMediaComponent<'Video'> {

    public isFullscreen: boolean = false;
    public FULLSCREEN_API: FullScreenApiType;
    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.handleClickFullscreen = this.handleClickFullscreen.bind(this);
        this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
        this.FULLSCREEN_API = getFullScreenApi();
    }

    abstract renderFullscreen(): any;
    abstract getFullscreenContainer(): HTMLElement;
    abstract onFullscreenChange(): any;

    beforeMount () {
        this.renderFullscreen();
        this.bindFullscreenEvents();
    }

    mounted () {
        this.isFullscreen = isFullscreen();
    }

    beforeDestroy () {
        this.removeFullscreenEvents();
    }

    private bindFullscreenEvents () {
        this.root.on('click', this.handleClickFullscreen);
        document.addEventListener(this.FULLSCREEN_API.fullscreenchange, this.handleFullscreenChange);
    }

    private removeFullscreenEvents () {
        this.root.off('click', this.handleClickFullscreen);
    }

    private handleClickFullscreen () {
        if (!this.isFullscreen) {
            requestFullscreen(this.getFullscreenContainer());
            return;
        }
        exitFullscreen();
    }

    private handleFullscreenChange () {
        this.isFullscreen = isFullscreen();
        this.onFullscreenChange();
    }

}

export default TTPlayerFullscreen;
