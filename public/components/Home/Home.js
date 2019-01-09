import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// 3rd Party Modules
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

// Redux

// Components
import Canvas from '../Canvas/Canvas';

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

// CSS, Requires
import "./Home.scss";

class Home extends React.Component {
  static propTypes = {
  };

  state = {
    withBars: true,
    frameRate: 5,
    color: '#000000',
    canvasLoading: true
  };

  onCheckboxChange = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  onValueChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onRadioChange = (e) => {
    this.setState({
      [e.target.name]: parseInt(e.target.value, 10)
    });
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

    const frameRates = [3, 5, 10];

    return (
      <div className={cls}>
        <aside className="home__controls">
          <ul>
            <li>
              <label className="home__controls__row">
                <span className="home__controls__row__title">With Bars</span>
                <span className="home__controls__row__input">
                  <input type="checkbox" name="withBars" onChange={this.onCheckboxChange} value={1} checked={withBars}/>
                </span>
              </label>
            </li>
            <li>
              <label className="home__controls__row">
                <span className="home__controls__row__title">Color</span>
                <span className="home__controls__row__input">
                  <input type="color" name="color" onChange={this.onValueChange} value={color}/>
                </span>
              </label>
            </li>
            <li>
              <label className="home__controls__row">
                <span className="home__controls__row__title">Color</span>
                <span className="home__controls__row__input">
                  {
                    frameRates.map(fr => {
                      return <input key={fr} type="radio" name="frameRate" onChange={this.onRadioChange} value={fr} checked={frameRate === fr}/>
                    })
                  }
                </span>
              </label>
            </li>
          </ul>
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
