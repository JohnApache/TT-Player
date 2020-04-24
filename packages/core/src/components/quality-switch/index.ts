import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';
import Hooks from '../../hooks';
import { DOMUtils } from '@dking/ttplayer-utils';

interface IQualityItem {
    name: string;
    url: string;
    type?: string;
}

abstract class TTPlayerQuailtySwich<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public qualityList: IQualityItem[] = [];
    public qualitySwitch: DOMUtils<HTMLDivElement>;
    public qualityListRoot: DOMUtils<HTMLDivElement>;
    public qualityListItems: DOMUtils<HTMLDivElement>[] = [];
    public defaultQuality: number = 0;
    public defaultQualityText: string = '默认'
    public isShow: boolean = false;

    private ugs: Function[] = [];
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        const quality = media.options.quality || {};
        this.qualityList = quality.qualityList || [];
        this.defaultQuality = quality.defaultQuality || 0;
        this.qualitySwitch = DOMUtils.createUtilDom('div');
        this.qualityListRoot = DOMUtils.createUtilDom('div');
        this.qualityListItems = this.qualityList.map(() => DOMUtils.createUtilDom('div'));
        this.handleClickQualitySwitch = this.handleClickQualitySwitch.bind(this);
        this.handleClickQualityItem = this.handleClickQualityItem.bind(this);
    }

    beforeMount () {
        this.logger.info('TTPlayerQuailtySwich beforeMount');
        this.init();
        this.renderQuality();
        this.renderQualityList();
        this.renderQualitySwitch();
        this.bindQualityEvents();
    }

    mounted () {
        this.logger.info('TTPlayerQuailtySwich mounted');
    }

    beforeDestroy () {
        this.logger.info('TTPlayerQuailtySwich beforeDestroy');
        this.removeQualityEvents();
    }

    abstract renderQuality(): any;

    renderQualityList () {
        this.qualityListItems.forEach((dom, index) => dom.html(this.qualityList[index].name));
    }

    renderQualitySwitch () {
        const focusedQualityItem = this.qualityList[this.defaultQuality];
        this.qualitySwitch.html(focusedQualityItem ? focusedQualityItem.name : this.defaultQualityText);
    }

    showQualityList () {
        this.qualityListRoot.show();
    }

    hideQualityList () {
        this.qualityListRoot.hide();
    }

    private init () {

        this.qualityListItems.forEach(dom => {
            this.qualityListRoot.append(dom.getInstance());
        });

        this.root
            .append(this.qualitySwitch.getInstance())
            .append(this.qualityListRoot.hide().getInstance());
    }

    private bindQualityEvents () {
        const ug = this.root.on('click', this.handleClickQualitySwitch);
        this.ugs.push(ug);
        this.qualityListItems.forEach((dom, index) => {
            const ug = dom.on('click', this.handleClickQualityItem.bind(this, index));
            this.ugs.push(ug);
        });
    }

    private removeQualityEvents () {
        this.ugs.forEach(ug => ug());
    }

    private handleClickQualitySwitch () {
        this.logger.info('click quality switch');
        this.logger.info(this.isShow ? 'hide quality list' : 'show quality list');
        if (this.isShow) {
            this.hideQualityList();
            this.event.emit(Hooks.HideQualityList);
        } else {
            this.showQualityList();
            this.event.emit(Hooks.ShowQualityList);
        }
        this.isShow = !this.isShow;
    }

    private handleClickQualityItem (index: number) {
        this.logger.info('click quality item');
        if (index === this.defaultQuality) return;
        const qualityItem = this.qualityList[index];
        this.logger.debug('switch to quality :', qualityItem);
        this.event.emit(Hooks.SwitchQuality, qualityItem);
        this.media.src = qualityItem.url;
        this.defaultQuality = index;
        this.renderQualitySwitch();
    }

}

export default TTPlayerQuailtySwich;
