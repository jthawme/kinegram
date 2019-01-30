import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-69179600-7');
ReactGA.pageview(window.location.pathname + window.location.search);

import './utils/polyfills';

import App from 'components/App/App';

ReactDOM.render(<App/>, document.getElementById('root'));
