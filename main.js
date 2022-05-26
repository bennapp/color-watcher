const { app, powerMonitor } = require('electron')
const path = require('path')
const robotjs = require('robotjs')
const ipc = require("electron").ipcMain;

var nodeConsole = require('console');
var console = new nodeConsole.Console(process.stdout, process.stderr);

app.allowRendererProcessReuse = false;

const screenSize = robotjs.getScreenSize();
const width = screenSize.width;
const height = screenSize.height;
const minWidth = 700;
const maxWidth = 1900;
const minHeight = 400;
const maxHeight = 1200;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getColor(x, y, screenImage, multiX, multiY) {
  const color = screenImage.colorAt(x * multiX, y * multiY);

  return color;
}

function findGreenSquare() {
  let screenImage = robotjs.screen.capture();
  const multiX = screenImage.width / width;
  const multiY = screenImage.height / height;

  for (let i = minWidth; i < maxWidth; i += getRandomInt(25, 150)) {
    for (let j = minHeight; j < maxHeight; j += getRandomInt(25, 150)) {
      color = getColor(i, j, screenImage, multiX, multiY);

      // blue == mark of grace
      if (color === '0000ff') {
        return [i, j];
      }

      // purple == next obs
      // TODO figure out falling off
      if (color === 'ff00ff') {
        return [i, j];
      }
    }
  }

  return [-1, -1];
}

async function runLoop() {
  while (true) {
    const startTime = new Date().getTime()
    const coords = findGreenSquare();
    let i = coords[0];
    let j = coords[1];

    // console.log(i, j)
    if (i > 0 && j > 0) {
      const clickX = i;
      const clickY = j;

      robotjs.moveMouse(clickX, clickY);
      await sleep(getRandomInt(75, 100));
      robotjs.mouseClick();

      const endTime = new Date().getTime()
      const durationMilli = endTime - startTime;

      console.log(durationMilli)

      const waitTime = 6740;
      const maxRunTime = 6610;
      const timeDiff = waitTime - durationMilli;
      const sleepTime = timeDiff > maxRunTime ? timeDiff : maxRunTime;

      await sleep(sleepTime + getRandomInt(0, 1000));
    }
  }
}

app.on('ready', runLoop);

// powerMonitor.on('resume', runLoop);
// powerMonitor.on('unlock-screen', runLoop);

// app.on('before-quit', writeBlanks);
// powerMonitor.on('shutdown', writeBlanks);
// powerMonitor.on('suspend', writeBlanks);
