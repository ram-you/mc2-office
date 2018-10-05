 

const files = require.context('.', false, /\.js$/)
const models = {}

files.keys().forEach(key => {
  if (key === './index.js' || key ==='./crud.js' ) return
  models[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default models
