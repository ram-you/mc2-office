<template>
  <div>
    <div class="hidden-div">
      <!-- <invoice-detail :id="selectedInvoiceID" :number="selectedInvoiceNumber"></invoice-detail> -->
    </div>

    <v-dialog v-model="waitingResponse" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text> {{waitingMessage}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="gotResponse" max-width="300">
      <v-card color="primary" dark>
        <v-card-title class="headline" color="white">Exportation en format Excel</v-card-title>
        <v-card-text color="white">
          <div> Done in : {{serverResponse.timed}} </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="gotResponse = false" light> OK </v-btn>
          <v-btn @click='gotResponse = false;openXlsFile(serverResponse.link)' light> Ouvrir </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item to="/">
          <span class="subheading">{{ $t('main.app.Home') }} </span>
        </v-breadcrumbs-item>
        <v-breadcrumbs-item disabled>
          <span class="subheading">Liste des Factures </span>
          <span class="subheading font-weight-medium"> </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mx-1">
        <v-btn icon @click="exportDatabaseToExel">
          <v-icon class="blue--text text--darken-2">mdi-database-export</v-icon>
        </v-btn>

        <upload-btn icon :accept="SheetJSFT" :fileChangedCallback="fileSelectedFunc" flat color='transparent'>
          <template slot="icon">
            <v-icon class="green--text text--darken-2">mdi-database-import</v-icon>
          </template>
        </upload-btn>

      </div>

    </v-toolbar>

    <v-flex xs12 mb-4 mt-4>
      <div class="display-1 px-3">Liste des Factures</div>

      <v-layout row wrap align-center justify-start py-3 :reverse="$vuetify.rtl">

        <v-flex xs12 sm10 offset-sm1>
          <v-card style="text-align: -webkit-auto;">
            <v-card-title>
              Factures
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-dialog v-model="dialog" max-width="500px">
              <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-data-table :headers="headers" :items="desserts2" :search="search" item-key="name">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-right">{{ props.item.calories }}</td>
                  <td class="text-xs-right">{{ props.item.fat }}</td>
                  <td class="text-xs-right">{{ props.item.carbs }}</td>
                  <td class="text-xs-right">{{ props.item.protein }}</td>
                  <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                      <v-icon color="teal" class="mdi-18px">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                      <v-icon color="red" class="mdi-18px">mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="createPDF(props.item)">
                      <v-icon color="green" class="mdi-18px">mdi-file-pdf</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="goDetail(props.item)">
                      <v-icon color="blue" class="mdi-18px">mdi-link</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat class="grey lighten-3 black--text">
                  <v-card-text class="px-5">
                    <v-icon v-if="$vuetify.rtl" class="green--text mdi-18px px-2">mdi-subdirectory-arrow-left</v-icon>
                    <v-icon v-else class="green--text mdi-18px px-2">mdi-subdirectory-arrow-right</v-icon>
                    <span class="grey--text text--darken-3 font-weight-regular px-2">Facture:</span>
                    <a class="font-weight-medium" @click="goDetail(props.item)"> {{ props.item.number }} </a>

                  </v-card-text>
                </v-card>
              </template>
              <template slot="no-data">
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }}
              </template>
              <v-alert slot="no-results" :value="true" color="red" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-layout v-if="isInvoicesDataLoaded" row wrap align-center justify-start py-3 mb-4>
      <v-flex xs12 sm10 offset-sm1>
        <v-card style="text-align: -webkit-auto;" class=" mb-4">
          <template v-for="item in invoicesList">
            <v-card :key="item.id">
              <v-card-title primary-title v-html="item.invoiceNumber +' '+item.invoiceClient">

              </v-card-title>
            </v-card>
          </template>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap align-center justify-start py-3 mb-4>
      <v-flex xs12 sm10 offset-sm1>
        <v-card style="text-align: -webkit-auto;">
          <v-card-title primary-title id="no-data" class="justify-center py-5 mb-4">
            <v-progress-circular :size="70" :width="7" color="red" indeterminate></v-progress-circular>

          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

  </div>
</template>
<script>
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const os = require('os')
const path = require('path')
const fse = require('fs-extra');

const { ipcRenderer } = require('electron')
import { remote } from 'electron'
const app = remote.app
let dbWorkerWindow = remote.getGlobal('dbWorkerWindow');

