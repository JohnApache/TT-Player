import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerPlayList from './list';
import { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerPlaySwitch<T extends TMediaType> extends TTPlayerPlayList<T> {

    static className = 'ttplayer__media__play--switch';
    public playSwitch: DOMUtils<HTMLDivElement>;
    public isShow: boolean = false;
    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.playSwitch = DOMUtils.createUtilDom('div');
        this.root.append(this.playSwitch.getInstance());
        this.handleClickPlaySwitch = this.handleClickPlaySwitch.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.bindPlaySwitchEvents();
        this.logger.debug('TTPlayerPlaySwitch componentWillMount');
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerPlaySwitch componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillMount();
        this.removePlaySwitchEvents();
        this.logger.debug('TTPlayerPlaySwitch componentWillUnmount');
    }

    beforeRender () {
        super.beforeRender();
        this.playSwitch.addClass(this.className);
        this.hidePlayList();
    }

    renderPlaySwitch () {
        this.playSwitch.html() !== '播放列表' && this.playSwitch.html('播放列表');
    }

    render () {
        super.render();
        this.renderPlaySwitch();
    }

    showPlayList () {
        this.playListRoot.show();
    }

    hidePlayList () {
        this.playListRoot.hide();
    }

    private bindPlaySwitchEvents () {
        this.playSwitch.on('click', this.handleClickPlaySwitch);
    }

    private removePlaySwitchEvents () {
        this.playSwitch.off('click', this.handleClickPlaySwitch);
    }

    private handleClickPlaySwitch () {
        this.logger.info('click play switch');
        this.logger.info(this.isShow ? 'hide play list' : 'show play list');
        this.isShow ? this.hidePlayList() : this.showPlayList();
        this.isShow = !this.isShow;
    }

}

export default TTPlayerPlaySwitch;
