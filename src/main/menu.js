 // Get mainWindow Object 
 let mainWindow

 const path = require('path')
 const { Menu, ipcMain } = require('electron')
 const electron = require('electron')
 const app = electron.app
 var i18n = new(require('./i18n'))
 const isDevelopment = process.env.NODE_ENV !== 'production'
 let ASSETS = global.ASSETS + '/' // isDevelopment ? '../common/assets/' : '/../../../assets/'

 function init(window) {
   mainWindow = global.mainWindow;
   const fileMenu = {
     label: i18n.__('File'),
     submenu: [{
         label: i18n.__('Home'),
         icon: (ASSETS + 'icons/menu/home.png'),
         accelerator: 'CmdOrCtrl+H',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'home');
         },
       },
       { type: 'separator' },
       {
         label: i18n.__('Restart'), 
         click() {
           app.relaunch();
           app.quit(0);
         }

       },
       { type: 'separator' },
       {
         label: i18n.__('Close'),
         icon: (ASSETS + 'icons/menu/power-off.png'),
         role: 'close',

       }

     ],
   };

   const viewHiddenWindowsMenu = {
     label: i18n.__('Dev tools'),
     enabled: global.showHiddenWindowsMenu["show"],
     submenu: [{
         label: 'Print Window',
         icon: (ASSETS + 'icons/menu/file-invoice.png'),
         click() {
           var win = global.printWorkerWindow
           win.show();
           win.restore();
           win.focus();
         },
       },

       {
         label: 'Database Window',
         icon: (ASSETS + 'icons/menu/database.png'),
         click() {
           var win = global.dbWorkerWindow
           win.show();
           win.restore();
           win.focus();
         },
       },
       {
         label: i18n.__('Close all'),
         icon: (ASSETS + 'icons/menu/eye-slash.png'),
         click() {
           global.dbWorkerWindow.hide();
           global.printWorkerWindow.hide();
         },
       },
       { type: 'separator' },
       {
         label: 'Database Administration',
         icon: (ASSETS + 'icons/menu/database.png'),
         click() {
           mainWindow.webContents.send('menu-change-tab', 'database');
         },
       },
       { type: 'separator' },
       { label: i18n.__('Reload'), role: 'forcereload' },
       { label: i18n.__('Toggle fullscreen'), role: 'togglefullscreen' },
       { type: 'separator' },
       { role: 'toggledevtools' },

     ]
   };

   const invoiceMenu = {
     label: i18n.__('Invoice'),
     submenu: [{
         label: i18n.__('New'),
         accelerator: 'CmdOrCtrl+N',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'new-invoice');
         },
       },
       {
         label: i18n.__('Save'),
         accelerator: 'CmdOrCtrl+S',
         click() {
           mainWindow.webContents.send('menu-form-save');
         },
       },
       {
         label: i18n.__('Reset'),
         accelerator: 'CmdOrCtrl+R',
         click() {
           mainWindow.webContents.send('menu-form-clear');
         },
       },
       { type: 'separator' },
       {
         label: i18n.__('Add Item'),
         accelerator: 'CmdOrCtrl+I',
         click() {
           mainWindow.webContents.send('menu-form-add-item');
         },
       },
       { type: 'separator' },
       {
         label: i18n.__('Toggle'),
         submenu: [{
             label: i18n.__('Toggle Form Settings'),
             accelerator: 'Alt+S',
             click() {
               mainWindow.webContents.send('menu-form-toggle-settings');
             },
           },
           {
             label: i18n.__('Toggle Due Date'),
             accelerator: 'Alt+T',
             click() {
               mainWindow.webContents.send('menu-form-toggle-dueDate');
             },
           },
           {
             label: i18n.__('Toggle Currency'),
             accelerator: 'Alt+C',
             click() {
               mainWindow.webContents.send('menu-form-toggle-currency');
             },
           },
           {
             label: i18n.__('Toggle VAT'),
             accelerator: 'Alt+V',
             click() {
               mainWindow.webContents.send('menu-form-toggle-vat');
             },
           },
           {
             label: i18n.__('Toggle Discount'),
             accelerator: 'Alt+D',
             click() {
               mainWindow.webContents.send('menu-form-toggle-discount');
             },
           },
           {
             label: i18n.__('Toggle Note'),
             accelerator: 'Alt+N',
             click() {
               mainWindow.webContents.send('menu-form-toggle-note');
             },
           },
         ],
       }
     ],
   };

   const goMenu = {
     label: i18n.__('Go to'),
     submenu: [{
         label: i18n.__('Invoices'),
         accelerator: 'CmdOrCtrl+Shift+A',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'invoices');
         },
       },
       {
         label: i18n.__('Contacts'),
         accelerator: 'CmdOrCtrl+Shift+D',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'contacts');
         },
       },
       {
         label: i18n.__('Settings'),
         icon: (ASSETS + 'icons/menu/wrench.png'),
         accelerator: 'CmdOrCtrl+Shift+S',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'settings');
         },
       },
     ],
   };

   const editMenu = {
     label: i18n.__('Edit'),
     submenu: [
       { label: i18n.__('Undo'), role: 'undo' },
       { label: i18n.__('Redo'), role: 'redo' },
       { type: 'separator' },
       { label: i18n.__('Cut'), role: 'cut' },
       { label: i18n.__('Copy'), role: 'copy' },
       { label: i18n.__('Paste'), role: 'paste' },
       { type: 'separator' },
       { label: i18n.__('Select all'), role: 'selectall' },
     ],
   };

   const windowsMenu = {
     label: i18n.__('Window'),
     role: 'window',
     submenu: [{ label: i18n.__('Minimize'), role: 'minimize' }, { label: i18n.__('Close'), role: 'close' }],

   };

   const helpMenu = {
     role: 'help',
     label: i18n.__('Help'),
     submenu: [{
         label: 'Show Tutorial',
         accelerator: 'CmdOrCtrl+t',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'start-tour');
         },
       },
       { type: 'separator' },
       viewHiddenWindowsMenu,
       { type: 'separator' },
       {
         label: 'MEDIACEPT Technology',
         click() {
           require('electron').shell.openExternal('http://mediacept.com');
         },
       },
       {
         label: i18n.__('About') + " " + i18n.__('MEDIACEPT Office'),
         icon: (ASSETS + 'icons/menu/info-circle.png'),
         accelerator: 'CmdOrCtrl+i',
         click() {
           mainWindow.webContents.send('menu-change-tab', 'about');
         },
       },

     ],
   };

   // Add additional menu item on Windows & Linux
   if (process.platform !== 'darwin') {
     
     // Add check for update to helpMenu
     helpMenu.submenu.unshift({
       label: 'Check For Updates',
       accelerator: 'CmdOrCtrl+U',
       click() {
         mainWindow.send('check-for-updates');
       },
     });
   }
   // Base menu
   const menuTemplate = [
     fileMenu,
     editMenu,
     goMenu,
     invoiceMenu,
     windowsMenu,
     helpMenu,
   ];

   // Developer Tools Menu
   if (isDevelopment) menuTemplate.splice(3, 0, viewHiddenWindowsMenu);


   // Build the menu
   const menu = Menu.buildFromTemplate(menuTemplate);
   //  Menu.setApplicationMenu(menu);


   mainWindow.setMenu(menu);

   ipcMain.once("update-main-menu", (event) => {
     i18n = new(require('./i18n'))
     init()

   })


 }



 module.exports.init = init;