 const fs = require('fs');
 const path = require("path");
 var files = fs.readdirSync(path.resolve(__dirname, "./"))
 const schemaModels = []

 files.forEach(key => {
   if (key === 'index.js') return
   schemaModels.push(key.replace(/(\.\/|\.js)/g, ''))
 })

 module.exports = schemaModels