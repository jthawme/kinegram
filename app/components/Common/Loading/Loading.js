import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
require('./Loading.scss');

class Loading extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    error: PropTypes.bool,
    pastDelay: PropTypes.bool
  };

  render() {
    const cls = classNames(
      this.props.className,
      'loading'
    );

    if (this.props.error) {
      return <div className={cls}>Error!</div>;
    } else if (this.props.pastDelay) {
      return <div className={cls}>Loading...</div>;
    } else {
      return null;
    }
  }
}

export default Loading;
