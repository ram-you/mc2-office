<template>
  <div>

    <v-toolbar flat style="border-bottom:1px solid rgba(150, 150, 150, 0.23);">
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item to="/">
          <span class="subheading">{{ $t('main.app.Home') }} </span>
        </v-breadcrumbs-item>
        <v-breadcrumbs-item disabled>
          <span class="subheading">Database (Base de données)</span>
          <span class="subheading font-weight-medium"> </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <div class="mx-1">
        <v-btn icon @click="exportDatabaseToExel">
          <v-icon class="blue--text text--darken-2">mdi-database-export</v-icon>
        </v-btn>

        <upload-btn icon :accept="acceptedExcelFiles" name="excelExport" :fileChangedCallback="fileSelectedFunc"
          flat color='transparent'>
          <template slot="icon">
            <v-icon class="green--text text--darken-2">mdi-database-import</v-icon>
          </template>
        </upload-btn>

      </div>

    </v-toolbar>

    <v-dialog v-model="waitingResponse" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text> {{waitingMessage}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="alert.visible" max-width="300">
      <v-card :color="alert.color" dark>
        <v-card-title class="headline" color="white" style="background: rgba(0, 0, 0, 0.1);padding: 8px 16px;">{{alert.title}}</v-card-title>
        <v-card-text color="white">
          <div> {{alert.message}} </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-for="action in alert.actions" :key="action.title" @click="action.action" dark
            flat>
            {{action.title}} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-flex xs12 mb-4>

      <v-layout row wrap align-center justify-start pb-3 :reverse="$vuetify.rtl">

        <v-flex xs12 px-3>

          <v-card style="min-height:100px; width:100%;background: rgba(125, 125, 125, 0.15);" class="pa-2 mt-3 pb-4">
            <v-toolbar dense class="elevation-1">

              <!-- <v-btn icon @click="exportDatabaseToExel">
                <v-icon class="blue-grey--text text--darken-2">mdi-folder-open</v-icon>
              </v-btn> -->

              <upload-btn icon :accept="acceptedSqlFiles" name="sqlOpen" :fileChangedCallback="fileOpenSql"
                flat color='transparent'>
                <template slot="icon">
                  <v-icon class="blue-grey--text text--darken-2">mdi-folder-open</v-icon>
                </template>
              </upload-btn>

              <v-btn icon @click="fileSaveSql">
                <v-icon class="blue--text text--darken-2">mdi-content-save</v-icon>
              </v-btn>

              <!-- <upload-btn icon :accept="acceptedSqlFiles"   :fileChangedCallback="fileSaveSql"
                flat color='transparent'>
                <template slot="icon">
                  <v-icon class="blue--text text--darken-2">mdi-content-save</v-icon>
                </template>
              </upload-btn> -->

              <v-btn icon @click="runSqlQueryInput">
                <v-icon class="orange--text text--darken-2">mdi-run</v-icon>
              </v-btn>
              <v-btn icon @click="editorContent=''">
                <v-icon class=" ">mdi-eraser</v-icon>
              </v-btn>

              <v-divider class="mx-3" inset vertical></v-divider>
              <v-menu :nudge-width="100">
                <v-toolbar-title slot="activator">
                  <span class="subheading grey--text">Table: </span>
                  <span class="subheading ">{{currentTable}}</span>
                  <v-icon>mdi-chevron-down</v-icon>
                </v-toolbar-title>

                <v-list>
                  <v-list-tile v-for="item in dbTables" :key="item" @click="currentTable=item">
                    <v-list-tile-title v-text="item"></v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>

              <v-divider class="mx-3" inset vertical></v-divider>

              <v-btn icon @click="exportDatabaseToExel">
                <v-icon class="blue--text text--darken-2">mdi-database-export</v-icon>
              </v-btn>

              <upload-btn icon :accept="acceptedExcelFiles" name="excelExport" :fileChangedCallback="fileSelectedFunc"
                flat color='transparent'>
                <template slot="icon">
                  <v-icon class="green--text text--darken-2">mdi-database-import</v-icon>
                </template>
              </upload-btn>

            </v-toolbar>
            <v-card style="text-align: -webkit-auto;border-radius:0;margin: 1px 0 4px;" class=" elevation-1">
              <editor v-model="editorContent" @init="editorInit" lang="sql" :theme="isDarkTheme?'tomorrow_night_eighties':'crimson_editor'"
                width="100%" height="100%" style="min-height:100px; width:100%; font-size: 16px;">
              </editor>

            </v-card>
            <!-- =========== -->

            <v-card style="text-align: -webkit-auto;" class="mt-2">

              <v-toolbar dense flat>
                <v-text-field flat solo-inverted hide-details :height="36" prepend-inner-icon="mdi-magnify"
                  label="Search" class="hidden-sm-and-down" v-model="search"></v-text-field>
                <v-divider class="mx-3 hidden-sm-and-down" inset vertical></v-divider>
                <v-btn icon @click="exportDatabaseToExel" :disabled="selectedUniqueID==''">
                  <v-icon class="blue--text text--darken-2">mdi-table-edit</v-icon>
                </v-btn>
                <v-btn icon @click="dialog=true">
                  <v-icon class="green--text text--darken-2">mdi-table-row-plus-after</v-icon>
                </v-btn>
                <v-btn icon @click="deleteSelectedRow" :disabled="selectedUniqueID==''">
                  <v-icon class="red--text text--darken-2">mdi-table-row-remove</v-icon>
                </v-btn>

                <v-divider class="mx-3" inset vertical></v-divider>
                <v-btn icon @click="exportDatabaseToExel">
                  <v-icon class="blue--text text--darken-2">mdi-database-export</v-icon>
                </v-btn>

                <upload-btn icon :accept="acceptedExcelFiles" name="excelExport"
                  :fileChangedCallback="fileSelectedFunc" flat color='transparent'>
                  <template slot="icon">
                    <v-icon class="green--text text--darken-2">mdi-database-import</v-icon>
                  </template>
                </upload-btn>

                <v-spacer></v-spacer>
              </v-toolbar>

              <v-dialog v-model="dialog" max-width="500px">
                <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
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

              <v-data-table :headers="headers" :items="tableData" v-model="selected" :search="search"
                item-key="id" :pagination.sync="pagination" prev-icon="mdi-menu-left" next-icon="mdi-menu-right"
                sort-icon="mdi-menu-down">

                <template slot="items" slot-scope="props">
                  <tr :active="selectedUniqueID==props.item.id" @click="makeSelectedUnique(props.item)"
                    style="cursor: pointer;">

                    <td v-for="(header,index) in headers" :key="index" :class=" 'text-xs-'+header.align">
                      <span v-if="header.value=='#'"> {{ tableData.indexOf(props.item) + 1 }}</span>
                      <span v-else> {{ props.item[header.value] }}</span>
                    </td>

                    <td class="justify-center layout px-0">
                      <v-btn icon class="mx-0" @click="editItem(props.item)">
                        <v-icon color="teal" class="mdi-18px">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="red" class="mdi-18px">mdi-delete</v-icon>
                      </v-btn>

                    </td>
                  </tr>
                </template>
                <template slot="no-data">
                  <v-alert :value="true" color="grey" outline icon="mdi-alert-decagram" v-if="currentTable">
                    <span> Sorry, no data in table </span>
                    <span class="font-weight-bold px-1">{{currentTable.toUpperCase()}}</span>
                  </v-alert>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }}
                </template>
                <v-alert slot="no-results" :value="true" color="red" outline icon="mdi-alert-decagram">
                  Your search for "{{ search }}" found no results.
                </v-alert>
              </v-data-table>
            </v-card>

          </v-card>

        </v-flex>
      </v-layout>
    </v-flex>

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

