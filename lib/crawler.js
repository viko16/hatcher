const axios = require('axios')
const debug = require('debug')('hatcher:crawler')

const { parseFromXPath, parseFromCss } = require('./selector')
const utils = require('./utils')
const cache = new Map()

async function crawlAndParse (targetUrl, itemConf, setting = {}) {
  if (cache.has(targetUrl)) {
    debug('从缓存读取')
    return cache.get(targetUrl)
  }

  debug('正在爬取 ' + targetUrl)
  const { data: htmlStr } = await axios.get(targetUrl, {
    baseURL: itemConf.baseUrl,
    ...setting
  })

  debug('正在解析')
  const result = utils.mapValues(itemConf.fields, val => {
    // FIXME: loose!!
    const isXPath = val.includes('/')
    const parsed = isXPath
      ? parseFromXPath(htmlStr, val)
      : parseFromCss(htmlStr, val)

    switch (parsed.length) {
      case 0: return null
      case 1: return parsed[0]
      default:return parsed
    }
  })

  result._targetUrl = targetUrl
  cache.set(targetUrl, result)

  debug('正在返回')
  return result
}

module.exports = {
  crawlAndParse
}
