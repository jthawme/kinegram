import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import ControlsBlock from './ControlsBlock/ControlsBlock';
import Timeline from './Timeline/Timeline';

// CSS, Requires
import "./Controls.scss";

class Controls extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;

    const cls = classNames(
      className,
      'controls'
    );

    return (
      <div className={cls}>
        <div className="controls__modifiers">
          <ControlsBlock title="Color">
            Hey there
          </ControlsBlock>
          <ControlsBlock title="Speed">
            Hey there
          </ControlsBlock>
        </div>
        
        <Timeline
          className="controls__timeline"/>

        <div className="controls__actions">
          <ControlsBlock title="Gif">
            Hey there
          </ControlsBlock>
          <ControlsBlock title="Export">
            Hey there
          </ControlsBlock>
        </div>
      </div>
    );
  }
}

export default Controls;
