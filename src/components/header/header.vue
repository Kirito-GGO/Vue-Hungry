<template>
  <div class="header">
    <!-- 内容区 -->
    <div class="content-wrapper">

      <!-- 头像 -->
      <div class="avatar">
        <!-- 注意使用:src 也就是v-bind绑定属性-->
        <img width="64" height="64" :src="seller.avatar">
      </div>

      <!-- 内容 -->
      <div class="content">

        <div class="title">
          <!-- 品牌 -->
          <span class="brand"></span>
          <!-- 通过{{seller.name}}拿到品牌的名称 -->
          <span class="name">{{seller.name}}</span>
        </div>

        <!-- 描述 -->
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>

        <!-- 优惠 -->
        <!-- v-if如果后台有seller.supports对应的优惠 -->
        <div v-if="seller.supports" class="supports">
          <!-- 和数据对应起来 -->
          <!-- classMap[seller.supports[0].type 取下标为0的type ] 对应created()中的this.classMap 此时得到的角标对应的数据就可以对应下面的css 无论后端json数据怎么变化 -->
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <!-- 取到seller中下标为0的description所对应的数据 -->
          <span class="text">{{seller.supports[0].description}}</span>
        </div>


      </div>

      <!-- 5个 -->
      <div @click="showDetail" v-if="seller.supports" class="support-count">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>

    </div>
    <!-- 公告区 -->
    <div @click="showDetail" class="bulletin-wrapper">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>

    <!-- 整体背景图 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>

    <!-- vue动画要放在transition标签中 并设置name -->
    <transition name="fade">
      <!-- 详情弹出浮层 -->
      <!-- 使用v-show控制显示与否 -->
      <div v-show="detailShow" class="detail">

        <!-- 包裹内容的容器-->
        <!-- clearfix 清除浮动-->
        <div class="detail-wrapper clearfix">
          <!-- 内容 -->
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>

            <div class="star-wrapper">
              <!-- 向star组件传入参数 -->
              <star :size="48" :score="seller.score"></star>
            </div>

            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>

            <!-- 因为商家可能没有seller.supports(优惠) 所以要先判断 -->
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item,index) in seller.supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>

            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>

            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>

        <!-- 关闭按钮 -->
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>

      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';

  // 把header.vue抛出去
  export default {
    // props 可以是数组或对象，用于接收来自父组件的数据。
    // 用props属性接收传过来seller
    props: {
      // props属性里有一个seller对象
      seller: {
        // 类型
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      // 显示详情弹出浮层
      showDetail() {
        this.detailShow = true;
      },
      // 关闭详情页面
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      // 和下面css中的顺序对应
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    // 注册star评分组件
    components: {
      star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  // 引入自己写的mixin.styl 才能用里面的函数
  @import "../../common/stylus/mixin.styl"

  .header
    position: relative
    overflow: hidden
    color: #fff
    background: rgba(7, 17, 27, 0.5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      /* 行内和行内之间有缝隙 因为有些空白字符在里面 所以设置父元素的font-size: 0*/
      font-size: 0
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            width: 30px
            height: 18px
            display: inline-block
            /* 对齐方式 */
            /* 把元素的顶端与行中最高元素的顶端对齐 */
            vertical-align: top
            /* dpi为2的时候用2x图片 dpi为3的时候用3x图片 */
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .supports
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
          .text
            line-height: 12px
            font-size: 10px
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          vertical-align: top
          font-size: 10px
        .icon-keyboard_arrow_right
          margin-left: 2px
          font-size: 10px
          line-height: 24px
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      /* white-space: nowrap 规定段落中的文本不进行换行 */
      white-space: nowrap
      overflow: hidden
      /* text-overflow: ellipsis 显示省略符号来代表被修剪的文本 */
      text-overflow: ellipsis
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        vertical-align: top
        margin: 0 4px
        font-size: 10px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      /* filter 属性定义了元素(通常是<img>)的可视效果(例如：模糊与饱和度) */
      /* blur(px)	给图像设置高斯模糊 */
      filter: blur(10px)
    .detail
      position: fixed
      z-index: 100
      top: 0
      left: 0
      width: 100%
      height: 100%
      /* overflow: auto如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容 */
      overflow: auto
      /* 模糊 只支持iOS */
      backdrop-filter: blur(10px)
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
      /* vue过渡动画 */
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, 0)

      .detail-wrapper
        width: 100%
        min-height: 100%
        .detail-main
          margin-top: 64px
          /* 下面的X的font-size为64px 内边距为64px 相加除2 */
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-size: 16px
            font-weight: 700
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position relative
              top: -6px
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding: 0 12px
              font-size: 14px
              font-weight: 700
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 12px
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        /* clear: both 清除浮动 在左右两侧均不允许浮动元素 */
        clear: both
        font-size: 32px
</style>
