<template>
  <div>

    <v-dialog v-model="alert.visible" max-width="300" persistent>
      <v-card :color="alert.color" dark style="direction: ltr;">
        <v-card-title class="headline" color="white" style="background: rgba(0, 0, 0, 0.1);padding: 8px 16px;">{{alert.title}}</v-card-title>
        <v-card-text color="white">
          <div class="font-weight-bold" v-html="alert.message"> </div>
        </v-card-text>
        <v-card-text color="white">
          <v-text-field v-for="input in alert.inputs" :key="input.label" :label="input.label"
            v-model="input.model" :placeholder="input.label" dark color="white" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-for="action in alert.actions" :key="action.title" @click="action.action" dark
            flat>
            {{action.title}} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container fluid class="about-container">
      <v-slide-y-transition mode="out-in">

        <div>
          <v-layout column align-center>
            <img src="../../common/assets/img/logo/128x128.png" alt="mediacept.com" class="mb-2">
            <blockquote>
              <span class="display-2 font-weight-bold light-blue--text text--darken-3"> {{
                $t('main.app.Title_Long') }}</span>
              <footer>
                <small>
                  <em class="subheading grey--text text--lighteen-1 font-weight-regular font-italic">The
                    desktop application</em>
                </small>
              </footer>
            </blockquote>
          </v-layout>

          <v-layout column class="my-4">

            <v-card>
              <v-card-title primary-title>
                <v-list three-line style="width:100%">
                  <template v-for="(item, index) in items">
                    <v-subheader v-if="item.header" :key="item.header">
                      {{ item.header }}
                    </v-subheader>

                    <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>

                    <v-list-tile v-else :key="item.title" avatar>
                      <v-list-tile-avatar v-on:dblclick="item.cb?item.cb():function(){}">
                        <img :src="item.avatar">
                      </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title v-html="item.title"></v-list-tile-title>
                          <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>

              </v-card-title>
            </v-card>

          </v-layout>

        </div>
      </v-slide-y-transition>
    </v-container>
    <v-layout column align-center class="mt-4">
      <v-card class="weatherwidget">
        <a class="weatherwidget-io" data-icons="Climacons Animated" :href="'https://forecast7.com/'+userShortLocale+'/35d8210d63/sousse/'"
          data-label_1="Sousse" data-label_2="Tunisie" data-font="Ubuntu" :data-theme="(userTheme.theme=='dark')?'dark':'pure'">Sousse,
          Tunisie</a>
      </v-card>
    </v-layout>

    <v-layout column align-center class="mt-4">
      <v-card class="elevation-1 pa-1">
        <video style="display:block" src="../../common/assets/videos/big_buck_bunny.mp4" controls></video>
      </v-card>
    </v-layout>

    <v-layout column align-center class="mt-4" v-if="iAmSuperAdmin">
      <v-card>

        <v-form>
          <v-container>
            <v-layout row wrap>

              <v-flex xs12 sm6>
                <v-text-field v-model="sa.sk" :rules="[v => v.length <= 6 || 'Max 6 characters']"
                  counter maxlength="6" hint="Secret Key" label="Secret Key" clearable @input="computePassword()"></v-text-field>
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field v-model="sa.sp" :rules="[v => v.length <= 6 || 'Max 6 characters']"
                  counter maxlength="6" hint="Secret Phrase" label="Secret Phrase" clearable @input="computePassword()"></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field :value="sa.cp" label="Computed Password" disabled></v-text-field>
              </v-flex>

            </v-layout>
          </v-container>
        </v-form>

      </v-card>
    </v-layout>

  </div>
</template> 

<script>

var C = require("crypto-js");

var electron = require("electron")
const remote = electron.remote;
const { ipcRenderer } = require('electron')
var _app = remote.app
const electronVersion = process.versions.electron
const chromeVersion = process.versions.chrome
const v8Version = process.versions.v8
const nodeVersion = process.versions.node
const os = require('os');
const appPath = _app.getPath('exe')
const appVersion = _app.getVersion()
let SHOW_HIDDEN_WINDOWS_MENU = remote.getGlobal('showHiddenWindowsMenu');

var sysInfos;

