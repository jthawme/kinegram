import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

// Redux

// Components

// CSS, Requires
import "./Home.scss";

class Home extends React.Component {
  static propTypes = {
  };

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

const mapStateToProps = (store) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({

  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
