import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerVolume from '../volume';

// TODO MIXINS 多重继承
abstract class TTPlayerVolumeButton<T extends TMediaType> extends TTPlayerVolume<T> {

    public volume: number = 0;
    public muted: boolean = false;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handleClickVolumeButton = this.handleClickVolumeButton.bind(this);
    }

    beforeMount () {
        super.beforeMount();
        this.bindButtonEvents();
        this.renderVolumeButton();
    }

    beforeDestroy () {
        super.beforeDestroy();
        this.removeButtonEvents();
    }

    abstract renderVolumeButton(): any;

    private bindButtonEvents () {
        this.root.on('click', this.handleClickVolumeButton);
    }

    private removeButtonEvents () {
        this.root.off('click', this.handleClickVolumeButton);
    }

    private handleClickVolumeButton () {
        this.mediaDom.muted = !this.muted;
    }

}

export default TTPlayerVolumeButton;
