/*
 * @Author: yu yi 
 * @Date: 2017-11-23 10:03:38 
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-12-04 14:50:30
 */
<template>
  <div class="player" v-if="playlist.length >0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 播放器高斯模糊背景 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.al.picUrl">
        </div>
        <div class="top">
          <!-- 返回按钮 -->
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <!-- 歌曲名称及歌手 -->
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.ar[0].name}}</h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <!-- 唱片 -->
          <div class="middle-l" ref="cdWrapper">
            <div class="cd-wrapper">
              <div class="cd" :class="cdCls"><img :src="currentSong.al.picUrl" alt="" class="image"></div>
            </div>
            <!-- 当前歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <!-- 歌词 -->
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <!-- 切换唱片与歌词的指示器 -->
          <div class="dot-wrapper">
            <div class="dot" :class="{'active':currentShow==='cd'}"></div>
            <div class="dot" :class="{'active':currentShow==='lyric'}"></div>
          </div>
          <!-- 歌曲进度条 -->
          <div class=" progress-wrapper ">
            <span class="time time-l ">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper ">
              <progress-bar :percent="percent " @percentChange="onProgressBarChange "></progress-bar>
            </div>
            <span class="time time-r ">{{formatTime(currentSong.dt/1000)}}</span>
          </div>
          <!-- 歌曲播放操作区 -->
          <div class="operators ">
            <!-- 播放模式 -->
            <div class="icon i-left " @click="changeMode ">
              <i :class="iconMode "></i>
            </div>
            <!-- 上一曲 -->
            <div class="icon i-left " @click="prev " :class="disableCls ">
              <i class="icon-prev "></i>
            </div>
            <!-- 播放按钮 -->
            <div class="icon i-center " @click="togglePlaying " :class="disableCls ">
              <i :class="playIcon "></i>
            </div>
            <!-- 下一曲 -->
            <div class="icon i-right " @click="next " :class="disableCls ">
              <i class="icon-next "></i>
            </div>
            <!-- 收藏 -->
            <div class="icon i-right ">
              <i class="icon icon-not-favorite "></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <transition name="mini ">
      <div class="mini-player " v-show="!fullScreen " @click="open ">
        <div class="icon "><img width="40 " height="40 " :src="currentSong.al.picUrl " :class="cdCls "></div>
        <div class="text ">
          <h2 class="name ">{{currentSong.name}}</h2>
          <p class="desc ">{{currentSong.ar[0].name}}</p>
        </div>
        <!-- 使用stop阻止冒泡，避免打开播放器层 -->
        <div class="control " @click.stop="togglePlaying ">
          <!-- 环形歌曲进度条 -->
          <progress-circle :radius=32 :percent="percent ">
            <i :class="miniIcon " class="icon-mini "></i>
          </progress-circle>
        </div>
        <!-- 歌曲列表按钮 -->
        <div class="control ">
          <i class="icon-playlist "></i>
        </div>
      </div>
    </transition>
    <audio :src="playUrl" ref="music" @canplay="ready" @error="onError" @timeupdate="updateTime" @ended="musicEnd"></audio>

  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex';
import animations from 'create-keyframe-animation';
import ProgressBar from 'base/progress-bar/progress-bar';
import ProgressCircle from 'base/progress-circle/progress-circle';
import { playMode } from 'common/js/config.js';
import { shuffle } from 'common/js/util.js';
import Lyric from 'lyric-parser';
import Scroll from 'base/scroll/scroll';

