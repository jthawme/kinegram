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
    image: PropTypes.string,
    onImageAdded: PropTypes.func,
  };

  static defaultProps = {
    onImageAdded: () => {}
  };

  onFileChange = (e) => {
    this.props.onImageAdded(e.target.files);
  }

  onClear = () => {
    this.props.onClearImage(this.props.image);
  }

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
          <span className="timelineslide__clear" onClick={this.onClear}><Iconer icon="close" size="xsmall"/></span>
        ) : null }
        <label>
        { image ? (
          <span className="timelineslide__poster" style={{backgroundImage: `url(${image})`}}/>
        ) : (
            <Iconer icon="add" size="medium"/>
        )}
          <input accept="image/*" type="file" onChange={this.onFileChange}/>
        </label>
      </div>
    );
  }
}

export default TimelineSlide;
