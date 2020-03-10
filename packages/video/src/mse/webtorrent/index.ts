import WebTorrent from './webtorrent';

declare global {
    interface Window {
        WebTorrent: WebTorrent.WebTorrent;
    }
}

const initWebTorrentMSE = (url: string, video: HTMLVideoElement, WebTorrentOption?: WebTorrent.Options): WebTorrent.Instance => {
    const WebTorrent = window.WebTorrent;
    if (!WebTorrent) throw new Error(`can't find WebTorrent`);
    if (!WebTorrent.WEBRTC_SUPPORT) throw new Error(`WebTorrent is not supported`);

    const client = new WebTorrent(WebTorrentOption);

    client.add(url, torrent => {
        const file = torrent.files.find(file => file.name.endsWith('.mp4'));
        if (!file) return;
        file.renderTo(video, { autoplay: false });
    });

    return client;
};

export default initWebTorrentMSE;
