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
          <span />
        ) : (
          <label>
            <Iconer icon="add" size="medium"/>
            <input type="file" onChange={this.onFileChange}/>
          </label>
        )}
      </div>
    );
  }
}

export default TimelineSlide;
