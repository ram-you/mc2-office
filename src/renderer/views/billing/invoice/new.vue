<template>
  <div class="heightAuto">

    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item to="/invoices">
          <span class="subheading">Liste des Factures </span>
        </v-breadcrumbs-item>
        <v-breadcrumbs-item disabled>
          <span class="subheading">Nouvelle Facture </span>
          <span class="subheading font-weight-medium"> </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mx-1">
        <v-btn icon>
          <v-icon class="grey--text text--darken-2">mdi-redo</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon class="green--text text--lighten-1">mdi-check-all</v-icon>
        </v-btn>
      </div>

    </v-toolbar>

    <!-- ========================= -->

    <v-card class="pa-4" style="zoom:85%">

      <v-layout row wrap id="invoice-header" style="overflow-x: auto;">
        <v-flex xs12>
          <v-card class="ma-2 my-4" flat>
            <invoice-header :form="form" @interface="handleFcAfterDataBack" />
          </v-card>
        </v-flex>
      </v-layout>
      <!-- ~~~~~~~~~~ -->

      <v-layout row wrap id="invoice-items" style="overflow-x: auto;">
        <v-flex xs12>
          <v-card class="ma-2 my-4" flat style="display: inline-table;">
            <invoice-items :form="form" @interface="handleFcAfterDataBack" />
          </v-card>
        </v-flex>
      </v-layout>

      <!-- ~~~~~~~~~~ -->

      <v-layout row wrap id="invoice-footer" style="overflow-x: auto;">
        <v-flex xs12>
          <v-card class="ma-2 my-4" flat>
            <invoice-footer :form="form" @interface="handleFcAfterDataBack" />
          </v-card>
        </v-flex>
      </v-layout>

    </v-card>

    <v-card flat class="ma-4 py-4" style="background: transparent;">
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red" class="white--text" @click="onGenerateTenItemsClick(9)">
          Générer des exemples (9)
          <v-icon right dark>mdi-plus</v-icon>
        </v-btn>

        <v-btn color="blue-grey" class="white--text" @click="onSaveDraftClick()">
          Sauvegarder le brouillon
          <v-icon right dark>mdi-content-save</v-icon>
        </v-btn>

        <v-btn color="green" class="white--text" @click="onMarkSentClick()">
          Marquer comme envoyé
          <v-icon right dark>mdi-content-save</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <!-- ========================================= -->

    <v-card class="ma-4 pb-2">
      <v-progress-linear :indeterminate="isRenderingPdf" :active="isRenderingPdf" class="ma-0"></v-progress-linear>
      <v-toolbar flat dense style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
        <span class="subheading">Aperçu (Preview) </span>
        <v-spacer></v-spacer>
        <div class="mx-1">
          <v-btn icon :disabled="isRenderingPdf">
            <v-icon class="grey--text text--darken-2" @click="toPDF()">mdi-reload</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon class="grey--text text--darken-2" @click="toPrinter()">mdi-printer</v-icon>
          </v-btn>
        </div>

      </v-toolbar>

      <webview id="pdf-viewer" :src="pdfString" style="display:flex; width:100%; height:100vh" autosize plugins></webview>

    </v-card>

  </div>
</template>

<script>  
var path = require('path');


const fs = require('fs');
const os = require('os');
const PDFWindow = require('electron-pdf-window');


const Store = require('electron-store');
const _store = new Store();

var format = require('date-fns/format')


const { ipcRenderer } = require('electron')
var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
let sep = path.sep
// const userDataPath = app.getPath('userData') + sep;
// const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
// var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });
let ASSETS = remote.getGlobal('ASSETS_GLOBAL')
let printWorkerWindow = remote.getGlobal('printWorkerWindow');


import invoiceHeader from "./invoiceHeader"
import invoiceItems from "./invoiceItems"
import invoiceFooter from "./invoiceFooter"


import { setTimeout } from 'timers';

