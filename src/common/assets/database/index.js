var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));

const Handlebars = require("handlebars");

const fs = require('fs')
const fse = require('fs-extra');

var XLSX = require('xlsx');

var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
const { BrowserWindow } = require('electron').remote;
const ipcRenderer = electron.ipcRenderer;
const isDevelopment = process.env.NODE_ENV !== 'production';
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;
var appDatabase;
let mainWindow = remote.getGlobal('mainWindow');

let DB_VERSION = remote.getGlobal('DB_VERSION')
let ASSETS = remote.getGlobal('ASSETS_GLOBAL')



const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });

var versionFile = path.join(userDataPath, 'database/version.json')



var obj = { current: DB_VERSION, latest: DB_VERSION }
fs.exists(versionFile, function(exists) {
  if (exists) {
    fs.readFile(versionFile, function readFileCallback(err, data) {
      if (err) { console.log(err); } else {
        obj = JSON.parse(data);
        obj.latest = DB_VERSION
        var json = JSON.stringify(obj);
        fs.writeFile(versionFile, json, () => { migrateDB(obj) });
      }
    });
  } else {
    fse.ensureDirSync(path.join(userDataPath, 'database'))
    var json = JSON.stringify(obj);
    fs.writeFile(versionFile, json, () => { migrateDB(obj) });
  }
});



function migrateDB(version) {
  if (version.current == version.latest) {
    require("./schema/" + version.current + "/initData.js");
    get_dbStatistics()
  } else {
    var migrationFile = path.join(ASSETS, "database/schema/" + version.latest + "/migrate/" + version.current + ".js");
    fs.exists(migrationFile, function(exists) {
      if (exists) {
        mainWindow.webContents.send("migrateDatabase", { status: 'start', current: version.current, latest: version.latest });
        var migrate = require(migrationFile);
        migrate.migrateDatabase().then((result) => {
          obj = { current: DB_VERSION, latest: DB_VERSION }
          var json = JSON.stringify(obj);
          fs.writeFile(versionFile, json, () => {
            console.log("Migration done.")
            mainWindow.webContents.send("migrateDatabase", { status: 'finish', current: version.current, latest: version.latest });
            get_dbStatistics()
          });
        });
      } else {
        alert("No Migration File: \n \n" + migrationFile);
        get_dbStatistics()
      }
    })
  }
}


// function get_dbStatistics() {
//   var dbTables=[]
//   var query = "SELECT name FROM sqlite_master" +
//     " WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'" +
//     " UNION ALL" +
//     " SELECT name FROM sqlite_temp_master" +
//     " WHERE type IN ('table','view')" +
//     " ORDER BY 1";

//   knex.raw(query).then(function(resp) {
//     var models = resp.map(a => a.name);

//     var promises = models.map(model => {
//       console.log(model)
//       return new Promise((resolve, reject) => {
//         knex(model).count('* as count').then(c => {
//           var total = c[0].count;
//           resolve({table_name: model, table_count: total  })
//         })
//       });
//     });


//     Promise.all(promises).then(function(values) {
//       for (var i = 0; i < values.length; i++) {
//         var value = values[i];
//         dbTables.push(value)
//       }

//       var source   = document.getElementById("db-tables-template").innerHTML;
//       var template = Handlebars.compile(source);
//       var html    = template( {version:DB_VERSION,dbTables:dbTables});

//       document.getElementById("db-infos").innerHTML=html
//     });

//   })
// }

