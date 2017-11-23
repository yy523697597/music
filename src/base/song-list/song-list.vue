/*
 * @Author: yu yi 
 * @Date: 2017-11-23 10:57:10 
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-11-23 17:21:50
 */
<template>
<div class="song-list">
  <ul>
    <li class="item" v-for="(song,index) of songs" :key="index" @click="selectItem(song,index)">
        <div class="content">
            <h2 class="name">{{song.name}}</h2>
                <p class="desc">{{getDesc(song)}}</p>
        </div>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created() {
    console.log(this.songs);
  },
  methods: {
    // 返回歌曲描述
    getDesc(song) {
      return `${song.ar[0].name} - ${song.al.name}`;
    },

    // 派发点击事件
    selectItem(item, index) {
      this.$emit('select', item, index);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';
@import '~common/scss/mixin';

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 1.28rem;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 0.5rem;
      width: 0.5rem;
      margin-right: 0.6rem;
      text-align: center;
      .icon {
        display: inline-block;
        width: 0.5rem;
        height: 0.48rem;
        background-size: 0.5rem 0.48rem;
        &.icon0 {
          @include bg-image('first');
        }
        &.icon1 {
          @include bg-image('second');
        }
        &.icon2 {
          @include bg-image('third');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-medium;
      }
    }

    .content {
      flex: 1;
      line-height: 0.4rem;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
        font-size: $font-size-medium;
      }
      .desc {
        @include no-wrap();
        margin-top: 0.08rem;
        color: $color-text-d;
        font-size: $font-size-medium;
      }
    }
  }
}
</style>
