const date_1975_2011 = require('./../treated/resultados-legislativos-by-date-parties.json')
const date_2015 = require('./../treated/resultados-2015.json')
const fs = require('fs')

const total = [...date_1975_2011, date_2015]

const jsonFile = JSON.stringify(total, null, 2)

fs.writeFile(
  'resultados-legislativos-1971-2015-normalized.json',
  jsonFile,
  'utf8',
  () => {
    console.log('Done!')
  }
)
