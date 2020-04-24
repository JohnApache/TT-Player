import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';
import Hooks from '../../hooks';

abstract class TTPlayerScreenshot extends TTPlayerMediaComponent<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.handleScreenshot = this.handleScreenshot.bind(this);
    }

    abstract renderScreenshot(): any;
    abstract getScreenshotImageName(): string;

    beforeMount () {
        this.logger.info('TTPlayerScreenshot beforeMount');
        this.renderScreenshot();
        this.bindScreenshotEvents();
    }

    mounted () {
        this.logger.info('TTPlayerScreenshot mounted');
    }

    beforeDestroy () {
        this.logger.info('TTPlayerScreenshot beforeDestroy');
        this.removeScreenshotEvents();
    }

    private bindScreenshotEvents () {
        this.root.on('click', this.handleScreenshot);
    }

    private removeScreenshotEvents () {
        this.root.off('click', this.handleScreenshot);
    }

    private handleScreenshot () {
        this.logger.info('click screenshot button');
        this.event.emit(Hooks.Screenshot);
        const canvas = document.createElement('canvas');
        const width = this.media.media.width();
        const height = this.media.media.height();
        canvas.width = width;
        canvas.height = height;
        const cvs = canvas.getContext('2d');
        if (!cvs) {
            const error = new Error('canvas not support');
            this.event.emit(Hooks.ScreenshotError, error);
            throw error;
        }
        try {
            cvs.drawImage(this.mediaDom, 0, 0, width, height);
            canvas.toBlob(blob => {
                if (!blob) {
                    this.event.emit(Hooks.ScreenshotError, new Error('blob is empty'));
                    return;
                }
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = this.getScreenshotImageName() || 'TTPlayer.png';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.event.emit(Hooks.ScreenshotSuccess, { blobUrl: blobUrl, imgName: a.download });
                URL.revokeObjectURL(blobUrl);
            });
        } catch (error) {
            this.event.emit(Hooks.ScreenshotError, error);
        }
    }

}

export default TTPlayerScreenshot;
