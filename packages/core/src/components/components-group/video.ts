import TTPlayerMedia, { TTPlayerMediaComponent } from '../../media/media';

interface VideoComponentCtor {
    new (media: TTPlayerMedia<'Video'>): TTPlayerMediaComponent<'Video'>;
}

interface VideoGroupComponentCtor extends VideoComponentCtor {
    use(ctor: VideoComponentCtor): any;
}

// Consider 怎么建立组合后的，组件间的通信
// Group 怎么赋能更多的事情
class TTPlayerVideoComponentsGroup extends TTPlayerMediaComponent<'Video'> {

    static className: string = 'ttplayer__media__component--group';
    static groupComponentsCtor: VideoComponentCtor[] = [];
    public groupComponents: TTPlayerMediaComponent<'Video'>[] = [];

    constructor (media: TTPlayerMedia<'Video'>) {
        super(media);
        this.initGroupComponents();
    }

    static use (ctor: VideoComponentCtor) {
        this.groupComponentsCtor.push(ctor);
        return this;
    }

    componentWillMount () {
        this.logger.debug('TTPlayerVideoComponentsGroup componentWillMount');
        this.renderGroupComponets();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerVideoComponentsGroup componentDidMount');
        this.groupComponents.forEach(comp => comp.componentDidMount());
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerVideoComponentsGroup componentWillUnmount');
        this.groupComponents.forEach(comp => comp.componentWillUnmount());
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    private initGroupComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerVideoComponentsGroup).groupComponentsCtor.forEach(ctor => {
            this.groupComponents.push(new ctor(this.media));
        });
        /* eslint-enable */
    }

    private renderGroupComponets () {
        this.groupComponents.forEach(comp => {
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.root.append(comp.root.getInstance());
        });
    }

}

const TTPlayerVideoComponentsGroupFactory = (): typeof TTPlayerVideoComponentsGroup => {
    class T extends TTPlayerVideoComponentsGroup {

        static className: string = 'ttplayer__media__component--group';
        static groupComponentsCtor: VideoComponentCtor[] = [];

    }
    return T;
};

export {
    VideoComponentCtor,
    VideoGroupComponentCtor,
    TTPlayerVideoComponentsGroupFactory,
};
export default TTPlayerVideoComponentsGroup;
