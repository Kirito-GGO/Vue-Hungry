<template>
  <!-- 商品评价组件 -->
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <!-- v-bind绑定class selectType为几就给对应的元素添加class="active"-->
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 好评常量
  const POSITIVE = 0;
  // 差评常量
  const NEGATIVE = 1;
  // 所有评价常量
  const ALL = 2;

  export default {
    // props外部可以传入组件的变量
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      // 选择评价类型
      selectType: {
        type: Number,
        default: ALL
      },
      // 是否显示只有内容的评价
      onlyContent: {
        type: Boolean,
        // 默认看到所有的评价
        default: false
      },
      // 默认文本
      // 满意是为:0,不满意是为:1，全部是为:2.
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    // 计算属性
    computed: {
      // 好评数量
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      // 差评数量
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      // 点击事件 改变selectType
      select(type, event) {
        // 防止pc断多次点击
        if (!event._constructed) {
          return;
        }
        // this.$emit("自定义事件名",要传送的数据) 父子组件通讯
        // 派发一个事件 把type传出去给父组件
        this.$emit('select', type);
      },
      // 点击事件 只看有内容的评价
      toggleContent(event) {
        // 防止pc断多次点击
        if (!event._constructed) {
          return;
        }
        this.$emit('toggle');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
