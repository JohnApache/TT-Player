import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';

const TOP_DEGREE = 0;
const RIGHT_DEGREE = 0.25;
const BOTTOM_DEGREE = 0.5;
const LEFT_DEGREE = 0.75;

enum EDegree {
    TOP = TOP_DEGREE,
    RIGHT = RIGHT_DEGREE,
    BOTTOM = BOTTOM_DEGREE,
    LEFT= LEFT_DEGREE,
}

abstract class TTPlayerRotateButton extends TTPlayerMediaComponent<'Video'> {

    public degree: EDegree = TOP_DEGREE;
    public innerRotate: boolean = true;

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        const rotate = this.media.options.rotate || {};
        this.innerRotate = rotate.innerRotate || true;
        this.degree = rotate.defaultDegree || TOP_DEGREE;
        this.handleClickRotateButton = this.handleClickRotateButton.bind(this);
        if (this.degree !== TOP_DEGREE) this.rotate(this.degree);
    }

    abstract renderRotateButton(): any;

    beforeMount () {
        this.renderRotateButton();
        this.bindRotateEvents();
    }

    mounted () {}

    beforeDestroy () {
        this.removeRotateEvents();
    }

    private bindRotateEvents () {
        this.root.on('click', this.handleClickRotateButton);
    }

    private removeRotateEvents () {
        this.root.off('click', this.handleClickRotateButton);
    }

    private handleClickRotateButton () {
        switch (this.degree) {
            case EDegree.TOP:
                this.rotate(EDegree.BOTTOM);
                break;
            case EDegree.BOTTOM:
                this.rotate(EDegree.RIGHT);
                break;
            case EDegree.RIGHT:
                this.rotate(EDegree.LEFT);
                break;
            case EDegree.LEFT:
                this.rotate(EDegree.TOP);
                break;
            default:
                this.rotate(EDegree.TOP);
                break;
        }
    }

    private rotate (degree: EDegree) {
        this.degree = degree;
        this.media.media.css({
            transformOrigin: 'center center',
            transfrom      : `rotate(${ this.degree }turn) scale(${ this.calcScale(this.degree) })`,
        });
    }

    private calcScale (degree: EDegree): number {
        const media = this.media.media;
        switch (degree) {
            case EDegree.TOP:
            case EDegree.BOTTOM:
                return 1;
            case EDegree.RIGHT:
            case EDegree.LEFT:
                return parseFloat((media.height() / media.width()).toFixed(2));
            default:
                return 1;
        }

    }

}


export default TTPlayerRotateButton;
