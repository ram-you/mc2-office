<template>
  <!-- <v-footer :fixed="fixed" app inset>
    <span>&copy; 2018</span>
  </v-footer> -->
  <v-footer height="auto" app inset>
    <v-card flat tile class="grey lighten-3 text-xs-center" width="100%">
      <v-card-text class="grey--text darken-2 py-2">
        &copy;2018 —
        <strong>MC Office</strong>
        Powered by
        <a href="https://mediacept.com" target="_blank">
          <strong>MEDIACEPT Technology &copy; 2018</strong>
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
    }
  }
}
</script>
