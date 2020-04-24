import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerError from '../error';
import Hooks from '../../hooks';

const DEFAULT_LOADING_DELAY = 500;

abstract class TTPlayerLoading<T extends TMediaType> extends TTPlayerError<T> {

    public loading: boolean = false;
    public LODING_DELAY: number = DEFAULT_LOADING_DELAY;
    private timerId: any = null;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.showMediaLoading = this.showMediaLoading.bind(this);
        this.hideMediaLoading = this.hideMediaLoading.bind(this);
    }

    beforeMount () {
        super.beforeMount();
        this.logger.info('TTPlayerLoading beforeMount');
        this.renderLoading();
        this.bindLoadingEvents();
    }

    mounted () {
        super.mounted();
        this.logger.info('TTPlayerLoading mounted');
    }

    beforeDestroy () {
        super.beforeDestroy();
        this.logger.info('TTPlayerLoading beforeDestroy');
        this.removeLoadingEvents();
    }

    renderError () {}

    showError () {
        if (!this.loading) return;
        this.hideMediaLoading();
    }

    hideError () {}

    abstract showLoading(): any;
    abstract hideLoading(): any;
    abstract renderLoading(): any;

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
            this.showLoading();
            this.logger.info('show media loading');
            this.event.emit(Hooks.ShowLoading);
        }, this.LODING_DELAY);
    }

    private hideMediaLoading () {
        if (!this.loading) return;
        if (this.timerId) clearTimeout(this.timerId);
        this.loading = false;
        this.hideLoading();
        this.logger.info('hide media loading');
        this.event.emit(Hooks.HideLoading);
    }

}

export default TTPlayerLoading;
