import TTPlayerMedia, { TMediaType } from '../../media/media';
import Hooks from '../../hooks';
import TTPlayerBaseQuality from './base';
import { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerQualityList<T extends TMediaType> extends TTPlayerBaseQuality<T> {

    public qualityListRoot: DOMUtils<HTMLDivElement>;
    public qualityListItems: DOMUtils<HTMLDivElement>[] = [];

    private ugs: Function[] = [];
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.qualityListRoot = DOMUtils.createUtilDom('div');
        this.qualityListItems = this.qualityList.map(() => {
            const item = DOMUtils.createUtilDom('div');
            this.qualityListRoot.append(item.getInstance());
            return item;
        });
        this.root.append(this.qualityListRoot.getInstance());
        this.handleClickQualityListItem = this.handleClickQualityListItem.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindQualityListEvents();
        this.logger.debug('TTPlayerQualityList componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerQualityList componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.removeQualityListEvents();
        this.logger.debug('TTPlayerQualityList componentWillUnmount');
    }

    beforeRender () {
        this.qualityListRoot.addClass(`${ this.className }--list`);
        this.qualityListItems.forEach(item => item.addClass(`${ this.className }__list--item`));
    }

    renderQualityList () {
        this.qualityListItems.forEach((item, index) => {
            if (this.current === index) {
                !item.hasClass('current') && item.addClass('current');
                return;
            }
            item.hasClass('current') && item.removeClass('current');
            const targetContent = this.qualityList[index].name || `品质${ index }`;
            item.html() !== targetContent && item.html(targetContent);
        });
    }

    render () {
        this.renderQualityList();
    }

    private bindQualityListEvents () {
        this.qualityListItems.forEach((item, index) => {
            const ug = item.on('click', this.handleClickQualityListItem.bind(this, index));
            this.ugs.push(ug);
        });
    }

    private removeQualityListEvents () {
        this.ugs.forEach(ug => ug());
    }

    private handleClickQualityListItem (index: number) {
        this.logger.info('click quality item');
        if (index === this.current) return;
        const qualityItem = this.qualityList[index];
        this.logger.debug('switch to quality :', qualityItem);
        this.event.emit(Hooks.SwitchQuality, index);
        this.current = index;
        this.media.src = qualityItem.url;
    }

}

export default TTPlayerQualityList;
