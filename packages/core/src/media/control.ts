import TTPlayerMediaComponent from './component';
import { TMediaType } from './media';

abstract class TTPlayerMediaControl<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static use () {

    }

}

export default TTPlayerMediaControl;
