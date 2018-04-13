import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const Singer = () => import('pages/singer/singer');
const Recommend = () => import('pages/recommend/recommend');
const Rank = () => import('pages/rank/rank');
const Search = () => import('pages/search/search');
const SingerDetail = () => import('components/singer-detail/singer-detail');
const SongMenu = () => import('components/song-menu/song-menu');
const TopList = () => import('components/top-list/top-list');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
      name: 'recommend'
    },
    {
      path: '/singer',
      component: Singer,
      name: 'singer',

      // 子路由
      children: [
        {
          path: ':id',
          component: SingerDetail,
          meta: ['歌手详情']
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      name: 'search',

      // 子路由
      children: [
        {
          path: ':id',
          component: SingerDetail,
          meta: ['歌手详情']
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      name: 'recommend',

      // 子路由
      children: [
        {
          path: ':id',
          component: SongMenu,
          meta: ['歌曲菜单']
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      name: 'rank',

      // 子路由
      children: [
        {
          path: ':id',
          component: TopList,
          meta: ['歌曲列表']
        }
      ]
    }
  ]
});
