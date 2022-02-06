const { app, powerMonitor } = require('electron')
const path = require('path')
const robotjs = require('robotjs')
const ipc = require("electron").ipcMain;
const SerialPort = require('serialport');

app.allowRendererProcessReuse = false;

let serialPort;
const ledDimensions = [23, 37];
const numRows = ledDimensions[0];
const numCols = ledDimensions[1];
const screenSize = robotjs.getScreenSize();
const width = screenSize.width;
const height = screenSize.height;

const heightSize = height / numRows
const widthSize = width / numCols

function toHex(num) {
  return parseInt(num).toString(16).padStart(2, '0');
}

function rgbFromHex(color) {
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  return [r, g, b]
};

function getColorAverage(x, y, screenImage, multiX, multiY) {
  const color = screenImage.colorAt(x * multiX, y * multiY);

  // const color1 = robotjs.getPixelColor(x - 25, y - 25);
  // const color2 = robotjs.getPixelColor(x + 25, y - 25);
  // const color3 = robotjs.getPixelColor(x, y);
  // const color4 = robotjs.getPixelColor(x - 25, y  + 25);
  // const color5 = robotjs.getPixelColor(x + 25, y + 25);
  // const arrayOfColors = [color1, color2, color3, color4, color5];

  // return colorAverage(arrayOfColors)
  return color;
}

function colorAverage(arrayOfColors) {
  const avgRed = arrayOfColors.reduce((sum, hexString) => { return sum + parseInt(hexString.substring(0, 2), 16) }, 0) / arrayOfColors.length
  const avgGreen = arrayOfColors.reduce((sum, hexString) => { return sum + parseInt(hexString.substring(2, 4), 16) }, 0) / arrayOfColors.length
  const avgBlue = arrayOfColors.reduce((sum, hexString) => { return sum + parseInt(hexString.substring(4, 6), 16) }, 0) / arrayOfColors.length

  const avgColorHex = `${toHex(avgRed)}${toHex(avgGreen)}${toHex(avgBlue)}`

  return avgColorHex;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function writeBlanks() {
  let x, y;

  // do right side from bottom to top
  x = width - 100;
  y = height - 100;
  for (let i = 0; i < (numRows - 1); i++) {
    const index = i;
    writeData('000000', toHex(index));
    await sleep(1);
    y -= heightSize;
  }

  // do top from right to left
  x = width - 100;
  y = 100;
  for (let i = 0; i < (numCols - 1); i++) {
    const index = i + numRows - 1;
    writeData('000000', toHex(index));
    await sleep(1);
    x -= widthSize;
  }

  // do left from top to bottom
  x = 100;
  y = 100;
  for (let i = 0; i < (numRows - 1); i++) {
    const index = i + numRows - 2 + numCols;
    writeData('000000', toHex(index));
    await sleep(1);
    y += heightSize;
  }
}

async function readRandomData() {
  let screenImage = robotjs.screen.capture();
  const multiX = screenImage.width / width;
  const multiY = screenImage.height / height;
  let x, y;
  let sampleSpace = []

  // do right side from bottom to top
  x = width - 100;
  y = height - 100;
  for (let i = 0; i < (numRows - 1); i++) {
    const index = i;
    sampleSpace[index] = [x, y];
    y -= heightSize;
  }

  // do top from right to left
  x = width - 100;
  y = 100;
  for (let i = 0; i < (numCols - 1); i++) {
    const index = i + numRows - 1;
    sampleSpace[index] = [x, y];
    x -= widthSize;
  }

  // do left from top to bottom
  x = 100;
  y = 100;
  for (let i = 0; i < (numRows - 1); i++) {
    const index = i + numRows - 2 + numCols;
    sampleSpace[index] = [x, y];
    y += heightSize;
  }

  let indexToVisit = [...Array(sampleSpace.length)].map((_, i) => i)

  while(true) {
    const rand = Math.random()*indexToVisit.length;
    const randIndex = Math.floor(rand);
    const index = indexToVisit[randIndex];
    indexToVisit.splice(randIndex, 1);
    
    const coord = sampleSpace[index];
    x = coord[0];
    y = coord[1];
    const color = screenImage.colorAt(x * multiX, y * multiY);
    writeData(color, toHex(index));
    await sleep(1);
    
    if (indexToVisit.length == 0) {
      screenImage = robotjs.screen.capture();
      indexToVisit = [...Array(sampleSpace.length)].map((_, i) => i)
    }
  }
}

function writeData(color, index) {
  serialPort.write(color + index);
}

async function readSerialPort() {
  while(true) {
    try {
      await readRandomData();
    } catch (error) {
      console.error(error);
    }
    await sleep(3000);
  }
}

function initializeSerialPort() {
  serialPort = new SerialPort('COM5', { baudRate: 9600 });
  
  serialPort.on("open", readSerialPort);

  serialPort.on('data', function (d) {
    const data = String(d)
    console.log('Data:', data)
  })
}

app.on('ready', initializeSerialPort);

powerMonitor.on('resume', readSerialPort);
powerMonitor.on('unlock-screen', readSerialPort);

app.on('before-quit', writeBlanks);
powerMonitor.on('shutdown', writeBlanks);
powerMonitor.on('suspend', writeBlanks);
