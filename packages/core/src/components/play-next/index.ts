import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBasePlayList from '../playList/base';

abstract class TTPlayerPlayNext<T extends TMediaType> extends TTPlayerBasePlayList<T> {

    public disable: boolean = true;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        if (
            this.playList.length > 0 &&
            this.current < this.playList.length - 1
        ) {
            this.disable = false;
        }

        this.handlePlayNext = this.handlePlayNext.bind(this);
    }

    abstract renderPlayNext(): any;

    beforeMount () {
        super.beforeMount();
        this.renderPlayNext();
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
        this.renderPlayNext();
    }

    private bindPlayNextEvents () {
        this.root.on('click', this.handlePlayNext);
    }

    private removePlayNextEvents () {
        this.root.off('click', this.handlePlayNext);
    }

    private handlePlayNext () {
        if (this.disable) return;
        const nextIndex = this.current + 1;
        if (
            nextIndex >= this.playList.length ||
            nextIndex < 0
        ) return;
        this.current = nextIndex;
        this.media.src = this.playList[nextIndex].url;
        this.event.emit(Hooks.PlayNext);
        this.event.emit(Hooks.SwitchPlayItem, nextIndex);
    }

}

export default TTPlayerPlayNext;
