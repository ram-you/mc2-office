<template>

  <v-card style="width: 20%; min-width: 250px; max-width: 300px;">

    <v-list two-line subheader>
      <v-subheader>Invoice style</v-subheader>

      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Color theme</v-list-tile-title>
          <v-list-tile-sub-title>Change Invoice theme</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <swatches v-model="color" colors="material-dark" shapes="squares" swatch-size="24" :trigger-style="{ width: '22px', height: '22px' ,margin: '2px'}"
          />
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Profile photo</v-list-tile-title>
          <v-list-tile-sub-title>Change your Google+ profile photo</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Show your status</v-list-tile-title>
          <v-list-tile-sub-title>Your status is visible to everyone</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>

    <v-list subheader two-line>
      <v-subheader>Hangout notifications</v-subheader>

      <v-list-tile>
        <v-list-tile-action>
          <v-checkbox v-model="ltr"></v-checkbox>
        </v-list-tile-action>
        <v-list-tile-content @click="ltr = !ltr">
          <v-list-tile-title>LTR direction</v-list-tile-title>
          <v-list-tile-sub-title>Force Left To Right</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile>
        <v-list-tile-action>
          <v-checkbox v-model="sound"></v-checkbox>
        </v-list-tile-action>

        <v-list-tile-content @click="sound = !sound">
          <v-list-tile-title>Sound</v-list-tile-title>
          <v-list-tile-sub-title>Hangouts message</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile>
        <v-list-tile-action>
          <v-checkbox v-model="video"></v-checkbox>
        </v-list-tile-action>

        <v-list-tile-content @click="video = !video">
          <v-list-tile-title>Video sounds</v-list-tile-title>
          <v-list-tile-sub-title>Hangouts video call</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile>
        <v-list-tile-action>
          <v-checkbox v-model="invites"></v-checkbox>
        </v-list-tile-action>

        <v-list-tile-content @click="invites = !invites">
          <v-list-tile-title>Invites</v-list-tile-title>
          <v-list-tile-sub-title>Notify when receiving invites</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>

</template>

<script>
import Swatches from 'vue-swatches'

// Import the styles too, globally
import "vue-swatches/dist/vue-swatches.min.css"
export default {
  props: [],
  components: { Swatches },
  data() {
    return {
      color: '#57B223',
      ltr: false,
      sound: false,
      video: false,
      invites: false
    }
  },
  watch: {
    'color': function (color) {
      this.updateTheme(color)
    },
        'ltr': function (ltr) {
      this.updateDirection(ltr)
    },
  },
  methods: {
    updateTheme(color) {
      var x, i
      var container = document.getElementsByClassName('billing-container')[0]
      var table = container.getElementsByTagName("table")[0]

      x = table.getElementsByClassName('no')
      for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = color;
      }
      x = table.getElementsByClassName('total')
      for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = color;
      }
      x = table.getElementsByTagName('h3')
      for (i = 0; i < x.length; i++) {
        x[i].style.color = color;
      }


    },
    updateDirection(ltr){
        var container = document.getElementsByClassName('billing-container')[0]
      if (ltr){
container.style.direction="ltr"
      }else{
container.style.direction="inherit"
      }
    }
  }
}
</script>
<style>
.vue-swatches {
  padding-top: 6px;
}
</style>
