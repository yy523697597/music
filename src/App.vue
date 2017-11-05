<template>
  <div id="app">
    <m-header></m-header>
     <tab></tab>
    <router-view/>

  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';

export default {
  name: 'app',
  components: {
    MHeader,
    Tab
  }
};
</script>

<style>
/* @import '~common/scss/variable'; */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #222;
}
</style>
