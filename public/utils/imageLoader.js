
export const imageLoader = (imagePath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img)
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src= imagePath;
  });
};

export const imageLoaderManager = (images) => {
  let res;
  let rej;
  const p = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  const _images = images.slice();
  const imgObjects = [];
  const loader = (index, imgs) => {
    if (index >= imgs.length) {
      res(imgObjects);
    } else {
      imageLoader(imgs[index])
        .then(imgObj => {
          imgObjects.push(imgObj);
          loader(index + 1, imgs);
        });
    }
  };
  loader(0, _images);

  return p;
};