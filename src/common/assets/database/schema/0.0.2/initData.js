var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'app.asar', 'node_modules'));


var electron = require("electron")
const remote = electron.remote;
const app = remote.app; 
const isDevelopment = process.env.NODE_ENV !== 'production';
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;
let mainWindow = remote.getGlobal('mainWindow');

 let invoicesSchema = require("./Invoices")
let usersSchema = require("./Users")


const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });


// ==============Invoices===========
function initInvoicesTable() {
  return new Promise(function(resolve, reject) {

    knex.schema.hasTable('invoices').then(function(exists) {
      if (!exists) {
        knex.schema
          .createTable('invoices', invoicesSchema)
          .then(() => {
            console.log("Table 'invoices' created");
            countInvoices()
          })
      } else {
        countInvoices()
      }
    })

    function countInvoices() {
      knex('invoices').count('* as count').then(c => {
        var invoicesCount = c[0].count;
        console.log("invoicesCount", invoicesCount)
        if (invoicesCount == 0) { createInvoicesData() } else { resolve(false) }
      })
    }

    // ******************
    function createInvoicesData() {

      var j = 0
      initInvoices(j)

      function initInvoices(j) {
        var datas = []
        for (var i = j * 100; i < (j * 100) + 100; i++) {

          var d = new Date();
          var data = {
            invoiceClient: 'John Doe - ' + (i + 1),
            invoiceNumber: 'Invoice #' + Math.floor((Math.random() * 9000) + 1),
            invoiceDate: d.toLocaleTimeString(),
            invoiceTotal: Math.floor((Math.random() * 9000) + 1) + ' $',
            invoiceLines: JSON.stringify(['Game of the Year', 'Best Multiplayer Game', 'Best ESports Game']),
          }

          datas.push(data)
        }

        knex('invoices').insert(datas).then(result => {
          j += 1
          if (j < 365) {
            console.log("j=", j, result);
            initInvoices(j);

          } else {
            resolve(true)
          }
        })
      }

    }

  });
}
//-------------------------------




// ==============Users===========
function initUsersTable() {
  return new Promise(function(resolve, reject) {

    knex.schema.hasTable('users').then(function(exists) {
      if (!exists) {
        knex.schema
          .createTable('users', usersSchema)
          .then(() => {
            console.log("Table 'users' created");
            countUsers()
          })
      } else {
        countUsers()
      }
    })

    function countUsers() {
      knex('users').count('* as count').then(c => {
        var usersCount = c[0].count;
        console.log("usersCount", usersCount)
        if (usersCount == 0) { createUsersData() } else { resolve(false) }
      })
    }

    // ******************
    function createUsersData() {
      mainWindow.webContents.send("initApplicationData", 'start');
      var j = 0
      initUsers(j)

      function initUsers(j) {
        var crypto = require("crypto");
        var datas = []
        for (var i = j * 100; i < (j * 100) + 100; i++) {

          var d = new Date();
          var data = {
            first_name: 'John - ' + (i + 1),
            last_name: 'Doe - ' + (i + 1),
            password: crypto.randomBytes(20).toString('hex'),
          }

          datas.push(data)
        }

        knex('users').insert(datas).then(result => {
          j += 1
          if (j < 365) {
            console.log("j=", j, result);
            initUsers(j);

          } else {
            resolve(true)
          }
        })
      }

    }

  });
}
//-------------------------------







function initDatabase() {

  var promises = Promise.all([initInvoicesTable(), initUsersTable()]);
  promises.then(function(values) {
    console.log("done Users+Invoices",values)
    if (values.every( (val, i, arr) => val === false )){
      mainWindow.webContents.send("initApplicationData", 'nothingtodo');
    }else{
      mainWindow.webContents.send("initApplicationData", 'success');
    }
   
  });
}
initDatabase()
module.exports = {}