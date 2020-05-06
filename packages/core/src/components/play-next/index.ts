import TTPlayerMedia, { TMediaType } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBasePlayList from '../play-list/base';

class TTPlayerPlayNext<T extends TMediaType> extends TTPlayerBasePlayList<T> {

    static className = 'ttplayer__media__component--play-next';
    public disable: boolean = true;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.disable = this.isDisabled();
        this.handleClickPlayNext = this.handleClickPlayNext.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindPlayNextEvents();
        this.logger.debug('TTPlayerPlayNext componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerPlayNext componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.removePlayNextEvents();
        this.logger.debug('TTPlayerPlayNext componentWillUnmount');
    }

    beforeRender () {
        this.root.addClass(this.className);
    }

    renderPlayNext () {
        this.root.html('下一个');
    }

    render () {
        this.disable = this.isDisabled();
        this.disable ? this.root.addClass('disabled') : this.root.removeClass('disabled');
        this.renderPlayNext();
    }

    public isDisabled (): boolean {
        return (
            this.playList.length <= 0 ||
            this.current >= this.playList.length - 1
        );
    }

    private bindPlayNextEvents () {
        this.root.on('click', this.handleClickPlayNext);
    }

    private removePlayNextEvents () {
        this.root.off('click', this.handleClickPlayNext);
    }

    private handleClickPlayNext () {
        this.logger.info('click play next button');
        if (this.disable) return;
        let nextIndex = this.current + 1;
        if (nextIndex > this.playList.length - 1) nextIndex = this.playList.length - 1;
        if (nextIndex < 0) nextIndex = 0;
        this.current = nextIndex;
        this.media.src = this.playList[nextIndex].url;
        this.event.emit(Hooks.PlayNext);
        this.event.emit(Hooks.SwitchPlayItem, nextIndex);
    }

}

export default TTPlayerPlayNext;
