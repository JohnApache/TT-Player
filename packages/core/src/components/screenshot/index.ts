import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';
import Hooks from '../../hooks';

const DEFAULT_IMAGE_NAME = 'TTPlayer.png';

class TTPlayerScreenshot extends TTPlayerMediaComponent<'Video'> {

    static screenshotImageName: string = DEFAULT_IMAGE_NAME;
    static className: string = 'ttplayer__media__component--screenshot';
    public screenshotImageName: string;
    public screenshotting: boolean = false;

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        /* eslint-disable */
        this.screenshotImageName = (this.constructor as typeof TTPlayerScreenshot).screenshotImageName;
        /* eslint-enable */
        this.handleScreenshot = this.handleScreenshot.bind(this);
    }

    componentWillMount () {
        this.logger.info('TTPlayerScreenshot componentWillMount');
        this.bindScreenshotEvents();
    }

    componentDidMount () {
        this.logger.info('TTPlayerScreenshot componentDidMount');
    }

    componentWillUnmount () {
        this.logger.info('TTPlayerScreenshot componentWillUnmount');
        this.removeScreenshotEvents();
    }

    beforeRender () {
        this.root.addClass(this.className);
    }

    render () {
        this.screenshotting ?
            this.root.addClass('screenshotting') :
            this.root.removeClass('screenshotting');
    }

    private setScreenshotting (screenshotting: boolean) {
        this.screenshotting = screenshotting;
        this.render();
    }

    private bindScreenshotEvents () {
        this.root.on('click', this.handleScreenshot);
    }

    private removeScreenshotEvents () {
        this.root.off('click', this.handleScreenshot);
    }

    private handleScreenshot () {
        this.logger.info('click screenshot button');
        this.setScreenshotting(true);
        this.event.emit(Hooks.Screenshot);
        const canvas = document.createElement('canvas');
        const width = this.media.media.width();
        const height = this.media.media.height();
        canvas.width = width;
        canvas.height = height;
        const cvs = canvas.getContext('2d');
        if (!cvs) {
            this.setScreenshotting(false);
            const error = new Error('canvas not support');
            this.event.emit(Hooks.ScreenshotError, error);
            throw error;
        }
        try {
            cvs.drawImage(this.mediaDom, 0, 0, width, height);
            canvas.toBlob(blob => {
                if (!blob) {
                    this.setScreenshotting(false);
                    this.event.emit(Hooks.ScreenshotError, new Error('blob is empty'));
                    return;
                }
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = this.screenshotImageName || DEFAULT_IMAGE_NAME;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.event.emit(Hooks.ScreenshotSuccess, { blobUrl: blobUrl, imgName: a.download });
                URL.revokeObjectURL(blobUrl);
                this.setScreenshotting(false);
            });
        } catch (error) {
            this.event.emit(Hooks.ScreenshotError, error);
        }
    }

}

export default TTPlayerScreenshot;
