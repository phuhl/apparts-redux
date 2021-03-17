Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var redux = require('redux');
var reduxPersist = require('redux-persist');
var storage = _interopDefault(require('redux-persist/lib/storage'));
var thunk = _interopDefault(require('redux-thunk'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var configureStore = function configureStore() {
  var substores = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var middlewares = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var persistConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    key: "root",
    storage: storage,
    blacklist: []
  };
  middlewares.push(thunk);
  var middlewareEnhancer = redux.applyMiddleware.apply(void 0, _toConsumableArray(middlewares));
  persistConfig = _objectSpread2({
    blacklist: []
  }, persistConfig);
  var stores = {};
  var actionNames = [];
  var types = {};

  for (var substoreKey in substores) {
    var substore = substores[substoreKey];

    if (substore.blacklisted) {
      persistConfig.blacklist.push(substoreKey);
    }

    stores[substoreKey] = substore.reducer(types);
    actionNames.push(substore.actionNames);
  } // check, that action names are unique


  actionNames.forEach(function (ans) {
    return ans.forEach(function (actionName) {
      if (typeof actionName !== "string") {
        throw new Error("ERROR, some action-names are not strings! " + JSON.stringify(ans));
      }

      types[actionName] = {
        name: actionName
      };
    });
  });

  if (Object.keys(types).length !== actionNames.reduce(function (a, b) {
    return a + Object.keys(b).length;
  }, 0)) {
    throw new Error("ERROR, not all action-names are unique! " + JSON.stringify(actionNames) + JSON.stringify(types));
  }

  var store = redux.createStore(reduxPersist.persistReducer(persistConfig, redux.combineReducers(stores)), middlewareEnhancer);
  var persistor = reduxPersist.persistStore(store);
  return {
    store: store,
    persistor: persistor
  };
};

exports.default = configureStore;
//# sourceMappingURL=index.js.map
