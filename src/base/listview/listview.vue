<template>
  <scroll class="listview" :data="data" @pullingUp="pullingUp" @pullingDown="pullingDown" ref="listview">
    <div>
      <div class="list-container">
        <ul class="list-group">
          <li v-for="(item,index) of data" class="list-group-item" :key="index" @click="_selectItem(item)">
            <img v-lazy="item.img1v1Url" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
export default {
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    pullingUp() {
      this.$emit('pullingUp');
    },
    pullingDown() {
      this.$emit('pullingDown');
    },
    _selectItem(item) {
      this.$emit('select', item);
    },
    refresh() {
      this.$refs.listview.refresh();
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';

.listview {
  height: 100%;
  overflow: hidden;
  .list-group {
    padding-bottom: 0.6rem;

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 0.3rem 0 0 0.3rem;
      .avatar {
        width: 1.08rem;
        height: 1.08rem;
      }

      .name {
        margin-left: 0.4rem;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
