import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerError from '../error';

const DEFAULT_LOADING_DELAY = 500;

class TTPlayerLoading<T extends TMediaType> extends TTPlayerError<T> {

    static className = 'ttplayer__media__component--loading';

    public loading: boolean = false;
    public LODING_DELAY: number = DEFAULT_LOADING_DELAY;
    private timerId: any = null;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.showMediaLoading = this.showMediaLoading.bind(this);
        this.hideMediaLoading = this.hideMediaLoading.bind(this);
    }

    componentWillMount () {
        super.componentWillMount();
        this.logger.debug('TTPlayerLoading componentWillMount');
        this.bindLoadingEvents();
    }

    componentDidMount () {
        super.componentDidMount();
        this.logger.debug('TTPlayerLoading componentDidMount');
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.logger.debug('TTPlayerLoading componentWillUnmount');
        this.removeLoadingEvents();
    }

    renderLoading () {
        this.root
            .html('加载中')
            .show();
    }

    hideLoading () {
        this.root
            .html('')
            .hide();
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    render () {
        if (this.loading && !this.isError) {
            this.renderLoading();
            return;
        }
        this.hideLoading();
    }

    private bindLoadingEvents () {
        this.event.on('waiting', this.showMediaLoading);
        this.event.on('playing', this.hideMediaLoading);
        this.event.on('play', this.hideMediaLoading);
    }

    private removeLoadingEvents () {
        this.event.off('waiting', this.showMediaLoading);
        this.event.off('play', this.hideMediaLoading);
        this.event.off('playing', this.hideMediaLoading);
    }

    private showMediaLoading () {
        if (this.isError || this.loading) return;
        if (this.timerId) clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            this.loading = true;
            this.logger.info('show media loading');
            this.render();
        }, this.LODING_DELAY);
    }

    private hideMediaLoading () {
        if (!this.loading) return;
        if (this.timerId) clearTimeout(this.timerId);
        this.loading = false;
        this.logger.info('hide media loading');
        this.render();
    }

}

export default TTPlayerLoading;
