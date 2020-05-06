import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';
import { bUtils } from '@dking/ttplayer-utils';

class TTPlayerDownload<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static className = 'ttplayer__media__download--component'

    public filename: string;
    public downloadUrl: string;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        const download = this.media.options.download || {};
        this.filename = download.filename || 'TTPlayer';
        this.downloadUrl = download.url;
        this.handleClickDownload = this.handleClickDownload.bind(this);
        this.logger.info('TTPlayerDownload option', download);
    }

    componentWillMount () {
        this.logger.debug('TTPlayerDownload componentWillMount');
        this.bindDownloadEvents();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerDownload componentDidMount');
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerDownload componentWillUnmount');
        this.removeDownloadEvents();
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    render () {
        this.root.html('下载');
    }

    private bindDownloadEvents () {
        this.root.on('click', this.handleClickDownload);
    }

    private removeDownloadEvents () {
        this.root.off('click', this.handleClickDownload);
    }

    private handleClickDownload () {
        this.logger.info('click download btn');
        this.download(this.downloadUrl);
    }

    private download (downloadUrl: string) {
        if (!downloadUrl) return;
        this.logger.info(`download media from ${ downloadUrl }`);
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
