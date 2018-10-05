<template>
  <!-- <v-layout row justify-center> -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <!-- v-btn color="primary" dark slot="activator">Open Dialog</v-btn -->
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>{{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="doYes">Yes</v-btn>
          <v-btn color="green darken-1" flat @click.native="doNo">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <!-- </v-layout> -->
</template>

<script>
export default {
  props: ['text','openedDialog'],
  methods: {
    doYes() {
      // this.dialog = false
      this.$emit('sayYes')
    },
    doNo() {
      // this.dialog = false
      this.$emit('sayNo')
    }
  },
  data() {
    return {
      dialog: this.openedDialog
    }
  }
}
</script>