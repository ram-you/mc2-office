<template>
  <div>
    <v-container grid-list-md :class="isDarkTheme?'dashboard-dark':'dashboard-light'" class="dashboard pa-2">
      <v-layout row wrap>
        <v-flex d-flex xs12 sm6 md3>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-card class="grey--text">
                <v-card-title class="justify-center pt-4">
                  <v-icon class="fa-6x grey--text">fa-file-alt</v-icon>
                </v-card-title>
                <v-card-title class="justify-center subheading label-title">Quotations</v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <v-card class="light-green--text">
                    <v-card-title class="justify-center pt-4">
                      <v-icon class="fa-6x light-green--text">fa-cubes</v-icon>
                    </v-card-title>
                    <v-card-title class="justify-center subheading label-title">Products</v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm6 md3>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-card to="/invoices" class="green--text">
                <v-card-title class="justify-center pt-4">
                  <v-icon class="fa-6x green--text">fa-file-invoice</v-icon>
                </v-card-title>
                <v-card-title class="justify-center subheading label-title">Invoices</v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <v-card to="/settings" class="red--text">
                    <v-card-title class="justify-center pt-4">
                      <v-icon class="fa-6x red--text">fa-cogs</v-icon>
                    </v-card-title>
                    <v-card-title class="justify-center subheading label-title">Settings</v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm6 md3>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-card class="blue--text">
                <v-card-title class="justify-center pt-4">
                  <v-icon class="fa-6x blue--text">fa-user-tie</v-icon>
                </v-card-title>
                <v-card-title class="justify-center subheading label-title">Customers</v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <v-card to="/about" class="teal--text">
                    <v-card-title class="justify-center pt-4">
                      <v-icon class="fa-6x teal--text">fa-info-circle</v-icon>
                    </v-card-title>
                    <v-card-title class="justify-center subheading label-title">About</v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm6 md3>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-card to="/login" class="deep-orange--text">
                <v-card-title class="justify-center pt-4">
                  <v-icon class="fa-6x deep-orange--text">fa-sign-out-alt</v-icon>
                </v-card-title>
                <v-card-title class="justify-center subheading label-title">Logout</v-card-title>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <v-card @click.native="confirmDialogQuit=true" class="orange--text">
                    <v-card-title class="justify-center pt-4">
                      <v-icon class="fa-6x orange--text">fa-power-off</v-icon>
                    </v-card-title>
                    <v-card-title class="justify-center subheading label-title">Quit</v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

    </v-container>

    <v-dialog v-model="confirmDialogQuit" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-card-text>Quitter l'application ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="applicationQuit">Yes</v-btn>
          <v-btn color="green darken-1" flat @click="()=>{this.confirmDialogQuit=false}">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
const app = remote.app;

export default {
  props: ['theme'],
  data: () => ({
    confirmDialogQuit: false,
  }),
  computed: {
    isDarkTheme() { return this.theme == 'dark' },
  },
  methods: {
    applicationQuit() {
      app.quit()
    }
  },
}
</script>

<style>
.dashboard {
  max-width: 1485px;
}
.dashboard .v-card {
  min-height: 186px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dashboard .v-card .v-icon{ 
      text-shadow: 1px 5px 5px rgba(0,0,0,0.1);
    transition: all 0.3s;
}
.dashboard .v-card:hover .v-icon{ 
      text-shadow: 1px 5px 5px rgba(0,0,0,0.15); 
}
.dashboard .v-card:hover {
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;
}
.dashboard .v-card .label-title {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: rgba(0, 0, 0, 0.2);
  color: #6b6b6b;
}
.dashboard .v-card:hover .label-title {
  color: inherit;
  font-weight: bolder;
}
/* =================== */
.dashboard-dark .v-card {
  filter: contrast(90%);
}
.dashboard-dark .v-card:hover {
  filter: contrast(75%);
}

/* ========================== */

.dashboard-light .v-card {
  filter: grayscale(50%);
  background-color: #e0e0e0;
}
.dashboard-light .v-card:hover {
   background-color: #fff;
  filter: grayscale(10%);
}
</style>
