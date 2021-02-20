import jsdom from 'jsdom'
import fetch from 'node-fetch'
import merge from 'lodash.merge'
import cliProgress from 'cli-progress'
import { writeToFile } from '../writeToFile.js'
import { generateMidSmallCap } from './msc/index.js'

const { JSDOM } = jsdom
const TRADING_VIEW_MYX = 'MYX'
export const MYX_FILENAME = 'contents/MYX.txt'

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

const scrapUrl = ({ per_page, page }) =>
  `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${page}&per_page=${per_page}`

const pipe = (...fn) => initialVal => fn.reduce((acc, fn) => fn(acc), initialVal)
const removeSpaces = pipe(name => name.replace(/\s/gm, ''))
const removeSpacesAndShariah = pipe(removeSpaces, name => name.replace(/\[S\]/gim, ''))

async function scrapBursaMalaysia() {
  try {
    const page = await fetch(scrapUrl({ page: 1, per_page: 50 }))
    const dom = await page.text()
    const { document } = new JSDOM(dom).window

    // getting max size of syariah list by grabbing the value in pagination btn
    const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
      .map(i => i.textContent)
      .filter(Boolean)
      .map(parseFloat)

    const maxPageNumbers = Math.max(...paginationBtn)

    let syariahList = {}
    progressBar.start(maxPageNumbers, 0)

    // grab all syariah list and navigate to each pages.
    for (let i = 1; i <= maxPageNumbers; i++) {
      const stockPage = await fetch(scrapUrl({ page: i, per_page: 50 }))
      const dom_page = await stockPage.text()
      const { document } = new JSDOM(dom_page).window

      const temp = Array.from(document.querySelectorAll('table.equity_prices_table tbody tr')).reduce((acc, tr) => {
        const s = tr.querySelector(':nth-child(2)').textContent
        const stockCode = tr.querySelector(':nth-child(3)').textContent

        const code = removeSpaces(stockCode)
        const stockName = removeSpacesAndShariah(s)
        return {
          ...acc,
          [code]: {
            s: 1,
            code,
            stockName,
          },
        }
      }, {})

      syariahList = { ...syariahList, ...temp }
      progressBar.increment()
    }

    console.log('\n\nFound: ', Object.keys(syariahList).length)

    return syariahList
  } catch (e) {
    console.error('Error scrap data', e)
    process.exit(1)
  }
}

export function myxFilenameTransformer(data, flagId = 'MYX') {
  const bufferPadRightSize = 1
  const {
    [TRADING_VIEW_MYX]: { list, ...rest },
  } = data

  const maxRestLength = Math.max(...Object.keys(rest).map(i => i.length))
  const maxStockLength = Math.max(...Object.keys(list).map(i => i.length))

  function metaDataDisplayed(key, value) {
    return `${key.padEnd(maxRestLength + bufferPadRightSize, ' ')}: ${value}`
  }

  function listDisplayed(stockName, value) {
    const temp = []
    if ('s' in value) {
      temp.push('s')
    }

    if ('msc' in value) {
      temp.push('msc')
    }

    return `${stockName.padEnd(maxStockLength + bufferPadRightSize, ' ')}: ${temp.join(', ')}`
  }

  function dash(size = 20, char = '-') {
    return Array.from({ length: size }, () => char).join('')
  }

  return `
${flagId}
${Object.entries(rest)
  .reduce((acc, [key, value]) => acc + '\n' + metaDataDisplayed(key, value), '')
  .trim()}
${dash()}
${Object.entries(list).reduce((acc, [stockName, value]) => acc + '\n' + listDisplayed(stockName, value), '')}`.trim()
}

export async function MYX() {
  try {
    const shariahList = await scrapBursaMalaysia()
    const { mscAt, mscLink, mscList } = await generateMidSmallCap()

    const sortedList = pipe(
      Object.values,
      entries => entries.sort(({ stockName: keyA }, { stockName: keyB }) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)),
      items =>
        items.reduce(
          // eslint-disable-next-line no-unused-vars
          (acc, { stockName, code, ...rest }) => ({
            ...acc,
            [stockName]: { ...rest },
          }),
          {}
        )
    )(merge(mscList, shariahList)) // merge by stock code

    const NEW_MYX_DATA = {
      [TRADING_VIEW_MYX]: {
        mscAt,
        mscLink,
        updatedAt: new Date(),
        list: sortedList,
      },
    }

    // write to MYX
    await writeToFile(MYX_FILENAME, myxFilenameTransformer(NEW_MYX_DATA))

    return NEW_MYX_DATA
  } catch (e) {
    throw `Error generating ${TRADING_VIEW_MYX}`
  }
}
