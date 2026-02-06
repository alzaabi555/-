const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

// Increase memory limit for the V8 engine (Chromium) to handle large IndexedDB operations
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=8192');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Determine icon path based on environment
  // In production (dist), assets are in the same folder structure relative to the resource path
  const iconPath = process.env.ELECTRON_START_URL 
    ? path.join(__dirname, '../public/favicon.ico') 
    : path.join(__dirname, '../dist/favicon.ico');

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    title: "لجنة شؤون الطلاب",
    icon: iconPath, // Set the window icon here
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allows using some node features if needed
      webSecurity: false // sometimes needed for local file loading in dev
    },
    autoHideMenuBar: true, // Hide the ugly top menu
  });

  // In production, load the built html file
  // In development, load the vite server
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;

  if (process.env.ELECTRON_START_URL) {
      mainWindow.loadURL(startUrl);
      mainWindow.webContents.openDevTools();
  } else {
      mainWindow.loadURL(startUrl);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});