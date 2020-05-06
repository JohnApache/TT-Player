import TTPlayerMedia, { TMediaType } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBasePlayList from '../play-list/base';

class TTPlayerPlayPrev<T extends TMediaType> extends TTPlayerBasePlayList<T> {

    static className = 'ttplayer__media__component--play-prev';
    public disable: boolean = true;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.disable = this.isDisabled();
        this.handleClickPlayPrev = this.handleClickPlayPrev.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindPlayNextEvents();
        this.logger.debug('TTPlayerPlayPrev componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerPlayPrev componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.removePlayNextEvents();
        this.logger.debug('TTPlayerPlayPrev componentWillUnmount');
    }

    beforeRender () {
        this.root.addClass(this.className);
    }

    renderPlayNext () {
        this.root.html('上一个');
    }

    render () {
        this.disable = this.isDisabled();
        this.disable ? this.root.addClass('disabled') : this.root.removeClass('disabled');
        this.renderPlayNext();
    }

    public isDisabled () {
        return (
            this.playList.length <= 0 ||
            this.current <= 0
        );
    }

    private bindPlayNextEvents () {
        this.root.on('click', this.handleClickPlayPrev);
    }

    private removePlayNextEvents () {
        this.root.off('click', this.handleClickPlayPrev);
    }

    private handleClickPlayPrev () {
        this.logger.info('click play prev button');
        if (this.disable) return;
        let prevIndex = this.current - 1;
        if (prevIndex > this.playList.length - 1) prevIndex = this.playList.length - 1;
        if (prevIndex < 0) prevIndex = 0;
        this.current = prevIndex;
        this.media.src = this.playList[prevIndex].url;
        this.event.emit(Hooks.PlayNext);
        this.event.emit(Hooks.SwitchPlayItem, prevIndex);
    }

}

export default TTPlayerPlayPrev;
