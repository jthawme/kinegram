import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import TimelineSlide from './TimelineSlide/TimelineSlide';
import Iconer from '../../Common/Iconer/Iconer';

// CSS, Requires
import "./Timeline.scss";

let startingArray = new Array(8).fill(undefined);

class Timeline extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onImageAdded: PropTypes.func,
  };

  state = {
    slides: startingArray,
    pointer: 0
  };

  renderSlides(slides, images) {
    return slides.map((s, index) => {
      return <TimelineSlide
        onImageAdded={(files) => this.props.onImageAdded(files, index)}
        image={images[index]}
        key={index} />;
    });
  }

  leftArrowDisabled = () => {
    return this.state.pointer === 0;
  }

  rightArrowDisabled = () => {
    return this.state.pointer >= this.state.slides.length - 1;
  }

  movePointer(change) {
    let target = this.state.pointer + change;

    if (target >= 0 && target < this.state.slides.length) {
      this.setState({
        pointer: target
      });
    }
  }

  render() {
    const { className, images } = this.props;
    const { slides, pointer } = this.state;

    const cls = classNames(
      className,
      'timeline'
    );

    const leftArrowCls = classNames(
      'timeline__arrow',
      'timeline__arrow--left',
      {
        'timeline__arrow--disabled': this.leftArrowDisabled()
      }
    );

    const rightArrowCls = classNames(
      'timeline__arrow',
      'timeline__arrow--right',
      {
        'timeline__arrow--disabled': this.rightArrowDisabled()
      }
    );

    const slide = 140;
    const trackStyle = {
      transform: `translate3d(${(slide * pointer) * -1}px, 0, 0)`
    }

    return (
      <div className={cls}>
        <button className={leftArrowCls} onClick={() => this.movePointer(-1)}>
          <Iconer icon="arrow_left" size="small"/>
        </button>
        <div className="timeline__slider">
          <div className="timeline__track" style={trackStyle}>
            { this.renderSlides(slides, images) }
          </div>
        </div>
        <button className={rightArrowCls} onClick={() => this.movePointer(1)}>
          <Iconer icon="arrow_left" size="small"/>
        </button>
      </div>
    );
  }
}

export default Timeline;
