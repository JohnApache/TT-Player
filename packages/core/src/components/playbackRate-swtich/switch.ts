import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerQualityList from './list';
import { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerPlaybackRateSwitch<T extends TMediaType> extends TTPlayerQualityList<T> {

    public playbackRateSwitch: DOMUtils<HTMLDivElement>;
    public isShow: boolean = false;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.playbackRateSwitch = DOMUtils.createUtilDom('div');
        this.root.append(this.playbackRateSwitch.getInstance());
        this.handleClickPlaybackRateSwitch = this.handleClickPlaybackRateSwitch.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindPlaybackRateSwitchEvents();
        this.logger.debug('TTPlayerPlaybackRateSwitch componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerPlaybackRateSwitch componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillMount();
        this.removePlaybackRateSwitchEvents();
        this.logger.debug('TTPlayerPlaybackRateSwitch componentWillUnmount');
    }

    beforeRender () {
        super.beforeRender();
        this.playbackRateSwitch.addClass(`${ this.className }--switch`);
        this.hidePlaybackRateList();
    }

    renderQualitySwitch () {
        const targetRateItem = this.playbackRateList[this.current];
        const targetContent = targetRateItem ? targetRateItem.name || '播放速度' : '播放速度';
        targetContent !== this.playbackRateSwitch.html() && this.playbackRateSwitch.html(targetContent);
    }

    render () {
        super.render();
        this.renderQualitySwitch();
    }

    showPlaybackRateList () {
        this.playbackRateListRoot.show();
    }

    hidePlaybackRateList () {
        this.playbackRateListRoot.hide();
    }

    private bindPlaybackRateSwitchEvents () {
        this.playbackRateSwitch.on('click', this.handleClickPlaybackRateSwitch);
    }

    private removePlaybackRateSwitchEvents () {
        this.playbackRateSwitch.off('click', this.handleClickPlaybackRateSwitch);
    }

    private handleClickPlaybackRateSwitch () {
        this.logger.info('click playbackRate switch');
        this.logger.info(this.isShow ? 'hide playbackRate list' : 'show playbackRate list');
        this.isShow ? this.hidePlaybackRateList() : this.showPlaybackRateList();
        this.isShow = !this.isShow;
    }

}

export default TTPlayerPlaybackRateSwitch;
