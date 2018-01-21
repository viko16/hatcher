const { URL } = require('url')
const assert = require('assert')
const PathParser = require('path-parser')
const debug = require('debug')('hatcher:index')
const Router = require('koa-router')

const { crawlAndParse } = require('./lib/crawler')

module.exports = function (config = {}) {
  // check config
  assert(config, '[hatcher:config] config must exist')
  assert(config.entry, '[hatcher:config] config.entry must exist')

  const router = new Router()

  // index
  router.get('/', async ctx => {
    ctx.body = { routes: Object.keys(config.entry) }
  })

  for (const routeName in config.entry) {
    // matched
    router.get(routeName, async ctx => {
      try {
        const itemConf = config.entry[routeName]
        const targetPath = new PathParser(itemConf.path).build(ctx.params)
        const targetUrl = new URL(targetPath, itemConf.baseUrl).toString()
        debug('目标地址: %s', targetUrl)
        // 爬取站点 + 解析内容
        const result = await crawlAndParse(targetUrl, itemConf, config.setting)
        ctx.body = result
      } catch (error) {
        ctx.body = { error: error.message }
      }
    })
  }

  return router.routes()
}