function Capitalize(str) {
  str = str.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) { return key });
  return str.toLowerCase().split(' ').map(function (word) { return word[0].toUpperCase() + word.substr(1); }).join(' ');
}

import UploadButton from '../../components/UploadButton.vue';
export default {
  components: { 'upload-btn': UploadButton, editor: require('vue2-ace-editor'), },
  name: 'invoicesList',
  data() {
    return {
      editorContent: "",
      waitingResponse: false,
      waitingMessage: '',
      alert: {
        visible: false, color: 'green', title: 'Message', message: 'Message',
        actions: [{ title: 'OK', action: () => { this.alert.visible = false } }, { title: 'Cancel', action: () => { this.alert.visible = false } }]
      },

      acceptedExcelFiles: ["xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "ods", "dbf"].map(function (x) { return "." + x; }).join(","),
      acceptedSqlFiles: ["sql", "txt"].map(function (x) { return "." + x; }).join(","),
      lastOpenedFile: "",

      isInvoicesDataLoaded: false,
      // invoicesList: [],
      theme: 'default',
      selectedInvoiceID: null,
      selectedInvoiceNumber: null,
      search: '',
      selected: [],
      selectedID: [],
      selectedUniqueID: '',
      dbTables: [],
      headers: [],
      tableData: [],
      currentTable: "",

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
      themesItems: this.$colorThemeItems,
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },
    formTitle() { return this.editedIndex === -1 ? 'New Item' : 'Edit Item' },

    invoicesList() { return this.$store.state.Invoice.invoices },

    _userTheme() { return this.$store.state.User.userTheme; },
    userTheme() { return this.themesItems.filter((item) => { return item.theme == this._userTheme; })[0] },
    isDarkTheme() { return this.userTheme.theme == 'dark'; }

  },
  watch: {
    pagination: {
      handler() { },
      deep: true
    },
    dialog(val) { val || this.close() },
    currentTable() {
      var currentTable = this.currentTable;
      if (currentTable) {
        dbWorkerWindow.webContents.send("get_tableSchema", currentTable);
        dbWorkerWindow.webContents.send("get_tableData", currentTable);
        this.editorContent = "SELECT * FROM " + currentTable + ";";
      } else {

      }
      this.search = "";
    }
  },
  beforeCreate() { },
  created() {
    this.initialize();
    this.isInvoicesDataLoaded = true;
  },
  destroyed() {
    ipcRenderer.removeAllListeners("got_tableSchema");
  },
  mounted() {

    this.initContextMenu();



    var vm = this
    function align(row) {
      var text = "left"
      switch (row.type) {
        case "float":
          text = 'right'
          break;
        case "integer":
          text = 'right'
          break;
        default:
          text = 'left'
      }
      return (row.name == 'id') ? 'left' : text
    }
    ipcRenderer.on("got_dbTables", (event, data) => {
      console.log("Done dbTables Results=", data);
      var dbTables = data.map(a => { return a.table_name });
      vm.dbTables = dbTables;
      this.currentTable = dbTables[0]
    });

    ipcRenderer.on("got_tableSchema", (event, data) => {
      var res = data.map(row => { return { text: Capitalize(row.name), value: row.name, align: align(row), sortable: true } });
      res.unshift({ text: '#', value: '#', align: 'center', sortable: false, width: "50" })
      vm.headers = res;
      console.log("Done Schema Results=", data, " vm.headers", vm.headers);
    });

    ipcRenderer.on("got_tableData", (event, data) => {
      console.log("Done Data Results=", data)
      vm.tableData = data.data
    });

    ipcRenderer.on("got_sqlQueryResult", (event, data) => {
      console.log("Done sqlQueryResult Results=", data);
      vm.headers = []
      vm.tableData = []
      if (Array.isArray(data.result)) {
        if (data.result.length > 0) {
          var headers = Object.keys(data.result[0]).map(row => { return { text: Capitalize(row), value: row, align: 'left', sortable: true } });
          headers.unshift({ text: '#', value: '#', align: 'center', sortable: false, width: "50" })
          vm.headers = headers
          vm.tableData = data.result
        } else {
          vm.alert = {
            visible: true, color: 'blue-grey', title: 'Query Result', message: "Executed with success.",
            actions: [{ title: 'OK', action: () => { this.alert.visible = false } }]
          }
        }
      } else {
        if (data.error != "") {

          vm.alert = {
            visible: true, color: 'red', title: 'Error', message: data.error,
            actions: [{ title: 'OK', action: () => { this.alert.visible = false } }]
          }
        }
      }

    });


  },
  methods: {
    runSqlQueryInput() {
      var sqlCommands = this.editorContent.split(';')
      for (var a = 0; a < sqlCommands.length; a++) {
        if (sqlCommands[a].length > 0)
          dbWorkerWindow.webContents.send("run_sqlQuery", sqlCommands[a]);
      }
      this.currentTable = null
    },
    makeSelectedUnique(item) {
      if (this.selectedUniqueID == item.id) {
        this.selectedUniqueID = '';
        this.selected = [];
      } else {
        this.selectedUniqueID = item.id;
        this.selected = [item];
      }
    },
    deleteSelectedRow() {
      for (var a = 0; a < this.selected.length; a++) {
        this.selectedID.push(this.selected[a].id)
        var itemToDelete = this.selected[a].id
        for (var b = 0; b < this.tableData.length; b++) {
          if (this.tableData[b].id === itemToDelete) {
            this.tableData.splice(b, 1);
          }
        }
        for (var c = 0; c < this.selected.length; c++) {
          if (this.selected[c].id === itemToDelete) {
            this.selected.splice(c, 1);
          }
        }
        this.selectedUniqueID = '';
      }
    },
    editorInit: function (editor) {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/sql')    //language
      require('brace/theme/crimson_editor');
      require('brace/theme/tomorrow_night_eighties')
      require('brace/snippets/sql') //snippet

      editor.setOption("minLines", 10);
      editor.setAutoScrollEditorIntoView(true);
      editor.setOption("maxLines", 20);
      editor.setOption("wrap", true)
      editor.setShowPrintMargin(false);
    },
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

    initialize() {
      dbWorkerWindow.webContents.send("get_dbTables");
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
      this.waitingMessage = "Exportation en cours, veuillez patienter... "
      ipcRenderer.on('exportToXLS', (event, message) => {
        ipcRenderer.removeAllListeners("exportToXLS");
        vm.waitingResponse = false;
        setTimeout(() => {
          vm.alert = {
            visible: true, color: 'primary', title: 'Exportation vers Excel', message: 'Done in :  ' + message.timed,
            actions: [{ title: 'OK', action: () => { this.alert.visible = false } }, { title: 'Open (Ouvrir)', action: () => { this.alert.visible = false; this.openXlsFile(message.link) } }]
          }
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
    fileOpenSql(file) {
      var vm = this;
      this.lastOpenedFile = file.name

      fs.readFile(file.path, { encoding: 'utf-8' }, function (err, data) {
        if (err) {
          vm.alert = {
            visible: true, color: 'red', title: 'Error opening file', message: err,
            actions: [{ title: 'OK', action: () => { this.alert.visible = false } }]
          }
        } else {
          vm.editorContent = data
        }
      });
    },
    fileSaveSql(file) {
      var vm = this;
      var fileName = this.lastOpenedFile != "" ? this.lastOpenedFile : "query.sql"
      var FileSaver = require('file-saver');
      var blob = new Blob([vm.editorContent], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, fileName);


      // fs.writeFile(file, vm.editorContent, function (err) {
      //   if (err) {
      //     vm.alert = {
      //       visible: true, color: 'red', title: 'Error on save', message: err,
      //       actions: [{ title: 'OK', action: () => { this.alert.visible = false } }]
      //     }
      //   }

      //   vm.alert = {
      //     visible: true, color: 'green', title: 'Saved with success', message: 'File:  ' + file,
      //     actions: [{ title: 'OK', action: () => { this.alert.visible = false } }]
      //   }
      // });
    },
    initContextMenu() {
      const electron = require('electron');
      const remote = electron.remote;
      const Menu = remote.Menu;

      const InputMenu = Menu.buildFromTemplate([

        { label: 'Cut', role: 'cut', },
        { label: 'Copy', role: 'copy', },
        { label: 'Paste', role: 'paste', },
        { type: 'separator', },
        { label: 'Select all', role: 'selectall', },
      ]);

      document.body.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let node = e.target;
        let className = e.target.getAttribute('class')
        while (node) {
          if ((node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) && className == "ace_text-input") {
            InputMenu.popup(remote.getCurrentWindow());
            break;
          }
          node = node.parentNode;

        }
      });

    },
  },


}
</script>

<style>
.upload-btn {
  display: inline-flex;
  vertical-align: middle;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
/* --------- */
.ace_gutter,
.ace_content {
  z-index: 2 !important;
}
/* ------------ */
.v-toolbar__content .v-text-field.v-text-field--solo .v-input__control {
  min-height: 36px;
}
.v-table thead tr:first-child {
  border-bottom: 1px solid orange !important;
}

.theme--dark .v-table tbody tr[active] td {
  color: #ff7c72 !important;
}
.theme--light .v-table tbody tr[active] td {
  color: rgba(222, 0, 0, 0.79) !important;
}
</style>
