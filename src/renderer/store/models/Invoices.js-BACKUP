var fs = require('fs');

import path from 'path'
import { remote } from 'electron'



const crypto = require('crypto');

var Datastore = require('nedb')

const version = require('../../../../package').version
const dsFolder = 'database'
const invoicesFilename = path.join(remote.app.getPath('userData'), dsFolder + '/invoices.db')


 

var table = {}
table.name = "Invoices"
// ==============   ==============
function init() {
  if (!table.model)
    table.model = new Datastore({
      filename: invoicesFilename,
      autoload: true,
      timestampData: true,

      // onload: (error) => {
      //   if (error) { alert(error) } else {
      //     table.model.count({}, function (err, count) {
      //       if (count == 0) {
      //         table.model.insert(JSON.parse(JSON.stringify(require('../data/invoices-sample.json'))), function (err, newDoc) { })

      //       } else { }
      //     });
      //   }
      // },


      onload: (error) => {
        if (error) { alert(error) } else {
          table.model.count({}, function (err, count) {
            console.log("count Users=", count)

            var InvoiceData = [
              {
                invoiceClient: 'John Doe', invoiceNumber: '23444', invoiceDate: new Date('May 23, 2016'), invoiceTotal: 'Rien',
                invoiceLines: ['Game of the Year', 'Best Multiplayer Game', 'Best ESports Game']
              },
              {
                invoiceClient: 'John Doe', invoiceNumber: '23444', invoiceDate: new Date('May 23, 2016'), invoiceTotal: 'Rien',
                invoiceLines: ['Game of the Year', 'Best Multiplayer Game', 'Best ESports Game']
              },
              {
                invoiceClient: 'John Doe', invoiceNumber: '23444', invoiceDate: new Date('May 23, 2016'), invoiceTotal: 'Rien',
                invoiceLines: ['Game of the Year', 'Best Multiplayer Game', 'Best ESports Game']
              },
            ]
            table.model.insert(InvoiceData, function (err, newDoc) { })

          });
        }
      },

    });
}

init()

var methods = {

}

table.methods = methods

export default table