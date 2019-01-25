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
    className: PropTypes.string
  };

  state = {
    slides: startingArray
  };

  renderSlides(slides) {
    return slides.map((s, index) => {
      return <TimelineSlide key={index} />;
    });
  }

  render() {
    const { className } = this.props;
    const { slides } = this.state;

    const cls = classNames(
      className,
      'timeline'
    );

    return (
      <div className={cls}>
        <button className="timeline__arrow timeline__arrow--left" onClick={() => {}}>
          <Iconer icon="arrow_left" size="small"/>
        </button>
        <div className="timeline__slider">
          <div className="timeline__track">
            { this.renderSlides(slides) }
          </div>
        </div>
        <button className="timeline__arrow timeline__arrow--right" onClick={() => {}}>
          <Iconer icon="arrow_left" size="small"/>
        </button>
      </div>
    );
  }
}

export default Timeline;
