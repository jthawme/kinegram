import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';
import GIF from 'gif.js.optimized';

// Redux

// Components

// CSS, Requires
import "./Canvas.scss";
import { imageLoaderManager, imageLoader } from '../../utils/imageLoader';
import { getIntrinsicHeight, getIntrinsicWidth } from '../../utils/intrinsic';
import { getBars } from './Drawing';

const workerScript = require('file-loader!gif.js.optimized/dist/gif.worker.js');

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
    recording: false,
    exporting: false,
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

    if (this.props.recording && !oldProps.recording) {
      this.setState({
        recording: true
      }, () => {
        this.startRecording();
      });
    }

    if (this.props.exporting && !oldProps.exporting) {
      this.setState({
        exporting: true
      }, () => {
        this.startExport();
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

  getHiddenRef = (ref) => {
    this.hiddenCanvas = ref;

    if (ref) {
      this.hiddenCtx = this.hiddenCanvas.getContext('2d');
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
      const w = getIntrinsicWidth(CHEIGHT, img.width, img.height);

      let yOffset = 0;
      let xOffset = 0;
      let imgH = img.height;
      let imgW = img.width;

      if (h > CHEIGHT) {
        imgH = CHEIGHT;
        imgW = w;
        xOffset = (CWIDTH - w) / 2;
      } else {
        imgW = CWIDTH;
        imgH = h;
        yOffset = (CHEIGHT - h) / 2;
      }

      this.ctx.drawImage(img, xOffset, yOffset, imgW, imgH);
  
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

  startRecording = () => {
    this.gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: workerScript
    });

    this.gifFrames = [];

    this.gif.on('finished', (blob) => {
      this.props.onFinishedProcessing(blob);
    });

    this.frame = 0;
    this.counter = 0;
  }

  endRecording = () => {
    this.setState({
      recording: false
    });

    this.props.onFinishedRecording();

    imageLoaderManager(this.gifFrames)
      .then(imgObjects => {
        imgObjects.forEach(img => {
          this.gif.addFrame(img, {
            delay: 15 * this.props.speed
          });
        });
        this.gif.render();
      });
  }

  startExport = () => {
    this.setState({
      export: true
    });
  }

  endExport = () => {
    this.setState({
      export: false
    });
  }

  drawMark(angle = 0) {
    this.hiddenCtx.save();
    // this.hiddenCtx.translate(10, 10);
    this.hiddenCtx.rotate(angle * Math.PI / 180);
    this.hiddenCtx.beginPath();
    this.hiddenCtx.moveTo(10, -10);
    this.hiddenCtx.lineTo(10, 8);
    this.hiddenCtx.moveTo(8, 10);
    this.hiddenCtx.lineTo(-10, 10);
    this.hiddenCtx.stroke();
    this.hiddenCtx.restore();
  }

  drawMarks(width, height) {
    this.hiddenCtx.save();
    this.hiddenCtx.translate(((width / 2) * -1), ((height / 2) * -1) - 20);
    this.drawMark(0);
    this.hiddenCtx.restore();

    this.hiddenCtx.save();
    this.hiddenCtx.translate((width / 2) + 20, ((height / 2) * -1) - 20);
    this.drawMark(90);
    this.hiddenCtx.restore();

    this.hiddenCtx.save();
    this.hiddenCtx.translate((width / 2) + 20, (height / 2) + 20);
    this.drawMark(180);
    this.hiddenCtx.restore();

    this.hiddenCtx.save();
    this.hiddenCtx.translate(((width / 2) * -1), (height / 2) + 20);
    this.drawMark(270);
    this.hiddenCtx.restore();
  }

  drawExport = (bars = false) => {
    const scale = 3;
    const expWidth = CWIDTH * scale;
    const expHeight = CHEIGHT * scale;

    this.hiddenCanvas.width = expHeight;
    this.hiddenCanvas.height = expWidth;
    // this.hiddenCtx.scale(scale, scale);

    const { cutUp } = this.state;
    const { frames, color } = this.props;

    this.hiddenCtx.clearRect(0, 0, expWidth, expHeight);

    this.hiddenCtx.save();
    this.hiddenCtx.translate(expHeight, 0);
    this.hiddenCtx.rotate(90 * Math.PI / 180);
    this.hiddenCtx.save();
    this.hiddenCtx.translate(expWidth / 2, expHeight / 2);

    if (!bars) {
      this.hiddenCtx.drawImage(cutUp, (cutUp.width / 2) * -1, (cutUp.height / 2) * -1, cutUp.width, cutUp.height);
    } else {
      const block = (frames.length * LINEWID) + LINEWID;
      this.hiddenCtx.save();
      this.hiddenCtx.fillStyle = 'black';
      this.hiddenCtx.translate((CWIDTH + (block / 2)) * -1, -CHEIGHT);
      this.hiddenCtx.scale(2, 2);
      this.hiddenCtx.fill(this.bars);
      this.hiddenCtx.restore();
    }

    this.drawMarks(cutUp.width, cutUp.height);

    this.hiddenCtx.font = "12px monospace";
    this.hiddenCtx.fillText(`${frames.length} frames`, ((cutUp.width / 2) * -1) + 50, ((cutUp.height / 2) * -1) - 10);

    this.hiddenCtx.restore();
    this.hiddenCtx.restore();

    this.hiddenCtx.save();
    this.hiddenCtx.globalCompositeOperation = 'source-atop';
    this.hiddenCtx.fillStyle = color;
    this.hiddenCtx.fillRect(0, 0, expHeight, expWidth);
    this.hiddenCtx.restore();

    this.hiddenCtx.save();
    this.hiddenCtx.globalCompositeOperation = "destination-over";
    this.hiddenCtx.fillStyle = "#ffffff";
    this.hiddenCtx.fillRect(0, 0, expHeight, expWidth);
    this.hiddenCtx.restore();

    this.hiddenCanvas.toBlob(blob => {
      this.props.onFinishedExporting(blob);
    });

    if (bars) {
      this.setState({
        exporting: false
      });
    }
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


    this.ctx.save();
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, CWIDTH, CHEIGHT);
    this.ctx.restore();
  }

  loop = () => {
    if (this.state.exporting) {
      this.drawExport();
      this.drawExport(true);
    }
    else if (this.frame % this.props.speed === 0) {
      this.draw(this.counter);
      this.counter++;

      if (this.state.recording) {
        // this.gif.addFrame(this.canvas)
        this.gifFrames.push(this.canvas.toDataURL('image/png'));

        if (this.counter >= this.props.frames.length) {
          this.endRecording();
        }
      }
    }

    if (!this.state.exporting) {
      this.frame++;
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  render() {
    const { className, parentWidth, parentHeight } = this.props;

    const cls = classNames(
      className,
      'canvas'
    );

    const padding = 20;
    let scaleBy = 1;

    if (CWIDTH > parentHeight) {
      scaleBy = Math.min(Math.max((parentWidth - padding) / CWIDTH, 0.1), 1);
    } else {
      scaleBy = Math.min(Math.max((parentHeight - padding) / CHEIGHT, 0.1), 1);
    }

    return (
      <Fragment>
        <canvas className={cls} ref={this.getRef} style={{ transform: `scale(${scaleBy})` }}/>
        <canvas className="canvas__hidden" ref={this.getHiddenRef}/>
      </Fragment>
    );
  }
}

export default Canvas;
