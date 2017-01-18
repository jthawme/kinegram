import React from 'react';

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
  children: React.PropTypes.object
};

export default NAME;
