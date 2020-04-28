import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';
import Hooks from '../../hooks';

interface IPlayItem {
    url: string;
    type?: string;
}

abstract class TTPlayerBasePlayList<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public current: number = -1;
    public playList: IPlayItem [] = [];

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.playList = media.options.playList || [];
        this.playList.forEach((item, index) => {
            if (item.url === this.media.src) {
                this.current = index;
            }
        });
        this.handlePlayItemChange = this.handlePlayItemChange.bind(this);
    }

    abstract onPlayItemChange(current: number): any;

    beforeMount () {
        this.bindPlayListEvents();
    }

    mounted () {}

    beforeDestroy () {
        this.removePlayListEvents();
    }

    private bindPlayListEvents () {
        this.event.on(Hooks.SwitchPlayItem, this.handlePlayItemChange);
    }

    private removePlayListEvents () {
        this.event.off(Hooks.SwitchPlayItem, this.handlePlayItemChange);
    }

    private handlePlayItemChange (index: number) {
        this.current = index;
        this.onPlayItemChange(this.current);
    }

}

export { IPlayItem };

export default TTPlayerBasePlayList;
