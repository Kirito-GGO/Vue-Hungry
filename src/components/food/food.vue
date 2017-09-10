<template>
  <transition name="move">
    <!-- 商品详情页 -->
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <!-- 头部图片 -->
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <!-- 返回按钮 -->
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <!-- 内容 -->
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <!-- 物品加减组件 -->
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <!-- 加入购物车按钮 -->
          <transition name="fade">
            <!-- 没有food.count属性 或者 food.count为0时显示 -->
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车
            </div>
          </transition>
        </div>
        <!-- 商品信息 -->
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <!--商品评价-->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 评价选择 -->
          <!-- 向子组件传入属性 -->
          <ratingselect @select="selectRating" @toggle="toggleContent" :select-type="selectType"
                        :only-content="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingselect>
          <!-- 评价列表 -->
          <div class="rating-wrapper">
            <!-- 有评价的时候显示ul -->
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                  class="rating-item border-1px">
                <!-- 用户 -->
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <!-- 时间 -->
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <!-- 评价 -->
                <p class="text">
                  <span
                    :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <!-- 没有评价时显示div -->
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  // 引入better-scroll
  import BScroll from 'better-scroll';
  // 引入Vue
  import Vue from 'vue';
  // 引入加减按钮组件
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  // 引用split组件
  import split from '../split/split.vue';
  // 用商品评价组件
  import ratingselect from '../ratingselect/ratingselect.vue';
  // 引用formatDate方法 带{}为export function 可以引用多个模块 例如{a,b}
  import {formatDate} from '../../common/js/date';

  // 好评常量
  //  const POSITIVE = 0;
  // 差评常量
  //  const NEGATIVE = 1;
  // 所有评价常量
  const ALL = 2;

  // 导出
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        // data观测showFlag的变化
        showFlag: false,
        // 对一些变量进行依赖跟踪
        // 选择评价类型
        selectType: ALL,
        // 是否勾选有内容的评价
        onlyContent: true,
        // 默认文本
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      // 点击food组件 把food展开
      // 组件命名规范 可以被外部调用的用驼峰正常写 只能被内部调用私有方法的前面加_
      show() {
        this.showFlag = true;
        // 每次显示的时候初始化 评价类型 有内容的评价
        this.selectType = ALL;
        this.onlyContent = true;
        // 初始化better-scroll 注意使用$nextTick确保dom已经渲染完成
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              // 允许点击
              click: true
            });
          } else {
            // 调用better-scroll中的refresh()方法从新做一次计算
            this.scroll.refresh();
          }
        });
      },
      // 点击返回按钮隐藏详情页
      hide() {
        this.showFlag = false;
      },
      // 购物车按钮点击事件
      addFirst(event) {
        // 防止pc多次点击
        if (!event._constructed) {
          return;
        }
        // this.$emit("自定义事件名",要传送的数据)
        // event.target 属性返回哪个 DOM 元素触发了事件
        this.$emit('add', event.target);
        // 点击把food.count 设为 1
        Vue.set(this.food, 'count', 1);
      },
      addFood(target) {
        this.$emit('add', target);
      },
      // 改变selectType
      selectRating(type) {
        this.selectType = type;
        // 初始化better-scroll 注意使用$nextTick确保dom已经渲染完成
        this.$nextTick(() => {
          // 调用better-scroll中的refresh()方法从新做一次计算
          this.scroll.refresh();
        });
      },
      // 只看有内容的评价
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      // 判断是否显示内容
      needShow(type, text) {
        // 如果只看有内容的评价 并且 没有评论内容(没有评价text为false 取反为true)
        if (this.onlyContent && !text) {
          return false;
        }
        // 如果是查看所有评价
        if (this.selectType === ALL) {
          return true;
        } else {
          // 否则选择类型要和这条评价的类型一致才能被显示
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        // 把formatDate抽成一个通用的方法模块 放在common下的js里
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
  ;
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    /* 留出购物车的空间 */
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      /*padding-top: 100% 和 width: 100% 的长度是一样的*/
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          /*让按钮可点击区域变大*/
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
        // 需要有一定时间的延迟才能获取dom位置 所以设置渐隐
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
