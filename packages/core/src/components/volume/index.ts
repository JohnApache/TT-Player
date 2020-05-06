import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

class TTPlayerVolume<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public volume: number;
    public muted: boolean
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.volume = media.volume;
        this.muted = media.muted;
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    componentWillMount () {
        this.logger.info('TTPlayerVolume componentWillMount');
        this.bindVolumeEvents();
    }

    componentDidMount () {
        this.logger.info('TTPlayerVolume componentDidMount');
    }

    componentWillUnmount () {
        this.logger.info('TTPlayerVolume componentWillUnmount');
        this.removeVolumeEvents();
    }

    private bindVolumeEvents () {
        this.event.on('volumechange', this.handleVolumeChange);
    }

    private removeVolumeEvents () {
        this.event.off('volumechange', this.handleVolumeChange);
    }

    private handleVolumeChange () {
        this.volume = this.media.volume;
        this.muted = this.media.muted;
        this.render();
    }

}

export default TTPlayerVolume;