async function get_dbStatistics() {
  const dbTables = await get_dbTables();
  console.log("dbTables..........###########", dbTables)
  var currenciesSchema = await get_dbTableSchema("currencies");
  console.log("currencies Schema", currenciesSchema)
  var currenciesData = await get_dbTableData("currencies");
  console.log("currencies Data", currenciesData)
  var source = document.getElementById("db-tables-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template({ version: DB_VERSION, dbTables: dbTables });

  document.getElementById("db-infos").innerHTML = html;
}

function get_dbTables() {
  var query = "SELECT name FROM sqlite_master" +
    " WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'" +
    " UNION ALL" +
    " SELECT name FROM sqlite_temp_master" +
    " WHERE type IN ('table','view')" +
    " ORDER BY 1";

  return new Promise((resolves, rejects) => {

    knex.raw(query).then(async function(resp) {
      var models = resp.map(a => a.name);
      var promises = models.map(model => {
        return new Promise((resolve, reject) => {
          knex(model).count('* as count').then(c => {
            var total = c[0].count;
            knex.raw("PRAGMA table_info(" + model + ");").then(function(resp) {
              resolve({ table_name: model, table_schema: resp, table_count: total })
            })
          })
        });
      });
      return await Promise.all(promises);
    }).then((dbTables) => { resolves(dbTables) })

  })
}

async function get_dbTableSchema(tableName) {
  const dbTables = await get_dbTables();
  return new Promise((resolve, reject) => {
    var table = dbTables.filter(t => { return t.table_name == tableName })[0];
    var tableSchema = table.table_schema
    // var tableSchema = table.map(r => { return r.name });
    var response = { tableSchema: tableSchema };
    resolve(tableSchema);

  })
}

async function get_dbTableData(tableName, query) {
  var pageNum = 1;
  var perPage = 64000;
  var fromPage = 0;
  if (query) {
    pageNum = query.page ? parseInt(query.page) : 1;
    perPage = query.per_page ? parseInt(query.per_page) : 10;
    fromPage = (pageNum - 1) * perPage;
  }
  return new Promise((resolve, reject) => {
    knex(tableName).count('* as total').then(function(totalResponse) {
      knex.select('*').from(tableName).limit(perPage).offset(fromPage).then(function(dataResponse) {
        var maxPages = Math.ceil(totalResponse[0].total / perPage);
        var response = {
          data: dataResponse,
          total: totalResponse[0].total,
          page: pageNum,
          pages: maxPages,
          next_page: (maxPages <= pageNum) ? false : (pageNum + 1)
        };
        resolve(response);
      })
    })

  })
}

async function run_sqlQuery(query) {

  return new Promise((resolve, reject) => {
 
 
  
 
    knex.raw(query)
      .then(function(response) {
        resolve(response);
      })
      .catch(function(err) {
        console.log(err.stack);
        reject(err.code);
      })

  })
}

// ------------
ipcRenderer.on('exportToXLS', async (event, message) => {

  var query = "SELECT name FROM sqlite_master" +
    " WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'" +
    " UNION ALL" +
    " SELECT name FROM sqlite_temp_master" +
    " WHERE type IN ('table','view')" +
    " ORDER BY 1";
  var startTime = new Date()
  knex.raw(query).then(function(resp) {
    var models = resp.map(a => a.name);
    console.log(models);

    var wb = XLSX.utils.book_new();
    var promises = models.map(model => {
      console.log(model)
      return new Promise((resolve, reject) => {
        knex(model).select('*').then(data => {
          // console.log(data) 
          resolve({ data: data, model: model })
        })
      });
    });

    Promise.all(promises).then(function(values) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        // console.log("value",value)
        var ws = XLSX.utils.json_to_sheet(value.data);
        XLSX.utils.book_append_sheet(wb, ws, value.model);
      }
      saveAndExit()
    });

    function saveAndExit() {
      let xslPathFolder = userDataPath + 'database' + sep + 'excel' + sep + 'export' + sep
      fse.ensureDirSync(xslPathFolder)
      const xslPath = xslPathFolder + 'mc-office.xls';
      // XLSX.writeFile(wb, xslPath);
      const content = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', bookSST: false });
      fs.writeFileSync(xslPath, content);
      var endTime = new Date()
      var response = {
        timed: msToTime(endTime - startTime),
        link: xslPath
      }
      mainWindow.webContents.send("exportToXLS", response);
    }

    function msToTime(s) {
      function pad(n, z) { z = z || 2; return ('00' + n).slice(-z); }
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;
      return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
    }
  });



});

// ------------
ipcRenderer.on('importFromXLS', (event, file) => {
  var utils = require("./utils")
  var fileName = file.name.split('.')[file.name.split('.').length - 2]
  let xslPathFolder = userDataPath + 'database' + sep + 'excel' + sep + 'import' + sep
  fse.ensureDirSync(xslPathFolder)
  const xslFilePath = xslPathFolder + file.name;
  try {
    fs.readFile(file.path, function read(err, data) {
      if (err) { throw err; }
      fse.outputFile(xslFilePath, data)
      processFile(data);
    });

    function processFile(data) {
      // pre-process data
      var binary = "";
      var bytes = new Uint8Array(data);
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      var wb = XLSX.read(binary, { type: 'binary' });
      var jsonArray = utils.to_json(wb)
      Object.keys(jsonArray).forEach(key => {
        writeJson(fileName + " (" + key + ")", jsonArray[key])
      });

      mainWindow.webContents.send("importFromXLS", "Import From XLS\n" + ".......Done.");
    }
    async function writeJson(jsonFile, jsonData) {
      try {
        await fse.writeJson(xslPathFolder + jsonFile + '.json', jsonData)

      } catch (err) {
        console.error(err)
      }
    }
  } catch (e) {
    console.log(e)
  }
});

// ------------
ipcRenderer.on("getInvoices", async (event, model) => {
  knex('invoices').select('*').limit(10).then(data => {
    mainWindow.webContents.send("invoicesResults", data);
  })

});

ipcRenderer.on("get_dbTables", async (event) => {
  const resp = await get_dbTables();
  var dbTables = resp
  // var dbTables = resp.map(a => { return a.table_name });
  mainWindow.webContents.send("got_dbTables", dbTables);
});

ipcRenderer.on("get_tableSchema", async (event, table) => {
  var tableSchema = await get_dbTableSchema(table);
  mainWindow.webContents.send("got_tableSchema", tableSchema);
});

ipcRenderer.on("get_tableData", async (event, table, query) => {
  var tableData = await get_dbTableData(table, query);
  mainWindow.webContents.send("got_tableData", tableData);
});


ipcRenderer.on("run_sqlQuery", async (event, query) => {
  try {
    var sqlResult = await run_sqlQuery(query);
    mainWindow.webContents.send("got_sqlQueryResult", { query: query, result: sqlResult, error: '' });
  } catch (error) {
    mainWindow.webContents.send("got_sqlQueryResult", { query: query, result: error, error: error });
  }


});