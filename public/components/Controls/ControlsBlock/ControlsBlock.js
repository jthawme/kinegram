import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./ControlsBlock.scss";

class ControlsBlock extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const { className, title, children } = this.props;

    const cls = classNames(
      className,
      'controlsblock'
    );

    return (
      <div className={cls}>
        <h3 className="controlsblock__title">{ title }</h3>
        <div className="controlsblock__content">
          { children }
        </div>
      </div>
    );
  }
}

export default ControlsBlock;
