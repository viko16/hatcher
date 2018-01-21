const { URL } = require('url')
const assert = require('assert')
const PathParser = require('path-parser')
const debug = require('debug')('hatcher:index')
const { exec, match, parse } = require('matchit')

const { crawlAndParse } = require('./lib/crawler')

module.exports = function (config = {}) {
  // check config
  assert(config, '[hatcher:config] config must exist')
  assert(config.entry, '[hatcher:config] config.entry must exist')

  return async function hatch (ctx, next) {
    const routes = Object.keys(config.entry).map(parse)
    const url = ctx.path
    const arr = match(url, routes)
    // missed
    if (!arr.length) {
      await next()
      return
    }

    // matched
    const key = arr[0].old
    const params = exec(url, arr)

    const itemConf = config.entry[key]
    const targetPath = new PathParser(itemConf.path).build(params)
    const targetUrl = new URL(targetPath, itemConf.baseUrl).toString()
    debug('targetUrl', targetUrl)
    // 爬取站点 + 解析内容
    const result = await crawlAndParse(targetUrl, itemConf)
    ctx.body = result
  }
}
