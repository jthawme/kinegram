import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Canvas.scss";
import { imageLoaderManager, imageLoader } from '../../utils/imageLoader';

class Canvas extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    lineWidth: 1,
    frameRate: 5,
    color: 'black',
    withBars: true,
    onLoading: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      size: 400,
      frames: frames,
      lineWid: 1,
      frameRate: 5,
      color: 'red',
      withBars: true,
      playing: false
    };

    this.initialLoad = false;
    this.frame = 0;
    this.counter = 0;
  }

  static getDerivedStateFromProps(props, state) {
    return {
      frames: props.frames,
      lineWid: props.lineWidth,
      frameRate: props.frameRate,
      color: props.color,
      withBars: props.withBars,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.loading !== this.state.loading);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loading !== this.state.loading) {
      this.props.onLoading(this.state.loading);
    }

    if (this.gotNewFrames(prevProps.frames, this.props.frames) && this.initialLoad) {
      this.reset();
    }
  }

  gotNewFrames(prevFrames, frames) {
    if (prevFrames.length !== frames.length) {
      return true;
    }

    for (let i = 0; i < prevFrames.length; i++) {
      if (prevFrames[i] !== frames[i]) {
        return true;
      }
    }

    return false;
  }

  getRef = (ref) => {
    this.canvasRef = ref;

    if (ref) {
      this.ctx = this.canvasRef.getContext('2d');
      this.setDimensions(this.state.size);

      this.initialLoad = true;
      this.reset();
    }
  }
  
  reset() {
    this.loadEngine(this.state.frames)
      .then(() => {
        this.loop();
      });
  }

  loadEngine = (frames) => {
    return new Promise((resolve, reject) => {
      this.setState({
        loading: true,
        playing: false
      }, () => {
        Promise.all([
          this.createFrames(frames),
          this.delayedTimer()
        ])
          .then(() => {
            this.setState({
              loading: false,
              playing: true
            }, () => {
              resolve();
            });
          });
      });
    });
  }

  delayedTimer() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  createFrames(frames) {
    return imageLoaderManager(frames)
      .then(this.create);
  }

  setDimensions = (size) => {
    const dpr = window.devicePixelRatio;
    this.canvasRef.width = size * dpr;
    this.canvasRef.height = size * dpr;
    this.canvasRef.style.width = `${size}px`;
    this.canvasRef.style.height = `${size}px`;
    this.ctx.scale(dpr, dpr);
  }

  create = (images) => {
    const { size } = this.state;

    this.ctx.clearRect(0, 0, size, size);
    this.bars = this.getBars();
    this.ctx.fill(this.bars);
    
    return Promise.all(
      images.map((i, index) => {
        return this.getFrame(i, index);
      })
    )
      .then(frames => {
        this.frameImages = frames;
        return frames;
      });
  }

  draw = () => {
    const { size, lineWid, frames, color, withBars } = this.state;
    const block = (frames.length * lineWid) + lineWid;
    const dpr = window.devicePixelRatio;

    this.ctx.clearRect(0, 0, size, size);
    
    this.frameImages.forEach((f, index) => {
      this.ctx.drawImage(f, 0, 0, f.width / dpr, f.height / dpr);
    });
    this.ctx.restore();

    if (withBars) {
      this.ctx.save();
      this.ctx.translate(((this.counter % frames.length) * lineWid) - block, 0);
      this.ctx.fill(this.bars);
      this.ctx.restore();
    }

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-atop';
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, size, size);
    this.ctx.restore();
  }

  loop = () => {
    if (this.state.playing) {
      if (this.frame % this.state.frameRate === 0) {
        this.draw();
        this.counter++;
      }
      this.frame++;

      requestAnimationFrame(() => this.loop());
    }
  }

  getFrame(image, num) {
    const { size, color, lineWid } = this.state;

    this.ctx.save();
    this.ctx.clearRect(0, 0, size, size);

    this.ctx.drawImage(image, 0, 0, size, size);

    this.ctx.globalCompositeOperation = 'destination-out';

    this.ctx.translate(num * lineWid, 0);
    this.ctx.fill(this.bars);
    this.ctx.restore();

    return imageLoader(this.canvasRef.toDataURL('image/png'));
  }

  getBars() {
    const { size, frames, lineWid } = this.state;
    const block = (frames.length * lineWid) + lineWid;
    
    const shape = new Path2D();
    for (let i = 0; i < (size + block); i += block) {
      shape.rect(i + lineWid, 0, block - lineWid, size);
    }

    return shape;
  }

  render() {
    const { className } = this.props;
    const { size, loading } = this.state;

    const cls = classNames(
      className,
      'canvas',
      {
        'canvas--hide': loading
      }
    );

    return <canvas className={cls} ref={this.getRef} width={`${size}px`} height={`${size}px`}/>;
  }
}

export default Canvas;
