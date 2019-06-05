const data = require('./../../treated/resultados-legislativos-by-date.json')
const localsEquivelants = require('./../../treated/locals.json')
const fs = require('fs')

const partiesJoined = data.map(({ data: yearData, date }) => {
  const partiesJoinedByRegion = yearData.reduce((acc, votes) => {
    const {
      codigo: territoryKey,
      nome,
      tipo,
      partido,
      num_votos,
      perc_votos,
      mandatos
    } = votes
    const resultsParty = {
      acronym: partido,
      mandates: mandatos,
      percentage: perc_votos,
      votes: num_votos
    }

    const territoryKeyEquivelantObj = localsEquivelants.find(
      local => local.territoryKeyOld === territoryKey
    )
    const territoryKeyEquivelant = territoryKeyEquivelantObj
      ? territoryKeyEquivelantObj.territoryKey
      : null

    if (!territoryKeyEquivelant) return acc

    const territoryIndex =
      acc.length > 0
        ? acc.findIndex(({ territoryKeyOld: code }) => code === territoryKey)
        : -1
    const doesTerritoryKeyExist = territoryIndex !== -1
    if (!doesTerritoryKeyExist)
      return [
        {
          territoryName: nome,
          territoryKeyOld: territoryKey,
          territoryKey: territoryKeyEquivelant,
          type: tipo,
          resultsParty: [resultsParty]
        },
        ...acc
      ]
    acc[territoryIndex].resultsParty.push(resultsParty)
    return acc
  }, [])

  return {
    date,
    data: partiesJoinedByRegion
  }
})

const jsonFile = JSON.stringify(partiesJoined, null, 2)

fs.writeFile(
  'resultados-legislativos-by-date-parties.json',
  jsonFile,
  'utf8',
  () => {
    console.log('Done!')
  }
)
