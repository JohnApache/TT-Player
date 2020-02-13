/* Created By @dking/hasaki-cli */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.TTPlayerVideo = factory());
}(this, (function () { 'use strict';

    class TTPlayerVideo {
        constructor() {
            console.log('object');
        }
    }

    return TTPlayerVideo;

})));
/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */
