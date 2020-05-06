import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';
import Hooks from '../../hooks';
import {
    requestFullscreen,
    exitFullscreen,
    getFullScreenApi,
    FullScreenApiType,
    isFullscreen,
} from './fullscreen';

class TTPlayerFullscreen extends TTPlayerMediaComponent<'Video'> {

    static className = 'ttplayer__media__component--fullscreen';
    public isFullscreen: boolean = false;
    public FULLSCREEN_API: FullScreenApiType;

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.handleClickFullscreen = this.handleClickFullscreen.bind(this);
        this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
        this.FULLSCREEN_API = getFullScreenApi();
    }

    componentWillMount () {
        this.logger.debug('TTPlayerFullscreen componentWillMount');
        this.bindFullscreenEvents();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerFullscreen componentDidMount');
        this.isFullscreen = isFullscreen();
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerFullscreen componentWillUnmount');
        this.removeFullscreenEvents();
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    renderFullscreen () {
        this.root.html('全屏');
    }

    hideFullscreen () {
        this.root.html('取消全屏');
    }

    render () {
        if (this.isFullscreen) {
            this.renderFullscreen();
            return;
        }
        this.hideFullscreen();
    }

    getFullscreenContainer (): HTMLElement {
        return this.media.root.getInstance();
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
            requestFullscreen(this.getFullscreenContainer());
            return;
        }
        this.logger.info('exit fullscreen');
        exitFullscreen();
    }

    private handleFullscreenChange () {
        this.isFullscreen = isFullscreen();
        this.logger.info('fullscreen change');
        this.logger.info('current isFullscreen: ', this.isFullscreen);
        this.event.emit(Hooks.FullscreenChange, this.isFullscreen);
    }

}

export default TTPlayerFullscreen;
