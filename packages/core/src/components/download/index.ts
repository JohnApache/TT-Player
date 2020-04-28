import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';
import { bUtils } from '@dking/ttplayer-utils';

abstract class TTPlayerDownload<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public filename: string;
    public downloadUrl: string = '';

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        const download = this.media.options.download || {};
        this.filename = download.filename || 'TTPlayer';
        this.downloadUrl = download.url || this.media.options.src || this.media.src || '';
        this.handleClickDownload = this.handleClickDownload.bind(this);
        this.watchMediaLoadStart = this.watchMediaLoadStart.bind(this);
    }

    abstract renderDownload(): any;

    beforeMount () {
        this.renderDownload();
        this.bindDownloadEvents();
    }

    mounted () {}

    beforeDestroy () {
        this.removeDownloadEvents();
    }

    private bindDownloadEvents () {
        this.event.on('loadstart', this.watchMediaLoadStart);
        this.root.on('click', this.handleClickDownload);
    }

    private removeDownloadEvents () {
        this.event.off('loadstart', this.watchMediaLoadStart);
        this.root.off('click', this.handleClickDownload);
    }

    private handleClickDownload () {
        this.download(this.downloadUrl);
    }

    private watchMediaLoadStart () {
        const download = this.media.options.download || {};
        this.downloadUrl = download.downloadUrl || this.media.options.src || this.media.src || '';
    }

    private download (downloadUrl: string) {
        if (!downloadUrl) return;
        const a = bUtils.CreateDom('a');
        a.href = downloadUrl;
        a.setAttribute('download', this.filename);
        a.style.display = 'none';
        const fn = (e: Event) => {
            e.stopPropagation();
            a.removeEventListener('click', fn);
        };
        a.addEventListener('click', fn);
        document.body.appendChild(a);
        setTimeout(() => {
            a.click();
            document.body.removeChild(a);
        });
    }

}

export default TTPlayerDownload;
