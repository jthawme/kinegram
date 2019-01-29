import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Status.scss";

export const VALID_STATUSES = {
  LOADING: 'Loading',
  PROCESSING: 'Processing',
  RECORDING: 'Recording'
}

class Status extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    command: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ])
  };

  getCommandKey(command) {
    if (!command) {
      return 'false'
    }

    return command.toLowerCase();
  }

  render() {
    const { className, command } = this.props;

    const cls = classNames(
      className,
      'status',
      {
        'status--display': command
      },
      `status--${this.getCommandKey(command)}`
    );

    return (
      <div className={cls}>
        <span className="status__text">{ command }</span>
        <span className="status__symbol"/>
      </div>
    );
  }
}

export default Status;
