const { app, BrowserWindow, ipcMain, clipboard, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  const assetsPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, 'assets');

  const icoPath = path.join(assetsPath, 'zorro.ico');
  const pngPath = path.join(assetsPath, 'zorro.png');

  let appIcon;
  if (fs.existsSync(icoPath)) appIcon = nativeImage.createFromPath(icoPath);
  else if (fs.existsSync(pngPath)) appIcon = nativeImage.createFromPath(pngPath);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 950,
    minHeight: 650,
    frame: false,
    backgroundColor: '#0f0a06',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: appIcon || undefined,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

// Window controls
ipcMain.handle('window:minimize', () => mainWindow.minimize());
ipcMain.handle('window:maximize', () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  return mainWindow.isMaximized();
});
ipcMain.handle('window:close', () => mainWindow.close());

// Clipboard
ipcMain.handle('clipboard:copy', (event, text) => {
  clipboard.writeText(text);
  return true;
});

// Logo
ipcMain.handle('app:getLogo', () => {
  const assetsDir = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, 'assets');
  const pngPath = path.join(assetsDir, 'zorro.png');
  try {
    const raw = fs.readFileSync(pngPath);
    return `data:image/png;base64,${raw.toString('base64')}`;
  } catch (e) { return null; }
});