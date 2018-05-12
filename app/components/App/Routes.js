import React from 'react';
import Loadable from 'react-loadable';
import {Route} from 'react-router-dom';

import Loading from '../Common/Loading/Loading';

const routeComponents = {
  home: {
    route: '/',
    exact: true,
    component: Loadable({
      loader: () => import('../Home/Home'),
      loading: Loading,
    })
  }
};

const routes = Object.keys(routeComponents).map((rKey, index) => {
  return <Route key={index} {...routeComponents[rKey]}/>;
});

export default routes;
