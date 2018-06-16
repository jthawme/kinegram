import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// 3rd Party Modules

// Redux

// Components

// CSS, Requires

class ServiceWorker extends React.Component {
  constructor(props) {
    super(props);
  }

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

ServiceWorker.propTypes = {
  onSWUpdated: PropTypes.func,
  onSWInstalled: PropTypes.func,
};

ServiceWorker.defaultProps = {
  onSWUpdated: () => {},
  onSWInstalled: () => {},
};

const mapStateToProps = (store) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceWorker);