export default {
  data() {
    var appTitle = this.$i18n.t('main.app.Title')
    return {
      showPassword: false,
      iAmSuperAdmin: false,
      sa: { sk: '', sp: '', cp: '' },
      alert: {
        visible: false, color: 'green', title: 'Title', message: 'Message',
        inputs: [{ label: 'Your input', model: null }],
        actions: [{ title: 'OK', action: () => { this.alert.visible = false } }, { title: 'Cancel', action: () => { this.alert.visible = false } }]
      },
      sysInfos: sysInfos,
      localesItems: [{ name: 'العربية', locale: 'ar-tn' }, { name: 'English', locale: 'en-gb' }, { name: 'Français', locale: 'fr-fr' }],
      themesItems: this.$colorThemeItems,
      items: [
        { header: 'Installed Versions' },
        {
          avatar: require("../../common/assets/img/logo/256x256.png"),
          title: appTitle,
          subtitle: appVersion,
          cb: this.openDevTools,
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/electron-icon.png"),
          title: 'Electron',
          subtitle: electronVersion,
          cb: this.amISuperAdmin,
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/chrome-icon.png"),
          title: 'Chrome',
          subtitle: chromeVersion
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/v8-icon.png"),
          title: 'Google V8 engine',
          subtitle: v8Version
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/nodejs-icon.png"),
          title: 'Node.js®',
          subtitle: nodeVersion
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/os-icon.png"),
          title: 'Operating System',
          subtitle: `${os.platform()}, ${os.type()}  (${os.arch()})` + `, <b>version:</b>  ${os.release()}`
        },
        { divider: true, inset: true },
        {
          avatar: require("../../common/assets/img/data_floppy_disk-icon.png"),
          title: 'Application path',
          subtitle: appPath
        },
        { divider: true, inset: true },
        // {
        //   avatar: require("../../common/assets/img/data_floppy_disk-icon.png"),
        //   title: 'System informations',
        //   subtitle: sysInfos
        // }
      ]
    }
  },
  computed: {
    appTitle() { return this.$i18n.t('main.app.Title') },
    _userLocale() { return this.$store.state.User.userLocale; },
    userLocale() { return this.localesItems.filter((item) => { return item.locale == this._userLocale; })[0] },
    userShortLocale() { return (this._userLocale).substring(0, 2); },

    _userTheme() { return this.$store.state.User.userTheme; },
    userTheme() { return this.themesItems.filter((item) => { return item.theme == this._userTheme; })[0] },

  },
  mounted() {
    var vm = this
    !function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        vm.removejscssfile("weatherwidget-io-js", "js")
        setTimeout(() => {
          js = d.createElement(s);
          js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js';
          fjs.parentNode.insertBefore(js, fjs);
        }, 100);
      } else {
        js = d.createElement(s);
        js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js';
        fjs.parentNode.insertBefore(js, fjs);
      }
    }(document, 'script', 'weatherwidget-io-js');







  },
  methods: {
    computePassword() {
      if (this.sa.sk.length == 6 && this.sa.sp.length == 6) {
        this.sa.cp = C.AES.encrypt(this.sa.sk, this.sa.sp.toLowerCase() + 'My name is Ramzi').toString().substring(11, 21);
      } else {
        this.sa.cp = ""
      }
    },
    amISuperAdmin() {
      this.showPassword = false
      this.alert = {
        visible: true, color: 'red', title: 'MEDIACEPT password', message: "Super Admin Password",
        inputs: [{ label: 'Password', model: null }],
        actions: [
          {
            title: 'OK', action: () => {
              if (this.alert.inputs[0].model == 'yorasun2008') {
                this.alert.visible = false;
                this.iAmSuperAdmin = true;
                SHOW_HIDDEN_WINDOWS_MENU["show"] = true;
                ipcRenderer.send("update-main-menu");
              } else {
                this.iAmSuperAdmin = false;
                SHOW_HIDDEN_WINDOWS_MENU["show"] = false;
                ipcRenderer.send("update-main-menu");
              }

            }
          },
          { title: 'Cancel', action: () => { this.alert.visible = false; } }]
      };
    },
    openDevTools() {
      var charsString1 = '0123456789';
      var charsString2 = 'abcdefghijklmnopqrstuvwxyz';
      var charsString3 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
      }
      var aa = randomString(6, charsString1);
      var bf = randomString(6, charsString3);

      var ct = C.AES.encrypt(aa, bf.toLowerCase() + 'My name is Ramzi').toString().substring(11, 21);

      var message = " <div>" +
        " <span class='font-weight-thin pr-2'>Secret Key:</span>" +
        " <span class='font-weight-bold'>" + aa + "</span>" +
        " </div>" +
        " <div>" +
        " <span class='font-weight-thin pr-2'>Secret Phrase:</span>" +
        " <span class='font-weight-bold'>" + bf + "</span>" +
        " </div>"


      if (this.iAmSuperAdmin) {
        message += " <div>" +
          " <span class='font-weight-thin'>Password:</span>" +
          " <span class='font-weight-bold'>" + ct + "</span>" +
          " </div>"
      }
      this.showPassword = true
      this.alert = {
        visible: true, color: 'teal', title: 'Your password', message: message,
        inputs: [{ label: 'Password', model: null }],
        actions: [
          {
            title: 'OK', action: () => {
              if (this.alert.inputs[0].model == ct) {
                this.alert.visible = false;

                SHOW_HIDDEN_WINDOWS_MENU["show"] = true;
                ipcRenderer.send("update-main-menu");
              } else {
                if (this.alert.inputs[0].model.length > 0) {
                  SHOW_HIDDEN_WINDOWS_MENU["show"] = false;
                  ipcRenderer.send("update-main-menu");
                }
              }

            }
          },
          { title: 'Cancel', action: () => { this.alert.visible = false; } }]
      };

    },
    removejscssfile(filename, filetype) {
      var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
      var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
      var allsuspects = document.getElementsByTagName(targetelement)
      for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
          allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
      }
    }

  },
}
</script>
<style>
div.weatherwidget {
  width: 100%;
  max-width: 1200px;
  text-align: center;
  margin: 0 auto;
}
</style>

