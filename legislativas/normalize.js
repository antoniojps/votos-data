const legislativasData = require('./resultados-legislativas.json')
const fs = require('fs')

const dates = legislativasData.reduce((acc, curr) => {
  const { data: date } = curr
  const exists = acc.find(dateFound => date === dateFound.date)
  if (!exists) return [...acc, { date, data: [] }]
  return acc
}, [])

const organizedByDate = legislativasData.reduce((acc, curr) => {
  // get current item date

  const { data: dateOfObj } = curr
  const dateIndex = acc.findIndex(({ date }) => dateOfObj === date)

  acc[dateIndex].data.push(curr)
  return acc
}, dates)

const jsonFile = JSON.stringify(organizedByDate, null, 2)

fs.writeFile('resultados-legislativos-by-date.json', jsonFile, 'utf8', () => {
  console.log('Done!')
})
