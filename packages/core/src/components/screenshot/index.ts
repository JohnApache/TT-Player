import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';

abstract class TTPlayerScreenshot extends TTPlayerMediaComponent<'Video'> {

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.handleScreenshot = this.handleScreenshot.bind(this);
    }

    abstract renderScreenshot(): any;
    abstract getScreenshotImageName(): string;

    beforeMount () {
        this.renderScreenshot();
        this.bindScreenshotEvents();
    }

    mounted () {}

    beforeDestroy () {
        this.removeScreenshotEvents();
    }

    private bindScreenshotEvents () {
        this.root.on('click', this.handleScreenshot);
    }

    private removeScreenshotEvents () {
        this.root.off('click', this.handleScreenshot);
    }

    private handleScreenshot () {
        const canvas = document.createElement('canvas');
        const width = this.media.media.width();
        const height = this.media.media.height();
        canvas.width = width;
        canvas.height = height;
        const cvs = canvas.getContext('2d');
        if (!cvs) throw new Error('canvas not support');
        cvs.drawImage(this.mediaDom, 0, 0, width, height);
        canvas.toBlob(blob => {
            if (!blob) return;
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = this.getScreenshotImageName() || 'TTPlayer.png';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        });
    }

}

export default TTPlayerScreenshot;
