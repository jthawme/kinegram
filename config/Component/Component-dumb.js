import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
SCSS

class NAME extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const cls = classNames(
      this.props.className,
      'LOWER'
    );

    return (
      <div className={cls}>
        NAME
      </div>
    );
  }
}

NAME.propTypes = {
  className: PropTypes.string
};

export default NAME;
