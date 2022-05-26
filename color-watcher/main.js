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

  for (let i = 0; i < width; i += (150 + getRandomInt(0, 50))) {
    for (let j = 0; j < height; j += (150 + getRandomInt(0, 60))) {

      const startTime = new Date().getTime()
      color = getColor(i, j, screenImage, multiX, multiY);
      const endTime = new Date().getTime()
      console.log(startTime - endTime);
      

      // purple?
      if (color === 'ff00ff') {
        // nextOver = getColor(i + 10, j + 10, screenImage, multiX, multiY);
        // if (nextOver === 'ff00ff') {
        return [i, j];
        // }
      }
    }
  }

  return [-1, -1];
}

async function runLoop() {
  while(true) {
    // const startTime = new Date().getTime()
    console.log('wahat?')
    const coords = findGreenSquare();
    let i = coords[0];
    let j = coords[1];

    console.log(i, j)
    if (i > 0 && j > 0) {
      const clickX = i + getRandomInt(0, 10);
      const clickY = j + getRandomInt(0, 10);

      robotjs.moveMouse(clickX, clickY);
      robotjs.mouseClick();

      // const endTime = new Date().getTime()
      // const durationMilli = endTime - startTime;
      // const waitTime = 6740;
      // const maxRunTime = 6610;
      // const timeDiff = waitTime - durationMilli;
      // const sleepTime = timeDiff > maxRunTime ? timeDiff : maxRunTime;
      // console.log(sleepTime);

      // await sleep(sleepTime + getRandomInt(0, 1000));
    }
  }
}

app.on('ready', runLoop);

// powerMonitor.on('resume', runLoop);
// powerMonitor.on('unlock-screen', runLoop);

// app.on('before-quit', writeBlanks);
// powerMonitor.on('shutdown', writeBlanks);
// powerMonitor.on('suspend', writeBlanks);
