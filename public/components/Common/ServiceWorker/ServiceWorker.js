import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// 3rd Party Modules
import {bindActionCreators} from 'redux';

// Redux

// Components

// CSS, Requires

class ServiceWorker extends React.Component {
  static propTypes = {
    onSWUpdated: PropTypes.func,
    onSWInstalled: PropTypes.func,
  };

  static defaultProps = {
    onSWUpdated: () => {},
    onSWInstalled: () => {},
  };

  componentWillMount() {
    window.addEventListener('load', () => {
      if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
        this.registerSW();
      }
    });
  }

  registerSW() {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              this.props.onSWUpdated();
            } else {
              this.props.onSWInstalled();
            }
            break;
          case 'redundant':
            console.log('The Service worker was made redundant');
            break;
          }
        };
      };
    });
  }
  render() {
    return null;
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
)(ServiceWorker);
