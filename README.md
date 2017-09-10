# Vue-Hungry
完整高仿饿了么移动端APP核心模块 商家模块 实现单页面应用
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/1.PNG)
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/2.PNG)
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/3.png)
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/4.png)

### 代码规范
*   架构设置
*   组件抽象
*   模块拆分
*   代码风格统一
*   js变量命名规范
*   css代码规范
<p>以组件化 模块化开发方式 实现 高可维护 易扩展 通用性强的代码</p>

### 技术栈
*   es6 
*   eslint es6代码风格检查工具
*   webpack 构建工具
*   vue-cli 手脚架工具
*   vue-resource 与后端做数据交互 ajax通信
*   vue-router 做前端路由 实现单页应用
*   第三方js库 better-scroll 实现移动端列表滚动

### 技术细节
#### 1像素边框制作
<pre><code>屏幕宽度 320px 480px 640px
缩放比例   1    1.5    2</code></pre>
<p>当样式像素一定时 因手机有320px 640px等 各自的缩放比差异 所以设备显示像素就会有1Npx 2Npx 为保设计稿还原度 解决就是用media + scale</p>
<pre><code>// 在要画边框的元素上定义一个伪类 伪类相对于这个元素是绝对定位
// 通过伪类画一个1像素的边框 然后把伪类定位到元素的下面
// 在base.styl里 通过scaleY对这个伪类进行不同dpi下的缩放
border-1px($color)
  position relative
  &:after
    display: block
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    border-top: 1px solid $color
    content: ' '
// 设置对应不同dpi的缩放比
@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)
  .border-1px
    &::after
      -webkit-transform: scaleY(0.7)
      transform: scaleY(0.7)
@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2)
  .border-1px
    &::after
      -webkit-transform: scaleY(0.5)
      transform: scaleY(0.5)     
// 取消1像素边框
border-none()
  &:after
    display: none
</code></pre>
<p>通过查询它的缩放比 在媒体宽为1.5倍时 round(1px 1.5 / 0.7) = 1px 在媒体宽为2倍时 round(1px 2 / 0.5) = 1px</p>

#### 自适应宽
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/5.png)
<p>在商品路由中 导航宽度固定80px的 因为手机分辨率大小不一 所以食物详情自适应 解决就是flex布局 </p>
<p>css</p>
<pre><code><style lang="stylus" rel="stylesheet/stylus">
  .goods
    display: flex
    width: 100%
    .menu-wrapper    
      flex: 0 0 80px
      width: 80px
    .foods-wrapper
      flex: 1
</style></code></pre>
<p>在父元素设弹性布局 导航里设弹性为0 定宽为80px 商品食物详情弹性为1 就适应宽度变化</p>

#### Sticky footer
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/3.png)
<p>做商家弹出页时 信息高度是无法预定的 有可能溢出window高度 也可能少于window高度 但底部按钮 当信息高度少于window高度 要固定在底部40px 解决就是用sticky footer布局</p>
<p>css</p>
<pre><code><style lang="stylus" rel="stylesheet/stylus">
  .detail
    position: fixed
    width: 100%
    height: 100%
    .detail-wrapper
      width: 100%
      min-height: 100%
      .detail-main
        /* 下面的X的font-size为64px 内边距为64px 相加除2 */
        padding-bottom: 64px
    .detail-close
      position: relative
      margin: -64px auto 0 auto
      height: 32px
</style></code></pre>

#### 自适相等宽高
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/6.png)
<p>在食物弹出页 设计图食物图的宽高是相等 每张图的宽高比例有可能有区别 但也要做自适应 解决就是用padding边距</p>
<p>css</p>
<pre><code><style lang="stylus" rel="stylesheet/stylus">
  .image-header
    position: relative
    width: 100%
    height: 0
    /*padding-top: 100% 和 width: 100% 的长度是一样的*/
    padding-top: 100%
    .img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
</style></code></pre>
<p>在父元素 边距的长是取决去宽的 所其宽度与边距的长是相等的</p>
<p>在把高设为0 宽为100% 上边距100% 上边据就盒子的高 盒子是为正形</p>
<p>子元素设宽与高为100% 那也是正形</p>

### VUE要点
#### 小图标的编选
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/7.png)
<p>根据后台输出的数据 判定显示那个的图标 这vue典型的数据驱动 解决是使用:class捆绑数据</p>
<p>html</p>

```html
<ul v-if="seller.supports" class="supports">
  <li class="support-item" v-for="(item,index) in seller.supports">
    <span class="icon" :class="classMap[seller.supports[index].type]"></span>
  </li>
</ul>
```

<p>js</p>
<pre><code>
<script type="text/ecmascript-6">
  export default {
    methods: {
      created() {
        // 和下面css中的顺序对应
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      }
    }      
  }
</script>
</code></pre>
<p>css</p>
<pre><code>
.icon
  display: inline-block
  vertical-align: top
  width: 12px
  height: 12px
  margin-right: 4px
  background-size: 12px 12px
  background-repeat: no-repeat
  &.decrease
    bg-image('decrease_1')
  &.discount
    bg-image('discount_1')
  &.guarantee
    bg-image('guarantee_1')
  &.invoice
    bg-image('invoice_1')
  &.special
    bg-image('special_1')
</code></pre>
<p>通过v-for 遍历数据 所以date.type得到数据并判断类型 然后通classmap数组判定绑那个class 来加图标</p>

#### 小球动画
![Alt text](https://github.com/Kirito-GGO/Vue-Hungry/raw/master/Screenshots/8.png)
<p>点击加食物时 触动小球弹出的动画 小球的落点是在车的中央 但起点是根各个节点位子而又差别的 解决使用transitions + events + dispatch事件冒泡</p>
<p>cartcontrol子组件</p>

```html
  <!-- 物品加减 -->
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
```

<pre><code><script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('add', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script></code></pre>
<p>在加食物 触发了addCart事件 设用set方法给数据加属性 并使cart.add事件冒泡出去 event.target作为事件参数 即节点冒泡出去</p>

#### 接收后台数据
<p>与后台的配合,通过插vue.resource + express 连接得到数据</p>
<p>dev-server</p>

<pre><code>
require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

// 获取保存数据的json
var appData = require('../data.json');
// 得到商家数据
var seller = appData.seller;
// 得到商品数据
var goods = appData.goods;
// 得到评价数据
var ratings = appData.ratings;

var apiRoutes = express.Router();
apiRoutes.get('/seller', function (req, res) {
  // res响应
  res.json({
    errno: 0,
    data: seller
  })
});

apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
});

apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
});

app.use('/api', apiRoutes);

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
</code></pre>
