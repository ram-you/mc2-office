var path = require('path');
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../../../../../../../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', '..', 'electron', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', '..', 'electron.asar', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', '..', 'app.asar', 'node_modules'));

var electron = require("electron")
const remote = electron.remote;
const app = remote.app;
let sep = path.sep
const userDataPath = app.getPath('userData') + sep;


let invoicesSchema = require("../Invoices")
let usersSchema = require("../Users")

const dbFilename = path.join(userDataPath, 'database/mc-office.sqlite');
var knex = require('knex')({ client: 'sqlite3', connection: { filename: dbFilename }, useNullAsDefault: true });

var migrateTableInvoices = function() {
  return new Promise(
    function(resolve, reject) {
      return resolve("done");
    }
  );
};

var migrateTableUsers = function() {
  return new Promise(
    function(resolve, reject) {
      knex.schema.renameTable("users", "users_old").then(async () => {
        knex.schema.createTable('users', usersSchema).then(() => {
          query = 'insert into users(id, first_name, last_name, password) select id, firstName, lastName,password from users_old;'
          knex.raw(query).then(() => {
            knex.schema.dropTable('users_old').then(() => {
              knex.raw("VACUUM").then(() => {
                return resolve("done");
              })
            })
          })
        })
      });
    }
  );
};


function migrateDatabase() {
  return new Promise(
    function(resolve, reject) { 
      var promises = Promise.all([migrateTableInvoices(), migrateTableUsers()]);
      promises.then(function() { 
        return resolve("done");
      });
    }
  );
}

module.exports = { migrateDatabase }