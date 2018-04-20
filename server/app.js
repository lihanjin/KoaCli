const path = require('path')
const Koa = require('koa')
const convert = require('koa-convert') //使用generator模块
const views = require('koa-views') // 模板引擎
const koaStatic = require('koa-static') // 静态资源
const bodyParser = require('koa-bodyparser') //post请求中间件解析
const koaLogger = require('koa-logger') //log日志
const session = require('koa-session-minimal') //koa-session-minimal 适用于koa2 的session中间件，提供存储介质的读写接口 。
const MysqlStore = require('koa-mysql-session') //koa-mysql-session 为koa-session-minimal中间件提供MySQL数据库的session数据读写操作。

const config = require('../config')
const routers = require('./router/index')

const app = new Koa()

// session存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
// app.use(session({
//   key: 'USER_SID',
//   store: new MysqlStore(sessionMysqlConfig)
// }))

// 配置控制台日志中间件
app.use(convert(koaLogger()))

// 配置ctx.body解析中间件
app.use(bodyParser())

// 配置静态资源加载中间件
app.use(convert(koaStatic(
  path.join(__dirname, '../static')
)))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())

// 监听启动端口
app.listen(config.port)
console.log(`the server is start at port ${config.port}`)