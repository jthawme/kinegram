export const getBars = (width, height, lineWid, frames) => {
  const block = (frames * lineWid) + lineWid;
  const shape = new Path2D();
  for (let i = 0; i < (width + block); i += block) {
    shape.rect(i + lineWid, 0, block - lineWid, height);
  }

  return shape;
}