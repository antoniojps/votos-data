const axios = require('axios')
const locals = require('./../locals/locals.json')
const fs = require('fs')

// const requestDataProms = locals.map(({ territoryKey }) =>
//   axios.get(
//     `https://www.eleicoes.mai.gov.pt/legislativas2015//static-data/territory-results/TERRITORY-RESULTS-${territoryKey}-AR.json`
//   )
// )

// const data = Promise.all(requestDataProms).then(data => console.log(data))

async function getData() {
  let data = []
  const localsProm = locals.map(
    ({ territoryKey }) =>
      new Promise((resolve, reject) => {
        setTimeout(async () => {
          const localData = await axios.get(
            `https://www.eleicoes.mai.gov.pt/legislativas2015//static-data/territory-results/TERRITORY-RESULTS-${territoryKey}-AR.json`
          )
          data.push(localData.data)
          resolve()
        }, 1000)
      })
  )
  await Promise.all(localsProm)

  const jsonFile = JSON.stringify(data, null, 2)

  fs.writeFile('2015-results.json', jsonFile, 'utf8', () => {
    console.log('Done!')
  })
}

getData()
