var fs = require('fs');

import path from 'path'
import { remote } from 'electron'
 

const crypto = require('crypto');

var Datastore =  require('nedb')
 

const version = require('../../../../package').version
const dsFolder = 'database'
const usersFilename = path.join(remote.app.getPath('userData'), dsFolder + '/users.db')

var table = {}
table.name = "Users"

// ==============   ==============
function init() {
  if(!table.model)
  table.model = new Datastore({
    filename: usersFilename,
    autoload: true,
    timestampData: true,
    onload: (error) => {
      if (error) { alert(error) } else {
        table.model.count({}, function (err, count) {
          console.log("count Users=", count)
          if (count == 0) {
            var password = "admin"
            var pass_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
            // var adminUser = { username: "admin", password: pass_hash };
            // var adminUser2 = { username: "admin2", password: pass_hash };
            var adminUsers=[
              { username: "admin", password: pass_hash },
              {  name: "admin2", password: pass_hash },
              { firstname: "admin3", lastname:"M3allim", password: pass_hash },
            ]
            table.model.insert(adminUsers, function (err, newDoc) { })  
          } else { }
        });
      }
    }

  });
}


init()
var methods = {

}

table.methods = methods
 
export default table