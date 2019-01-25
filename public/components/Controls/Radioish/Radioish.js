import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Radioish.scss";

class Radioish extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    let initial = props.options.findIndex(o => o === props.defaultValue);
    this.state = {
      options: props.options,
      selected: initial >= 0 ? initial : 0
    };
  }

  onSelect = (option) => {
    this.setState({
      selected: this.state.options.findIndex(opt => opt === option)
    });

    this.props.onChange(option);
  }

  render() {
    const { className } = this.props;
    const { options, selected } = this.state;

    const cls = classNames(
      className,
      'radioish'
    );

    return (
      <div className={cls}>
        {
          options.map((opt, index) => {
            const _cls = classNames(
              'radioish__radio',
              {
                'radioish__radio--selected': index === selected
              }
            );

            return <span key={opt} className={_cls} onClick={() => this.onSelect(opt)}/>;
          })
        }
      </div>
    );
  }
}

export default Radioish;
