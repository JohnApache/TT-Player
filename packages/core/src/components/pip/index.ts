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

abstract class TTPlayerPIP extends TTPlayerMediaComponent<'Video'> {

    public pipWindows: PictureInPictureWindow | null = null;

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.handleEnterPIP = this.handleEnterPIP.bind(this);
        this.handleLeavePIP = this.handleLeavePIP.bind(this);
        this.handleClickPIP = this.handleClickPIP.bind(this);
        this.handleResizePIPWindows = this.handleResizePIPWindows.bind(this);
    }

    beforeMount () {
        this.logger.info('TTPlayerPIP beforeMount');
        this.renderPIP();
        this.bindPIPEvents();
    }

    mounted () {
        this.logger.info('TTPlayerPIP mounted');
    }

    beforeDestroy () {
        this.logger.info('TTPlayerPIP beforeDestroy');
        this.removePIPEvents();
    }

    abstract renderPIP(): any;
    abstract onEnterPIP(): any;
    abstract onLeavePIP(): any;
    abstract onResizePIPWindows(): any;

    private bindPIPEvents () {
        this.event.on('enterpictureinpicture', this.handleEnterPIP);
        this.event.on('leavepictureinpicture', this.handleLeavePIP);
        this.root.on('click', this.handleClickPIP);
    }

    private removePIPEvents () {
        this.event.off('enterpictureinpicture', this.handleEnterPIP);
        this.event.off('leavepictureinpicture', this.handleLeavePIP);
    }

    private handleEnterPIP () {
        this.logger.info('enter PIP mode');
        this.onEnterPIP();
    }

    private handleLeavePIP () {
        this.logger.info('exit PIP mode');
        if (this.pipWindows) {
            this.pipWindows.removeEventListener('resize', this.handleResizePIPWindows);
            this.pipWindows = null;
        }
        this.onLeavePIP();
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
            this.logger.error('open PIP mode failed');
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
            this.logger.error(error);
            this.logger.error('exit PIP mode failed');
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
