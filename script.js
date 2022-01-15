const ipc = require("electron").ipcRenderer;

ipc.send('start')

ipc.on('screenSize', (event, msg, size) => {
  const width = msg.width;
  const height = msg.height;
  const numRows = parseInt(width / size) - 1;
  const numCols = parseInt(height / size) - 1;

  const grid = document.getElementById('grid');

  [...Array(numCols)].forEach((_, numCol) => {
    const row = document.createElement('div');
    row.setAttribute('class', 'row');
    grid.append(row);

    [...Array(numRows)].forEach((_, numRow) => {
      const color = document.createElement('div');
      color.setAttribute('class', 'color')
      color.setAttribute('id', `${numCol}:${numRow}`);
      row.append(color);
    })
  })

  setInterval(() => {
    ipc.send('poll');
  }, 1000)
});

// ipc.on('img', (event, msg) => {
//   const img = document.getElementById('img');
//   console.log(msg)
//   img.src = URL.createObjectURL(
//     new Blob([msg.buffer], { type: 'image/png' } /* (1) */)
//   );
// });

ipc.on('color', (event, msg) => {
  const msgSplit = msg.split(':')
  const x = msgSplit[0]
  const y = msgSplit[1]
  const color = msgSplit[2];

  const colorEl = document.getElementById(`${x}:${y}`);
  colorEl.style.backgroundColor = "#" + color
});
