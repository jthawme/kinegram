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
import Status, {VALID_STATUSES} from '../Status/Status';
import Canvas from '../Canvas/Canvas';

// CSS, Requires
import convertTo1Bit from './convert';
import { MAX_SLIDES, SPEEDS } from './constants';
import logoImg from '../../images/logo.png';
import metaJson from '../../../context/meta.json';
import "./App.scss";



class App extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  state = {
    color: '#000000',
    speed: SPEEDS[1],
    images: [],
    disabled: false,
    loading: false
  }

  onAttributeChange = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  onImageAdded = (files, index = false) => {
    this.setState({ disabled: true, loading: true });

    const _files = [];
    for (let i = 0; i < files.length; i++) {
      _files.push(files[i]);
    }

    Promise.all(_files.map(f => {
      return this.getFileUrl(f)
    }))
      .then(fileUrls => {
        return fileUrls.filter(f => f);
      })
      .then(convertTo1Bit)
      .then(fileUrls => {
        const images = this.state.images.slice();
        
        let start = parseInt(index) >= 0 ? index : images.length;

        if (start >= MAX_SLIDES) {
          start = 0;
        }

        const left = MAX_SLIDES - start;
        const filtered = fileUrls.slice(0, left);
        
        const args = [start, filtered.length].concat(filtered);

        Array.prototype.splice.apply(images, args);

        this.setState({ images, disabled: false, loading: false });
      });
  }

  onImageRemoved = (file, index) => {
    const images = this.state.images.slice();
    images.splice(index, 1);
    this.setState({ images });
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

  getStatus() {
    if (this.state.disabled) {
      return VALID_STATUSES.LOADING;
    }

    return false;
  }

  render() {
    const { images, color, speed } = this.state;

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

        <Status
          className="app__status"
          command={this.getStatus()}/>

        <DropZone accept="image/*" onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive}) => {
            return (
              <div
                {...getRootProps()}
                className={classNames('app__canvas', { 'app__canvas--dropping': isDragActive })}>
                { isDragActive ? (
                  <div className="app__canvas__drop-message">
                    <span>Drop images to add the frames</span>
                  </div>
                ) : null }
                <input {...getInputProps()} />
                
                <Canvas
                  color={color}
                  speed={speed}
                  frames={images}/>
              </div>
            )
          }}
        </DropZone>

        <Controls
          color={color}
          speed={speed}
          images={images}
          onAttributeChange={this.onAttributeChange}
          onImageAdded={this.onImageAdded}
          onImageRemoved={this.onImageRemoved}
          className="app__controls"/>

        <ServiceWorker/>
      </div>
    );
  }
}

export default hot(App);
