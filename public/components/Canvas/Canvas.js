import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Canvas.scss";
import { imageLoaderManager, imageLoader } from '../../utils/imageLoader';
const frames = [
  require('../../images/testframes/02/01.png'),
  require('../../images/testframes/02/02.png'),
  require('../../images/testframes/02/03.png'),
  require('../../images/testframes/02/04.png'),
  require('../../images/testframes/02/05.png'),
  require('../../images/testframes/02/06.png'),
  require('../../images/testframes/02/07.png'),
  require('../../images/testframes/02/08.png'),
];

class Canvas extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      size: 400,
      frames: frames.length,
      lineWid: 1,
      frameRate: 5,
      color: 'red'
    };

    this.frame = 0;
    this.counter = 0;
  }

  shouldComponentUpdate() {
    return false;
  }

  getRef = (ref) => {
    this.canvasRef = ref;

    if (ref) {
      this.ctx = this.canvasRef.getContext('2d');
      this.setDimensions(this.state.size);

      Promise.all([
        imageLoaderManager(frames)
      ])
        .then(this.create);
    }
  }

  setDimensions = (size) => {
    const dpr = window.devicePixelRatio;
    this.canvasRef.width = size * dpr;
    this.canvasRef.height = size * dpr;
    this.canvasRef.style.width = `${size}px`;
    this.canvasRef.style.height = `${size}px`;
    this.ctx.scale(dpr, dpr);
  }

  create = ([images]) => {
    const { size } = this.state;

    this.ctx.clearRect(0, 0, size, size);
    this.bars = this.getBars();

    Promise.all(
      images.map((i, index) => {
        return this.getFrame(i, index);
      })
    )
      .then(frames => {
        this.frameImages = frames;

        this.loop();
      });
  }

  draw = () => {
    const { size, lineWid, frames, color } = this.state;
    const block = (frames * lineWid) + lineWid;
    const dpr = window.devicePixelRatio;

    this.ctx.clearRect(0, 0, size, size);
    
    this.frameImages.forEach((f, index) => {
      // if (index < 2) {
        this.ctx.drawImage(f, 0, 0, f.width / dpr, f.height / dpr);
      // }
    });
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(((this.counter % frames) * lineWid) - block, 0);
    this.ctx.fill(this.bars);
    this.ctx.restore();

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-atop';
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, size, size);
    this.ctx.restore();
  }

  loop = () => {
    if (this.frame % this.state.frameRate === 0) {
      this.draw();
      this.counter++;
    }
    this.frame++;

    requestAnimationFrame(() => this.loop());
  }

  getFrame(image, num) {
    const { size, color } = this.state;

    this.ctx.save();
    this.ctx.clearRect(0, 0, size, size);

    this.ctx.drawImage(image, 0, 0, size, size);

    this.ctx.globalCompositeOperation = 'destination-out';

    this.ctx.translate(num, 0);
    this.ctx.fill(this.bars);
    this.ctx.restore();

    return imageLoader(this.canvasRef.toDataURL('image/png'));
  }

  getBars() {
    const { size, frames, lineWid } = this.state;
    const block = (frames * lineWid) + lineWid;

    const shape = new Path2D();
    for (let i = 0; i < (size + block); i += block) {
      shape.rect(i + lineWid, 0, block - lineWid, size);
    }

    return shape;
  }

  render() {
    const { className } = this.props;
    const { size } = this.state;

    const cls = classNames(
      className,
      'canvas'
    );

    return <canvas ref={this.getRef} width={`${size}px`} height={`${size}px`}/>;
  }
}

export default Canvas;
