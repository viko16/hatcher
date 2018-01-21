const Koa = require('koa')

const middleware = require('./')
const app = new Koa()

const config = {
  setting: {
    timeout: 1000,
    headers: {}
  },
  entry: {
    '/pic/:key': {
      baseUrl: 'https://www.pexels.com',
      path: '/search/:key',
      fields: {
        title: '//title/text()',
        name: '/html/body/div[1]/div[2]/div[2]/h1/text()',
        img: `//a//img[@class='photo-item__img']/@src`
      }
    },
    '/one/question/:id': {
      baseUrl: 'http://wufazhuce.com',
      path: '/question/:id',
      fields: {
        title: 'div.one-cuestion > h4:first-of-type',
        editor: 'div.one-cuestion p.cuestion-editor',
        content: 'div.one-cuestion div.cuestion-contenido'
      }
    }
  }
}

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})
app.use(middleware(config))
app.listen(2333, () => console.log('visit http://localhost:2333'))
