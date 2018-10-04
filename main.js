 const { app, BrowserWindow } = require('electron');
 const isDevelopment = process.env.NODE_ENV !== 'production';

 let mainWindow

 function createWindow() {
   mainWindow = new BrowserWindow({
     title: 'MEDIACEPT Office 2',
     useContentSize: true,
     width: 1264,
     height: 700,
     minWidth: 500,
     minHeight: 350,
     backgroundColor: '#303030',
     show: false,
     webPreferences: { plugins: true, nodeIntegration: false }

   })

   //  mainWindow.loadFile('index.html');
   mainWindow.loadURL(`http://192.168.100.200:8080`);
   mainWindow.setMenu(null)

   mainWindow.on('closed', function() {
     mainWindow = null
   });

   mainWindow.once('ready-to-show', () => {
     mainWindow.show()
     mainWindow.focus()
     if (!isDevelopment && process.argv.indexOf('--debug') !== -1) {
       mainWindow.webContents.openDevTools()
     }
   })

 }

 app.on('ready', createWindow)

 app.on('window-all-closed', function() {
   if (process.platform !== 'darwin') {
     app.quit()
   }
 })

 app.on('activate', function() {
   if (mainWindow === null) {
     createWindow()
   }
 })