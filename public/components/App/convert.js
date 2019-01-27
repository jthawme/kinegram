let hiddenCanvas = false;

function createCanvas() {
  hiddenCanvas = document.createElement('canvas');
}

function convertDataUrlTo1Bit(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = hiddenCanvas.getContext('2d');
      hiddenCanvas.width = img.width;
      hiddenCanvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      const idata = ctx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
      const buffer = idata.data;
      const threshold = 127;

      for (let i = 0; i < buffer.length; i += 4) {
        // get approx. luma value from RGB
        let luma = buffer[i] * 0.3 + buffer[i + 1] * 0.59 + buffer[i + 2] * 0.11;

        // test against some threshold
        luma = luma < threshold ? 0 : 255;

        if (buffer[i + 3] == 0) {
          luma = 255;
        }

        // write result back to all components
        buffer[i] = luma;
        buffer[i + 1] = luma;
        buffer[i + 2] = luma;
        buffer[i + 3] = luma === 0 ? 255 : 0;
      }

      // update canvas with the resulting bitmap data
      ctx.putImageData(idata, 0, 0);
      resolve(hiddenCanvas.toDataURL("image/png"));
    };
    img.crossOrigin = "";
    img.src = url;
  });
}

function convertTo1Bit(files) {
  if (files.length === 0) {
    return Promise.resolve(false);
  }

  if (!hiddenCanvas) {
    createCanvas();
  }

  const _files = files.slice();
  const completed = [];

  return new Promise((resolve, reject) => {
    const individual = index => {
      return convertDataUrlTo1Bit(_files[index])
        .then(newUrl => {
          completed.push(newUrl);

          if (index + 1 < _files.length) {
            individual(index + 1);
          } else {
            resolve(completed);
          }
        });
    };

    individual(0);
  });
}

export default convertTo1Bit;