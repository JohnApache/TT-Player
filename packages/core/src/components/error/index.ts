import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

class TTPlayerError<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static className = 'ttplayer__media__component--error';
    public error: Error | null = null;
    public isError: boolean = false;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.showMediaError = this.showMediaError.bind(this);
        this.hideMediaError = this.hideMediaError.bind(this);
    }

    componentWillMount () {
        this.logger.info('TTPlayerError componentWillMount');
        this.bindErrorEvents();
    }

    componentDidMount () {
        this.logger.info('TTPlayerError componentDidMount');
    }

    componentWillUnmount () {
        this.logger.info('TTPlayerError componentWillUnmount');
        this.removeErrorEvents();
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    renderError () {
        this.root.html('媒体异常').show();
    }

    hideError () {
        this.root.html('').hide();
    }

    render () {
        if (this.isError) {
            this.renderError();
            return;
        }
        this.hideError();
    }

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
        this.logger.warn('show media error');
        this.logger.warn(`media src: ${ this.media.src }`);
        this.logger.error(error);
        this.render();
    }

    private hideMediaError () {
        if (!this.isError || !this.error) return;
        this.error = null;
        this.isError = false;
        this.logger.info('hide media error');
        this.render();
    }

}

export default TTPlayerError;
