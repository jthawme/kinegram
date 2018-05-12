import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';
const config = require('config.js');
import {withRouter, Switch} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Helmet from 'react-helmet';

// Redux

// Components
import routes from './Routes';
import ServiceWorker from '../Common/ServiceWorker/ServiceWorker';

// CSS, Requires
require('./App.scss');

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  getCurrentKey(pathname) {
    return pathname.split('/')[1] || '/';
  }

  render() {
    const {location} = this.props;

    const cls = classNames(
      'app'
    );

    const currentKey = this.getCurrentKey(location.pathname);

    return (
      <div className={cls}>
        <Helmet
          titleTemplate={`%s - ${config.name}`}
          defaultTitle={config.name}
          meta={[
            {name: 'description', content: config.description}
          ]}/>

        <TransitionGroup component="main">
          <CSSTransition
            key={currentKey}
            timeout={{
              enter: 800,
              exit: 200
            }}
            classNames="fadeMove"
            mountOnEnter
            unmountOnExit>
            <div className={'app__routes-wrapper'}>
              <Switch location={location}>
                {routes}
              </Switch>
            </div>
          </CSSTransition>
        </TransitionGroup>

        <ServiceWorker/>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  location: PropTypes.object
};

const mapStateToProps = (store) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
