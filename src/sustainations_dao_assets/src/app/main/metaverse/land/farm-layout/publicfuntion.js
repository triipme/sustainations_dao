
const canvasConfig = (canvas) => {
  const canvasEle = canvas.current;
  canvasEle.width = window.innerWidth;
  canvasEle.height = window.innerHeight;
  const ctx = canvasEle.getContext("2d");
  return [ctx, canvasEle]
}

const sOft = (sX, sY, m, n, w, h) => {
  return { sX: sX, sY: sY, m: m, n: n, w: w, h: h };
}

const init = (tileStyle, col, row) => {
  let result = [];
  let rx, cx = tileStyle.sX;
  let ry, cy = tileStyle.sY;
  for (let j = tileStyle.n - 1; j >= 0; j--) {
    rx = cx;
    ry = cy;
    for (let i = 0; i < tileStyle.m; i++) {
      result.push({ x: rx, y: ry, w: tileStyle.w, h: tileStyle.h, id: (col + j) * 10 + (row + i), col: col + j, row: row + i });
      rx = rx + tileStyle.w / 2;
      ry = ry + tileStyle.h / 2;
    }
    if (j === 0) {
      return result;
    }
    cx = cx - tileStyle.w / 2;
    cy = cy + tileStyle.h / 2;
  }
}

const drawImageOnCanvas = (ctx, imageObj, cx, cy, width, height, rowSize, colSize) => {
  const image = new Image();
  image.src = imageObj;
  image.onload = function () { // when the image is loaded, execute this code
    console.log(imageObj); // draw the image on the canvas at position (0,0)
    ctx.drawImage(image, cx, cy, width, height)
  }
}

const drawImageOnCanvasTest = (ctx, imageObj, cx, cy, width, height, rowSize, colSize) => {
  var images = ["metaverse/farm25D/Ground.png", "metaverse/farm25D/building/Factory.png"]
  var loadedImages = {}
  var promiseArray = images.map(function (imgurl) {
    var prom = new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        loadedImages[imgurl] = img;
        resolve();
      };
      img.src = imgurl;
    });
    return prom;
  });
  Promise.all(promiseArray).then(imagesLoaded);
  function imagesLoaded() {

    ctx.drawImage(loadedImages[imageObj], cx, cy, width, height);
  }
}

const drawRhombus = (ctx, x, y, width, height, style = {}) => {
  let halfWidth = width / 2;
  let halfHeight = height / 2;
  const Color = style;

  ctx.beginPath();
  ctx.strokeStyle = "#09f";
  ctx.fillStyle = Color
  ctx.moveTo(x, y + halfHeight); // Left
  ctx.lineTo(x + halfWidth, y); // Top
  ctx.lineTo(x + width, y + halfHeight); // Right 
  ctx.lineTo(x + halfWidth, y + height); // Bottom
  ctx.lineTo(x, y + halfHeight); // Back to left
  ctx.stroke()
  if (Color !== 'none')
    ctx.fill();
}

const drawRect = (ctx, info, style = {}) => {
  const { x, y, w, h } = info;
  const { borderColor = 'black', borderWidth = 0 } = style;

  ctx.beginPath();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.rect(x, y, w, h);
  ctx.stroke();
}

const checkTilePosition = (event, listTile, sOft) => {
  let minX = sOft.sX - sOft.w * ((sOft.m - 1) / 2);
  let minY = sOft.sY;
  let maxX = sOft.sX + sOft.w * ((sOft.m - 1) / 2);
  let maxY = sOft.sY + sOft.h * (sOft.n - 1);
  let result = []
  if (minX < event.pageX < maxX && minY < event.pageY < maxY) {
    result = listTile.filter((tile) => {
      return (tile.x < event.pageX && event.pageX < (tile.x + sOft.w)) &&
        (tile.y < event.pageY && event.pageY < (tile.y + sOft.h));
    })
  }
  let positionTile, pos;
  const euclidD = (x1, x2, y1, y2) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
  }

  for (let i = 0; i < result.length; i++) {
    let coord = { x: (result[i].x + result[i].w / 2), y: (result[i].y + result[i].h / 2) }
    if (positionTile === undefined) {
      positionTile = { ...coord };
      pos = i;
    } else if (euclidD(coord.x, event.pageX, coord.y, event.pageY) < euclidD(positionTile.x, event.pageX, positionTile.y, event.pageY)) {
      positionTile = { ...coord };
      pos = i;
    }
  }
  return result[pos]

}

const getCenterCoordinate = (coord) => {
  return { x: coord.x + coord.w / 2, y: coord.y + coord.h / 2 }
}


export {
  canvasConfig,
  sOft,
  init,
  drawRect,
  drawImageOnCanvas,
  drawRhombus,
  checkTilePosition,
  getCenterCoordinate,
  drawImageOnCanvasTest
}