import fetch from 'node-fetch'
import { delay, pipe } from './utils.mjs'

const config = {
  FgRed: '\x1b[31m',
  FgCyan: '\x1b[36m',
  blackListItems: ['Cash&Other'],
  exchanges: ['NYSE', 'NASDAQ', 'AMAX', 'OTC'],
  wahedHoldingUrl: 'https://funds.wahedinvest.com/etf-holdings.csv',
  shape: [
    {
      '0': 'non-s',
      '1': 's',
      default: '',
    },
  ],
}

const isWait = spec => spec.task === 'wait'

function transformToTickersAndSymbols(csv) {
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d)
  }

  return (
    csv
      .split('\n')
      .filter(Boolean)

      // remove not valid data (eg column header
      .reduce((acc, item) => {
        const [firstCol] = item.split(',')
        return isValidDate(new Date(firstCol)) ? acc.concat(item) : acc
      }, [])

      // get tickers & symbols
      .reduce((acc, item) => {
        const [, , ticker, , symbols] = item.split(',')

        // remove non stock item (sukuk)
        if (config.blackListItems.some(i => new RegExp(i, 'i').test(ticker))) {
          return acc
        }

        return [...acc, { ticker, symbols }]
      }, [])
  )
}

/**
 * https://www.tradingview.com/symbols/NYSE-A/
 * @param {BeforeGetExchange} item
 * @returns {Promise<AfterGetExchange>}
 */
const getExchange = item =>
  new Promise(async (res, rej) => {
    for await (const exchange of config.exchanges) {
      try {
        const response = await fetch(`https://www.tradingview.com/symbols/${exchange}-${item.ticker}/`)
        console.log(
          response.status === 200 ? config.FgCyan : config.FgRed,
          `${response.status}:${item.ticker}:${exchange}`
        )

        // only expect status code to be 200 and 404
        if (![200, 404].includes(response.status)) {
          rej(`Failed (getExchanged): status code diff than 200 & 404: ${exchange}:${item.ticker}`)
        }

        if (response.status === 200) {
          res({ ...item, exchange })
          break
          // if all exchanges failed, then search that stock if it is really exist
        } else if (exchange === config.exchanges[config.exchanges.length - 1]) {
          rej(`Failed (getExchanged): all exchanges failed: ${exchange}:${item.ticker}`)
        }
      } catch (e) {
        rej(`Failed (getExchanged): ${exchange}:${item.ticker}: ${e}`)
      }
    }
  })

/**
 * @param {AfterGetExchange[]} list
 */
function createTasks(list) {
  return list.flatMap((item, index) => [item, index + 1 === list.length ? null : { task: 'wait' }]).filter(Boolean)
}

/**
 * @param {(Tasks|AfterGetExchange)[]} tasks
 * @returns {Promise}
 */
function runTaskSequentially(tasks) {
  return tasks.reduce(
    async (p, spec) =>
      p.then(acc =>
        (isWait(spec) ? delay() : getExchange(spec))
          .then(item => {
            if (!isWait(spec)) {
              acc[item.exchange][item.ticker] = [1] // shape final output
            }

            return acc
          })
          .catch(console.error)
      ),
    Promise.resolve(config.exchanges.reduce((acc, cur) => ({ ...acc, [cur]: {} }), {}))
  )
}

/**
 * @param {Promise<Object>} p
 * @returns {Promise<Exchange>}
 */
function finalOutput(p) {
  const updatedAt = new Date()

  return p.then(data =>
    Object.entries(data).reduce(
      (acc, [k, v]) => ({
        ...acc,
        ...(Object.keys(v).length ? { [k]: { shape: config.shape, updatedAt, list: v } } : {}),
      }),
      {}
    )
  )
}

/**
 * returns {Promise<Exchange>}
 */
export async function US() {
  try {
    const response = await fetch(config.wahedHoldingUrl)
    const data = await response.text()

    return await pipe(
      transformToTickersAndSymbols,
      // data => data.slice(0, 5),
      createTasks,
      runTaskSequentially,
      finalOutput
    )(data)
  } catch (e) {
    throw Error(`Error generating US stock: ${e}`)
  }
}

/**
 * @typedef {Object} BeforeGetExchange
 * @property {string} ticker - company code
 * @property {string} symbols - company full name
 */

/**
 * @typedef {Object} AfterGetExchange
 * @property {string} ticker - company code
 * @property {string} symbols - company full name
 * @property {string} exchange - company's exchange
 */

/**
 * @typedef {Object} Tasks
 * @property {wait} task
 */

/**
 * @typedef {Object} ExchangeItem
 * @property {string} updatedAt
 * @property {Array.<Object>} shape
 * @property {Record<string, [number]>} list
 */

/**
 * @typedef {Object} Exchange
 * @property {Record<string, ExchangeItem>} e
 */
