# Hatcher

> 🐣 Provides APIs by simple configuration.

- **Easy:** All you need is define the data what you want
- **Agile:** Just writing simple selector, API services built by one clik
- **Functional:** Core function provided as [Koa2](https://github.com/koajs/koa) middleware


## Installation

Hatcher requires **node v7.6.0** or higher for ES2015 and async function support.

```sh
$ npm install --global hatcher
```

Alternatively, hatcher provides API which can be used directly in your Koa 2.x App.

```sh
$ npm install --save hatcher
```


## Usage

```js
const Koa = require('koa')
const hatcher = require('hatcher')

const app = new Koa()
const config = require('./config.js')

app.use(hatcher(config))
app.listen(2333)
```

## Config

TODO


## Thanks

- Inspired by [gaojiuli/toapi](https://github.com/gaojiuli/toapi) .


## License

[MIT License](https://opensource.org/licenses/MIT) © [viko16](https://github.com/viko16)
