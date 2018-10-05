<template>
  <v-flex xs12>
    <v-breadcrumbs divider="/">
      <v-breadcrumbs-item
        v-for="item in $root.breadcrumbs"
        :key="item.text"
        :disabled="item.disabled"
        :to="item.href"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
  </v-flex>
</template>

<script>
  export default {
    name: 'Breadcrumbs'
  }
</script>
