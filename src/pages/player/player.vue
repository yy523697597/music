/*
 * @Author: yu yi 
 * @Date: 2017-11-23 10:03:38 
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-11-23 17:42:18
 */
<template>
 <div class="player" v-if="playlist.length >0">
   <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
    <div class="normal-player" v-show="fullScreen">
      
     <div class="background">
       <img width="100%" height="100%" :src="currentSong.al.picUrl">
     </div>
     <div class="top">
       <div class="back" @click="back">
         <i class="icon-back"></i>
       </div>
       <h1 class="title">{{currentSong.name}}</h1>
       <h2 class="subtitle">{{currentSong.ar[0].name}}</h2>
     </div>
     <div class="middle">
       <div class="middle-l">
         <div class="cd-wrapper" ref="cdWrapper" >
           <div class="cd" :class="cdCls"><img :src="currentSong.al.picUrl" alt="" class="image"></div>
         </div>
       </div>
     </div>
     <div class="bottom">
       <div class="operators">
         <div class="icon i-left">
           <i class="icon-sequence"></i>
         </div>
         <div class="icon i-left" @click="prev">
           <i class="icon-prev"></i>
         </div>
         <div class="icon i-center" @click="togglePlaying">
           <i :class="playIcon"></i>
         </div>
         <div class="icon i-right" @click="next">
           <i class="icon-next"></i>
         </div>
         <div class="icon i-right">
           <i class="icon icon-not-favorite"></i>
         </div>
       </div>
     </div>
    </div>
   </transition>
   <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon"><img width="40" height="40" :src="currentSong.al.picUrl" :class="cdCls"></div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.ar[0].name}}</p>
        </div>
        <!-- 阻止冒泡，避免打开播放器层 -->
        <div class="control" @click.stop="togglePlaying">
          <i :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
   </transition>
   <audio :src="playUrl" ref="music"></audio>
 </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex';
import animations from 'create-keyframe-animation';

export default {
  props: {},
  data() {
    return {
      // 音乐播放地址
      playUrl: ''
    };
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex'
    ]),
    // 播放按钮状态
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    // mini播放器播放按钮状态
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    // 添加播放器旋转动画
    cdCls() {
      return this.playing ? 'play' : 'play pause';
    }
  },
  methods: {
    // 收起播放器全屏
    back() {
      this.setFullScreen(false);
    },
    // 打开播放器全屏
    open() {
      this.setFullScreen(true);
    },
    // 切换歌曲播放状态
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },
    // 切换上一首歌
    prev() {
      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      // 切换播放器按钮状态
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    // 切换下一首歌
    next() {
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    // 动画效果
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      // 注册进入动画
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });
      // 运行进入动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter() {
      // 清空进入动画
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    // 离开动画不适用插件，直接写
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all .4s';
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = '';
      this.$refs.cdWrapper.style.transform = '';
    },
    // 获取动画初始位置和缩放尺寸
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

      return {
        x,
        y,
        scale
      };
    },
    // 获取音乐播放地址
    _getMusicPlayUrl(id) {
      let url = this.HOST + `/music/url?id=${id}`;
      this.$http.get(url).then(res => {
        if (res.data.code === 200) {
          this.playUrl = res.data.data[0].url;
        }
      });
    }
  },
  components: {},
  created() {},
  watch: {
    currentSong() {
      this._getMusicPlayUrl(this.currentSong.id);
    },
    playUrl() {
      this.$nextTick(() => {
        this.$refs.music.play();
      });
    },
    playing(playingState) {
      const music = this.$refs.music;
      this.$nextTick(() => {
        playingState ? music.play() : music.pause();
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import '~common/scss/variable';
@import '~common/scss/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(0.4rem);
    }
    .top {
      position: relative;
      margin-bottom: 2.1rem;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 0.18rem;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 0.8rem;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .subtitle {
        line-height: 0.4rem;
        text-align: center;
        font-size: $font-size-small;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 1.6rem;
      bottom: 3.4rem;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 0.2rem solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 32s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }

      .playing-lyric-wrapper {
        width: 80%;
        margin: 0.6rem auto 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 0.4rem;
          line-height: 0.4rem;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 0.64rem;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 1rem;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.08rem;
          width: 0.16rem;
          height: 0.16rem;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 0.4rem;
            border-radius: 0.1rem;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 0.2rem 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 0.6rem;
          line-height: 0.6rem;
          width: 0.6rem;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 0.6rem;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 0.4rem;
          text-align: center;
          i {
            font-size: 0.8rem;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
  .normal-enter-active,
  .normal-leave-active {
    transition: all 0.4s;
    .top,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  .normal-enter,
  .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -2rem, 0);
    }
    .bottom {
      transform: translate3d(0, 2rem, 0);
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 1.2rem;
    background: $color-highlight-background;
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 0.8rem;
      width: 0.8rem;
      padding: 0 0.2rem 0 0.4rem;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 16s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 0.4rem;
      overflow: hidden;
      .name {
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 0.6rem;
      width: 0.6rem;
      padding: 0 0.2rem;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 0.6rem;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 0.64rem;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
