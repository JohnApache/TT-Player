import TTPlayerMedia, { TMediaType } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBasePlaybackRate from './base';
import { DOMUtils } from '@dking/ttplayer-utils';

interface IPlaybackRateItem {
    name: string;
    value: number;
}

class TTPlayerPlaybackRateList<T extends TMediaType> extends TTPlayerBasePlaybackRate<T> {

    public playbackRateListRoot: DOMUtils<HTMLDivElement>;
    public playbackRateListItems: DOMUtils<HTMLDivElement>[] = [];
    public playbackRateList: IPlaybackRateItem[];
    public current: number = -1;

    private ugs: Function[] = [];
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.playbackRateList = this.media.options.playbackRateList || [];
        this.playbackRateListRoot = DOMUtils.createUtilDom('div');
        this.playbackRateListItems = this.playbackRateList.map(() => {
            const item = DOMUtils.createUtilDom('div');
            this.playbackRateListRoot.append(item.getInstance());
            return item;
        });
        this.root.append(this.playbackRateListRoot.getInstance());
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindPlaybackRateListEvents();
        this.logger.debug('TTPlayerPlaybackRateList componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerPlaybackRateList componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.removePlaybackRateListEvents();
        this.logger.debug('TTPlayerPlaybackRateList componentWillUnmount');
    }

    beforeRender () {
        this.playbackRateListRoot.addClass(`${ this.className }--list`);
        this.playbackRateListItems.forEach(item => item.addClass(`${ this.className }__list--item`));
    }

    renderPlaybackRateList () {
        this.playbackRateList.forEach((rateItem, index) => {
            const item = this.playbackRateListItems[index];
            if (this.playbackRate === rateItem.value) {
                !item.hasClass('current') && item.addClass('current');
                return;
            }
            item.hasClass('current') && item.removeClass('current');
            const targetContent = rateItem.name;
            item.html() !== targetContent && item.html(targetContent);
        });
    }

    render () {
        this.renderPlaybackRateList();
    }

    private bindPlaybackRateListEvents () {
        this.playbackRateListItems.forEach((item, index) => {
            const ug = item.on('click', this.handleClickPlaybackRateListItem.bind(this, index));
            this.ugs.push(ug);
        });
    }

    private removePlaybackRateListEvents () {
        this.ugs.forEach(ug => ug());
    }

    private handleClickPlaybackRateListItem (index: number) {
        this.logger.info('click playbackRate item');
        const rateItem = this.playbackRateList[index];
        const targetRate = rateItem.value;
        if (this.current === index || this.playbackRate === targetRate) return;
        this.logger.debug('switch to playbackRate :', targetRate);
        this.event.emit(Hooks.SwitchPlaybackRate, index);
        this.media.playbackRate = targetRate;
        this.current = index;
        this.render();
    }

}

export default TTPlayerPlaybackRateList;
