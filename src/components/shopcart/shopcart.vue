<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        </div>

        <!-- .stop阻止事件冒泡  .prevent阻止默认事件 -->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>

      <!-- 小球 -->
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!-- 购物车详情 -->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <!-- 加减按钮的组件复用 -->
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入better-scroll
  import BScroll from 'better-scroll';
  // 引入加减按钮组件
  import cartcontrol from '../cartcontrol/cartcontrol.vue';

  export default {
    // 接收
    props: {
      // 保存选择商品的数组 通过父组件传过来的
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 10,
              count: 1
            }
          ];
        }
      },
      deliveryPrice: {
        type: Number,
        // 默认值
        default: 0
      },
      minPrice: {
        type: Number,
        // 默认值
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        // 已经下落的小球
        dropBalls: [],
        // 购物车收起展开状态 默认是收起状态
        fold: true
      };
    },
    // 计算属性
    computed: {
      // 所有商品的总价
      totalPrice() {
        let total = 0;
        // forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数
        this.selectFoods.forEach((food) => {
          total = food.price * food.count + total;
        });
        return total;
      },
      // 所有商品的总数
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count = food.count + count;
        });
        return count;
      },
      payDesc() {
        // 未选择商品时
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          // 选择的商品价格 小于 起送价
          return `还差${diff}元起送`;
        } else {
          // 选择的商品价格 大于 起送价
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      // 控制购物车收起展开
      listShow() {
        // 判断是购物车里没有物品 如果没有 一定是收起状态
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        // fold为false时设置为true fold为true时设置为false
        let show = !this.fold;
        // 只有在列表展示的时候 需要去给better-scroll初始化
        if (show) {
          // $nextTick 因为数据变了 dom并没有立刻生效 而better-scroll是严重依赖于dom的
          this.$nextTick(() => {
            // 如果没有this.scroll需要new
            if (!this.scroll) {
              // better-scroll初始化
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              // 否则需要从新new 直接调用refresh() 来从新计算高度差 是否可以滚动
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop(el) {
        // 遍历小球
        for (let i = 0; i < this.balls.length; i++) {
          // 获取每个小球
          let ball = this.balls[i];
          // 如果ball.show属性取反为真
          if (!ball.show) {
            ball.show = true;
            // el当前节点
            ball.el = el;
            // push到存储已经下落的小球数组
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {
        // 如果购物车里没东西 点击时无效的
        if (!this.totalCount) {
          return;
        }
        // 否则更改 如果收起就展开 如果展开就收起
        this.fold = !this.fold;
      },
      // 点击阴影区域隐藏购物车
      hideList() {
        this.fold = true;
      },
      // 清空购物车
      empty() {
        // 遍历selectFoods把每个food的count设为0
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay() {
        // 总价 小于 配送价的时候
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      },
      addFood(target) {
        this.drop(target);
      },
      // js钩子 每个钩子都接收一个参数 这个参数就当前执行transition动画的dom对象
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          // 如果小球ball.show属性为true 这个小球就是要运动的小球
          if (ball.show) {
            // getBoundingClientRect() 返回有四个整数性质(上右下左)表示的坐标的矩形，以像素为单位。
            let rect = ball.el.getBoundingClientRect();
            // 获取x轴偏移
            let x = rect.left - 32;
            // 获取y轴偏移
            let y = -(window.innerHeight - rect.top - 22);
            // 把这个元素的display设为空 让他显示
            el.style.display = '';
            // 纵向位移
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            // 横向位移
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      // 小球动画完成时的状态
      dropping(el, done) {
        // 手动触发浏览器重绘
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop(el) {
        // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    },
    // 注册组件
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        /* cubic-bezier贝赛尔曲线 */
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
