const canvasConfig = canvas => {
  const canvasEle = canvas.current;
  if(window.innerWidth >= window.innerHeight){
    canvasEle.width = window.innerWidth;
    canvasEle.height = window.innerHeight;
  } else {
    canvasEle.width = window.innerHeight;
    canvasEle.height = window.innerHeight;
  }
  const ctx = canvasEle.getContext("2d");
  // ctx.mozImageSmoothingEnabled = false;
  // ctx.webkitImageSmoothingEnabled = false;
  // ctx.msImageSmoothingEnabled = false;
  // ctx.imageSmoothingEnabled = false;
  ctx.save();
  return [ctx, canvasEle];
};

const sOft = (sX, sY, m, n, w, h) => {
  return { sX: sX, sY: sY, m: m, n: n, w: w, h: h };
};

const init = (tileStyle, col, row) => {
  let result = [];
  let rx,
    cx = tileStyle.sX;
  let ry,
    cy = tileStyle.sY;
  for (let j = 0; j < tileStyle.n; j++) {
    rx = cx;
    ry = cy;
    for (let i = 0; i < tileStyle.m; i++) {
      result.push({
        x: rx,
        y: ry,
        w: tileStyle.w,
        h: tileStyle.h,
        id: (col + j) * 10 + (row + i),
        col: col + j,
        row: row + i
      });
      rx = rx + tileStyle.w / 2;
      ry = ry + tileStyle.h / 2;
    }
    if (j === tileStyle.n - 1) {
      return result;
    }
    cx = cx - tileStyle.w / 2;
    cy = cy + tileStyle.h / 2;
  }
};

const drawImageOnCanvas = (ctx, image, cx, cy, width, height) => {
  image.onload = function () {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(image, cx, cy, width, height);
  };
};

function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
}

const drawRhombus = (ctx, x, y, width, height, style = {}) => {
  let halfWidth = width / 2;
  let halfHeight = height / 2;
  const Color = style;

  ctx.beginPath();
  ctx.strokeStyle = "#09f";
  ctx.fillStyle = Color;
  ctx.moveTo(x, y + halfHeight); // Left
  ctx.lineTo(x + halfWidth, y); // Top
  ctx.lineTo(x + width, y + halfHeight); // Right
  ctx.lineTo(x + halfWidth, y + height); // Bottom
  ctx.lineTo(x, y + halfHeight); // Back to left
  ctx.stroke();
  if (Color !== "none") ctx.fill();
};

const drawRect = (ctx, info, style = {}) => {
  const { x, y, w, h } = info;
  const { borderColor = "black", borderWidth = 0 } = style;

  ctx.beginPath();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.rect(x, y, w, h);
  ctx.stroke();
};

const checkTilePosition = (event, listTile, sOft, ratio, d) => {
  let minX = sOft.sX * ratio + d.x - sOft.w * ratio * ((sOft.m - 1) / 2);
  let minY = sOft.sY * ratio + d.y;
  let maxX = sOft.sX * ratio + d.x + sOft.w * ratio * ((sOft.m - 1) / 2);
  let maxY = sOft.sY * ratio + d.y + sOft.h * ratio * (sOft.n - 1);
  let result = [];
  if (minX < event.pageX < maxX && minY < event.pageY < maxY) {
    result = listTile.filter(tile => {
      return (
        tile.x * ratio + d.x < event.pageX &&
        event.pageX < tile.x * ratio + d.x + sOft.w * ratio &&
        tile.y * ratio + d.y < event.pageY &&
        event.pageY < tile.y * ratio + d.y + sOft.h * ratio
      );
    });
  }
  let positionTile, pos;
  const euclidD = (x1, x2, y1, y2) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  for (let i = 0; i < result.length; i++) {
    let coord = {
      x: (result[i].x + d.x) * ratio + (result[i].w * ratio) / 2,
      y: (result[i].y + d.y) * ratio + (result[i].h * ratio) / 2
    };
    if (positionTile === undefined) {
      positionTile = { ...coord };
      pos = i;
    } else if (
      euclidD(coord.x, event.pageX, coord.y, event.pageY) <
      euclidD(positionTile.x, event.pageX, positionTile.y, event.pageY)
    ) {
      positionTile = { ...coord };
      pos = i;
    }
  }
  return result[pos];
};

const getCenterCoordinate = coord => {
  return { x: coord.x + coord.w / 2, y: coord.y + coord.h / 2 };
};


export {
  canvasConfig,
  sOft,
  init,
  drawRect,
  drawImageOnCanvas,
  drawRhombus,
  checkTilePosition,
  getCenterCoordinate,
  loadImage,
};
