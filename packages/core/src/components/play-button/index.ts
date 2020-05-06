import TTPlayerMediaComponent from '../../media/component';
import TTPlayerMedia, { TMediaType } from '../../media/media';

class TTPlayerPlayButton<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static className = 'ttplayer__media__component--play-button';
    public paused: boolean = true;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount () {
        this.logger.debug('TTPlayerPlayButton componentWillMount');
        this.bindEvents();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerPlayButton componentDidMount');
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerPlayButton componentWillUnmount');
        this.removeEvents();
    }

    renderPlay () {
        this.root
            .html('播放');
    }

    renderPause () {
        this.root
            .html('暂停');
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    render () {
        if (this.paused) {
            this.renderPause();
            return;
        }
        this.renderPlay();
    }

    private bindEvents () {
        this.event.on('play', this.handlePlay);
        this.event.on('pause', this.handlePause);
        this.root.on('click', this.handleClick);
        return this;
    }

    private removeEvents () {
        this.event.off('play', this.handlePlay);
        this.event.off('pause', this.handlePause);
        this.root.off('click', this.handleClick);
        return this;
    }

    private handlePause () {
        this.paused = true;
        this.render();
        return this;
    }

    private handlePlay () {
        this.paused = false;
        this.render();
        return this;
    }

    private handleClick (e: Event) {
        e.stopPropagation();
        this.logger.info('click play button');
        if (this.paused) {
            this.media.play();
            return;
        }
        this.media.pause();
    }

}

export default TTPlayerPlayButton;
