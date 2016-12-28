import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import WebFont from 'webfontloader';

import App from 'components/App/App.js';
import Home from 'components/Home/Home.js';


import * as reducers from 'reducers/index';

const store = createStore(
  combineReducers(reducers)
);

// WebFont.load({
//   google: {
//     families: ['Space Mono:400,700', 'Work Sans:400,500', 'Playfair Display:700']
//   }
// });

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
