<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';
import Player from 'pages/player/player';
// import { getQueryString } from '~common/js/util';

export default {
  name: 'app',
  components: {
    MHeader,
    Tab,
    Player
  },
  created() {
    // 通过判断参数来确定需不需要显示vconsole
    const userQuery = '_debug';
    const showConsole = this.$route.query[userQuery];
    if (showConsole) {
      require('./assets/util/vconsole.js');
    }
  }
};
</script>

<style>
/* @import '~common/scss/variable'; */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
