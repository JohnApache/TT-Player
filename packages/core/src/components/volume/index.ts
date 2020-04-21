import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

abstract class TTPlayerVolume<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public volume: number;
    public muted: boolean
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.volume = media.volume;
        this.muted = media.muted;
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    beforeMount () {
        this.logger.info('TTPlayerVolume beforeMount');
        this.bindVolumeEvents();
    }

    mounted () {
        this.logger.info('TTPlayerVolume mounted');
    }

    beforeDestroy () {
        this.logger.info('TTPlayerVolume beforeDestroy');
        this.removeVolumeEvents();
    }

    abstract onVolumeChange(volume: number, muted: boolean): any;

    private bindVolumeEvents () {
        this.event.on('volumechange', this.handleVolumeChange);
    }

    private removeVolumeEvents () {
        this.event.off('volumechange', this.handleVolumeChange);
    }

    private handleVolumeChange () {
        this.volume = this.media.volume;
        this.muted = this.media.muted;
        this.onVolumeChange(this.volume, this.muted);
    }

}

export default TTPlayerVolume;
