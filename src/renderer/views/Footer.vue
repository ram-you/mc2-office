<template>
  <v-footer height="auto" app inset>

    <v-card flat tile class="text-xs-left" style="display: inline-table;">
      <v-divider></v-divider>
      <v-card-text class="py-2 px-3 font-weight-thin">
        {{routeName}}
      </v-card-text>
    </v-card>

    <v-card flat tile :class="$vuetify.rtl?'text-xs-left':'text-xs-right'" width="100%">
      <v-divider></v-divider>
      <v-card-text class="grey--text text--darken-2 py-2">
       
        <!-- <strong v-if="!aboutPage" class="mx-1"> MC Office</strong> -->
        Powered by
        <a href="http://mediacept.com/" style="text-decoration: none;">
          <span class="grey--text text--darken-1 mx-1" style="font-size: 13px;font-weight: bold;">MEDIACEPT Technology
            <!-- <sup>®</sup> -->
              © {{currentYear}}
          </span>
        </a>
       
      </v-card-text>
    </v-card>

  </v-footer>
</template>

<script>

export default {
  name: 'Footer',
  data() {
    return {
      aboutPage: true,
      currentYear: (new Date()).getFullYear()
    }
  },
  computed: {
    routeName() { return this.$route.name },
  },
  watch: {
    '$route': function () {
      this.aboutPage = this.$route.name == "about" || this.$route.name == "home"

    }
  },
  mounted() {
    let win = null

    const { BrowserWindow } = require("electron").remote

    const links = document.querySelectorAll('a[href]')

    Array.prototype.forEach.call(links, (link) => {
      const url = link.getAttribute('href')
      if (url.indexOf('http') === 0) {
        link.addEventListener('click', (e) => {
          e.preventDefault()

          if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
          } else {
            win = new BrowserWindow({
              show: false,
              autoHideMenuBar: true,
              webPreferences: { nodeIntegration: false }
            })
            win.once('ready-to-show', () => {
              win.show()
            })
            win.loadURL(url)
            require('electron').remote.getCurrentWindow().on('close', () => {
              win.close();
            })
            win.on('closed', () => {
              win = null;
            })
          }


        })
      }
    })
  }

}
</script>
