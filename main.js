// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const robotjs = require('robotjs')
const ipc = require("electron").ipcMain;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 2000,
    height: 1400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

const size = 100;

ipc.on('start', event => {
  const screenSize = robotjs.getScreenSize();
  event.sender.send('screenSize', screenSize, size);
})

function toHex(num) {
  return parseInt(num).toString(16);
}

function colorAverage(arrayOfColors) {
  const avgRed = arrayOfColors.reduce((sum, hexString) => { return sum + parseInt(hexString.substring(0, 2), 16) }, 0) / arrayOfColors.length
  const avgGreen = arrayOfColors.reduce((sum, hexString) => { return sum + parseInt(hexString.substring(2, 4), 16) }, 0) / arrayOfColors.length
  const avgBlue = arrayOfColors.reduce((sum, hexString) => { return sum + parseInt(hexString.substring(4, 6), 16) }, 0) / arrayOfColors.length

  const avgColorHex = `${toHex(avgRed)}${toHex(avgGreen)}${toHex(avgBlue)}`

  return avgColorHex;
}

ipc.on('poll', event => {
  const screenSize = robotjs.getScreenSize();
  const width = screenSize.width;
  const height = screenSize.height;
  const numRows = parseInt(width / size) - 1;
  const numCols = parseInt(height / size) - 1;

  [...Array(numCols)].forEach((_, numCol) => {
    [...Array(numRows)].forEach((_, numRow) => {
      const x = (numCol * size);
      const y = (numRow * size);

      console.log(x, y)
      const color = robotjs.getPixelColor(y, x)
      console.log(color)
      event.sender.send('color', `${numCol}:${numRow}:${color}`)

      // const img = robotjs.screen.capture(y, x, size, size);
      // const multi = img.width / size;
      // const color1 = img.colorAt(parseInt((size * 0.25)) * multi, parseInt((size * 0.25)) * multi);
      // const color2 = img.colorAt(parseInt((size * 0.25)) * multi, parseInt((size * 0.75)) * multi);
      // const color3 = img.colorAt(parseInt((size * 0.50)) * multi, parseInt((size * 0.50)) * multi);
      // const color4 = img.colorAt(parseInt((size * 0.75)) * multi, parseInt((size * 0.25)) * multi);
      // const color5 = img.colorAt(parseInt((size * 0.75)) * multi, parseInt((size * 0.75)) * multi);
      // const color = colorAverage([color1, color2, color3, color4, color5]);
      // console.log([color1, color2, color3, color4, color5])

      event.sender.send('color', `${numCol}:${numRow}:${color}`)
    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
