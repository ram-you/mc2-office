<template>
  <div>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <div class="display-1 mb-2">System printers</div>

        <v-card v-if="defaultPrinter &&  defaultPrinter.name" flat class="elevation-1 py-2 px-3  mb-2" style="max-width:600px">
          <div class="toolbar__content">
            <v-icon class="v-icon  mdi mdi-24px  green--text"> mdi-printer</v-icon>
            <span class=" green--text font-weight-bold"> {{defaultPrinter.name}} </span>
            <span class="px-1 grey--text">( {{defaultPrinter.description}} ) </span>
          </div>
        </v-card>
        <v-card flat class="elevation-1 py-2 px-3" style="max-width:600px">
          <p>List of installed printers.</p>
          <v-radio-group v-if="printers.length>0" v-model="defaultPrinter">
            <v-radio v-for="pr in printers" :key="pr.name" :label="pr.name+' ('+pr.description+')'" color="green"
              :value="pr"></v-radio>
          </v-radio-group>
          <v-list two-line subheader v-else>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Sorry! no printer found on your system.</v-list-tile-title>
                <v-list-tile-sub-title>Please install one.</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>
        </v-card>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-list three-line subheader>
          <v-subheader>User Controls</v-subheader>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Content filtering</v-list-tile-title>
              <v-list-tile-sub-title>Set the content filtering level to restrict appts that can be downloaded</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Password</v-list-tile-title>
              <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-tile href="javascript:;">
            <v-list-tile-action>
              <v-checkbox v-model="notifications" readonly></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content @click="notifications = !notifications">
              <v-list-tile-title>Notifications</v-list-tile-title>
              <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="javascript:;">
            <v-list-tile-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content @click="sound = !sound">
              <v-list-tile-title>Sound</v-list-tile-title>
              <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile href="javascript:;">
            <v-list-tile-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content @click="widgets = !widgets">
              <v-list-tile-title>Auto-add widgets</v-list-tile-title>
              <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>

  </div>
</template>

<script>
import map from "lodash/map";
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const os = require('os')
const path = require('path')

const { shell, ipcRenderer, ipcMain } = require('electron')
const remote = require("electron").remote

export default {
  name: 'Settings',
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      defaultPrinter: {},
      printers: [],
    }
  },
  computed: {
    _userLocale() { return this.$store.state.User.userLocale; },
    userLocale() { return this.localesItems.filter((item) => { return item.locale == this._userLocale; })[0] },


    _userTheme() { return this.$store.state.User.userTheme; },
    userTheme() { return this.themesItems.filter((item) => { return item.theme == this._userTheme; })[0] },

    isDesktop() { return this.$vuetify.breakpoint.lgAndUp; },
    isTablet() { return this.$vuetify.breakpoint.smAndDown; },
    isMobile() { return this.$vuetify.breakpoint.xsOnly; },
    isConnected() { return this.$store.state.User.user; },
    connectedUserName() { return this.isConnected ? this.isConnected.username : ""; },

  },
  watch: {
    defaultPrinter() {
      var connectedUserName = this.connectedUserName
      var defaultPrinter = this.defaultPrinter
      if (connectedUserName == 'admin') _store.set('global.settings.defaults.printer', defaultPrinter);
      _store.set('users.' + connectedUserName + '.settings.defaults.printer', defaultPrinter);

    }
  },
  created: function () { },
  mounted() {
    this.printers = this.getSystemPrinters();
    this.defaultPrinter = this.getUserDefaultPrinter();
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

  },
}
</script>