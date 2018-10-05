<template>
  <div>
    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <div class="display-1 mb-2">Selection Controls</div>
        <p>Selection control components allow a user to select options. These components must be used with
          the v-model prop as they do not maintain their own state.</p>
        <v-checkbox :label="`Checkbox 1: ${checkbox.toString()}`" v-model="checkbox"></v-checkbox>
        <v-radio-group v-model="radioGroup">
          <v-radio v-for="n in 3" :key="n" :label="`Radio ${n}`" :value="n"></v-radio>
        </v-radio-group>
        <v-switch :label="`Switch 1: ${switch1.toString()}`" v-model="switch1"></v-switch>
      </v-card>
    </v-flex>

    <v-flex xs12 mt-4>
      <v-card class="pa-4 ma-4">
        <div class="title mb-2">Checkboxes - Array</div>
        <p>{{ selected }}</p>
        <v-checkbox v-model="selected" label="John" value="John"></v-checkbox>
        <v-checkbox v-model="selected" label="Jacob" value="Jacob"></v-checkbox>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Checkboxes - Colors</div>
          <p>Checkboxes can be colored by using any of the builtin colors and contextual names using the
            color prop.</p>
          <v-layout row wrap style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="red" color="red" value="red" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="red darken-3" color="red darken-3" value="red darken-3" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="indigo" color="indigo" value="indigo" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="indigo darken-3" color="indigo darken-3" value="indigo darken-3" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="orange" color="orange" value="orange" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="orange darken-3" color="orange darken-3" value="orange darken-3" hide-details></v-checkbox>
            </v-flex>
          </v-layout>

          <v-layout row wrap class="mt-5" style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="primary" color="primary" value="primary" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="secondary" color="secondary" value="secondary" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="success" color="success" value="success" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="info" color="info" value="info" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-checkbox v-model="ex4" label="warning" color="warning" value="warning" hide-details></v-checkbox>
              <v-checkbox v-model="ex4" label="error" color="error" value="error" hide-details></v-checkbox>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Checkboxes - Inline with a textfield</div>
          <v-layout align-center>
            <v-checkbox v-model="includeFiles" hide-details class="shrink mr-2"></v-checkbox>
            <v-text-field label="Include files"></v-text-field>
          </v-layout>
          <v-layout align-center>
            <v-checkbox v-model="enabled" hide-details class="shrink mr-2"></v-checkbox>
            <v-text-field :disabled="!enabled" label="I only work if you check the box"></v-text-field>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Switches - Boolean</div>
          <v-switch :label="`Switch 1: ${switch1.toString()}`" v-model="switch1"></v-switch>
          <v-switch :label="`Switch 2: ${switch2.toString()}`" v-model="switch2"></v-switch>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Switches - Array</div>
          <p>{{ people }}</p>
          <v-switch v-model="people" label="John" value="John"></v-switch>
          <v-switch v-model="people" label="Jacob" value="Jacob"></v-switch>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card class="pa-4 ma-4">
        <v-card-text>
          <div class="title mb-2">Switches - Colors</div>
          <p>Switches can be colored by using any of the builtin colors and contextual names using the color
            prop.
          </p>
          <v-layout row wrap style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="red" color="red" value="red" hide-details></v-switch>
              <v-switch v-model="ex11" label="red darken-3" color="red darken-3" value="red darken-3" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="indigo" color="indigo" value="indigo" hide-details></v-switch>
              <v-switch v-model="ex11" label="indigo darken-3" color="indigo darken-3" value="indigo darken-3" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="orange" color="orange" value="orange" hide-details></v-switch>
              <v-switch v-model="ex11" label="orange darken-3" color="orange darken-3" value="orange darken-3" hide-details></v-switch>
            </v-flex>
          </v-layout>

          <v-layout row wrap class="mt-5" style="max-width: 900px;">
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="primary" color="primary" value="primary" hide-details></v-switch>
              <v-switch v-model="ex11" label="secondary" color="secondary" value="secondary" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="success" color="success" value="success" hide-details></v-switch>
              <v-switch v-model="ex11" label="info" color="info" value="info" hide-details></v-switch>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-switch v-model="ex11" label="warning" color="warning" value="warning" hide-details></v-switch>
              <v-switch v-model="ex11" label="error" color="error" value="error" hide-details></v-switch>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

  </div>
  
</template>
<script>
export default {
  name: 'SelectionControls',
  data() {
    return {
      checkbox: true,
      radioGroup: 1,
      switch1: true,
      selected: ['John'],
      ex4: ['red', 'indigo', 'orange', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'red darken-3', 'indigo darken-3', 'orange darken-3'],
      includeFiles: true,
      enabled: false,
      switch1: true,
      switch2: false,
      people: ['John'],
      ex11: ['red', 'indigo', 'orange', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'red darken-3', 'indigo darken-3', 'orange darken-3']
    }
  },
  created: function () {
  
  }
}
</script>