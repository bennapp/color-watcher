const { app, BrowserWindow } = require('electron')
const path = require('path')
const robotjs = require('robotjs')
const ipc = require("electron").ipcMain;
const SerialPort = require('serialport');

app.allowRendererProcessReuse = false;

var serialPort = new SerialPort('COM4', { baudRate: 9600 });
let portIsOpen = false;
let busy = false;

serialPort.on("open", function () {
  portIsOpen = true;
});

serialPort.on('data', function (d) {
  const data = String(d)
  if (data === "FREE") {
    busy = false;
  }
  console.log('Data:', data)
})

const ledDimensions = [22, 37];
const numRows = ledDimensions[0];
const numCols = ledDimensions[1];

function toHex(num) {
  return parseInt(num).toString(16);
}

function rgbFromHex(color) {
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  return [r, g, b]
};

function getColorAverage(x, y) {
  const color1 = robotjs.getPixelColor(x - 25, y - 25);
  const color2 = robotjs.getPixelColor(x + 25, y - 25);
  const color3 = robotjs.getPixelColor(x, y);
  const color4 = robotjs.getPixelColor(x - 25, y  + 25);
  const color5 = robotjs.getPixelColor(x + 25, y + 25);
  const arrayOfColors = [color1, color2, color3, color4, color5];

  // return colorAverage(arrayOfColors)
  return color3;
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

async function poll() {
  await sleep(1000);

  const screenSize = robotjs.getScreenSize();
  const width = screenSize.width;
  const height = screenSize.height;

  const heightSize = height / numRows
  const widthSize = width / numCols

  let ledData, x, y;
  while(true) {
    ledData = []

    // do right side from bottom to top
    x = width - 100;
    y = height - 100;
    const rightSideData = [...Array(numRows - 1)].map(() => {
      const color = getColorAverage(x, y)
      y -= heightSize;
      return color;
    });
    ledData = ledData.concat(rightSideData)

    // do top from right to left
    x = width - 100;
    y = 100;
    const topData = [...Array(numCols - 1)].map(() => {
      const color = getColorAverage(x, y)
      x -= widthSize;
      return color;
    });
    ledData = ledData.concat(topData)

    // do left from top to bottom
    x = 100;
    y = 100;
    const leftSideData = [...Array(numRows - 1)].map(() => {
      const color = getColorAverage(x, y)
      y += heightSize;
      return color;
    });
    ledData = ledData.concat(leftSideData)
    
    if (portIsOpen) {
      while(busy){
        console.log('waiting')
        await sleep(20);
      }
      serialPort.write(ledData.join(''));
      busy = true;
    }
  };
}

poll();

// ipc.on('poll');

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ipc.on('start', event => {
//   event.sender.send('screenSize', numRows, numCols);
// })


// function createWindow () {
  // Create the browser window.
  // const mainWindow = new BrowserWindow({
  //   width: 1200,
  //   height: 800,
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'),
  //     nodeIntegration: true,
  //     contextIsolation: false,
  //   }
  // })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
  // createWindow()

  // app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // })
// })