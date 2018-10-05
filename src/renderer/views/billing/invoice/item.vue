<template>
  <div>

    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item to="/invoices">
          <span class="subheading">Liste des Factures </span>
        </v-breadcrumbs-item>
        <v-breadcrumbs-item disabled>
          <span class="pr-1 subheading">Facture: </span>
          <span class="subheading font-weight-medium"> {{invoice.number}}</span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>

      <v-spacer></v-spacer>

      <div class="mx-1">
        <v-btn icon :disabled="systemPrinters.length==0" @click="toPrinter()">
          <v-icon class="green--text text--darken-2">mdi-printer</v-icon>
        </v-btn>

        <v-btn icon @click="toPDF()">
          <v-icon class="red--text text--lighten-1">mdi-file-pdf</v-icon>
        </v-btn>
      </div>

    </v-toolbar>
    <div style="position: relative; margin-top:1px;">

      <div class="d-flex" style="overflow-x:overlay">

        <invoice-setup />

        <div class="pa-4">
          <invoice-detail :id="invoiceID" :number="invoiceNumber" />
        </div>
      </div>

    </div>

  </div>
</template>



<script>
import map from "lodash/map";
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const os = require('os')
const path = require('path')
const { shell, ipcRenderer } = require('electron')
const remote = require("electron").remote

import InvoiceDetail from "./itemDetails"
import InvoiceSetup from "./setup.vue"
import { setTimeout } from 'timers';

export default {
  components: { InvoiceSetup, InvoiceDetail },
  data() {
    return {





      theme: 'default',
      invoice: {},
      invoiceID: this.$route.params.id,
      invoiceNumber: this.$route.query.number,
      systemPrinters: [],
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },
  },
  watch: {
    '$route': function () {
      this.invoiceID = this.$route.params.id;
      this.invoiceNumber = this.$route.query.number;
      this.invoice.id = this.invoiceID;
      this.invoice.number = this.invoiceNumber;
    },

  },
  mounted() {
    var vm = this
    this.invoice = {
      id: this.invoiceID,
      number: this.invoiceNumber,
      date: "2018.07.20",
      due: "2018.07.21",
    }
    var connectedUserName = this.connectedUserName;
    var userTheme = _store.get('users.' + connectedUserName + '.invoice.theme') || 'default'
    this.theme = userTheme

    ipcRenderer.on("wrote-pdf", (event, data) => {
      console.log("Done", data)




    });
    this.systemPrinters = this.getSystemPrinters()

  },
  methods: {
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
      var content = document.getElementById("billing-container").parentNode.innerHTML
      ipcRenderer.send("printPDF", this.invoice.number, content, this.theme);

    },
    toPrinter() {
      var content = document.getElementById("billing-container").parentNode.innerHTML;
      var printer = this.getUserDefaultPrinter() || { name: '' }
      ipcRenderer.send("print", this.invoice.number, content, this.theme, printer.name);
    },


  },
}
</script> 