function Uint8ToBase64(u8Arr) {
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

export default {
  components: { invoiceHeader, invoiceItems, invoiceFooter },
  data() {
    const defaultForm = Object.freeze({
      invoice_number: '',
      po_number: '',
      invoice_date: format(new Date(), 'YYYY-MM-DD'),
      due_date: format(new Date(), 'YYYY-MM-DD'),
      partial: 0,
      discount: 0,
      is_amount_discount: 0,
      last: '',
      bio: '',
      favoriteDiscount: '',
      invoice_items: [],
      totals: {},
      client: { contact: {} },
      age: null,
      terms: false
    })
    return {
      logoImg: require("../../../../common/assets/img/logo/256x256.png"),
      base64: '',
      showInvoiceData: false,
      clientDialog: false,
      pdfString: 'about:blank',
      isRenderingPdf: false,
      invoiceDate: false,
      dueDate: false,
      isLoading: false,
      clientsItems: [],
      modelClient: null,
      searchClient: null,

      form: Object.assign({}, defaultForm),
      rules: {
        age: [
          val => val < 10 || `I don't believe you!`
        ],
        selectDiscount: [val => (val || '').length > 0 || 'This field is required'],
        name: [val => (val || '').length > 0 || 'This field is required']
      },
      discountType: 'Percent',
      discountValue: 0,
      selectDiscount: ['Percent', 'Amount'],
      snackbar: false,
      terms: false,
      defaultForm,
      theme: 'default',
      webview: ""
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },


  },
  watch: {

  },

  beforeCreate() {
  },
  created() {
  },
  destroyed() {
  },
  mounted() {
    var vm = this
    var connectedUserName = this.connectedUserName;
    var userTheme = _store.get('users.' + connectedUserName + '.invoice.theme') || 'default'
    this.theme = userTheme;



    vm.webview = document.querySelector('webview')
    vm.webview.webContents = vm.webview.getWebContents()
    PDFWindow.addSupport(vm.webview);



    ipcRenderer.on("data-pdf", (event, pdfData) => {
      console.log(" PDF DATA regenerated.....");
      // vm.pdfString = 'data:application/pdf;base64, ' + (Uint8ToBase64(pdfData))

      vm.webview.webContents = vm.webview.getWebContents()

      var tempPdfFile = os.tmpdir() + '/tmp_invoice.pdf'
      fs.writeFileSync(tempPdfFile, pdfData);
      vm.isRenderingPdf = false;
      vm.webview.loadURL(tempPdfFile);

    });

    this.generateBase64(this.logoImg).then((data) => {
      vm.base64 = data;
      vm.toPDF();
    })



  },


  methods: {
    handleFcAfterDataBack(data) {
      var vm = this;
      this.form = Object.assign({}, data);
      console.log(" this.form", this.form);
      this.$root.$emit("updateChilds", data);

      vm.toPDF()
    },



    getSystemPrinters(event) {
      const win = remote.getCurrentWindow()
      return map(win.webContents.getPrinters().slice(0), (p) => {
        var p2 = Object.assign({}, p);
        delete p2.options
        return p2
      });
    },

    getSystemDefaultPrinter(event) {
      const printers = this.getSystemPrinters()
      return Object.assign({}, printers.find(obj => { return obj.isDefault }));
    },

    getUserDefaultPrinter() {
      var connectedUserName = this.connectedUserName
      var defaultPrinter = _store.get('users.' + connectedUserName + '.settings.defaults.printer') || _store.get('global.settings.defaults.printer')
      return defaultPrinter || this.getSystemDefaultPrinter()
    },

    toPDF() {
      var vm = this
      this.isRenderingPdf = true;
      console.log(" PDF DATA requested.....");

      // var content = document.getElementById("billing-container").parentNode.innerHTML
      // printWorkerWindow.webContents.send("printPDF", vm.form.invoice_number, "content", vm.theme, true);
      var _data = { logo: this.base64, invoice: vm.form, theme: vm.theme, silent: true }
      remote.getGlobal('invoiceData').data = JSON.stringify(_data);
      printWorkerWindow.webContents.send("printInvoicePDF");


    },



    toPrinter() {
      // var content = document.getElementById("billing-container").parentNode.innerHTML;
      // var printer = this.getUserDefaultPrinter() || { name: '' }
      // ipcRenderer.send("print", this.form.invoice_number, content, this.theme, printer.name);




      let code = `var button = document.getElementById("print");button.click()`;
      this.webview.getWebContents().executeJavaScript(code);


    },
    onGenerateTenItemsClick(n) {
      for (var i = 0; i < n; i++) {
        var unit_cost = parseFloat((Math.random() * 100).toFixed(3).replace(",", "."));
        var quantity = Math.floor(Math.random() * 100) + 1;
        var line_total = quantity * unit_cost;
        var emptyItem = {
          id: this.form.invoice_items.length + 1,
          item: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          description: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          unit_cost: unit_cost,
          quantity: quantity,
          line_total: parseFloat(line_total.toFixed(3).replace(",", ".")),
          overed: false
        }
        var newItem = Object.assign({}, emptyItem);
        this.form.invoice_items.push(newItem)

      }

    },

    generateBase64(imgSrc) {
      var vm = this
      return new Promise((resolve, reject) => {
        let canvas = document.createElement('CANVAS')
        let img = document.createElement('img')

        img.onload = () => {
          canvas.height = img.height
          canvas.width = img.width
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var base64Image = canvas.toDataURL('image/png')
          canvas = null;
          resolve(base64Image)
        }
        img.onerror = error => { reject(error) }
        img.src = imgSrc
      })






    },

  },
}
</script>
 
