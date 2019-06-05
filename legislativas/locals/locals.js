const localsData = require('./locals_new.json')
const localsDataOld = require('./locals_old.json')
const fs = require('fs')

const bothLocalsData = localsData.map(local => {
  const { name, territoryKey } = local
  const localEquivelant = localsDataOld.find(local => {
    const { nome } = local
    return nome === name
  })

  return {
    name,
    territoryKey,
    territoryKeyOld: localEquivelant ? localEquivelant.codigo : null
  }
})

const jsonFile = JSON.stringify(bothLocalsData, null, 2)

fs.writeFile('locals.json', jsonFile, 'utf8', () => {
  console.log('Done!')
})
