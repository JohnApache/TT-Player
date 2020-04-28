import TTPlayerMedia, { TMediaType } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBasePlayList from './base';
import { DOMUtils } from '@dking/ttplayer-utils';

abstract class TTPlayerPlayList<T extends TMediaType> extends TTPlayerBasePlayList<T> {

    public playListItems: DOMUtils<HTMLDivElement>[];

    private ugs: Function[] = [];
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.playListItems = this.playList.map(() => DOMUtils.createUtilDom('div'));
        this.handleClickPlayItem = this.handleClickPlayItem.bind(this);
    }

    abstract renderPlayList(): any;

    beforeMount () {
        super.beforeMount();
        this.init();
        this.bindEvents();
        this.renderPlayList();
    }

    mounted () {
        super.mounted();
    }

    beforeDestroy () {
        super.beforeDestroy();
        this.removeEvents();
    }

    onPlayItemChange () {
        this.renderPlayList();
    }

    private init () {
        this.playListItems.forEach(playItem => {
            this.root.append(playItem.getInstance());
        });
    }

    private bindEvents () {
        this.playList.forEach((_, index) => {
            const playItem = this.playListItems[index];
            const ug = playItem.on('click', this.handleClickPlayItem.bind(this, index));
            this.ugs.push(ug);
        });
    }

    private removeEvents () {
        this.ugs.forEach(ug => ug());
    }

    private handleClickPlayItem (index: number) {
        const item = this.playList[index];
        this.media.src = item.url;
        this.current = index;
        this.event.emit(Hooks.SwitchPlayItem, item);
    }

}

export default TTPlayerPlayList;
