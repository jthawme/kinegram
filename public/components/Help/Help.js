import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Help.scss";
import Iconer from '../Common/Iconer/Iconer';

class Help extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, onClose } = this.props;

    const cls = classNames(
      className,
      'help'
    );

    return (
      <section className={cls}>
        <div className="help__close" onClick={onClose}>
          <Iconer icon="close"/>
        </div>
        <div className="help__content">
          <h1 className="help__title">Kinegram.</h1>
          <p>
            A Kinegram <span className="help-list">[<em>Barrier grid animation</em> / <em>Scanimation</em> / <em>Moiré Animation</em>]</span> is a method of creating animation cheaply and in a static form. <a href="https://en.wikipedia.org/wiki/Barrier_grid_animation_and_stereography" target="_blank" rel="noopener noreferrer">See more about it here.</a>
          </p>
          <p>
            Drag and drop images onto the canvas to generate your own, then <Iconer icon="save" size="small"/><b>export</b> files to print them out.
          </p>
          <p>
            Site made by <a href="https://jthaw.me" target="_blank" rel="noopener noreferrer">@jthawme</a>. View the source on <a href="https://github.com/jthawme/kinegram" target="_blank" rel="noopener noreferrer">Github</a>.
          </p>
        </div>
      </section>
    );
  }
}

export default Help;
