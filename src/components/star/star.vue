<!-- 星星评分组件 -->
<template>
  <!-- :class="starType" 动态绑定class -->
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span><!--track-by="$index"-->
  </div>
</template>

<script type="text/ecmascript-6">
  // 一共有5颗星星 所以定义常量5
  const LENGTH = 5;
  // 星星的三种状态的常量
  const CLS_ON = 'on'; // 满星
  const CLS_HALF = 'half'; // 半星
  const CLS_OFF = 'off'; // 无星

  export default {
    props: {
      // 接收星星的大小
      size: {
        type: Number // 24 36 48这三种尺寸
      },
      // 接收分数
      score: {
        type: Number
      }
    },
    // Vue计算属性
    computed: {
      // 用'star-'这个前缀加上this.size拼出一个class
      starType() {
        return 'star-' + this.size;
      },
      // 计算星星
      itemClasses() {
        // 用于存储星星
        let result = [];
        // 取分数为0.5的倍数
        // Math.floor 向下取整
        // 例如 小数位小于5 4.2分 Math.floor(4.2*2)等于8 8/2等于4
        // 例如 小数位大于5 4.6分 Math.floor(4.6*2)等于9 9/2等于4.5
        let score = Math.floor(this.score * 2) / 2;
        // 判断是否有小数以决定有没有半星
        let hasDecimal = score % 1 !== 0;
        // 取整以计算有多少的全星
        let integer = Math.floor(score);
        // 向result中写入integer个全星
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        // hasDecimal为true 也就是有半星 就向result写入一个半星 因为半星只能有一个
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        // 如果result内元素的个数小于之前定义的星星的个数 则添加空星
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        // 返回result这个数组
        return result;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    font-size: 0
    /* 每个star基础的样式 */
    .star-item
      display: inline-block
      background-repeat: no-repeat
    /* 不同大小的星星动态的class样式 */
    &.star-48
      .star-item
        width: 20px
        height: 20px
        /* 每颗星星的间距 */
        margin-right: 22px
        background-size: 20px 20px
        /* 最后一课星星没有右侧外边距 */
        &:last-child
          margin-right: 0
        /* 满星状态 */
        &.on
          bg-image('star48_on')
        /* 半星状态 */
        &.half
          bg-image('star48_half')
        /* 空星状态*/
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        /* 每颗星星的间距 */
        margin-right: 6px
        background-size: 15px 15px
        /* 最后一课星星没有右侧外边距 */
        &:last-child
          margin-right: 0
        /* 满星状态 */
        &.on
          bg-image('star36_on')
        /* 半星状态 */
        &.half
          bg-image('star36_half')
        /* 空星状态*/
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        /* 每颗星星的间距 */
        margin-right: 3px
        background-size: 10px 10px
        /* 最后一课星星没有右侧外边距 */
        &:last-child
          margin-right: 0
        /* 满星状态 */
        &.on
          bg-image('star24_on')
        /* 半星状态 */
        &.half
          bg-image('star24_half')
        /* 空星状态*/
        &.off
          bg-image('star24_off')
</style>
