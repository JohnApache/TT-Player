import WebTorrent from './webtorrent';
import { VideoMSE, TTPlayerVideo } from '@dking/ttplayer-core';

declare global {
    interface Window {
        WebTorrent: WebTorrent.WebTorrent;
    }
}

class WebTorrentMSE extends VideoMSE {

    static MSE_TYPE: string = 'hls';
    public MSE_TYPE: string;
    public __webtorrent__: WebTorrent.Instance | null = null;
    constructor (video: TTPlayerVideo) {
        super(video);
        this.handleFlvError = this.handleFlvError.bind(this);
        /* eslint-disable */
        this.MSE_TYPE = (this.constructor as typeof WebTorrentMSE).MSE_TYPE || 'auto';
        /* eslint-enable */
    }

    checkType (_url: string, type: string = 'auto'): boolean {
        return type === this.MSE_TYPE;
    }

    initMSE (url: string, webTorrentOption?: any) {
        const webTorrent = window.WebTorrent;
        if (!webTorrent) throw new Error(`can't find WebTorrent`);
        if (!webTorrent.WEBRTC_SUPPORT) throw new Error(`WebTorrent is not supported`);

        const client = new webTorrent(webTorrentOption);

        client.add(url, torrent => {
            const file = torrent.files.find(file => file.name.endsWith('.mp4'));
            if (!file) return;
            file.renderTo(this.video.mediaDom, { autoplay: false });
        });

        this.__webtorrent__ = client;
    }

    clearMSE () {
        if (this.__webtorrent__) {
            this.__webtorrent__.off('error', this.handleFlvError);
            this.__webtorrent__.destroy();
        }
        this.__webtorrent__ = null;
    }

    private handleFlvError (error: any) {
        this.video.event.emit('error', error);
    }

}

export default WebTorrentMSE;
