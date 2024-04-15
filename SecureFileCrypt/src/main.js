const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      sandbox: false,
      worldSafeExecuteJavaScript: true,
      webSecurity: false, // Disable web security for local resource loading
    },
  });

  mainWindow.loadFile('index.html');
  // Use this line to load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'index.html')).catch((error) => {
    console.error(error);
  });

  mainWindow.on('closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
    contextIsolation: false,
  },
});

