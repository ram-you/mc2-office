var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));

const fs = require('fs')
const fse = require('fs-extra');

const Handlebars = require("handlebars");


var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;

const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });

require("popper.js");
require("jquery")
require("./bootstrap/js/bootstrap");


function defer(method) {
  if (window.jQuery) {
    method();
  } else {
    setTimeout(function() { defer(method) }, 50);
  }
}
defer(function() {
  // Activate tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Select/Deselect checkboxes
  var checkbox = $('table tbody input[type="checkbox"]');
  $("#selectAll").click(function() {
    if (this.checked) {
      checkbox.each(function() {
        this.checked = true;
      });
    } else {
      checkbox.each(function() {
        this.checked = false;
      });
    }
  });
  checkbox.click(function() {
    if (!this.checked) {
      $("#selectAll").prop("checked", false);
    }
  });
});



Handlebars.registerHelper('eachProperty', function(context, options) {
  var ret = "";
  for (var prop in context) {
    ret = ret + options.fn({ property: prop, value: context[prop] });
  }
  return ret;
});






// ==============

(async () => {
  try {
    const dataBaseInfos = await get_dbTables();
    console.log(dataBaseInfos);
    var table = dataBaseInfos.filter(t => { return t.table_name == "currencies" })[0];
    var dbTableDefinition = table.table_schema.map(r => { return r.name });
    knex(table.table_name).then((result) => {
      var dbTableData = result;
      var source = fs.readFileSync(path.resolve(__dirname, 'templates', 'table.hbs'), 'utf8');
      var template = Handlebars.compile(source);
      var html = template({ dbTableDefinition: dbTableDefinition, dbTableData: dbTableData });
      document.getElementById("db-table-container").innerHTML = html;
    })
  } catch (error) { console.log(error); }
})();



// =======
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