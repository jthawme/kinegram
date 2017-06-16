import React from 'react';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
require('./Home.scss');

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const cls = classNames(
      'home'
    );

    return (
      <div className={cls}>
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
