<template>
  <tansition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <!-- click.stop 仅用于阻止冒泡 -->
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content">
          <ul>
            <li ref="listItem" class="item" v-for="(song,index) of sequenceList" :key="index" @click="selectItem(song,index)">
              <i class="current" :class="getCurrentIcon(song)"></i>
              <span class="text">{{song.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click="deleteItem(song)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </tansition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex';
import Scroll from 'base/scroll/scroll';
import { playMode } from 'common/js/config';
export default {
  name: 'playlist',
  props: {},
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      // 传入数据之后需要刷新一次，不然无法滚动
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    // 高亮当前播放歌曲
    getCurrentIcon(song) {
      if (this.currentSong.id === song.id) {
        return 'icon-play';
      }
      return '';
    },
    // 播放列表的点击事件
    selectItem(song, index) {
      // 如果是随机播放需要在播放列表中找到播放索引，而不能直接使用index
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(item => {
          return item.id === song.id;
        });
      }
      this.setCurrentIndex(index);
      // 修改播放状态
      this.setPlayingState(true);
    },
    delete(song) {},
    // 切换当前播放歌曲为播放列表第一位,带滚动动画
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    // 不生效？
    watch: {
      currentSong(newSong, oldSong) {
        console.log(234234);
        if (!this.showFlag || newSong.id === oldSong.id) {
          return;
        }
        this.scrollToCurrent(newSong);
      }
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  },
  components: {
    Scroll
  },
  created() {},
  computed: {
    ...mapGetters(['sequenceList', 'currentSong', 'playlist'])
  }
};
</script>

<style scoped lang="scss">
@import '~common/scss/variable';
@import '~common/scss/mixin';
.list-fade-enter-active,
.list-fade-leave-active {
  transition: opacity 0.3s;
  .list-wrapper {
    transition: all 0.3s;
  }
}
.list-fade-enter,
.list-fade-leave-to {
  opacity: 0;
  .list-wrapper {
    transform: translate3d(0, 100%, 0);
  }
}
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click() .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .like {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }
    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
