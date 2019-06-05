const data = require('./2015-results.json')
const localsEquivelants = require('./../../treated/locals.json')
const fs = require('fs')

const treated = data.map(localResults => {
  const {
    territoryKey,
    territoryName,
    currentResults: { resultsParty: resultsPartyJSON }
  } = localResults

  const territoryKeyEquivelantObj = localsEquivelants.find(
    local => local.territoryKey === territoryKey
  )
  const territoryKeyEquivelant = territoryKeyEquivelantObj
    ? territoryKeyEquivelantObj.territoryKeyOld
    : null

  const resultsParty = resultsPartyJSON.map(results => {
    const { acronym, mandates, percentage, votes } = results
    return {
      acronym: acronym.toString(),
      mandates: mandates.toString(),
      percentage: percentage.toString(),
      votes: votes.toString()
    }
  })
  return {
    territoryName,
    territoryKeyOld: territoryKeyEquivelant,
    territoryKey,
    resultsParty
  }
})

const dateObj = {
  date: '2015-10-04',
  data: treated
}

const jsonFile = JSON.stringify(dateObj, null, 2)

fs.writeFile('resultados-2015.json', jsonFile, 'utf8', () => {
  console.log('Done!')
})
