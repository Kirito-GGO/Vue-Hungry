// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';

import './common/stylus/index.styl';

// 通过Vue.use()安装vue-router
Vue.use(VueRouter);
// 注册VueResource
Vue.use(VueResource);

const router = new VueRouter({
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ]
});

new Vue({
  template: '<App/>',
  components: {App},
  router
}).$mount('#app');

// router.push()默认路由
router.push('/goods');
