const { app, BrowserWindow } = require('electron')
const { dialog } = require('electron')
const url = require('url');
const path = require('path');
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1020,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadURL(url.format({
    pathname : path.join(__dirname,'index.html'),
    protocol : 'file:'
  }));
  
    // console.log(dialog.showOpenDialog({ properties: ['openFile'] }))
}

app.on('ready', createWindow)