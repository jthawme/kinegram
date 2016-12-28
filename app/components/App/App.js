import React from 'react';
import { connect } from 'react-redux';

require('./App.css');

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="app">
        App
        { this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object
};

const mapStateToProps = function(store) {
  return {
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
