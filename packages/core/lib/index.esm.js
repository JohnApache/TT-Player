/* Created By @dking/hasaki-cli */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/* Created By @dking/hasaki-cli */
const BrowserUtils = {
    createDom(tagName) {
        const dom = document.createElement(tagName);
        return dom;
    },
    findDom(selector) {
        if (typeof document.querySelector === 'function') {
            return document.querySelector(selector);
        }
        if (selector.startsWith('#')) {
            return document.getElementById(selector.slice(1));
        }
        if (selector.startsWith('.')) {
            return document.getElementsByClassName(selector.slice(1))[0];
        }
        return null;
    },
};

class DOMUtils {
    constructor(element) {
        this.element = element;
    }
    get className() {
        return this.element.className.trim();
    }
    get classList() {
        return this.className.split(/\s+/g);
    }
    hasClass(className) {
        if (this.element.classList) {
            return Array.prototype.some.call(this.element.classList, item => item === className);
        }
        return this.classList.some(item => item === className);
    }
    addClass(className) {
        const classList = className.trim().split(/\s+/g);
        if (this.element.classList) {
            classList.forEach(item => {
                item && this.element.classList.add(item);
            });
        }
        else {
            this.element.className += ` ${classList.join(' ')}`;
        }
        return this;
    }
    removeClass(className) {
        const classList = className.trim().split(/\s+/g);
        if (this.element.classList) {
            classList.forEach(item => {
                this.element.classList.remove(item);
            });
        }
        else if (this.hasClass(className)) {
            this.element.className = this.classList.filter(item => classList.every(v => v !== item)).join(' ');
        }
        return this;
    }
    setStyle(key, value) {
        this.element.style[key] = value;
        return this;
    }
    setStyles(styles) {
        Object.keys(styles).forEach(item => {
            this.setStyle(item, styles[item]);
        });
        return this;
    }
    setAttributes(attributes) {
        Object.keys(attributes).forEach(attr => {
            this.setAttribute(attr, attributes[attr]);
        });
        return this;
    }
    setAttribute(key, value) {
        this.element.setAttribute(key, value);
        return this;
    }
    prependTo(root) {
        root.insertBefore(this.element, root.firstChild);
        return this;
    }
    appendChild(element) {
        this.element.appendChild(element);
        return this;
    }
    findDom(selector) {
        if (typeof this.element.querySelector === 'function') {
            return this.element.querySelector(selector);
        }
        return BrowserUtils.findDom(selector);
    }
    getInstance() {
        return this.element;
    }
    static createInstance(element) {
        return new DOMUtils(element);
    }
    static createUtilDom(tagName) {
        return new DOMUtils(BrowserUtils.createDom(tagName));
    }
}
/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var eventemitter3 = createCommonjsModule(function (module) {

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
{
  module.exports = EventEmitter;
}
});

const DEFAULT_OPTIONS = {
    width: 600,
    height: 300,
};
class Options {
    constructor(options) {
        if (!options.root)
            throw new Error(`root can't be empty`);
        if (typeof options.root === 'string') {
            const root = document.querySelector(options.root);
            if (!root)
                throw new Error(`root can't be empty`);
            this.root = root;
        }
        else {
            this.root = options.root;
        }
        this.width = options.width || DEFAULT_OPTIONS.width;
        this.height = options.height || DEFAULT_OPTIONS.height;
        if (typeof this.width === 'number') {
            this.width = `${this.width}px`;
        }
        if (typeof this.height === 'number') {
            this.width = `${this.width}px`;
        }
        Object.keys(options).forEach(item => {
            if (item === 'width' || item === 'height' || item === 'root')
                return;
            this[item] = options[item];
        });
    }
}

class TTPlayerCore {
    constructor(options) {
        this.plugins = [];
        this.pluginsMap = {};
        this.pluginsCtor = TTPlayerCore.pluginsCtor;
        this.event = new eventemitter3();
        this.options = new Options(options);
        this.root = new DOMUtils(this.options.root);
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                if (Math.random() > 0.1) {
                    resolve();
                    return;
                }
                reject();
            });
        });
    }
    init() {
        this.installPlugins()
            .render()
            .ready();
    }
    ready() {
        this.event.emit('ready');
        return this;
    }
    render() {
        this.renderContainer()
            .renderPlugins();
        return this;
    }
    renderContainer() {
        const { width, height } = this.options;
        this.root
            .addClass('ttplayer--container')
            .setStyles({ width, height })
            .prependTo(this.options.root);
        return this;
    }
    renderPlugins() {
        this.plugins.forEach(plug => plug.render && plug.render());
    }
    installPlugins() {
        this.pluginsCtor.forEach(plug => {
            const plugInstance = new plug(this);
            this.pluginsMap[plug.pluginName] = plugInstance;
            this.plugins.push(plugInstance);
            plugInstance.init();
        });
        return this;
    }
    unInstallPlugin() {
        return this;
    }
    static use(ctor) {
        const installed = this.installedPluginsMap[ctor.pluginName];
        if (installed)
            return this;
        this.pluginsCtor.push(ctor);
        return this;
    }
}
TTPlayerCore.pluginsCtor = [];
TTPlayerCore.installedPluginsMap = {};

export default TTPlayerCore;
/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */
