<template>
  <div>
    <div class="goods">

      <!-- 左侧分类 -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}"
              @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>

      <!-- 右侧商品 -->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <!-- class中 -hook 钩子 用来被js选择 没有实际效果 -->
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <!-- @click="selectFood(food,$event)" 点击进入详情页 -->
              <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">¥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 购物车 -->
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"></shopcart>
    </div>

    <!-- 详情页 -->
    <!-- ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例 -->
    <food @add="addFood" :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入better-scroll
  import BScroll from 'better-scroll';
  // 引入购物车组件
  import shopcart from '../shopcart/shopcart.vue';
  // 引入加减按钮组件
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  // 引入详情页组件
  import food from '../food/food.vue';

  const ERR_OK = 0;

  // goods.vue抛出去
  export default {
    // 接收seller
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        // 存储每个区间的高度
        listHeight: [],
        // 储存滚动位置
        scrollY: 0,
        // 选中的商品 展示详情页
        // 注意data中观测的数据不要和methods中的方法重名 因为两者都可以用this访问到 如果重名其中一个就会被覆盖
        selectedFood: {}
      };
    },
    // 计算属性
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          // 当前索引值的高度
          let height1 = this.listHeight[i];
          // 获得下一个的高度
          let height2 = this.listHeight[i + 1];
          // 区间的高点和低点
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        // 遍历所有商品 拿到good(每个分类)
        this.goods.forEach((good) => {
          // 遍历分类下面所有的foods 拿到每个food
          good.foods.forEach((food) => {
            // 如果有food.count 证明该商品被选择了
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.$http.get('/api/goods')
      // 成功的回调
        .then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.goods = response.data;
            // 等dom结构完全加载结束再调用_initScroll()方法才会生效
            // this.$nextTick(() => {}) 判断dom结构是否完全加载
            this.$nextTick(() => {
              this._initScroll();
              this._calculateHeight();
            });
          }
        });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    // methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。方法中的 this 自动绑定为 Vue 实例。
    methods: {
      // 点击左侧对应右侧相应的位置
      selectMenu(index, event) {
        // 判断是否是移动端的点击 如果的pc端点击event没有_constructed属性,所以取反后为true 执行return 防止pc端点击两次
        if (!event._constructed) {
          return;
        }
        // 得到foodsWrapper的所有li
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        // el为当前左侧索引对应的右侧索引
        let el = foodList[index];
        // scrollToElement滚动到某个元素
        this.foodsScroll.scrollToElement(el, 300);
      },
      // 点击进入详情页
      selectFood(food, event) {
        // 判断是否是移动端的点击 如果的pc端点击event没有_constructed属性,所以取反后为true 执行return 防止pc端点击两次
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        // $refs一个对象，其中包含了所有拥有 ref 注册的子组件
        // 拿到food子组件实例 调用他的show()方法
        this.$refs.food.show();
      },
      addFood(target) {
        this._drop(target);
      },
      _drop(target) {
        // 性能体验优化 异步执行下落动画
        // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      // _initScroll(){} 初始化需要滚动的dom结构
      _initScroll() {
        // $refs 为 DOM 元素注册一个索引，方便通过所属实例的 $els 访问这个元素。
        // $refs类似于document.querySelector('.class')的功能,可以拿到指定的dom元素
        // 命名方式 可以用 ref="some-el" 设置 this.$els.someEl
        // 初始化时传入 click: true 才可以点击
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        //  probeType: 3  scroll在滚动的时候能实时告诉我们滚动位置
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });
        // 监听scroll事件 回调函数的参数pos(位置)
        this.foodsScroll.on('scroll', (pos) => {
          // round() 方法可把一个数字舍入为最接近的整数
          // abs() 方法可返回数的绝对值
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      // 滚动对应高亮
      _calculateHeight() {
        // 得到foodsWrapper的所有li
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          // 获取foodsWrapper的当前li
          let item = foodList[i];
          // 高度 = 高度 + 当前item可见区域的高度
          // clientHeight可见区域的高
          height = height + item.clientHeight;
          // 向 listHeight push进每个item可见区域的高度
          this.listHeight.push(height);
        }
      }
    },
    // 注册组件
    components: {
      shopcart,
      cartcontrol,
      food
    }
//    events: {
//      'cart.add'(target) {
//        this._drop(target);
//      }
//    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    /* header的高度加上tab的高度 */
    top: 174px
    /* 购物车的高度 */
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      /* 等分 内容缩放 占位的空间 */
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        /* display: table 此元素会作为块级表格来显示（类似 <table>） */
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          /* display: table-cell 此元素会作为一个表格单元格显示（类似 <td> 和 <th>）  */
          display: table-cell
          width: 56px
          /* vertical-align: middle 把此元素放置在父元素的中部 */
          vertical-align: middle
          /* 移动端1px边框 */
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          /* 列表的最后一项没有边框 */
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            font-size: 14px
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
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
            right: 0
            bottom: 12px
</style>
