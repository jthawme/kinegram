import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import ControlsBlock from './ControlsBlock/ControlsBlock';
import ColorPicker from './ColorPicker/ColorPicker';
import Radioish from './Radioish/Radioish';
import Timeline from './Timeline/Timeline';
import IconButton from '../Common/Buttons/IconButton';

// CSS, Requires
import "./Controls.scss";
import { SPEEDS } from '../App/constants';
import Iconer from '../Common/Iconer/Iconer';

class Controls extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, images, color, speed, onToggleControls, canRecord } = this.props;

    const cls = classNames(
      className,
      'controls'
    );

    return (
      <div className={cls}>
        <button className="controls__close" onClick={onToggleControls}>
          Toggle Controls <Iconer icon="close" size="xsmall"/>
        </button>

        <div className="controls__modifiers">
          <ControlsBlock title="Color">
            <ColorPicker
              color={color}
              onChange={(color) => this.props.onAttributeChange('color', color)}/>
          </ControlsBlock>
          <ControlsBlock title="Speed">
            <Radioish
              onChange={(option) => this.props.onAttributeChange('speed', option)}
              options={SPEEDS}
              defaultValue={speed}
              value={speed}/>
          </ControlsBlock>
        </div>

        <div className="controls__actions">
          <ControlsBlock title="Gif">
            <IconButton className="controls__btn" icon="download" onClick={this.props.onStartRecording} disabled={!canRecord} size="free"/>
          </ControlsBlock>
          <ControlsBlock title="Export">
            <IconButton className="controls__btn" icon="save" onClick={this.props.onStartExporting} disabled={!canRecord} size="free"/>
          </ControlsBlock>
        </div>
        
        <Timeline
          images={images}
          onImageAdded={this.props.onImageAdded}
          onImageRemoved={this.props.onImageRemoved}
          className="controls__timeline"/>
      </div>
    );
  }
}

export default Controls;
