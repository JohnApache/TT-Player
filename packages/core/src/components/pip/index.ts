import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';

declare global {

    interface Document {
        pictureInPictureEnabled: boolean;
        pictureInPictureElement: Element;
        exitPictureInPicture: ()=> Promise<void>;
    }

    interface HTMLVideoElement {
        requestPictureInPicture: ()=> Promise<PictureInPictureWindow>;
    }

    interface PictureInPictureWindow {
        addEventListener: (ev: string, cb: ()=> any)=> void;
        removeEventListener: (ev: string, cb: ()=> any)=> void;
        readonly width: number;
        readonly height: number;
    }
}

class TTPlayerPIP extends TTPlayerMediaComponent<'Video'> {

    static className = 'ttplayer__media__component--pip';
    public pipWindows: PictureInPictureWindow | null = null;
    public isPIP: boolean = false;

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.handleEnterPIP = this.handleEnterPIP.bind(this);
        this.handleLeavePIP = this.handleLeavePIP.bind(this);
        this.handleClickPIP = this.handleClickPIP.bind(this);
        this.handleResizePIPWindows = this.handleResizePIPWindows.bind(this);
    }

    componentWillMount () {
        this.logger.debug('TTPlayerPIP componentWillMount');
        this.bindPIPEvents();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerPIP componentDidMount');
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerPIP componentWillUnmount');
        this.removePIPEvents();
    }

    renderPIP () {
        this.root.html('画中画');
    }

    hidePIP () {
        this.root.html('取消画中画');
    }

    beforeRender () {
        this.root.addClass(this.className);
    }

    render () {
        if (this.isPIP) {
            this.hidePIP();
            return;
        }
        this.renderPIP();
    }

    onResizePIPWindows () {}

    private bindPIPEvents () {
        this.event.on('enterpictureinpicture', this.handleEnterPIP);
        this.event.on('leavepictureinpicture', this.handleLeavePIP);
        this.root.on('click', this.handleClickPIP);
    }

    private removePIPEvents () {
        this.event.off('enterpictureinpicture', this.handleEnterPIP);
        this.event.off('leavepictureinpicture', this.handleLeavePIP);
    }

    public handleEnterPIP () {
        this.logger.info('enter PIP mode');
        this.isPIP = true;
        this.render();
    }

    public handleLeavePIP () {
        this.logger.info('exit PIP mode');
        if (this.pipWindows) {
            this.pipWindows.removeEventListener('resize', this.handleResizePIPWindows);
            this.pipWindows = null;
        }
        this.render();
        setTimeout(() => {
            this.media.play();
        }, 0);
    }

    private handleClickPIP () {
        this.logger.info('click PIP button');
        if (!document.pictureInPictureEnabled) return;
        if (document.pictureInPictureElement) {
            this.closePIP();
            return;
        }
        this.openPIP();
    }

    private async openPIP () {
        this.logger.info('try open PIP mode');
        try {
            this.pipWindows = await this.mediaDom.requestPictureInPicture();
            if (this.pipWindows) {
                this.pipWindows.addEventListener('resize', this.handleResizePIPWindows);
            }
        } catch (error) {
            this.logger.warn('open PIP mode failed');
            this.logger.error(error);
        }
    }

    private async closePIP () {
        this.logger.info('try exit PIP mode');
        try {
            await document.exitPictureInPicture();
            if (this.pipWindows) {
                this.pipWindows.removeEventListener('resize', this.handleResizePIPWindows);
                this.pipWindows = null;
            }
        } catch (error) {
            this.logger.warn('exit PIP mode failed');
            this.logger.error(error);
        }
    }

    private handleResizePIPWindows () {
        if (!this.pipWindows) return;
        this.logger.info('pipWindows resize');
        this.logger.debug(`pipWindows width: ${ this.pipWindows.width } height: ${ this.pipWindows.height }`);
        this.onResizePIPWindows();
    }

}

export default TTPlayerPIP;
