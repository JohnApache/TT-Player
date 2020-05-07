import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';
import Hooks from '../../hooks';

interface IPlayItem {
    url: string;
    name?: string;
    type?: string;
}

class TTPlayerBasePlayList<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static className = 'ttplayer__media__component--playlist';
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

    componentWillMount () {
        this.bindPlayListEvents();
    }

    componentWillUnmount () {
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
        this.render();
    }

}

export { IPlayItem };

export default TTPlayerBasePlayList;
