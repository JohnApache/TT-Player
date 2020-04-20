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
        this.renderPIP();
        this.bindPIPEvents();
    }

    mounted () {}

    beforeDestroy () {
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
        console.log('enter PIP mode');
        this.onEnterPIP();
    }

    private handleLeavePIP () {
        console.log('exit PIP mode');
        if (this.pipWindows) {
            this.pipWindows.removeEventListener('resize', this.handleResizePIPWindows);
            this.pipWindows = null;
        }
        this.onLeavePIP();
    }

    private handleClickPIP () {
        if (!document.pictureInPictureEnabled) return;
        if (document.pictureInPictureElement) {
            this.closePIP();
            return;
        }
        this.openPIP();
    }

    private async openPIP () {
        try {
            this.pipWindows = await this.mediaDom.requestPictureInPicture();
            if (this.pipWindows) {
                this.pipWindows.addEventListener('resize', this.handleResizePIPWindows);
            }
        } catch (error) {
            console.log(error);
            console.log('open pip mode failed');
        }
    }

    private async closePIP () {
        try {
            await document.exitPictureInPicture();
            if (this.pipWindows) {
                this.pipWindows.removeEventListener('resize', this.handleResizePIPWindows);
                this.pipWindows = null;
            }
        } catch (error) {
            console.log(error);
            console.log('exit pip mode failed');
        }
    }

    private handleResizePIPWindows () {
        this.onResizePIPWindows();
    }

}

export default TTPlayerPIP;
