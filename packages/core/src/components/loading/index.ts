import TTPlayerMedia, { TMediaType } from '../../media/media';
import TTPlayerError from '../error';

abstract class TTPlayerLoading<T extends TMediaType> extends TTPlayerError<T> {

    public loading: boolean = false;
    private timerId: number = 0;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.showMediaLoading = this.showMediaLoading.bind(this);
        this.hideMediaLoading = this.hideMediaLoading.bind(this);
    }

    beforeMount () {
        super.beforeMount();
        this.renderLoading();
        this.bindLoadingEvents();
    }

    mounted () {
        super.mounted();
    }

    beforeDestroy () {
        super.beforeDestroy();
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
        if (this.isError) return;
        if (this.timerId) clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            this.loading = true;
            this.showLoading();
        });
    }

    private hideMediaLoading () {
        if (this.timerId) clearTimeout(this.timerId);
        this.loading = false;
        this.hideLoading();
    }

}

export default TTPlayerLoading;
