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
const maxWidth = 2000;
const minHeight = 400;
const maxHeight = 1200;

const nextObsColor = 'ff00ff';
const mogColor = '0000ff';
const onDColor = 'ffff00';
const onDTimeout = 4000;
const noYTimeout = 7000;

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

function findSpot(seekColor, nexti, nextj) {
  let screenImage = robotjs.screen.capture();
  const multiX = screenImage.width / width;
  const multiY = screenImage.height / height;
  
  if (nexti && nextj) {
    const starti = nexti - 300;
    const startj = nextj - 300;

    for (let i = starti; i < starti + 500; i += getRandomInt(25, 150)) {
      for (let j = startj; j < startj + 500; j += getRandomInt(25, 150)) {
        color = getColor(i, j, screenImage, multiX, multiY);

        if (color === mogColor || color === seekColor) {
          console.log('used yellow shortcut!');
          return [i, j];
        }
      }
    }
  }

  for (let i = minWidth; i < maxWidth; i += getRandomInt(25, 150)) {
    for (let j = minHeight; j < maxHeight; j += getRandomInt(25, 150)) {
      color = getColor(i, j, screenImage, multiX, multiY);

      if (color === mogColor || color === seekColor) {
        return [i, j];
      }
    }
  }

  return [-1, -1];
}

async function runLoop() {
  let nexti;
  let nextj;

  while (true) {
    const startTime = new Date().getTime()
    console.log('seeking purp', nexti, nextj);
    const coords = findSpot(nextObsColor, nexti, nextj);
    let i = coords[0];
    let j = coords[1];

    // console.log(i, j)
    if (i > 0 && j > 0) {
      const clickX = i;
      const clickY = j;

      robotjs.moveMouse(clickX, clickY);
      await sleep(getRandomInt(75, 100));
      robotjs.mouseClick();

      while (true) {
        const endTime = new Date().getTime()
        const durationMilli = endTime - startTime;

        console.log('seeking no yellow')

        const nextCoords = findSpot(onDColor);
        possibleOnDi = nextCoords[0];
        possibleOnDj = nextCoords[1];

        if (durationMilli > noYTimeout || possibleOnDi != -1) {
          console.log('breaking yellow no search')
          break;
        }
      }

      while(true) {
        const endTime = new Date().getTime()
        const durationMilli = endTime - startTime;

        console.log('seeking yellow')
        
        const nextCoords = findSpot(onDColor);
        possibleOnDi = nextCoords[0];
        possibleOnDj = nextCoords[1];
        console.log('next coords?', nextCoords)

        if (possibleOnDi > 0) {
          nexti = possibleOnDi;
          nextj = possibleOnDj;
          console.log('set next yellow coords', nexti, nextj)
        }

        if (durationMilli > onDTimeout || possibleOnDi == -1) {
          console.log('breaking yellow search')
          break;
        }
      }

      await sleep(getRandomInt(25, 100));
    }
  }
}

app.on('ready', runLoop);

// powerMonitor.on('resume', runLoop);
// powerMonitor.on('unlock-screen', runLoop);

// app.on('before-quit', writeBlanks);
// powerMonitor.on('shutdown', writeBlanks);
// powerMonitor.on('suspend', writeBlanks);
