import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import './utils/fonts';
import './utils/polyfills'
import './utils/serviceworker'

import App from 'components/App/App';
import Home from 'components/Home/Home';

import * as reducers from 'reducers/index';

const store = createStore(
  combineReducers(reducers)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route exact path='/' component={Home} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
