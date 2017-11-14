import Vue from 'vue';
import Router from 'vue-router';

import Singer from 'pages/singer/singer';
import Recommend from 'pages/recommend/recommend';
import Rank from 'pages/rank/rank';
import Search from 'pages/search/search';
import SingerDetail from 'components/singer-detail/singer-detail';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/singer',
      component: Singer,
      // 子路由
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/rank',
      component: Rank
    }
  ]
});
