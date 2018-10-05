const { Menu, Tray, ipcMain } = require('electron')
const electron = require('electron')
const app = electron.app
var i18n = new(require('./i18n'))
const os = require('os')
const path = require('path')
var i18n = new(require('./i18n'))
const isDevelopment = process.env.NODE_ENV !== 'production'
let platform = os.platform()

let tray = null
let mainWindow

let assetsFolder = isDevelopment ? '../common/assets/' : '/../../../assets/'

function init(window) {
  mainWindow = window
  tray = createTray()
}

 

 
// ====================================== TRAY ====================
const createTray = () => {
  let linuxIco = assetsFolder + 'icons/16x16.png'
  let winIco = assetsFolder + 'icons/16x16_win.png'

  const iconName = platform === 'win32' ? winIco : linuxIco
  const iconPath = path.join(__dirname, iconName)


  tray = new Tray(path.join(iconPath))
  tray.on('click', toggleApp)
  const contextMenu =Menu.buildFromTemplate([
    {icon: path.join(__dirname, assetsFolder + 'icons/menu/blind.png'),label: 'MEDIACEPT Office',enabled:false},
    { type: 'separator' },
    { icon: path.join(__dirname, assetsFolder + 'icons/menu/angle-up.png'), label: 'Show', click: showApp, },
    { icon: path.join(__dirname, assetsFolder + 'icons/menu/angle-down.png'), label: 'Hide', click: hideApp, },
    { type: 'separator' },
    { icon: path.join(__dirname, assetsFolder + 'icons/menu/info-circle.png'), label: 'About', click: () => require('electron').shell.openExternal('http://mediacept.com'), },
    { type: 'separator' },
    { icon: path.join(__dirname, assetsFolder + 'icons/menu/power-off.png'), label: 'Quit', click:quitApp },
  ])

  tray.setToolTip("MEDIACEPT Office");
  tray.setContextMenu(contextMenu);
  return tray
}

const toggleApp = () => {

  if(!mainWindow.isMinimized() && !mainWindow.isFocused() && mainWindow.isVisible()){
    mainWindow.focus(); 
    return false
  }
  if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
    mainWindow.show();
    mainWindow.restore();
    mainWindow.focus(); 
  } else {
    mainWindow.hide(); 
  }
}

const showApp = () => {
  if(!mainWindow.isMinimized() && !mainWindow.isFocused() && mainWindow.isVisible()){
    mainWindow.focus(); 
    return false
  }
  if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
    mainWindow.show();
    mainWindow.restore();
    mainWindow.focus();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

function hideApp() {
  if (mainWindow) {
    mainWindow.hide();
  }
}

function quitApp() {
  app.quit();
}




module.exports.init = init;