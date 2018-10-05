 

import db from "../models";
var Users = db.Users.model
  
 



const crypto = require('crypto');

const Store = require("electron-store");
const _store = new Store();
var connectedUserName = _store.get('user.username')
var userLocale = _store.get('users.' + connectedUserName + '.locale.locale') || _store.get('global.locale.locale');
var userTheme = _store.get('users.' + connectedUserName + '.theme.theme') || _store.get('global.theme.theme');



// =======================STATE======================
const state = {
  appInited: false,
  user: null,
  users: [],
  userLocale: userLocale || "en-gb",
  userTheme: userTheme || "light"
}

// =======================GETTERS======================
const getters = {}

// =======================MUTATIONS======================
const mutations = {
  updateUserLocale(state, data) {
    state.userLocale = data;
  },
  updateUserTheme(state, data) {
    state.userTheme = data;
  },
  setUser(store, data) {
    store.user = data;
  },
  setUsers(store, data) {
    store.appInited = true;
    store.users = data;
  },
  resetUser(store) {
    store.appInited = true;
    store.user = null;
  }
}

// =======================ACTIONS======================
const actions = {

  setUserLocale({ commit }, data) {
    commit("updateUserLocale", data);
    return Promise.resolve();
  },

  setUserTheme({ commit }, data) {
    commit("updateUserTheme", data);
    return Promise.resolve();
  },

  login({ commit }, data) {
    var pass_hash = crypto.createHash('md5').update(data.password, 'utf-8').digest('hex').toUpperCase();
    return new Promise((resolve, reject) => {
 

      Users.findOne({ username: data.username, password: pass_hash }, function (err, doc) {
        if (doc) {
          if (data.remember) {
            var user = { username: doc.username, password: doc.password, connected: true };
          } else {
            var user = { username: doc.username, connected: true };
          }
          commit("setUser", user);
          resolve(user)
        } else {
          commit("resetUser");
          resolve(false)
        }
      })




    })
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit("resetUser");
      resolve(true)
    })
  },

  getUser({ commit }, data) {
    return Users.findOne({ username: data.username }, function (err, doc) {
      if (doc) {
        var user = { username: doc.username }
        return commit("setUser", user)
      } else {
        commit("resetUser");
        return Promise.resolve(false);
      }
    })
  },

  getUsers({ commit }) {
     Users.find({}, function (err, docs) {
      commit("setUsers", docs)
      return Promise.resolve();
    })
  },

  isConnected({ commit }) {
    var userName = _store.get('users.' + connectedUserName + '.credential.name');
    var userPassword = _store.get('users.' + connectedUserName + '.credential.password');
    if (userName && userPassword) {
       Users.findOne({ username: userName, password: userPassword }, function (err, doc) {
        if (doc) {
          var user = { username: doc.username, connected: true }
          commit("setUser", user);
        } else { commit("resetUser"); }
        return Promise.resolve(false);
      });

    } else {
      commit("resetUser");
      return Promise.resolve(false);
    }
  },


}



// =======================EXPORT======================
export default {
  state,
  getters,
  mutations,
  actions
}