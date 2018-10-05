var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));


const fs = require('fs')
const fse = require('fs-extra');
const os = require('os')
const ipcRenderer = require("electron").ipcRenderer;
const isDevelopment = process.env.NODE_ENV !== 'production';

const Handlebars = require("handlebars");


var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
let mainWindow = remote.getGlobal('mainWindow');
let printWorkerWindow = remote.getGlobal('printWorkerWindow');
let ASSETS = remote.getGlobal('ASSETS_GLOBAL');
var userDataPath = app.getPath('userData') + path.sep;

function removejscssfile(filename, filetype) {
  var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
  var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
  var allsuspects = document.getElementsByTagName(targetelement)
  for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
      allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
  }
}

Handlebars.registerHelper("inc", function(value, options) { return parseInt(value) + 1; });

ipcRenderer.on("printInvoicePDF", (event) => {
  console.log("data received............................", remote.getGlobal('invoiceData'))
  // var _data={data:vm.form, theme:vm.theme, silent:true}
  const _DATA = JSON.parse(remote.getGlobal('invoiceData').data)
  var invoiceData = { logo: _DATA.logo, invoice: _DATA.invoice }
  var theme = _DATA.theme
  var silent = _DATA.silent
  var container = document.getElementById("container");
  // container.innerHTML = fs.readFileSync(  path.join(__dirname,   './template.hbs')         , 'utf8');




  var source = fs.readFileSync(path.join(__dirname, './template.hbs'), 'utf8');
  var template = Handlebars.compile(source);
  var compiledTemplate = template(invoiceData);
  container.innerHTML = compiledTemplate


  let assetsFolder = isDevelopment ? ('./theme/' + theme + '/') : ('/../../../assets/billing/theme/' + theme + '/')
  let indexCss = path.join(__dirname, assetsFolder + 'index.css')
  if (document.getElementById("invoiceStyle")) {
    removejscssfile(indexCss, "css")
  }

  setTimeout(() => {
    var element = document.createElement('link');
    element.id = "invoiceStyle"
    element.type = 'text/css';
    element.rel = 'stylesheet';
    element.href = indexCss;
    document.getElementsByTagName("head")[0].appendChild(element);
  }, 50);



  setTimeout(() => {
    // ipcRenderer.send("readyToPrintPDF", ID, silent);

    toPDF(event, invoiceData, silent)
  }, 100);

});

// ===
ipcRenderer.on("print", (event, ID, content, theme, printer) => {
  var container = document.getElementById("container");
  container.innerHTML = content;

  let assetsFolder = isDevelopment ? ('./theme/' + theme + '/') : ('/../../../assets/billing/theme/' + theme + '/')
  let indexCss = path.join(__dirname, assetsFolder + 'index.css')

  if (document.getElementById("invoiceStyle")) {
    removejscssfile(indexCss, "css")
  }

  setTimeout(() => {
    var element = document.createElement('link');
    element.id = "invoiceStyle"
    element.type = 'text/css';
    element.rel = 'stylesheet';
    element.href = indexCss;
    document.getElementsByTagName("head")[0].appendChild(element);
  }, 100);
  setTimeout(() => {
    ipcRenderer.send("readyToPrint", ID, printer);
  }, 200);

});



function toPDF(event, invoiceData, silent = false) {
  const invoiceFontBytes = fs.readFileSync(ASSETS + '/billing/theme/default/SourceSansPro-Regular.ttf');
  const PURPLE = [119 / 255, 41 / 255, 83 / 255];
  const ORANGE = [224 / 255, 90 / 255, 43 / 255];
  const GREY = [117 / 255, 117 / 255, 117 / 255];
  const INVOICE_FONT = 'InvoiceFont';

  const { PDFDocumentFactory, PDFDocumentWriter, drawText } = require('pdf-lib');

  let pdfPathFolder = userDataPath + 'billing' + path.sep + 'invoices' + path.sep
  fse.ensureDirSync(pdfPathFolder)
  const pdfPath = pdfPathFolder + 'invoice-' + invoiceData.id + '.pdf';

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
      mainWindow.webContents.send('data-pdf', pdfBytes);
      console.log("data sended YES YES ===================", remote.getGlobal('invoiceData'))
    } else {
      try {
        fs.writeFileSync(pdfPath, pdfBytes);
        // shell.openItem(pdfPath)
        // pdfViewerWindow = createPdfViewerWindow(pdfPath)
        mainWindow.webContents.send('wrote-pdf', pdfPath)
      } catch (error) {
        console.log(error)
      }
    }
  })











}