const data = require('./../../../treated/resultados-legislativos-by-date.json')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const dates = data.map(({ date }) => {
  const dateSplit = date.split('-')
  const [year, month, day] = dateSplit
  return {
    year,
    month,
    day,
    date
  }
})

const computeUrl = ({ day, month, year }) =>
  `http://eleicoes.cne.pt/raster/menu.cfm?dia=${day}&mes=${month}&ano=${year}&eleicao=ar`

async function getNationalResults({ day, month, year }) {
  // get html from page
  const url = computeUrl({ day, month, year })
  const { data: html } = await axios.get(url)

  // use cheerio to parse the data we want
  const $ = cheerio.load(html)
  const parties = $('td').find('.txt_lateral_tabela')
  const results = $(parties).map((index, elem) => {
    const siblings = $(elem).nextAll('.txt_lateral_tabela2')
    const isResult = siblings.length === 3
    if (!isResult) return null
    const acronym = $(elem)
      .text()
      .split(':')[0]
    const votes = siblings.eq(0).text()
    const percentage = siblings
      .eq(1)
      .text()
      .split('( ')[1]
      .split(')')[0]
      .split('%')[0]

    const mandates = siblings.eq(2).text()
    return {
      acronym,
      votes,
      percentage,
      mandates
    }
  })
  const abstentionElem = $(parties).map((index, elem) => {
    const siblings = $(elem).nextAll('.txt_lateral_tabela2')
    const isAbstention = siblings.length === 2
    if (!isAbstention) return null
    return siblings
      .eq(0)
      .text()
      .split('%')[0]
  })
  const abstention = abstentionElem.get()[0]

  return {
    date: `${year}-${month}-${day}`,
    territoryName: 'Resultados Globais',
    territoryKeyOld: null,
    territoryKey: 'GLOBAL-990000',
    abstention,
    resultsParty: results.get()
  }
}

const allNationalResults = async dates => {
  const promisesArr = dates.map(date => getNationalResults(date))
  const results = await Promise.all(promisesArr)
  const jsonFile = JSON.stringify(results, null, 2)

  fs.writeFile('resultados-nacionais-by-date.json', jsonFile, 'utf8', () => {
    console.log('Done!')
  })
  return results
}

allNationalResults(dates)
