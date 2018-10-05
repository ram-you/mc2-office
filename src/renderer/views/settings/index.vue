<template>
  <v-tabs centered icons-and-text  >
    <v-tabs-slider color="orange"></v-tabs-slider>

    <v-tab href="#tab-profile">
      Company Profile
    </v-tab>

    <v-tab href="#tab-invoice">
      Invoice
    </v-tab>

    <v-tab href="#tab-general">
      General
    </v-tab>

    <v-tabs-items>
      <v-tab-item id="tab-profile">
        <profile-settings/>
      </v-tab-item>

      <v-tab-item id="tab-invoice">
        <invoice-settings/>
      </v-tab-item>

      <v-tab-item id="tab-general">
        <general-settings/>
      </v-tab-item>
    </v-tabs-items>

  </v-tabs>
</template>
<script>
import ProfileSettings from './profile.vue'
import InvoiceSettings from './invoice.vue'
import GeneralSettings from './general.vue'
export default {
  components: {
    ProfileSettings,
    InvoiceSettings,
    GeneralSettings,
  },
  data() {
    return {

    }
  }
}
</script>
<style>
.v-tabs__container.v-tabs__container--centered{
  direction: ltr
}
</style>

