import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';
import { BlockPicker } from 'react-color';

// Redux

// Components
import Iconer from '../../Common/Iconer/Iconer';

// CSS, Requires
import "./ColorPicker.scss";

class ColorPicker extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      display: false
    };
  }

  togglePicker = () => {
    if (this.state.display) {
      this.closePicker();
    } else {
      this.openPicker();
    }
  }

  openPicker = () => {
    this.setState({
      display: true
    });
  }

  closePicker = () => {
    this.setState({
      display: false
    });
  }

  onChangeComplete = (color) => {
    this.setState({ display: false });
    this.props.onChange(color.hex);
  }

  render() {
    const { className, color } = this.props;
    const { display } = this.state;

    const cls = classNames(
      className,
      'colorpicker',
      {
        'colorpicker--display': display
      }
    );

    return (
      <div className={cls}>
        <div className="colorpicker__picker">
          <div className="colorpicker__picker__close" onClick={this.closePicker}>
            <Iconer icon="close" size="xsmall"/>
          </div>
          <BlockPicker 
            onChangeComplete={this.onChangeComplete}
            color={color}
            triangle="hide"/>
        </div>

        <div className="colorpicker__palette" onClick={this.togglePicker} style={{backgroundColor: color}}/>
      </div>
    );
  }
}

export default ColorPicker;
