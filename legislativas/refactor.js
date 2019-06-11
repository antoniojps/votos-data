// refactor single json file into seperate files and folders
// by year and district

const dataDistricts = require('./../treated/resultados-legislativos-distritos-1975-2015.json')
const dataNational = require('./../treated/resultados-legislativos-nacionais-1975-2015.json')
const fs = require('fs')

// add districts file and folder by year
dataDistricts.forEach(yearData => {
  const { date, data: districtsData } = yearData
  const dir = `./treated/legislativas/${date}`
  // create directory if doesnt exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  // create json file for each district results
  districtsData.forEach(districtData => {
    const { territoryKey } = districtData
    const jsonFile = JSON.stringify(districtData, null, 2)
    const fileName = `${dir}/${territoryKey}.json`
    fs.writeFile(fileName, jsonFile, 'utf8', () => {
      console.log(`Wrote file ${fileName}`)
    })
  })
})

// add national/globals file and folder by year
dataNational.forEach(national => {
  const { date, ...nationalData } = national
  const { territoryKey } = nationalData

  const dir = `./treated/legislativas/${date}`
  const fileName = `${dir}/${territoryKey}.json`

  const jsonFile = JSON.stringify(nationalData, null, 2)

  fs.writeFile(fileName, jsonFile, 'utf8', () => {
    console.log(`Wrote file ${fileName}`)
  })
})
