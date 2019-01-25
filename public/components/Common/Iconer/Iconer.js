import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Iconer.scss";

const iconReq = require.context('!!svg-inline-loader!./icons', false, /\.svg/);

class Iconer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['free', 'xsmall', 'small', 'medium', 'large'])
  };

  static defaultProps = {
    size: 'free'
  };

  getIcon(icon) {
    const keys = iconReq.keys();
    const target = `./${icon}.svg`;

    return keys.indexOf(target) >= 0 ? iconReq(target) : 'false';
  }

  render() {
    const { className, icon, size } = this.props;

    const cls = classNames(
      className,
      'iconer',
      `iconer--size-${size}`
    );

    return <span className={cls} dangerouslySetInnerHTML={{__html: this.getIcon(icon)}}/>
  }
}

export default Iconer;
