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

class TTPlayerRotateButton extends TTPlayerMediaComponent<'Video'> {

    static className: string = 'ttplayer__media__component--rotate-button';
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

    componentWillMount () {
        this.bindRotateEvents();
        this.logger.debug('TTPlayerRotateButton componentWillMount');
    }

    componentDidMount () {
        this.logger.debug('TTPlayerRotateButton componentDidMount');
    }

    componentWillUnmount () {
        this.removeRotateEvents();
        this.logger.debug('TTPlayerRotateButton componentWillUnmount');
    }

    beforeRender () {
        this.root.addClass(this.className);
    }

    render () {
        this.media.media.css({
            transformOrigin: 'center center',
            transfrom      : `rotate(${ this.degree }turn) scale(${ this.calcScale(this.degree) })`,
        });
    }

    private bindRotateEvents () {
        this.root.on('click', this.handleClickRotateButton);
    }

    private removeRotateEvents () {
        this.root.off('click', this.handleClickRotateButton);
    }

    private handleClickRotateButton () {
        this.logger.info('click rotate button');
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
        this.logger.debug(`rotate from: ${ this.degree } to: ${ degree }`);
        this.degree = degree;
        this.render();
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
