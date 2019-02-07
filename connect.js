"use strict";

import * as lang from '../lang';
import { connect as connect1 } from 'react-redux';
import * as actions from '../actions';

export default (props, methods) =>
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
      obj.setState = x => d(actions.setUIState(x));
      methods.forEach(m => obj[m.name] = function(){
        return d(m.apply(null, arguments));
      });
      return obj;
    });

