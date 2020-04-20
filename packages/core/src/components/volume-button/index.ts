import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerVolume from '../volume';

// TODO MIXINS 多重继承
abstract class TTPlayerVolumeButton<T extends TMediaType> extends TTPlayerVolume<T> {

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handleClickVolumeButton = this.handleClickVolumeButton.bind(this);
    }

    beforeMount () {
        super.beforeMount();
        this.logger.info('TTPlayerVolumeButton beforeMount');
        this.bindButtonEvents();
        this.renderVolumeButton();
    }

    mounted () {
        super.mounted();
        this.logger.info('TTPlayerVolumeButton mounted');
    }

    beforeDestroy () {
        super.beforeDestroy();
        this.logger.info('TTPlayerVolumeButton beforeDestroy');
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
        this.logger.info('click volume button');
        this.mediaDom.muted = !this.muted;
    }

}

export default TTPlayerVolumeButton;
