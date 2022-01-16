const ipc = require("electron").ipcRenderer;

ipc.send('start')

ipc.on('screenSize', (event, numRows, numCols) => {
  const grid = document.getElementById('grid');
  const row = document.createElement('div');
  row.setAttribute('class', 'row');
  grid.append(row);

  [...Array(numCols + numRows + numRows - 2)].forEach((_, i) => {
    const color = document.createElement('div');
    color.setAttribute('class', 'color')
    color.setAttribute('id', i);
    row.append(color);
  })

  ipc.send('poll');
});

ipc.on('color', (event, colorData) => {
  colorData.reverse().map((color, i) => {
    const colorEl = document.getElementById(i);
    colorEl.style.backgroundColor = "#" + color;
  })
});
