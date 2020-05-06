import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerVolume from '../volume';

// Consider MIXINS 多重继承
class TTPlayerVolumeButton<T extends TMediaType> extends TTPlayerVolume<T> {

    static className: string = 'ttplayer__media__component--volume-button';

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handleClickVolumeButton = this.handleClickVolumeButton.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.logger.info('TTPlayerVolumeButton componentWillMount');
        this.bindButtonEvents();
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.info('TTPlayerVolumeButton componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.logger.info('TTPlayerVolumeButton componentWillUnmount');
        this.removeButtonEvents();
    }

    beforeRender () {
        this.root.addClass(this.className);
    }

    render () {
        this.muted ?
            this.root.addClass('muted') :
            this.root.removeClass('muted');
    }

    private bindButtonEvents () {
        this.root.on('click', this.handleClickVolumeButton);
    }

    private removeButtonEvents () {
        this.root.off('click', this.handleClickVolumeButton);
    }

    private handleClickVolumeButton () {
        this.logger.info('click volume button');
        this.media.muted = !this.muted;
    }

}

export default TTPlayerVolumeButton;
