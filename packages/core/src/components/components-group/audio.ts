import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';

interface AudioComponentCtor {
    new (media: TTPlayerMedia<'Audio'>): TTPlayerMediaComponent<'Audio'>;
}

interface AudioGroupComponentCtor extends AudioComponentCtor {
    use(ctor: AudioComponentCtor): any;
}

class TTPlayerAudioComponentsGroup extends TTPlayerMediaComponent<'Audio'> {

    static className: string = 'ttplayer__media__component--group';
    static groupComponentsCtor: AudioComponentCtor[] = [];
    public groupComponents: TTPlayerMediaComponent<'Audio'>[] = [];

    constructor (media: TTPlayerMedia<'Audio'>) {
        super(media);
        this.initGroupComponents();
    }

    static use (ctor: AudioComponentCtor) {
        this.groupComponentsCtor.push(ctor);
        return this;
    }

    componentWillMount () {
        this.logger.debug('TTPlayerAudioComponentsGroup componentWillMount');
        this.renderGroupComponents();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerAudioComponentsGroup componentDidMount');
        this.groupComponents.forEach(comp => comp.componentDidMount());
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerAudioComponentsGroup componentWillUnmount');
        this.groupComponents.forEach(comp => comp.componentWillUnmount());
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    private initGroupComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerAudioComponentsGroup).groupComponentsCtor.forEach(ctor => {
            this.groupComponents.push(new ctor(this.media));
        });
        /* eslint-enable */
    }

    private renderGroupComponents () {
        this.groupComponents.forEach(comp => {
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.root.append(comp.root.getInstance());
        });
    }

}

const TTPlayerAudioComponentsGroupFactory = (): typeof TTPlayerAudioComponentsGroup => {
    class T extends TTPlayerAudioComponentsGroup {

        static className: string = 'ttplayer__media__component--group';
        static groupComponentsCtor: AudioComponentCtor[] = [];

    }
    return T;
};

export {
    AudioComponentCtor,
    AudioGroupComponentCtor,
    TTPlayerAudioComponentsGroupFactory,
};
export default TTPlayerAudioComponentsGroup;

