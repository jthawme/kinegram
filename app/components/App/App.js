import React from 'react';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';
const config = require('config.js');

// Redux

// Components
import Helmet from 'react-helmet';

// CSS, Requires
require('./App.scss');

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const cls = classNames(
      'app'
    );

    return (
      <div className={cls}>
        <Helmet
          titleTemplate={`%s - ${config.name}`}
          defaultTitle={config.name}
          meta={[
            {name: 'description', content: config.description}
          ]}/>
        <span className="app__el">
          App
        </span>
        { this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object
};

const mapStateToProps = (store) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
