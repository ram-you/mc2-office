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

const fs = require('fs')
const fse = require('fs-extra');



let schemaModels = require("./models/index.js"); 

const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });



// ==============initTable===========
function initTable(tableName) {
  return new Promise(function(resolve, reject) {
    knex.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        var tableSchemaModel = require(path.resolve(__dirname, "./models/" + tableName + ".js"));
        knex.schema.createTable(tableName, tableSchemaModel).then(() => {
          console.log("Table '" + tableName + "' created.");
          countTableItems(tableName)
        })
      } else {
        countTableItems(tableName)
      }
    })

    function countTableItems(tableName) {
      knex(tableName).count('* as count').then(c => {
        var total = c[0].count;
        console.log("Total items in Table '" + tableName + "' =", total)
        if (total == 0) { importDataFromSqlFile(tableName) } else { resolve(false) }
      })
    }

    // ******************
    function importDataFromSqlFile(tableName) {
      var dataSqlFile = path.resolve(__dirname, "./data/" + tableName + ".sql");
      fs.exists(dataSqlFile, function(exists) {
        if (exists) {
          mainWindow.webContents.send("initApplicationData", 'start');
          var sql = fs.readFileSync(dataSqlFile).toString() 
        
          knex.raw(sql).then(result => { resolve(true) })

        } else {
          resolve(false)
        }
      })
    };
  })
}




function initDatabase() {
  var databaseModels = schemaModels;
  var funcs = []
  for (var i = 0; i < databaseModels.length; i++) {
    funcs.push(eval('initTable("' + databaseModels[i] + '")'))
  }
  var promises = Promise.all(funcs);
  promises.then(function(values) {
    console.log(databaseModels, values)
    if (values.every((val, i, arr) => val === false)) {
      mainWindow.webContents.send("initApplicationData", 'nothingtodo');
    } else {
      mainWindow.webContents.send("initApplicationData", 'success');
    }

  });
};

initDatabase();
module.exports = {}