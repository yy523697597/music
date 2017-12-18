<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item" v-for="(item,index) of searches" :key="index">
        <span class="text">{{item}}</span>
        <span class="icon">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  }
};
</script>

<style scoped lang="scss">
@import '~common/scss/variable';
@import '~common/scss/mixin';

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 0.8rem;
    overflow: hidden;
    &.list-enter-active,
    &.list-leave-active {
      transition: all 0.1s;
    }
    &.list-enter,
    &.list-leave-to {
      height: 0;
    }
    .text {
      flex: 1;
      color: $color-text-l;
      font-size: $font-size-medium;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>
