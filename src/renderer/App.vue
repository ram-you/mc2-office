<template>
  <v-app id="app" :dark="dark=='dark'">

    <v-dialog v-model="waitingResponse" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text> {{waitingMessage}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar_model" :color="snackbar_color" :multi-line="snackbar_mode === 'multi-line'"
      :timeout="snackbar_timeout" :vertical="snackbar_mode === 'vertical'" :top="snackbar_top">
      {{ snackbar_text }}
      <v-btn dark flat @click="snackbar_model = false">
        Fermer
      </v-btn>
    </v-snackbar>

    <header-section v-if="isConnected"></header-section>

    <v-content>

      <v-container style="padding: 0 0 24px 0 !important; max-width: 100% !important;">
        <transition-page>
          <router-view v-if="isConnected" />
        </transition-page>
        <login-form v-if="!isConnected && isAppInited" />
      </v-container>

    </v-content>

    <footer-section></footer-section>

  </v-app>
</template>

<script>   
const Store = require('electron-store');
const _store = new Store();

import LoginForm from './views/Login'
import Header from './views/Header'
import Footer from './views/Footer'
import TransitionSlideUp from "./components/TransitionSlideUp";
import TransitionPage from './components/TransitionPage.vue';
import { setTimeout } from 'timers';
export default {
  name: 'App',
  components: {
    'login-form': LoginForm,
    'header-section': Header,
    'footer-section': Footer,
    'transition-slide-up': TransitionSlideUp,
    TransitionPage
  },
  data() {
    return {
      waitingResponse: false,
      waitingMessage: '',

      snackbar_model: false,
      snackbar_color: '',
      snackbar_mode: '',
      snackbar_top: false,
      snackbar_timeout: 6000,
      snackbar_text: 'Traitement terminé',

      isHomePage: true,

    }
  },
  computed: {
    dark() { return this.$store.state.User.userTheme; },
    isConnected() { return this.$store.state.User.user; },
    isAppInited() { return this.$store.state.User.appInited; },
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : ""; },
  },
  watch: {
    '$route': function () {
      this.isHomePage = this.$route.name == "home";
    },
    connectedUserName: function (userName) {
      if (userName.length > 0) { this.setUserLocale(); this.setUserTheme() }
    }
  },
  mounted() {
    var vm = this;
    this.$root.$on("themeToogle", function (theme) {
      vm.dark = (theme == 'dark');
    });
    this.$store.dispatch('isConnected');
    this.$vuetify.lang.current = (this.$root.$i18n.locale).substring(0, 2);
    this.$vuetify.rtl = (this.$vuetify.lang.current == "ar");

    const ipcRenderer = require('electron').ipcRenderer
    ipcRenderer.send('put-in-tray')
    ipcRenderer.on('tray-removed', function () {
      ipcRenderer.send('remove-tray')
    })
    ipcRenderer.on('menu-change-tab', function (event, tab) {
      vm.$router.push({ name: tab });
    })


    ipcRenderer.on('initApplicationData', function (event, message) {
      if (message == 'start') {
        vm.waitingResponse = true;
        vm.waitingMessage = "Initialisation des données, veuillez patienter... "
      } else {
        vm.$store.dispatch('isConnected')
        vm.waitingResponse = false;
        if (message == 'success') {
          vm.snackbar_model = true;
          vm.snackbar_color = 'blue';
          vm.snackbar_top = true;
          vm.snackbar_mode = 'multi-line';
          vm.snackbar_timeout = 10000;
          vm.snackbar_text = "La base de données a été initialisé avec succès.";
        }


      }
    })

    ipcRenderer.on('migrateDatabase', function (event, message) {
      if (message.status == 'start') {
        vm.waitingResponse = true;
        vm.waitingMessage = "Migration des données, veuillez patienter... "
      } else {
        vm.waitingResponse = false;
        vm.snackbar_model = true;
        vm.snackbar_color = 'green';
        vm.snackbar_top = true;
        vm.snackbar_mode = 'multi-line';
        vm.snackbar_timeout = 10000;
        vm.snackbar_text = "Migration de la base de données effectuée avec succès. Ancienne Version: " + message.current + " Nouvelle Version: " + message.latest;
      }
    })


  },
  methods: {

    setUserLocale() {
      var vm = this
      var connectedUserName = this.connectedUserName
      var userLocale = _store.get('users.' + connectedUserName + '.locale.locale') || _store.get('global.locale.locale')
      if (userLocale) {
        this.$root.$i18n.locale = userLocale
        this.$vuetify.lang.current = (this.$root.$i18n.locale).substring(0, 2);
        this.$vuetify.rtl = this.$vuetify.lang.current == "ar"
        this.$store.dispatch('setUserLocale', userLocale);



      }
    },
    setUserTheme() {
      var connectedUserName = this.connectedUserName
      var userTheme = _store.get('users.' + connectedUserName + '.theme.theme') || _store.get('global.theme.theme')
      if (userTheme) {
        this.$store.dispatch('setUserTheme', userTheme)
      }
    },

  },
}
</script>


<style>
.container > div {
  height: 100% !important;
}
.application {
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
}

.application.application--is-rtl .v-navigation-drawer *,
.application.application--is-rtl .v-menu__content * {
  text-align: right;
}

.application.application--is-rtl .v-input__prepend-outer {
  margin-left: 9px;
  margin-right: 0px;
}

.v-card {
  text-align: initial;
}

::before,
::after {
  vertical-align: unset;
}
.v-breadcrumbs__item--disabled {
  color: inherit;
}

.heightAuto {
  height: auto !important;
}

.hidden-div {
  display: none !important;
  height: 0px !important;
  width: 0px !important;
  visibility: hidden !important;
  opacity: 0 !important;
  position: absolute !important;
  top: -10000px !important;
  overflow: hidden !important;
}

/* ================================ */

/* .application:not(.application--is-rtl) {
  font-family: "Ubuntu" !important;
}
 .application.application--is-rtl {
  font-family: "Tajawal" !important;
  direction: rtl;
}
.ar-fontFamily {
  font-family: "Tajawal" !important;
}
.en-fontFamily,
.fr-fontFamily {
  font-family: "Ubuntu" !important;
} */

/* ================================ */
/* ================================ */

.application:not(.application--is-rtl),
.ar-fontFamily,
.en-fontFamily,
.fr-fontFamily,
.application.application--is-rtl {
  font-family: 'Cairo', 'Ubuntu', 'Tajawal' !important;
}
.application.application--is-rtl {
  direction: rtl;
}

/* ================================ */
.v-icon {
  vertical-align: middle !important;
}

.application.application--is-rtl .v-list__tile__content,
.application.application--is-rtl .v-list__tile__title {
  text-align: right !important;
}
</style>