'use strict';
const grafinfo = {};
const loops = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

 ctx.font = '24px Times new Roman';
 ctx.textBaseline = 'middle';
 ctx.textAlign = 'center';

 const A = [
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0],
  [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1]
];

const C = JSON.parse(JSON.stringify(A));

const r = 20;
const rloops = 3 * r / 4;
const arrr = 5;

const buildVertex = (n, P, x0, y0, obj) => {
  let step = P / n;
  const side = P / 4;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  for (vert; vert <=  Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY += step;
  }

  for (vert; vert <=  2 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step;
  }

  for (vert; vert <=  3 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY -= step;
  }
  for (vert; vert <=  n; vert++) {
    step = side / (n - 3 * Math.ceil(n / 4));
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX -= step;
  }
};
buildVertex(11, 2000, 40, 40, grafinfo);

const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simplecon = [];
    obj[key].doublecon = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) { 
        const names = [`vert${i+1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simplecon.push(`vert${j + 1}`);
        }
        else {
          obj[names[0]].doublecon.push(`vert${j + 1}`);
        }
      }
    }
  }
}
const center = (x0, y0, p) =>{ 
  let x = x0 + p/8;
  let y = y0 + p/8;
  return {
    x : x,
    y : y
  }
}

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (let i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc)**2 + (obj[arr[i]].coords[1] - yc)**2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

function drawArrowhead(x0, y0, x1,y1, radius, fillStyle = 'black', strokestyle = 'black') {
  const xcenter = x1;
  const ycenter = y1;
  let angle;
  let x;
  let y;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  angle = Math.atan2(y1 - y0, x1 - x0);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;

  ctx.moveTo(x, y);
  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;
  ctx.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

const readyCons = (x0, y0, x1, y1, r) => {
  const step = 1;
  const alpha = Math.atan2(y1 - y0, x1 - x0);
    const dx = step * Math.cos(alpha);
    const dy = step * Math.sin(alpha);
    let x = x0;
    let y = y0;
    while(true) {
      x += dx;
      y += dy;
      if(Math.sqrt((x1 - x)**2 + (y1 - y)**2) < r + arrr) break;
    }
    const res = {
      x : x,
      y : y
    };
    return res;
  }

  function simpleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r * 2.5) * Math.cos(Math.PI / 2 - alpha),
      dy : (r * 2.6) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  function doubleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r * 1.15) * Math.cos(Math.PI / 2 - alpha),
      dy : (r * 0.55) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  const drawOrSimpleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].simplecon.length; i++) {
        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].simplecon[i]}`].coords[0];
        const toY = obj[`${obj[key].simplecon[i]}`].coords[1];
  
        
        if (Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
          const coordinates = readyCons(fromX, fromY, toX, toY, r);
          drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);
        } 
        else {
        const { dx, dy } = simpleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY, r);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);  
        }
      }
    }
  }

  const drawOrDoubleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].doublecon.length; i++) {

        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].doublecon[i]}`].coords[0];
        const toY = obj[`${obj[key].doublecon[i]}`].coords[1];
  
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
  
        const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY, r);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
        } 
      }
    }

function drawCircle(context, x, y, r, fillStyle, strokeStyle) { 
  context.fillStyle = fillStyle;
  context.strokeStyle = strokeStyle;
  context.arc(x, y, r, 0, Math.PI * 2);
  context.stroke();
  if (fillStyle) context.fill();
  context.closePath();
}
const drawVertex = obj => {
  for (let key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.font = '20px Times New Roman';
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.stroke();
  }
}

const drawNewVertex = obj => {
  for (let key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.font = '14px Times new Roman';
    ctx.strokeText(obj[key].num +'-' + obj[key].number, obj[key].coords[0], obj[key].coords[1]);
    ctx.stroke();
  }
}

makeCons(A, grafinfo);
drawLoops(loops, grafinfo,75, 100);
drawOrSimpleCons(grafinfo);
drawOrDoubleCons(grafinfo);

const list = [];
const BFS = (obj, n) => {
  list.push(n);
  const closed = [];
  const q = [n];
  while (q.length !== 0) {
    const curr = q.shift();
    const cons = obj[`vert${curr}`].simplecon.concat(obj[`vert${curr}`].doublecon);
    const compare = (a, b) => (obj[a].num < obj[b].num) ? -1 : 1;
    cons.sort(compare);
    for (let i = 0; i < cons.length; i++)  {
      const vert = obj[cons[i]].num;
      if (list.includes(vert) === false) {
        list.push(curr);
        q.push(vert);
        list.push(vert);
        closed.push(curr);
      }
    }
  }
};
BFS(grafinfo, 1); 

let c = 1;
for (let i = 0; i < list.length; i+=2) {
  grafinfo[`vert${list[i]}`].number = c;
  c++;
};
const iter = list[Symbol.iterator]();
let prev = 0;
const visited = [];

let numMatrix = [];
for(let i = 0; i < A.length; i++) {
  numMatrix[i] = [];
  for(let j = 0; j < A.length; j++) {
    numMatrix[i][j] = 0;
  }
}
for(let i = 0; i < A.length; i++) {
numMatrix[grafinfo[`vert${i+1}`].number - 1][grafinfo[`vert${i+1}`].num - 1] = 1;
}
ctx.font = '22px Times new Roman';
ctx.fillText('Renumbering matrix', 320, 660);
for (let i = 0; i < numMatrix.length; i++) {
  ctx.font = '22px Times new Roman';
  ctx.fillText(`${numMatrix[i]}`, 320, 660 + (i + 1) * 25);
}

const halt = () => {
  let currVal = iter.next().value;
  visited.forEach(x => {
    ctx.beginPath();
    drawCircle(ctx, grafinfo[`vert${x}`].coords[0], grafinfo[`vert${x}`].coords[1], r, '#0000FF', 'black');
    { //text
      ctx.font = '20px Times New Roman';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(grafinfo[`vert${x}`].number, grafinfo[`vert${x}`].coords[0], grafinfo[`vert${x}`].coords[1]);
      ctx.fillText(grafinfo[`vert${x}`].number, grafinfo[`vert${x}`].coords[0], grafinfo[`vert${x}`].coords[1]);
    }
  });
  const currVert = `vert${currVal}`;
  const prevVert = `vert${prev}`;
  ctx.beginPath();
  drawCircle(ctx, grafinfo[currVert].coords[0], grafinfo[currVert].coords[1], r, 'green', 'black');
  { //text
    ctx.font = '24px Times New Roman';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign =
     'center';
    ctx.strokeText(grafinfo[`vert${currVal}`].number, grafinfo[currVert].coords[0], grafinfo[currVert].coords[1]);
    ctx.fillText(grafinfo[`vert${currVal}`].number, grafinfo[currVert].coords[0], grafinfo[currVert].coords[1]);
  }
  if (prev) {
    ctx.beginPath();
    drawCircle(ctx, grafinfo[prevVert].coords[0], grafinfo[prevVert].coords[1], r, 'red', 'black');

    {
      ctx.font = '20px Times New Roman';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(grafinfo[`vert${prev}`].number, grafinfo[prevVert].coords[0], grafinfo[prevVert].coords[1]);
      ctx.fillText(grafinfo[`vert${prev}`].number, grafinfo[prevVert].coords[0], grafinfo[prevVert].coords[1]);
    }
  }
  visited.push(currVal);
  currVal = iter.next().value;
  prev = currVal;
};

const treeMatrix = [];
for (let i = 0; i < A.length; i++) {
  treeMatrix[i] = [];
  for (let j = 0; j < A.length; j++) {
    treeMatrix[i][j] = 0;
  }
}

let treeinfo = {};
for (let i = 1; i < list.length - 1; i += 2) {
  const curr = grafinfo[`vert${list[i]}`].num;
  const next = grafinfo[`vert${list[i + 1]}`].num;
  if (treeinfo[next] !== curr) {
    treeinfo[curr] = next;
    treeMatrix[curr - 1][next - 1] = 1;
  }
}

const treeMatrixPrint = [];
for (let i = 0; i < A.length; i++) {
  treeMatrixPrint[i] = [];
  for (let j = 0; j < A.length; j++) {
    treeMatrixPrint[i][j] = 0;
  }
}

let treeinfoPrint = {};
for (let i = 1; i < list.length - 1; i += 2) {
  const curr = grafinfo[`vert${list[i]}`].number;
  const next = grafinfo[`vert${list[i + 1]}`].number;
  if (treeinfoPrint[next] !== curr) {
    treeinfoPrint[curr] = next;
    treeMatrixPrint[curr - 1][next - 1] = 1;
  }
}


{
  const n = A.length;
  const x = 950;
  const y = 300;
  const r = 230;
  
  const alpha = 2 * Math.PI / n;

  let vertics = {};
  let i = 1;
  let c1 = 1;
  for (let angle = 0; i <= n; angle += alpha) {
    const newX = x + r * Math.cos(angle);
    const newY = y + r * Math.sin(angle);
    vertics[`vert${i}`] = {};
    vertics[`vert${i}`].coords = [];
    vertics[`vert${i}`].coords.push(newX);
    vertics[`vert${i}`].coords.push(newY);
    vertics[`vert${i}`].num = grafinfo[`vert${i}`].number;
    i++;
  }
  treeinfo = vertics;
}

const drawNewOrSimpleCons = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].simplecon.length; i++) {
      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].simplecon[i]}`].coords[0];
      const toY = obj[`${obj[key].simplecon[i]}`].coords[1];
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.strokeStyle = "black";
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(fromX, fromY, toX, toY, r);
        drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);  
      }
    }
  }
  ctx.fillText('Adjacency matrix of tree', 900, 660);
  for (let i = 0; i < treeMatrixPrint.length; i++) {
    ctx.font = '22px Times new Roman';
    ctx.fillText(`${treeMatrixPrint[i]}`, 900, 660 + (i + 1) * 25);
  }

makeCons(treeMatrix, treeinfo);
drawNewOrSimpleCons(treeinfo);
drawNewVertex(grafinfo);
drawVertex(treeinfo);

