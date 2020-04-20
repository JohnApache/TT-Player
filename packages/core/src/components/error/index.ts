import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

abstract class TTPlayerError<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public error: Error | null = null;
    public isError: boolean = false;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.showMediaError = this.showMediaError.bind(this);
        this.hideMediaError = this.hideMediaError.bind(this);
    }

    beforeMount () {
        this.renderError();
        this.bindErrorEvents();
    }

    mounted () {}

    beforeDestroy () {
        this.removeErrorEvents();
    }

    abstract renderError(): any;
    abstract showError(): any;
    abstract hideError(): any;

    private bindErrorEvents () {
        this.event.on('error', this.showMediaError);
        this.event.on('canplay', this.hideMediaError);
    }

    private removeErrorEvents () {
        this.event.off('error', this.showMediaError);
        this.event.off('canplay', this.hideMediaError);
    }

    private showMediaError (error: Error) {
        this.error = error;
        this.isError = true;
        this.showError();
    }

    private hideMediaError () {
        this.error = null;
        this.isError = false;
        this.hideError();
    }

}

export default TTPlayerError;
