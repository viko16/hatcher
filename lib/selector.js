const xpath = require('xpath')
const Dom = require('xmldom').DOMParser
const cheerio = require('cheerio')

function parseFromXPath (htmlStr, selector) {
  const doc = new Dom({ errorHandler: () => {} }).parseFromString(htmlStr)
  const rq = xpath.select(selector, doc)
  if (Array.isArray(rq)) {
    return rq.map(item => {
      // TODO
      return item.nodeValue || item.toString()
    })
  }
  return [rq.toString()]
}

function parseFromCss (htmlStr, selector) {
  const $ = cheerio.load(htmlStr)
  return $(selector).map((i, el) => {
    return $(el).text()
  }).get()
}

module.exports = {
  parseFromXPath,
  parseFromCss
}
