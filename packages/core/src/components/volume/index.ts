import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

abstract class TTPlayerVolume<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public volume: number = 0;
    public muted: boolean = false;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    beforeMount () {
        this.bindVolumeEvents();
    }

    mounted () {}

    beforeDestroy () {
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
        this.volume = this.mediaDom.volume;
        this.muted = this.mediaDom.muted;
        this.onVolumeChange(this.volume, this.muted);
    }

}

export default TTPlayerVolume;