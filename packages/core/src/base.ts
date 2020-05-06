import { NormalObject } from './type';

class Base {

    static className: string = '';
    public className: string;
    constructor () {
        /* eslint-disable */
        this.className = (this.constructor as typeof Base).className;
        /* eslint-enable */
    }

    componentReceiveNewOptions (newOptions: NormalObject): any {
        console.log(newOptions);
    }

    shouldComponentUpdate (newOptions: NormalObject): boolean {
        console.log(newOptions);
        return false;
    }

    dynamicUpdateOption (newOptions: NormalObject) {
        if (this.shouldComponentUpdate(newOptions)) {
            this.componentReceiveNewOptions(newOptions);
        }
    }

}

// TODO 考虑是否真的要添加这个东西
class LifeCycle extends Base {

    constructor () {
        super();
    }

    componentWillMount (): any {

    }

    componentDidMount (): any {

    }

    componentWillUnmount (): any {

    }

    beforeRender (): any {

    }

    render (): any {

    }

}

export { LifeCycle, Base };

export default Base;
