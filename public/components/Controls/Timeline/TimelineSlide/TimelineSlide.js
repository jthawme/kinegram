import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Iconer from '../../../Common/Iconer/Iconer';

// CSS, Requires
import "./TimelineSlide.scss";

class TimelineSlide extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    image: PropTypes.string
  };

  render() {
    const { className, image } = this.props;

    const cls = classNames(
      className,
      'timelineslide',
      {
        'timelineslide--no-image': !image
      }
    );

    return (
      <div className={cls}>
        { image ? (
          <span />
        ) : (
          <Iconer icon="add" size="medium"/>
        )}
      </div>
    );
  }
}

export default TimelineSlide;