import InvoiceDetail from "./itemDetails"
// import UploadButton from 'vuetify-upload-button';
import UploadButton from '../../../components/UploadButton.vue';
export default {
  components: { 'upload-btn': UploadButton, InvoiceDetail },
  name: 'invoicesList',
  data() {
    return {
      waitingResponse: false,
      waitingMessage:'',
      gotResponse: false,
      serverResponse: '',
      SheetJSFT: ["xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "ods", "dbf"].map(function (x) { return "." + x; }).join(","),
      isInvoicesDataLoaded: false,
      // invoicesList: [],
      theme: 'default',
      selectedInvoiceID: null,
      selectedInvoiceNumber: null,
      search: '',
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' }
      ],

      totalDesserts: 0,

      loading: true,
      pagination: {},
      max25chars: (v) => v.length <= 25 || 'Input too long!',
      desserts2: [],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        id: 1, number: 'FAC-2018-007', name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        id: 1, number: 'FAC-2018-007', name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },
    formTitle() { return this.editedIndex === -1 ? 'New Item' : 'Edit Item' },

    invoicesList() { return this.$store.state.Invoice.invoices },

  },
  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
          .then(data => {
            this.desserts1 = data.items
            this.totalDesserts = data.total
          })
      },
      deep: true
    },
    dialog(val) { val || this.close() }
  },
  beforeCreate(){ 
    dbWorkerWindow.webContents.send("getInvoices", 'invoices'); 
  },
  created() { 
    this.initialize(); 
    this.isInvoicesDataLoaded = true;
  },
  destroyed() {
    ipcRenderer.removeAllListeners("invoicesResults");
  },
  mounted() {

    var vm = this
    this.getDataFromApi()
      .then(data => {
        this.desserts1 = data.items
        this.totalDesserts = data.total
      })

    var connectedUserName = this.connectedUserName;
    var userTheme = _store.get('users.' + connectedUserName + '.invoice.theme') || 'default'
    this.theme = userTheme

    if (!vm.isInvoicesDataLoaded)
      dbWorkerWindow.webContents.send("getInvoices", 'invoices');

    var _CB = (event, data) => {
      console.log("Done invoicesResults", data)
      vm.isInvoicesDataLoaded = true
      this.$store.commit("setInvoices", data)
    }
    ipcRenderer.on("invoicesResults", _CB);




  },
  methods: {
    refreshInvoicesData() {
      ipcRenderer.send("getInvoices", 'invoices');
    },
    async initInvoicesData() {
      var vm = this
      await this.$store.dispatch('getInvoices')
      vm.isInvoicesDataLoaded = true

    },
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination

        let items = this.getDesserts()

        const total = items.length

        if (this.pagination.sortBy) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy]
            const sortB = b[sortBy]

            if (descending) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }

        if (rowsPerPage > 0) {
          items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

        setTimeout(() => {
          this.loading = false
          resolve({
            items,
            total
          })
        }, 1000)
      })
    },
    getDesserts() {
      return [
        {
          value: false,
          id: 1, number: 'FAC-2018-001', name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-002', name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-003', name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-004', name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-005', name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-006', name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-007', name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-008', name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-009', name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%'
        },
        {
          value: false,
          id: 1, number: 'FAC-2018-010', name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%'
        }
      ]
    },
    initialize() {
      this.desserts2 = [
        {
          id: 1, number: 'FAC-2018-001', name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0
        },
        {
          id: 1, number: 'FAC-2018-002', name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3
        },
        {
          id: 1, number: 'FAC-2018-003', name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0
        },
        {
          id: 1, number: 'FAC-2018-004', name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3
        },
        {
          id: 1, number: 'FAC-2018-005', name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9
        },
        {
          id: 1, number: 'FAC-2018-006', name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0
        },
        {
          id: 1, number: 'FAC-2018-007', name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0
        },
        {
          id: 1, number: 'FAC-2018-008', name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5
        },
        {
          id: 1, number: 'FAC-2018-009', name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9
        },
        {
          id: 1, number: 'FAC-2018-010', name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7
        }
      ]
    },
    createPDF(item) {
      var vm=this;
      this.selectedInvoiceID = item.id;
      this.selectedInvoiceNumber = item.number;

      setTimeout(() => {
        var content = document.getElementById("billing-container").parentNode.innerHTML
        ipcRenderer.send("printPDF", item.number, content, vm.theme, false);
      }, 100);


    },
    goDetail(item) {
      this.$router.push({ name: "invoice", params: { id: item.id }, query: { number: item.number } });
    },
    editItem(item) {
      this.editedIndex = this.desserts2.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const itemIndex = this.desserts2.indexOf(item)

      const { dialog } = require('electron').remote

      const options = {
        type: 'warning',
        title: 'Suppression',
        message: "Êtes-vous sûr de vouloir supprimer " + '"' + item.name + '"' + " ?",
        buttons: ['Oui', 'Non']
      }
      dialog.showMessageBox(options, (index) => {
        if (index == 0) this.desserts2.splice(itemIndex, 1)
      })

    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts2[this.editedIndex], this.editedItem)
      } else {
        this.desserts2.push(this.editedItem)
      }
      this.close()
    },

    exportDatabaseToExel() {
      var vm = this
      this.waitingResponse = true;
      this.waitingMessage="Exportation en cours, veuillez patienter... "
      ipcRenderer.on('exportToXLS', (event, message) => {
        ipcRenderer.removeAllListeners("exportToXLS");
        vm.waitingResponse = false;
        setTimeout(() => {
          // alert(message);
          vm.gotResponse = true;
          vm.serverResponse = message;
        }, 300);

      });
      dbWorkerWindow.webContents.send('exportToXLS', "Message from Window 1");
    },
    openXlsFile(file) {
      const { shell } = require('electron');
      shell.openItem(file);
    },
    fileSelectedFunc(file) {
      ipcRenderer.once('importFromXLS', (event, message) => { alert(message); });

      dbWorkerWindow.webContents.send('importFromXLS', file);
    },

  },


}
</script>

<style>
.upload-btn {
  display: inline-flex;
  vertical-align: middle;
}
</style>
