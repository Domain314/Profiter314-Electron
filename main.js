const electron = require('electron');
const url = require('url');
const path = require('path');
const Overseer = require('./Profiter/Overseer');
const settings = require('electron-settings');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function() {
  // Create new main window
  mainWindow = new BrowserWindow({
    width: 1190,
    height: 800,
    webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
    }
  });
  // Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // mainWindow.webContents.openDevTools();

  // Quit app and all windows when closed
  mainWindow.on('closed', function() {
    app.quit();
  })

  ipcMain.on('settings:set', function(err, settings) {
    console.log("main.js (ipcMain)");
    Overseer.setConfig(settings);
  })

  // mainWindow.webContents.on('settings:set', function(err,settings) {
  //   console.log("main.js");
  //   Overseer.setConfig(settings);
  // })

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert Menu
  Menu.setApplicationMenu(mainMenu);

  // const Overseer = require('./Profiter/Overseer');
  Overseer.initialize();

  mainWindow.webContents.send('settings:get', JSON.stringify(settings.getSync()))

});

// Create menu template (Array of Objects, containing Arrays of Objects,...)
// "darwin" = Mac | "linux" | "win32"
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Initialize',
        accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
        click() {
          // createAddWindow();
          Overseer.initialize();
        }
      },
      {
        label: 'Simulate',
        accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
        click() {
          Overseer.simulate();
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      },
    ]
  }
];

// If Mac, add empty Object to menu (if not done, the first label will be named "electron" instead of "File")
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tool item, if not in prod
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.patform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
