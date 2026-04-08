/**
 * StateManagement.js
 * Reactive Store using Observer Pattern + Proxy API + Encapsulation
 */
const _subscribers = new WeakMap();
const _state = new WeakMap();

class Store {
  constructor(initialState = {}) {
    _subscribers.set(this, []);
    _state.set(this, this._createReactiveState(initialState));
  }

  subscribe(fn) {
    if (typeof fn === "function") {
      _subscribers.get(this).push(fn);
    }
  }

  notify(data) {
    for (let fn of _subscribers.get(this)) {
      fn(data);
    }
  }

  _createReactiveState(state) {
    const handler = {
      set: (target, prop, value) => {
        target[prop] = value;
        this.notify({ [prop]: value });
        return true;
      }
    };
    return new Proxy(state, handler);
  }

  getState() {
    return _state.get(this);
  }
}

export { Store };