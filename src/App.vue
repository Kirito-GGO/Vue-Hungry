<template>
  <div>
    <!-- 属性绑定 v-bind="seller" -->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>

    <!--路由匹配到的组件将渲染在这里-->
    <!--当我们改变路由会刷新router-view中的内容-->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  // 接收header
  import header from './components/header/header.vue';

  const ERR_OK = 0;

  // 抛出
  export default {
    data() {
      return {
        seller: {}
      };
    },
    // created()生命周期钩子 在初始化过程中给我们提供了执行自定义逻辑的机会
    created() {
      this.$http.get('/api/seller')
      // 成功的回调
        .then((response) => {
          response = response.body;
          // 判断dev-server返回的错误码errno
          if (response.errno === ERR_OK) {
            this.seller = response.data;
          }
        });
    },
    components: {
      // 注册header
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'

  .tab
    display: flex
    width: 100%
    /*设计稿为80 实际写40*/
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      /* & 代表.tab-item*/
      /* > 后代选择器*/
      & > a
        /*让a元素可以撑满整个父元素*/
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.router-link-active
          color: rgb(240, 20, 20)
</style>
