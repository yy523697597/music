 <template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 播放按钮 -->
      <div class="play-wrapper" v-show="songs.length>0" ref="playBtn">
        <div class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 歌手图片遮罩层 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 滚动阴影层 -->
    <div class="bg-layer" ref="layer" :style="layerMove"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
        <loading v-show="!(songs.length>0)"></loading>
      </div>
    </scroll>
  </div>
</template>
 <script>
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { mapActions } from 'vuex';
import { playlistMixin } from 'common/js/mixin';
// 歌手名字的保留高度
const RESERVED_HEIGHT = 40;

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0,
      imageHeight: 0
    };
  },
  computed: {
    // 控制歌手头图
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    },
    // 控制layer层的移动
    layerMove() {
      return `transform:translate3d(0,${this.scrollY}px,0)`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  methods: {
    // 监听是否有播放列表，即是否有mini播放器，调整scroll的底部高度，避免内容被mini播放器覆盖
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '.7rem' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$nextTick(() => {
        this.$refs.list.refresh();
      });
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 返回
    back() {
      this.$router.back();
    },
    // 歌曲点击事件
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    // 随机播放所有歌曲
    random() {
      this.randomPlay({
        list: this.songs
      });
    },
    // 语法糖
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  created() {
    // scroll节流参数
    this.probeType = 3;
    // scroll监听滚动
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    // 设置list的初始位置,px之前不能有空格
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    this.minHeight = -this.imageHeight + RESERVED_HEIGHT;
  },
  watch: {
    scrollY(newY) {
      // 让layer只能滚动到距离顶部一定的距离，用于解决layer滚动过多，会重新漏出歌手头图的bug
      let translateY = Math.max(this.minHeight, newY);
      // 蒙层的z-index
      let zIndex = 0;
      // 下拉时图片的缩放比例
      let scale = 1;
      // 上滑时图片的模糊参数
      let blur = 0;

      let percent = Math.abs(newY / this.imageHeight);
      // 向下滑动的时候放大歌手图片，向上滑动出现高斯模糊
      if (newY > 0) {
        scale += percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }
      this.$refs.filter.style['backdrop'] = `blur(${blur}px)`;
      this.$refs.bgImage.style['transform'] = `scale(${scale})`;

      // 当歌曲列表滑动到顶部的位置时，需要更改歌手头图的高度和z-index来盖住歌曲名字
      if (newY <= this.minHeight) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = RESERVED_HEIGHT + 'px';
        this.$refs.playBtn.style.display = 'none';
      } else {
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = '';
      }

      this.$refs.bgImage.style.zIndex = zIndex;

      this.scrollY = translateY;
    }
  }
};
</script>
 <style lang="scss" scoped>
@import '~common/scss/variable';
@import '~common/scss/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 0.12rem;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 0.2rem;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    @include no-wrap();
    text-align: center;
    line-height: 0.8rem;
    font-size: $font-size-large;
    color: #fff;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 0.4rem;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 3rem;
        padding: 0.1rem 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 2rem;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 0.12rem;
          font-size: $font-size-medium;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-medium;
        }
      }
    }
  }

  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;

    background: $color-background;
    .song-list-wrapper {
      padding: 0.4rem 0.6rem;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
 