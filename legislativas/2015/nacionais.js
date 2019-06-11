const axios = require('axios')
const fs = require('fs')

async function getData() {
  const { data: nationalData } = await axios.get(
    `https://www.eleicoes.mai.gov.pt/legislativas2015//static-data/territory-results/TERRITORY-RESULTS-GLOBAL-990000-AR.json`
  )
  const abstention = `${100 - nationalData.currentResults.percentageVoters}`
  const resultsParty = nationalData.currentResults.resultsParty.map(
    ({ acronym, votes, percentage, mandates }) => ({
      acronym: String(acronym),
      votes: String(votes),
      percentage: String(percentage),
      mandates: String(mandates)
    })
  )
  const data = {
    date: '2015-10-04',
    territoryName: 'Resultados Globais',
    territoryKeyOld: null,
    territoryKey: 'GLOBAL-990000',
    abstention,
    resultsParty
  }

  const jsonFile = JSON.stringify(data, null, 2)

  fs.writeFile('2015-results-nacionais.json', jsonFile, 'utf8', () => {
    console.log('Done!')
  })
}

getData()
