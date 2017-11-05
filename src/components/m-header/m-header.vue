<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="title">乐动心声</h1>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable.scss';
@import '~common/scss/mixin.scss';

.m-header {
  position: relative;
  height: 0.88rem;
  text-align: center;
  color: $color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 0.12rem;
    width: 0.6rem;
    height: 0.64rem;
    margin-right: 0.18rem;
    @include bg-image('logo');
    background-size: 0.6rem 0.64rem;
  }
  .title {
    display: inline-block;
    vertical-align: top;
    line-height: 0.88rem;
    font-size: $font-size-large;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 0.24rem;
      font-size: 0.4rem;
      color: $color-theme;
    }
  }
}
</style>

