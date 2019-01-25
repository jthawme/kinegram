import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root'

// 3rd Party Modules
import classNames from 'classnames';
import Helmet from 'react-helmet';
import DropZone from 'react-dropzone';

// Redux

// Components
import ServiceWorker from '../Common/ServiceWorker/ServiceWorker';
import Controls from '../Controls/Controls';

// CSS, Requires
import metaJson from '../../../context/meta.json';
import "./App.scss";

import logoImg from '../../images/logo.png';

const MAX_SLIDES = 8;

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  state = {
    images: []
  }

  onImageAdded = (files, index = false) => {
    const _files = [];
    for (let i = 0; i < files.length; i++) {
      _files.push(files[i]);
    }

    Promise.all(_files.map(f => {
      return this.getFileUrl(f)
    }))
      .then(fileUrls => {
        const images = this.state.images.slice();
        
        const accepted = fileUrls.map(f => f);
        let start = parseInt(index) >= 0 ? index : images.length;

        if (start >= MAX_SLIDES) {
          start = 0;
        }

        const left = MAX_SLIDES - start;
        const filtered = accepted.slice(0, left);
        
        const args = [start, filtered.length].concat(filtered);

        Array.prototype.splice.apply(images, args);

        this.setState({ images });
      });
  }

  getFileUrl(file) {
    return new Promise((resolve, reject) => {
      if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          resolve(reader.result);
        });
        reader.readAsDataURL(file);
      } else {
        resolve(false);
      }
    });
  }

  onDrop = (files) => {
    this.onImageAdded(files);
  }

  render() {
    const { images } = this.state;

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

        <DropZone accept="image/*" onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive}) => {
            return (
              <div
                {...getRootProps()}
                className={classNames('app__canvas', { 'app__canvas--dropping': isDragActive })}>
                canvas
              </div>
            )
          }}
        </DropZone>

        <Controls
          images={images}
          onImageAdded={this.onImageAdded}
          className="app__controls"/>

        <ServiceWorker/>
      </div>
    );
  }
}

export default hot(App);
