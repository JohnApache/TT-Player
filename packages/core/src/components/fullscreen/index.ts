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
        this.logger.info('TTPlayerFullscreen beforeMount');
        this.renderFullscreen();
        this.bindFullscreenEvents();
    }

    mounted () {
        this.logger.info('TTPlayerFullscreen mounted');
        this.isFullscreen = isFullscreen();
    }

    beforeDestroy () {
        this.logger.info('TTPlayerFullscreen beforeDestroy');
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
        this.logger.info('click fullscreen button');
        if (!this.isFullscreen) {
            this.logger.info('request fullscreen');
            requestFullscreen(this.getFullscreenContainer());
            return;
        }
        this.logger.info('exit fullscreen');
        exitFullscreen();
    }

    private handleFullscreenChange () {
        this.isFullscreen = isFullscreen();
        this.logger.info('fullscreen change');
        this.logger.debug('current isFullscreen: ', this.isFullscreen);
        this.onFullscreenChange();
    }

}

export default TTPlayerFullscreen;
