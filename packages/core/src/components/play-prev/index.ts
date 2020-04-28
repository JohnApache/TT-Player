import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBasePlayList from '../playList/base';

abstract class TTPlayerPlayPrev<T extends TMediaType> extends TTPlayerBasePlayList<T> {

    public disable: boolean = true;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        if (
            this.playList.length > 0 &&
            this.current > 0 &&
            this.current <= this.playList.length - 1
        ) {
            this.disable = false;
        }

        this.handlePlayPrev = this.handlePlayPrev.bind(this);
    }

    abstract renderPlayPrev(): any;

    beforeMount () {
        super.beforeMount();
        this.renderPlayPrev();
        this.bindPlayNextEvents();
    }

    mounted () {
        super.mounted();
    }

    beforeDestroy () {
        super.beforeDestroy();
        this.removePlayNextEvents();
    }

    onPlayItemChange () {
        if (this.current >= this.playList.length - 1) {
            this.disable = true;
        }
        this.renderPlayPrev();
    }

    private bindPlayNextEvents () {
        this.root.on('click', this.handlePlayPrev);
    }

    private removePlayNextEvents () {
        this.root.off('click', this.handlePlayPrev);
    }

    private handlePlayPrev () {
        if (this.disable) return;
        const prevIndex = this.current - 1;
        if (
            prevIndex >= this.playList.length ||
            prevIndex < 0
        ) return;
        this.current = prevIndex;
        this.media.src = this.playList[prevIndex].url;
        this.event.emit(Hooks.PlayNext);
        this.event.emit(Hooks.SwitchPlayItem, prevIndex);
    }

}

export default TTPlayerPlayPrev;
