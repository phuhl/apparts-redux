//import throttle from 'lodash/throttle';
import { loadState, saveState } from './localStorage';
import { createStore, applyMiddleware } from 'redux';
import { connect as connect1 } from 'react-redux';
import asyncDispatchMiddleware from './asyncDispatchMiddleware';
import debounce from './debounce';

const myCreateStore = (app, state) => createStore(
  app, state, applyMiddleware(asyncDispatchMiddleware));

function throttle(func, wait, options) {
  let leading = true;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  return debounce(func, wait, {
    leading,
    trailing,
    'maxWait': wait,
  });
}


let lang, actions;
const configureStore = (reducers, p_actions, p_lang) => {
  lang = p_lang;
  actions = p_actions;
  return loadState()
    .then(s => {
      let store;
      try{
        store = myCreateStore(reducers, s);
        console.log('Store created');
      } catch(e){
        console.log(e);
        store = myCreateStore(reducers);
        console.log('Store recovery');
      };
      store.subscribe(throttle(() => {
        let toSave = Object.assign({}, store.getState());
        delete toSave.ui;
        saveState(toSave);
      }, 5000));
      return Promise.resolve(store);
    })
    .catch(e => {
      console.log(e);
      return Promise.resolve(myCreateStore(reducers));
    });
};

export connect = (props, methods) =>
  connect1(
    state => {
      let p = props(state);
      p.lang = lang[state.global.lang];
      p.global = state.global;
      p.state = state.ui.state;
      return p;
    },
    d => {
      let obj = {};
      obj.setState = x => console.log('Not implemented');//d(actions.setUIState(x));
      methods.forEach(m => obj[m.name] = function(){
        return d(m.apply(null, arguments));
      });
      return obj;
    });

export default configureStore;
