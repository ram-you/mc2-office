'use strict'





const debounce = require("lodash/debounce");
var i18n = new(require('./i18n'))
const Store = require('electron-store');
const _store = new Store();

var connectedUserName = _store.get('user.username')
var windowWidth = _store.get('users.' + connectedUserName + '.window.width')
var windowHeight = _store.get('users.' + connectedUserName + '.window.height')
const theme = _store.get('users.' + connectedUserName + '.theme.theme') || _store.get('global.theme.theme');
const isDarkMode = theme == "dark";
const { app, protocol, BrowserWindow, Menu, shell, dialog, globalShortcut, ipcMain } = require('electron')
const fs = require('fs')
const fse = require('fs-extra');
const os = require('os')
const path = require('path')
// import { format as formatUrl } from 'url'
const formatUrl = require('url').format

const centerOnPrimaryDisplay = require('./helpers/center-on-primary-display');

let platform = os.platform()

const isDevelopment = process.env.NODE_ENV !== 'production'


let ASSETS_DIR = path.resolve(__dirname, '../common/assets')

global.ASSETS_GLOBAL = isDevelopment ? path.resolve(__dirname, '../common/assets') : path.join(__dirname, '/../../../assets');
global.ASSETS =global.ASSETS_GLOBAL 



global.mainWindow = null
global.dbWorkerWindow = null 
global.printWorkerWindow = null
global.pdfViewerWindow = null
global.invoiceData = { data: null }
global.showHiddenWindowsMenu = { show: false }

global.DB_VERSION = require('../../package.json').db_version

let userDataPath = ''

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })

