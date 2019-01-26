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

class Controls extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, images, color, speed } = this.props;

    const cls = classNames(
      className,
      'controls'
    );

    return (
      <div className={cls}>
        <div className="controls__modifiers">
          <ControlsBlock title="Color">
            <ColorPicker
              color={color}
              onChange={(color) => this.props.onAttributeChange('color', color)}/>
          </ControlsBlock>
          <ControlsBlock title="Speed">
            <Radioish
              onChange={(option) => this.props.onAttributeChange('speed', option)}
              options={[1, 2, 5]}
              defaultValue={speed}
              value={speed}/>
          </ControlsBlock>
        </div>
        
        <Timeline
          images={images}
          onImageAdded={this.props.onImageAdded}
          onImageRemoved={this.props.onImageRemoved}
          className="controls__timeline"/>

        <div className="controls__actions">
          <ControlsBlock title="Gif">
            <IconButton icon="download" onClick={() => {}}/>
          </ControlsBlock>
          <ControlsBlock title="Export">
            <IconButton icon="save" onClick={() => {}}/>
          </ControlsBlock>
        </div>
      </div>
    );
  }
}

export default Controls;
