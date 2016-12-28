import React from 'react';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
require('./App.scss');

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const appCls = classNames(
      'app'
    );

    return (
      <div className={appCls}>
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

const mapStateToProps = function(store) {
  return {
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