function createMainWindow() {
  const winPOS = centerOnPrimaryDisplay(windowWidth || 1264, windowHeight || 700);
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  mainWindow = new BrowserWindow({
    title: i18n.__('MEDIACEPT Office'),
    useContentSize: true,
    width: windowWidth || 1264,
    height: windowHeight || 700,
    minWidth: 500,
    minHeight: 350,
    x: winPOS.x,
    y: winPOS.y,
    backgroundColor: isDarkMode ? '#303030' : '#fff',
    show: false,
    icon: ASSETS_DIR + '/icons/64x64.png',
    webPreferences: { plugins: true }

  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()

    if (!isDevelopment && process.argv.indexOf('--debug') !== -1) {
      mainWindow.webContents.openDevTools()
    }
  })

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:9080`)
    if (!process.env.IS_TEST) { mainWindow.webContents.openDevTools() }
    globalShortcut.register('f5', function() { mainWindow.reload() })
  } else {
    mainWindow.loadURL(formatUrl({ pathname: path.join(__dirname, 'index.html'), protocol: 'file', slashes: true }))
    if (platform === 'linux' || platform === 'win32') {
      globalShortcut.register('Control+Shift+R', () => {
        mainWindow.webContents.openDevTools()
      })
      globalShortcut.register('f5', function() {
        mainWindow.reload()
      })
    }
  }

  mainWindow.on('closed', () => { app.quit() })

  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.focus()
    setImmediate(() => { mainWindow.focus() })
  })

  mainWindow.on('resize', debounce(function(e) {
    e.preventDefault();
    onWindowResize();
  }, 100));
  mainWindow.on('hide', () => {
    dbWorkerWindow.hide();
    printWorkerWindow.hide();
  })
  require('./menu').init(mainWindow)
  require('./traymenu').init(mainWindow)



  return mainWindow
}
 
// create main BrowserWindow when electron is ready
app.on('ready', async () => {    
  dbWorkerWindow = createDataBaseWorkerWindow();
  mainWindow = createMainWindow();
  printWorkerWindow = createPrintWorkerWindow(); 
  userDataPath = app.getPath('userData') + path.sep;
})


// =====================DATABASE================DATABASE==========DATABASE==================
function createDataBaseWorkerWindow() {
  dbWorkerWindow = new BrowserWindow({
    title: "Database",
    parent: mainWindow,
    modal: true,
    show: false,
    icon: ASSETS_DIR + '/icons/64x64.png',
  });
  var dbWorkerPathname = ASSETS_GLOBAL + '/database/worker.html';
  dbWorkerWindow.loadURL(formatUrl({ pathname: dbWorkerPathname, protocol: 'file', slashes: true }));
  dbWorkerWindow.setMenu(null)
  dbWorkerWindow.webContents.openDevTools();
  dbWorkerWindow.on('close', (e) => {
    if (mainWindow && (mainWindow.isMinimized() || mainWindow.isVisible() || !mainWindow.isVisible())) {
      e.preventDefault();
      dbWorkerWindow.hide();
    }
  });
  return dbWorkerWindow;
}
// =====================~~~~~~~============================================~~~~~~~===========


app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})


function makeSingleInstance() {
  if (process.mas) return false

  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
        mainWindow.show();
        mainWindow.restore();
      }
      mainWindow.focus()
    }
  })
}


function onWindowResize(event) {
  var connectedUserName = _store.get('user.username')
  if (connectedUserName) {
    var b = mainWindow.getBounds()
    _store.set('users.' + connectedUserName + '.window.width', b.width);
    _store.set('users.' + connectedUserName + '.window.height', b.height);
  }
}

ipcMain.on('update-window-size', (event) => {
  var connectedUserName = _store.get('user.username')
  var windowWidth = _store.get('users.' + connectedUserName + '.window.width')
  var windowHeight = _store.get('users.' + connectedUserName + '.window.height')
  if (windowWidth && windowHeight) { mainWindow.setSize(windowWidth, windowHeight) }
})

function createPdfViewerWindow(file) {
  pdfViewerWindow = new BrowserWindow({
    title: "PDF Viewer",
    // parent: mainWindow, modal: true,
    show: false,
    icon: ASSETS_DIR + '/icons/pdf.png',
    webPreferences: { plugins: true, },
    icon: ASSETS_DIR + '/icons/64x64.png',
  });
  pdfViewerWindow.setMenu(null)
  pdfViewerWindow.loadURL(formatUrl({ pathname: file, protocol: 'file', slashes: true }))
  pdfViewerWindow.on('ready-to-show', () => {
    pdfViewerWindow.show();
    pdfViewerWindow.focus();
  })
  return pdfViewerWindow;
}

function createPrintWorkerWindow() {
  printWorkerWindow = new BrowserWindow({ title: "Print Worker", width: 860, show: false, icon: ASSETS_DIR + '/icons/64x64.png', });
  var printWorkerPathname = ASSETS_GLOBAL + '/billing/worker.html';
  printWorkerWindow.loadURL(formatUrl({ pathname: printWorkerPathname, protocol: 'file', slashes: true }));
  printWorkerWindow.setMenu(null);
  printWorkerWindow.webContents.openDevTools();
  printWorkerWindow.on('close', (e) => {
    if (mainWindow && (mainWindow.isMinimized() || mainWindow.isVisible() || !mainWindow.isVisible())) {
      e.preventDefault();
      printWorkerWindow.hide();
    }
  });
  return printWorkerWindow;
}

ipcMain.on("printPDF", (event, content, theme, silent = false) => {
  printWorkerWindow.webContents.send("printPDF", content, theme, silent);
});



ipcMain.on("print", (event, ID, content, theme, printer) => {
  printWorkerWindow.webContents.send("print", ID, content, theme, printer);
});


const invoiceFontBytes = fs.readFileSync(ASSETS_GLOBAL + '/billing/theme/default/SourceSansPro-Regular.ttf');
const PURPLE = [119 / 255, 41 / 255, 83 / 255];
const ORANGE = [224 / 255, 90 / 255, 43 / 255];
const GREY = [117 / 255, 117 / 255, 117 / 255];
const INVOICE_FONT = 'InvoiceFont';

const { PDFDocumentFactory, PDFDocumentWriter, drawText } = require('pdf-lib');

ipcMain.on("readyToPrintPDF", (event, ID, silent = false) => {
  let pdfPathFolder = userDataPath + 'billing' + path.sep + 'invoices' + path.sep
  fse.ensureDirSync(pdfPathFolder)
  const pdfPath = pdfPathFolder + 'invoice-' + ID + '.pdf';

  const printOptions = {
    pageSize: 'A4',
    marginsType: 0,
    printBackground: true,
    printSelectionOnly: false,
    landscape: false
  }
  printWorkerWindow.webContents.printToPDF(printOptions, function(error, data) {
    if (error) throw error;



    const pdfDoc = PDFDocumentFactory.load(data);

    const [invoiceFontRef] = pdfDoc.embedFont(invoiceFontBytes);
    const pages = pdfDoc.getPages();

    for (var i = 0; i < pages.length; i++) {
      const currentPage = pages[i].addFontDictionary(INVOICE_FONT, invoiceFontRef);
      const PAGE_WIDTH = (currentPage.get('MediaBox').array[2]).number;
      const PAGE_HEIGHT = (currentPage.get('MediaBox').array[3]).number;
      var contentStream1 = pdfDoc.createContentStream(
        drawText(
          'Page: ' + (i + 1).toString() + '/' + (pages.length).toString(), { x: 34, y: 31, size: 8, font: INVOICE_FONT, colorRgb: GREY, },
        ),
      );
      currentPage.addContentStreams(pdfDoc.register(contentStream1));
    }

    const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);


    if (silent) {
      mainWindow.send('data-pdf', pdfBytes);
    } else {
      try {
        fs.writeFileSync(pdfPath, pdfBytes);
        // shell.openItem(pdfPath)
        pdfViewerWindow = createPdfViewerWindow(pdfPath)
        mainWindow.send('wrote-pdf', pdfPath)
      } catch (error) {
        console.log(error)
      }
    }
  })




})





ipcMain.on("readyToPrint", (event, ID, printer) => {
  const printOptions = {
    deviceName: printer,
    pageSize: 'A4',
    marginsType: 2,
    printBackground: true,
    printSelectionOnly: false,
    landscape: false
  }
  printWorkerWindow.webContents.print(printOptions, function(success) {
    if (success) { console.log('invoice-' + ID, "...printed.") } else {
      console.log('invoice-' + ID, "...NOT PRINTED")
    }
  })
});