import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Canvas.scss";
import { imageLoaderManager, imageLoader } from '../../utils/imageLoader';
import { getIntrinsicHeight } from '../../utils/intrinsic';
import { getBars } from './Drawing';

const CWIDTH = 640;
const CHEIGHT = 480;
const LINEWID = 1;

class Canvas extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onLoading: PropTypes.func,
  };

  static defaultProps = {
    onLoading: () => {}
  };

  state = {
    running: true,
    imgObjects: []
  }

  static arrayDiff(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return true;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return true;
      }
    }

    return false;
  }

  componentDidMount() {
    this.frame = 0;
    this.counter = 0;
  }

  componentDidUpdate(oldProps) {
    if (Canvas.arrayDiff(this.props.frames, oldProps.frames)) {
      this.props.onLoading(true);
      this.stopEngine();

      this.loadNewFrames(this.props.frames)
        .then(this.commitImageObjects)
        .then(this.cutUpFrames)
        .then(this.compositeFrames)
        .then(img => {
          this.setState({
            cutUp: img
          });

          this.startEngine();
          this.props.onLoading(false);
        });
    }
  }

  getRef = (ref) => {
    this.canvas = ref;

    if (ref) {
      this.ctx = this.canvas.getContext('2d');
      this.setDimensions(CWIDTH, CHEIGHT);
    }
  }

  setDimensions = (width, height) => {
    const dpr = window.devicePixelRatio;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
  }

  loadNewFrames = (frames) => {
    return imageLoaderManager(frames);
  }

  commitImageObjects = (imgObjects) => {
    return new Promise((resolve, reject) => {
      this.setState({ imgObjects }, () => resolve(imgObjects));
    });
  }

  cutUpFrames = () => {
    this.bars = getBars(CWIDTH, CHEIGHT, LINEWID, this.state.imgObjects.length);

    const cutUps = this.state.imgObjects.map((img, index) => {
      this.ctx.save();
      this.ctx.clearRect(0, 0, CWIDTH, CHEIGHT);

      const h = getIntrinsicHeight(CWIDTH, img.width, img.height);
      const yOffset = (CHEIGHT - h) / 2;
      this.ctx.drawImage(img, 0, yOffset, CWIDTH, h);
  
      this.ctx.globalCompositeOperation = 'destination-out';
  
      this.ctx.translate(index * LINEWID, 0);
      this.ctx.fill(this.bars);
      this.ctx.restore();

      return this.canvas.toDataURL('image/png');
    });
    
    return imageLoaderManager(cutUps);
  }

  compositeFrames = (frames) => {
    const dpr = window.devicePixelRatio;
    frames.forEach(f => {
      this.ctx.drawImage(f, 0, 0, f.width / dpr, f.height / dpr);
    });

    return imageLoader(this.canvas.toDataURL('image/png'));
  }

  stopEngine = () => {
    this.setState({
      running: false
    }, () => {
      cancelAnimationFrame(this.raf);
    });
  }

  startEngine = () => {
    this.setState({
      running: true
    }, () => {
      this.raf = requestAnimationFrame(this.loop);
    });
  }

  draw = (counter) => {
    const { cutUp } = this.state;
    const { frames, color } = this.props;
    const block = (frames.length * LINEWID) + LINEWID;
    const dpr = window.devicePixelRatio;

    this.ctx.clearRect(0, 0, CWIDTH, CHEIGHT);
    this.ctx.drawImage(cutUp, 0, 0, cutUp.width / dpr, cutUp.height / dpr);

    this.ctx.save();
    this.ctx.fillStyle = 'black';
    this.ctx.translate(((counter % frames.length) * LINEWID) - block, 0);
    this.ctx.fill(this.bars);
    this.ctx.restore();

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-atop';
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, CWIDTH, CHEIGHT);
    this.ctx.restore();
  }

  loop = () => {
    if (this.frame % this.props.speed === 0) {
      this.draw(this.counter);
      this.counter++;
    }
    this.frame++;

    this.raf = requestAnimationFrame(this.loop);
  }

  render() {
    const { className } = this.props;

    const cls = classNames(
      className,
      'canvas'
    );

    return <canvas className={cls} ref={this.getRef}/>;
  }
}

export default Canvas;
