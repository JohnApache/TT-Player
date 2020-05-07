import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerQualityList from './list';
import { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerQualitySwitch<T extends TMediaType> extends TTPlayerQualityList<T> {

    static className = 'ttplayer__media__quality--switch';
    public qualitySwitch: DOMUtils<HTMLDivElement>;
    public isShow: boolean = false;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.qualitySwitch = DOMUtils.createUtilDom('div');
        this.root.append(this.qualitySwitch.getInstance());
        this.handleClickQualitySwitch = this.handleClickQualitySwitch.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindQualitySwitchEvents();
        this.logger.debug('TTPlayerQualitySwitch componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerQualitySwitch componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillMount();
        this.removeQualitySwitchEvents();
        this.logger.debug('TTPlayerQualitySwitch componentWillUnmount');
    }

    beforeRender () {
        super.beforeRender();
        this.qualitySwitch.addClass(`${ this.className }--switch`);
        this.hideQualityList();
    }

    renderQualitySwitch () {
        const targetQuality = this.qualityList[this.current];
        const targetContent = targetQuality ? targetQuality.name || `品质${ this.current }` : '默认';
        targetContent !== this.qualitySwitch.html() && this.qualitySwitch.html(targetContent);
    }

    render () {
        super.render();
        this.renderQualitySwitch();
    }

    showQualityList () {
        this.qualityListRoot.show();
    }

    hideQualityList () {
        this.qualityListRoot.hide();
    }

    private bindQualitySwitchEvents () {
        this.qualitySwitch.on('click', this.handleClickQualitySwitch);
    }

    private removeQualitySwitchEvents () {
        this.qualitySwitch.off('click', this.handleClickQualitySwitch);
    }

    private handleClickQualitySwitch () {
        this.logger.info('click quality switch');
        this.logger.info(this.isShow ? 'hide quality list' : 'show quality list');
        this.isShow ? this.hideQualityList() : this.showQualityList();
        this.isShow = !this.isShow;
    }

}

export default TTPlayerQualitySwitch;
