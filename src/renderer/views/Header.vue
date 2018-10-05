<template>
  <div>

    <v-dialog v-model="alert.visible" max-width="300" persistent>
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

    <v-navigation-drawer :value="drawerState" :clipped="isDesktop" app :right="$vuetify.rtl" :fixed="isDesktop"
      :mini-variant="miniVariant">
      <div class="py-2"></div>
      <v-list>
        <!-- ****************************** -->
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon class="brown--text brown lighten-3">mdi-home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">{{ $t('main.app.Home') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon class="blue white--text">mdi-account-multiple</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Clients</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon class="light-green white--text">mdi-package-variant</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Products</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/invoices" @mouseover="invoice_new=true" @mouseleave="invoice_new=false">
          <v-list-tile-action>
            <v-icon class="green white--text">mdi-file-pdf</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Invoices</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon v-show="invoice_new" @click.prevent="gotoPage('/invoice/new')" style="box-shadow: none !important; background: none !important;"
              class="mdi-18px">mdi-plus-circle-outline</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon class="blue-grey white--text">mdi-file-document</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Quotes</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon class="deep-purple white--text">mdi-office-building</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Vendors</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider class="my-3"></v-divider>
        <v-subheader class="mt-3">Billing</v-subheader>

        <v-list-tile to="/invoice/22/?number=FAC-2017-005">
          <v-list-tile-action>
            <v-icon class="green white--text">mdi-file-document-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Invoice</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/charts">
          <v-list-tile-action>
            <v-icon class="blue white--text">mdi-chart-line</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Charts</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- ****************************** -->
        <!-- Actions  -->
        <v-divider class="my-3"></v-divider>

        <!-- ****************************** -->

        <!-- Data Tables -->
        <v-list-tile to="/data-tables">
          <v-list-tile-action>
            <v-icon class="indigo white--text">mdi-table-large</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">Data table</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- Data Tables -->
        <!-- ****************************** -->

        <v-list-tile @click="openHomeDir()">
          <v-list-tile-action>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">
              Votre dossier personnel
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- ****************************** -->
        <v-list-tile @click="openAppDataDir()">
          <v-list-tile-action>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">
              Dossier Données de l'application
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- ****************************** -->
        <v-list-tile @click="printToPDF()">
          <v-list-tile-action>
            <v-icon>mdi-file-pdf</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">
              Prendre une copie PDF
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- ======== -->
        <!-- ****************************** -->

        <!-- ****************************** -->

        <v-divider class="my-3"></v-divider>

        <v-list-tile to="/login">
          <v-list-tile-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">{{ $t('main.app.Logout') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/about">
          <v-list-tile-action>
            <v-icon>mdi-information-variant</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">
              {{ $t('main.app.About') }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/settings">
          <v-list-tile-action>
            <v-icon class="red--text">mdi-settings-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="subheading">
              {{ $t('settings.header') }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- ****************************** -->
        <div class="py-4"></div>
      </v-list>
    </v-navigation-drawer>

    <!-- ***********           ************* -->
    <!-- ***********  TOOLBAR  ************* -->
    <!-- ***********           ************* -->
    <v-toolbar :dark="isDarkTheme" app fixed clipped-left :clipped-right="$vuetify.rtl">
      <v-toolbar-side-icon @click.stop="toggleMenuDrawer()" :style="{'margin-left':$vuetify.rtl?'0':'','margin-right':$vuetify.rtl?'-6px':''}"></v-toolbar-side-icon>
      <img src="../../common/assets/img/logo/32x32.png" alt="MC-Office" style="width:32px; height:32px;">
      <v-toolbar-title class="mx-2 align-center">
        <span class="title font-weight-bold light-blue--text text--darken-3">{{
          $t('main.app.Title_Long') }} </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu open-delay="500" close-delay="300" :class="isDarkTheme?'theme--dark':'theme--light'">
        <v-toolbar-title slot="activator">
          <v-btn icon>
            <v-icon class="grey--text">mdi-theme-light-dark</v-icon>
          </v-btn>
        </v-toolbar-title>
        <v-list dense subheader :class="isDarkTheme?'theme--dark':'theme--light'">
          <v-subheader> {{ $t('main.app.Color_theme')}}</v-subheader>
          <v-list-tile v-for="item in themesItems" :key="item.theme" @click="updateUserTheme(item)"
            :class="isDarkTheme?'theme--dark':'theme--light'">
            <v-list-tile-title v-text="item.name" :class="(item.name==userTheme.name)?'font-weight-bold primary--text':''"
              style="overflow: unset;"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu offset-x open-delay="500" close-delay="300">
        <v-toolbar-title slot="activator">
          <v-btn icon>
            <v-icon class="grey--text">mdi-earth</v-icon>
          </v-btn>
        </v-toolbar-title>
        <v-list dense subheader>
          <v-subheader> {{ $t('main.app.Application_Locale')}}</v-subheader>
          <v-list-tile v-for="item in localesItems" :key="item.locale" @click="updateUserLocale(item)">
            <v-list-tile-title v-text="item.name" :class="(item.name==userLocale.name)? getLocaleFontClass(item)+'font-weight-bold primary--text':getLocaleFontClass(item)"
              style="overflow: unset;"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-btn icon to="/login">
        <v-icon class="grey--text">mdi-logout</v-icon>
      </v-btn>

    </v-toolbar>
    <!-- ****************************** -->
  </div>

</template>

<script>    
const Store = require('electron-store');
const _store = new Store();

const fs = require('fs')
const os = require('os')
const path = require('path')

const { shell, ipcRenderer, ipcMain } = require('electron')
const remote = require("electron").remote

import TransitionSlideUp from "../components/TransitionSlideUp";
export default {
  name: 'Header',
  components: { TransitionSlideUp, },
  data() {
    return {
      invoice_new: false,
      isHomePage: this.$route.name == "home",
      miniVariant: false,
      drawerState: false,
      drawer: -1,
      localesItems: this.$localesItems,
      themesItems: this.$colorThemeItems,
      alert: {
        visible: false, color: 'green', title: 'Message', message: 'Message',
        actions: [{ title: this.$t('main.app.Ok'), action: () => { this.alert.visible = false } }, { title: this.$t('main.app.Cancel'), action: () => { this.alert.visible = false } }]
      },
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
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : ""; },
    isDarkTheme() { return this.userTheme.theme == 'dark'; }
  },
  watch: {
    '$route': function () {
      this.isHomePage = this.$route.name == "home";
    },
    "$vuetify.rtl": function () {


    },


    "isDesktop": function (val) {
      if (val) {
        var connectedUserName = this.connectedUserName
        var menuDrawerState = _store.get('users.' + connectedUserName + '.menu.drawer.state')
        var _menuDrawerState = Number.isInteger(menuDrawerState) ? menuDrawerState : -1;
        this.drawer = _menuDrawerState;
        this.miniVariant = (this.drawer == 0)
        this.drawerState = (this.drawer > -1)
      }
    }
  },
  mounted() {
    var vm = this
    var connectedUserName = this.connectedUserName
    var menuDrawerState = _store.get('users.' + connectedUserName + '.menu.drawer.state')
    var _menuDrawerState = Number.isInteger(menuDrawerState) ? menuDrawerState : -1;
    var breakPoint = this.isDesktop;
    this.drawer = breakPoint ? _menuDrawerState : -1;
    this.miniVariant = breakPoint ? (_menuDrawerState == 0) : false

    this.drawerState = breakPoint ? (this.drawer > -1) : false
    _store.onDidChange('users.' + connectedUserName + '.locale', (newValue, oldValue) => {
      ipcRenderer.send('update-main-menu')
    })
    this.themesItems = this.$colorThemeItems.map(function (e) {
      e.name = vm.$i18n.t('main.app.' + e.theme)
      return e;
    });
  },
  methods: {
    gotoPage(page) {
      this.$router.push({ path: page });
    },
    getLocaleFontClass(item) {
      return item.locale.substring(0, 2) + '-fontFamily ';
    },
    updateUserLocale(locale) {
      var vm = this
      var currentDirection = this.$vuetify.rtl ? 'rtl' : 'ltr'
      var askedDirection = locale.locale.substring(0, 2) == "ar" ? 'rtl' : 'ltr'
      if (currentDirection != askedDirection) {

        this.alert = {
          visible: true, color: 'primary', title: this.$t('main.app.Restart'), message: this.$t('main.app.Restart_message'),
          actions: [
            {
              title: this.$t('main.app.Restart'),
              action: () => {
                vm.alert.visible = false;
                vm._updateUserLocale(locale);
                setTimeout(() => {
                  const remote = require('electron').remote;
                  remote.app.relaunch();
                  remote.app.quit(0);
                }, 100);

              }
            },
            {
              title: this.$t('main.app.Later'),
              action: () => {
                this.alert.visible = false;
                vm._updateUserLocale(locale)
              }
            }
          ]
        }

      } else {
        vm._updateUserLocale(locale)
      }
    },
    _updateUserLocale(locale) {
      var vm = this;
      var connectedUserName = this.connectedUserName
      this.$root.$i18n.locale = locale.locale
      this.$vuetify.lang.current = (this.$root.$i18n.locale).substring(0, 2);
      this.$vuetify.rtl = this.$vuetify.lang.current == "ar";
      this.$store.dispatch('setUserLocale', locale.locale).then(() => {
        if (connectedUserName == 'admin') _store.set('global.locale', locale);
        _store.set('users.' + connectedUserName + '.locale', locale);
      })
      this.themesItems = this.$colorThemeItems.map(function (e) {
        e.name = vm.$i18n.t('main.app.' + e.theme)
        return e;
      });
      ipcRenderer.send("update-main-menu");


    },
    updateUserTheme(theme) {
      var connectedUserName = this.connectedUserName
      this.$store.dispatch('setUserTheme', theme.theme).then(() => {
        if (connectedUserName == 'admin') _store.set('global.theme', theme);
        _store.set('users.' + connectedUserName + '.theme', theme);
      })


    },

    toggleMenuDrawer() {
      var vm = this
      var breakPoint = this.isDesktop
      var x
      if (breakPoint) {
        x = this.drawer + 1
        if (x == 2) x = -1;
        this.miniVariant = (x == 0)
        this.drawer = x
        this.drawerState = (this.drawer > -1)
      } else {
        this.miniVariant = false
        this.drawerState = false
        setTimeout(() => {
          vm.drawerState = true
        }, 100);

      }


      var connectedUserName = this.connectedUserName
      if (breakPoint) _store.set('users.' + connectedUserName + '.menu.drawer.state', this.drawer);
    },
    openHomeDir(event) {
      var _app = require('electron').remote.app
      const userHomePath = _app.getPath('home')
      shell.showItemInFolder(userHomePath)
    },
    openAppDataDir(event) {
      var _app = require('electron').remote.app
      const appDataPath = _app.getPath('userData') + path.sep + _app.getName()
      shell.showItemInFolder(appDataPath)
    },
    printToPDF(event) {
      const pdfPath = path.join(os.tmpdir(), 'print.pdf')
      const win = remote.getCurrentWindow()
      // Use default printing options
      win.webContents.printToPDF({}, (error, data) => {
        if (error) throw error
        fs.writeFile(pdfPath, data, (error) => {
          if (error) throw error
          shell.openExternal(`file://${pdfPath}`)
          // event.sender.send('wrote-pdf', pdfPath)
        })
      })



    },


  },
}
</script>

<style scoped>
.v-list__tile__action i {
  padding: 4px;
  border-radius: 50%;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
  background: rgba(0, 0, 0, 0.13);
}
.v-avatar {
  background: #fff;
}
.v-navigation-drawer {
  overflow-y: auto;
  max-height: calc(100% - 48px) !important;
}
.v-navigation-drawer--temporary:not(.v-navigation-drawer--close),
.v-navigation-drawer--is-mobile:not(.v-navigation-drawer--close) {
  max-height: initial !important;
}
</style>
