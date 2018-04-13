import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
// import Singer from 'pages/singer/singer';
// import Recommend from 'pages/recommend/recommend';
// import Rank from 'pages/rank/rank';
// import Search from 'pages/search/search';
// import SingerDetail from 'components/singer-detail/singer-detail';
// import SongMenu from 'components/song-menu/song-menu';
// import TopList from 'components/top-list/top-list';

const Singer = r =>
  require.ensure([], () => r(require('pages/singer/singer')), 'Singer');

const Recommend = r =>
  require.ensure(
    [],
    () => r(require('pages/recommend/recommend')),
    'Recommend'
  );
const Rank = r =>
  require.ensure([], () => r(require('pages/rank/rank')), 'Rank');

const Search = r =>
  require.ensure([], () => r(require('pages/search/search')), 'Search');

const SingerDetail = r =>
  require.ensure(
    [],
    () => r(require('components/singer-detail/singer-detail')),
    'SingerDetail'
  );

const SongMenu = r =>
  require.ensure(
    [],
    () => r(require('components/song-menu/song-menu')),
    'SongMenu'
  );
const TopList = r =>
  require.ensure(
    [],
    () => r(require('components/top-list/top-list')),
    'TopList'
  );
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
