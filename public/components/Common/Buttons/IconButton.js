import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Iconer from '../Iconer/Iconer';

// CSS, Requires
import "./IconButton.scss";

class IconButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.string.isRequired,
    size: PropTypes.string
  };

  static defaultProps = {
    size: 'small'
  };

  render() {
    const { className, onClick, icon, size } = this.props;

    const cls = classNames(
      className,
      'iconbutton'
    );

    return (
      <button onClick={onClick} className={cls}>
        <Iconer icon={icon} size={size}/>
      </button>
    );
  }
}

export default IconButton;
