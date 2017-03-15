import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
// import WebFont from 'webfontloader';

require('polyfills');
require('serviceworker');

import * as reducers from 'reducers/index';

const store = createStore(
  combineReducers(reducers)
);

// WebFont.load({
//   google: {
//     families: ['Space Mono:400,700', 'Work Sans:400,500', 'Playfair Display:700']
//   }
// });

import Routes from './routes';

const onRouteEnter = (nextState, replace, callback) => {
  // const state = store.getState();

  console.log('Route entered');

  callback();
};

const routeChange = () => {
  console.log('Route Changed');
};

const childRoutes = Routes.childRoutes.slice().map((r) => {
  if (r.path !== '*') {
    return Object.assign({}, r, {
      onEnter: onRouteEnter
    });
  } else {
    return r;
  }
});

Routes.childRoutes = childRoutes;

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={Routes} onUpdate={routeChange}/>
  </Provider>,
  document.getElementById('root')
);
