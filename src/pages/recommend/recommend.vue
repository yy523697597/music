<template>
  <div class="recommend">
      <scroll ref="scroll" :data="playLists" class="recommend-content">
        <div>
            <div class="slider-wrapper">
              <!-- 需要有banners的数据之后再去渲染DOM,不然的话slider的宽度不对 -->
              <slider v-if="banners.length">
                <div v-for="(item,index) of banners" :key="index">
                  <div @click="_bannerClick(item.typeTitle,item.url)">
                    <!-- 监听图片的load事件用于初始化scroll，添加needsclick类名用于解决fastclick和better-scroll的冲突 -->
                    <img class="needsclick" @load="loadImg" :src="item.pic">
                  </div>
                  <span class="type">{{item.typeTitle}}</span>
                </div>
              </slider>
            </div>
            <div class="recommend-list">
              <h1 class="list-title">热门歌单推荐</h1>
              <ul>
                <li class="item" v-for="(item,index) of playLists" :key="index">
                  <div class="icon">
                    <img v-lazy="item.coverImgUrl" >
                  </div>
                  <div class="text">
                    <h2 class="name">{{item.creator.nickname}}</h2>
                    <p class="desc">{{item.name}}</p>
                  </div>
                </li>
              </ul>
            </div>
        </div>
      </scroll>
  </div>
</template>
<script>
import { ERR_OK } from 'api/config';
import Slider from 'base/slider/slider';
import Scroll from 'base/scroll/scroll';

export default {
  data() {
    return {
      banners: [],
      playLists: [],
      loadedImg: false
    };
  },
  components: {
    Slider,
    Scroll
  },
  created() {
    this._getBanners();
    this._getPlaylists();
  },
  methods: {
    // 获取banner数据
    _getBanners() {
      // 获取banner数据
      const url = this.HOST + 'banner';
      this.$http.get(url).then(res => {
        if (res.status === ERR_OK) {
          this.banners = res.data.banners;
        }
      });
    },
    // 获取推荐歌单
    _getPlaylists() {
      const url = this.HOST + 'top/playlist';
      this.$http.get(url).then(res => {
        if (res.status === ERR_OK) {
          this.playLists = res.data.playlists;
        }
      });
    },
    // banner点击事件
    _bannerClick(type, url) {
      if (url !== '') {
        window.location = url;
      }
    },
    // banner图片载入后,刷新scroll
    loadImg() {
      if (!this.loadedImg) {
        this.loadedImg = true;
        this.$refs.scroll.refresh();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 1.76rem;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 1.3rem;
        line-height: 1.3rem;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 0.4rem 0.4rem 0.4rem;
        .icon {
          flex: 0 0 1.2rem;
          width: 1.2rem;
          padding-right: 0.4rem;
          img {
            width: 1.2rem;
            height: 1.2rem;
          }
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 0.4rem;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 0.2rem;
            color: $color-text;
          }
          .desc {
            color: $color-text-d;
          }
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
}
</style>
