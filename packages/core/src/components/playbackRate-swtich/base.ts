import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

class TTPlayerBasePlaybackRate<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public playbackRate: number = 1;
    static className: string = 'ttplayer__media__component--playback-rate';
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handlePlaybackRateChange = this.handlePlaybackRateChange.bind(this);
    }

    componentWillMount () {
        this.bindPlaybackRateEvents();
    }

    componentWillUnmount () {
        this.removePlaybackRateEvents();
    }

    private bindPlaybackRateEvents () {
        this.event.on('ratechange', this.handlePlaybackRateChange);
    }

    private removePlaybackRateEvents () {
        this.event.off('ratechange', this.handlePlaybackRateChange);
    }

    private handlePlaybackRateChange () {
        this.playbackRate = this.media.playbackRate;
        this.render();
    }

}

export default TTPlayerBasePlaybackRate;
