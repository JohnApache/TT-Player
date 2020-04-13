import TTPlayerMediaComponent from '../../media/component';
import TTPlayerMedia, { TMediaType } from '../../media/media';

abstract class TTPlayerPlayButton<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public paused: boolean = true;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    abstract onPlay(e: Event): any;
    abstract onPause(e: Event): any;

    beforeMount () {
        this.bindEvents();
    }

    mounted () {

    }

    beforeDestroy () {
        this.removeEvents();
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

    private handlePause (e: Event) {
        this.paused = true;
        this.onPause(e);
        return this;
    }

    private handlePlay (e: Event) {
        this.paused = false;
        this.onPlay(e);
        return this;
    }

    private handleClick () {
        if (this.paused) {
            this.media.play();
            return;
        }
        this.media.pause();
    }

}

export default TTPlayerPlayButton;
