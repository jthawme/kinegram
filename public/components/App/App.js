import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root'

// 3rd Party Modules
import classNames from 'classnames';
import Helmet from 'react-helmet';
import Iconer from '../Common/Iconer/Iconer';

// Redux

// Components
import ServiceWorker from '../Common/ServiceWorker/ServiceWorker';
import Controls from '../Controls/Controls';

// CSS, Requires
import metaJson from '../../../context/meta.json';
import "./App.scss";

import logoImg from '../../images/logo.png';

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const cls = classNames(
      'app'
    );

    return (
      <div className={cls}>
        <Helmet
          titleTemplate={`%s - ${metaJson.name}`}
          defaultTitle={metaJson.name}
          meta={[
            {name: 'description', content: metaJson.description}
          ]}/>

        <img className="app__logo" src={logoImg} />

        <Controls
          className="app__controls"/>

        <ServiceWorker/>
      </div>
    );
  }
}

export default hot(App);
