import App from 'components/App/App';

function errorLoading(error) {
  throw new Error(`Dynamic page loading failed: ${error}`);
}

function loadRoute(cb) {
  return module => cb(null, module.default);
}

export default {
  path: '/',
  component: App,
  indexRoute: {
    getComponent(location, cb) {
      System.import('./components/Home/Home')
        .then(loadRoute(cb))
        .catch(errorLoading);
    },
  },
  childRoutes: [
    {
      path: '*',
      onEnter(nextState, replace, callback) {
        replace('/');
        callback();
      }
    }
  ],
};
