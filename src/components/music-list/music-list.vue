 <template>
   <div class="music-list">
       <div class="back"><i class="icon-back"></i></div>
       <h1 class="title">{{title}}</h1>
       <div class="bg-image" :style="bgStyle" ref="bgImage">
           <!-- 歌手图片遮罩层 -->
           <div class="filter"></div>
       </div>
       <!-- 滚动阴影层 -->
       <div class="bg-layer" ref="layer" :style="layerMove"></div>
       <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
           <div class="song-list-wrapper">
            <song-list :songs="songs"></song-list>
           </div>
       </scroll>
   </div>
 </template>
 <script>
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
export default {
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
    Scroll
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    }
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
  },
  watch: {
    scrollY(newY) {
      // 解决layer滚动过多，会重新漏出歌手头图的bug
      let translateY = Math.max(-this.imageHeight, newY);

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
    color: $color-text;
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
        width: 2.7rem;
        padding: 0.14rem 0;
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
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
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
 