export default {
  data() {
    return {
      // 音乐播放地址
      playUrl: '',
      // 歌曲是否可播放
      songReady: false,
      // 当前播放时间
      currentTime: 0,
      // 歌词存储对象
      lyric: {},
      // 当前歌曲的歌词
      currentLyric: {},
      // 当前歌词行
      currentLineNum: 0,
      // 切换唱片与歌词显示
      currentShow: 'cd',
      // 当前歌词
      playingLyric: null
    };
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'playMode',
      'sequenceList'
    ]),
    // 播放按钮状态
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    // mini播放器播放按钮状态
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    // 播放模式图标
    iconMode() {
      return this.playMode === playMode.sequence
        ? 'icon-sequence'
        : this.playMode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    // 添加播放器旋转动画
    cdCls() {
      return this.playing ? 'play' : 'play pause';
    },
    // 按钮不可点击样式
    disableCls() {
      return this.songReady ? '' : 'disable';
    },
    // 进度条百分比
    percent() {
      return this.currentTime / (this.currentSong.dt / 1000);
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
      if (!this.songReady) {
        return;
      }
      // 如果播放列表只有一首歌，就让他循环播放
      if (this.playlist.length === 1) {
        this.loop;
      }
      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playlist.length - 1;
      }
      // 设置歌曲索引
      this.setCurrentIndex(index);
      // 切换播放器按钮状态
      if (!this.playing) {
        this.togglePlaying();
      }
      // 更改歌曲ready状态
      this.songReady = false;
    },
    // 切换下一首歌
    next() {
      if (!this.songReady) {
        return;
      }
      // 如果播放列表只有一首歌，就让他循环播放
      if (this.playlist.length === 1) {
        this.loop;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }

      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    // 单曲循环播放歌曲
    loop() {
      this.$refs.music.currentTime = 0;
      this.$refs.music.play();
      // 单曲循环模式下，重新播放歌曲时，重新定位歌词到顶部
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    // 歌曲缓冲好可以播了
    ready() {
      this.songReady = true;
      this.$refs.music.play();
    },
    // 歌曲缓冲出错
    onError() {
      this.songReady = true;
    },
    // 监听音乐播放完成事件
    musicEnd() {
      // 如果是单曲循环模式，就重新播放这首歌曲
      if (this.playMode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    // 更新播放器播放时间
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    // 格式化时间函数
    formatTime(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      let second = interval % 60;

      if (second < 10) {
        second = '0' + second;
      }
      return `${minute}:${second}`;
    },
    onProgressBarChange(percent) {
      const currentTime = percent * (this.currentSong.dt / 1000);
      // currentTiem 是一个可读可写的参数，写参数可以改播放进度
      this.$refs.music.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }

      // 拖动进度条，改变当前歌词进度
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    // 切换播放模式
    changeMode() {
      // mode 依 0 1 2 循环
      const mode = (this.playMode + 1) % 3;
      // 设置播放模式
      this.setPlayMode(mode);

      let list = null;
      // 随机播放
      if (mode === playMode.random) {
        // 打乱播放列表
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      // 设置播放列表
      this.setPlaylist(list);
    },
    // 切换播放模式时，不切换当前正在播放的歌曲
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    // vuex设置
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
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
    // 离开动画不使用插件，直接写
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
    },
    // 改变歌词进度
    // 参数是一个对象，其中当前歌词的属性是txt
    _changeLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      // 设置当前歌词
      this.playingLyric = txt;
    },
    // 处理歌词
    _handleLyric() {
      this._getLyric()
        .then(lyric => {
          this.currentLyric = new Lyric(lyric, this._changeLyric);
          if (this.playing) {
            // 播放歌词
            this.currentLyric.play();
          }
        })
        // 获取不到歌词的时进行的处理
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = null;
          this.currentLineNum = 0;
        });
    },
    // 获取歌曲歌词
    _getLyric() {
      // 使用歌词对象存储已经获取的歌词
      if (this.lyric[this.currentSong.id]) {
        return Promise.resolve(this.lyric[this.currentSong.id]);
      }
      // 获取歌词
      return new Promise((resolve, reject) => {
        const lyricUrl = `${this.HOST}/lyric?id=${this.currentSong.id}`;

        this.$http.get(lyricUrl).then(res => {
          resolve(res.data.lrc.lyric);
          this.lyric[this.currentSong.id] = res.data.lrc.lyric;
        });
      });
    },
    // 切换cd与歌词显示界面
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      // Y方向移动距离大于X方向的移动距离时，认为是纵向滚动，就忽略调
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      // 如果是唱片界面，距离左侧的距离就是0
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      // 手指滑动的比例
      this.touch.percent = Math.abs(width / window.innerWidth);
      this.$refs.lyricList.$el.style.transform = `translate3d(${width}px,0,0)`;
      this.$refs.lyricList.$el.style.transition = 'none';
      this.$refs.cdWrapper.style.transition = 'none';
      this.$refs.cdWrapper.style.opacity = 1 - this.touch.percent;
    },
    middleTouchEnd() {
      let offsetWidth, opacity;

      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          this.currentShow = 'lyric';
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = 'cd';
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.cdWrapper.style.opacity = opacity;
      this.$refs.lyricList.$el.style.transition = 'all .4s';
    }
  },

  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  created() {
    // 关联一个触摸对象，用于切换唱片与歌词
    this.touch = {};
  },
  watch: {
    currentSong() {
      this._getMusicPlayUrl(this.currentSong.id);

      // 切换歌曲时，重新定位歌词到顶部
      if (this.currentLyric && this.currentLyric.stop) {
        this.$nextTick(() => {
          this.currentLyric.stop();
        });
      }
      this._handleLyric();
    },
    playing() {
      const music = this.$refs.music;
      this.$nextTick(() => {
        // 歌曲准备好之后，才能播放和暂停
        if (this.songReady) {
          this.playing ? music.play() : music.pause();
          // 暂停歌曲播放后，也应该暂停歌词的播放
          // 重新播放歌曲后，需要让当前歌词去跳转到相应的播放进度
          if (this.currentLyric) {
            this.playing
              ? this.currentLyric.seek(this.$refs.music.currentTime * 1000)
              : this.currentLyric.stop();
          }
        }
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
        left: -0.02rem;
        top: 0.2rem;
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
