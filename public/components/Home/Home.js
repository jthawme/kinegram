import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { FormControl, FormControlLabel, Radio, RadioGroup, Switch } from '@material-ui/core';
import { CirclePicker } from 'react-color';

// Redux

// Components
import Canvas from '../Canvas/Canvas';
import Controls from './Controls';

// const frames = [
//   require('../../images/testframes/01.png'),
//   require('../../images/testframes/02.png'),
//   require('../../images/testframes/03.png'),
//   require('../../images/testframes/04.png'),
//   require('../../images/testframes/05.png')
// ];

const frames = [
  require('../../images/testframes/02/01.png'),
  require('../../images/testframes/02/02.png'),
  require('../../images/testframes/02/03.png'),
  require('../../images/testframes/02/04.png'),
  require('../../images/testframes/02/05.png'),
  require('../../images/testframes/02/06.png'),
  require('../../images/testframes/02/07.png'),
  require('../../images/testframes/02/08.png'),
];

const frameRates = [
  {label: 'Fast', value: '3'},
  {label: 'Normal', value: '5'},
  {label: 'Slow', value: '10'}
];

const colors = [
  "#000000", "#F44336", "#3f51b5", "#00796b", "#546e7a",
];

// CSS, Requires
import "./Home.scss";

class Home extends React.Component {
  static propTypes = {
  };

  state = {
    withBars: true,
    frameRate: '5',
    color: '#000000',
    canvasLoading: true
  };

  handleChange = name => e => {
    let value;

    if (name === 'color') {
      value = e.hex;
    } else if (name === 'withBars') {
      value = e.target.checked;
    } else {
      value = e.target.value
    }

    this.setState({ [name]: value });
  }

  setCanvasLoading = (loading) => {
    this.setState({
      canvasLoading: loading
    });
  }

  render() {
    const { withBars, color, frameRate, canvasLoading } = this.state;
    const cls = classNames(
      'home',
      {
        'home--canvasLoading': canvasLoading
      }
    );

    return (
      <div className={cls}>
        <aside className="home__controls">
          <Controls>

            <FormControl name="Speed" component="fieldset">
              <RadioGroup
                aria-label="Speed"
                name="frameRate"
                value={ frameRate }
                onChange={this.handleChange('frameRate')}
              >
                {
                  frameRates.map(fr => {
                    return <FormControlLabel key={fr.label} value={fr.value} control={<Radio />} label={fr.label} />
                  })
                }
              </RadioGroup>
            </FormControl>

            <FormControl name="With Bars" component="fieldset">
              <Switch
                color="secondary"
                checked={ withBars }
                onChange={this.handleChange('withBars')}
                value="withBars"
              />
            </FormControl>

            <FormControl name="Colour" component="fieldset">
              <CirclePicker
                className="color-correct"
                colors={colors}
                color={ color }
                onChangeComplete={this.handleChange('color')}/>
            </FormControl>
            
          </Controls>
        </aside>
        <div className="home__canvas">
          <Canvas
            frames={frames}
            withBars={withBars}
            color={color}
            frameRate={frameRate}
            onLoading={this.setCanvasLoading}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({

  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
