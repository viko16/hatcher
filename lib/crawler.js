const axios = require('axios')
const debug = require('debug')('hatcher:crawler')

const { parseFromXPath, parseFromCss } = require('./selector')
const cache = new Map()

async function crawlAndParse (targetUrl, config) {
  if (cache.has(targetUrl)) {
    debug('从缓存读取')
    return cache.get(targetUrl)
  }

  debug('正在爬取 ' + targetUrl)
  const { data: htmlStr } = await axios.get(targetUrl, {
    baseURL: config.baseUrl
  })

  debug('正在解析')
  const result = mapValues(config.fields, val => {
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

  result._targetUrl = config.baseUrl + targetUrl
  cache.set(targetUrl, result)

  debug('正在返回')
  return result
}

module.exports = {
  crawlAndParse
}

// ======== utils ========

/**
 * @description function like lodash method `_.mapValues`
 *
 * @param {Object} object The object to iterate over.
 * @param {Function} fn The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 */
function mapValues (obj, fn) {
  const result = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      result[key] = fn(value, key, obj)
    }
  }
  return result
}
