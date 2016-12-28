import React from 'react';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
require('./Home.css');

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let homeCls = classNames(
      'home'
    );

    return (
      <div className={homeCls}>
        Home
      </div>
    );
  }
}

Home.propTypes = {
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
)(Home);
