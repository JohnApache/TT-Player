import TTPlayerMedia, { TMediaType } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBasePlayList from './base';
import { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerPlayList<T extends TMediaType> extends TTPlayerBasePlayList<T> {

    public playListRoot: DOMUtils<HTMLDivElement>;
    public playListItems: DOMUtils<HTMLDivElement>[];
    private ugs: Function[] = [];
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.playListRoot = DOMUtils.createUtilDom('div');
        this.playListItems = this.playList.map(() => DOMUtils.createUtilDom('div'));
        this.handleClickPlayItem = this.handleClickPlayItem.bind(this);
        this.playListItems.forEach(playItem => {
            this.playListRoot.append(playItem.getInstance());
        });
        this.root.append(this.playListRoot.getInstance());
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindEvents();
        this.logger.debug('TTPlayerPlayList componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerPlayList componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.removeEvents();
        this.logger.debug('TTPlayerPlayList componentWillUnmount');
    }

    beforeRender () {
        this.playListRoot.addClass(`${ this.className }--list`);
        this.playListItems.forEach(playItem => {
            playItem.addClass(`${ this.className }__list--item`);
        });
    }

    renderPlayItem (index: number) {
        const item = this.playList[index];
        const playItem = this.playListItems[index];
        if (!playItem || !item) return;
        const targetContent = item.name || `媒体文件${ index }`;
        playItem.html() !== targetContent && playItem.html(targetContent);
    }

    renderPlayList () {
        this.playListItems.forEach((playItem, index) => {
            this.renderPlayItem(index);
            if (index === this.current) {
                !playItem.hasClass('current') && playItem.addClass('current');
                return;
            }
            playItem.hasClass('current') && playItem.removeClass('current');
        });
    }

    render () {
        this.renderPlayList();
    }

    private bindEvents () {
        this.playListItems.forEach((item, index) => {
            const ug = item.on('click', this.handleClickPlayItem.bind(this, index));
            this.ugs.push(ug);
        });
    }

    private removeEvents () {
        this.ugs.forEach(ug => ug());
    }

    private handleClickPlayItem (index: number) {
        this.logger.debug('click play item', this.playList[index]);
        const item = this.playList[index];
        this.media.src = item.url;
        this.current = index;
        this.event.emit(Hooks.SwitchPlayItem, index);
    }

}

export default TTPlayerPlayList;
