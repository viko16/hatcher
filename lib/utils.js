/**
 * log response time
 *
 * @param {Koa.Context} ctx Koa Context
 * @param {Function} next Koa middleware next function
 */
async function logTime (ctx, next) {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
}

/**
 * function like lodash method `_.mapValues`
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

module.exports = {
  logTime,
  mapValues
}
