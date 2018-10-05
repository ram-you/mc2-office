var fs = require('fs');

import path from 'path'

// const { ipcRenderer } = require('electron')
// import { remote } from 'electron'
// const app = remote.app
// let dbWorkerWindow = remote.getGlobal('dbWorkerWindow');

// dbWorkerWindow.webContents.send("getInvoices", 'invoices');

// var _CB = (event, data) => {
//   console.log("Done invoicesResults FROM VUE STORE", data)
//   commit("setInvoices", data)
// }
// ipcRenderer.on("invoicesResults", _CB);



// =======================STATE======================
const state = {
  invoices: []
}

// =======================GETTERS======================
const getters = {}

// =======================MUTATIONS======================
const mutations = {

  setInvoices(state, data) {
    state.invoices = data;
  },
}

// =======================ACTIONS======================
const actions = {



  getInvoices({ commit, state, dispatch }) {


    return new Promise((resolve, reject) => {

      resolve(true)
    })


  },
}



// =======================EXPORT======================
export default {
  state,
  getters,
  mutations,
  actions
}