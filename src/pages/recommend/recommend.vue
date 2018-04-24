<template>
  <div class="recommend" ref="recommend">
    <scroll @pullingUp="pullingUp" ref="scroll" :data="playLists" class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <!-- 需要有banners的数据之后再去渲染DOM,不然的话slider的宽度不对 -->
          <slider v-if="banners.length">
            <div v-for="(item,index) of banners" :key="index">
              <div @click="_bannerClick(item.typeTitle,item.url)">
                <!-- 监听图片的load事件用于初始化scroll，添加needsclick类名用于解决fastclick和better-scroll的冲突 -->
                <img class="needsclick" @load="loadImg" :src="item.pic+(isIos?'?imageView&thumbnail=750x0&quality=75&tostatic=0&type=jpg':'_.webp?imageView&thumbnail=750x0&quality=75&tostatic=0&type=webp')">
              </div>
              <!-- <span class="type">{{item.typeTitle}}</span> -->
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item,index) of playLists" :key="index" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.coverImgUrl+(isIos?'?imageView&thumbnail=80x0&quality=75&tostatic=0&type=jpg':'_.webp?imageView&thumbnail=80x0&quality=75&tostatic=0&type=webp')">
              </div>
              <div class="text">
                <h2 class="name">{{item.name}}</h2>
                <p class="desc">{{item.creator.nickname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="showLoading">
        <loading></loading>
      </div>
    </scroll>
    <!-- 歌单详情页面路由 -->
    <router-view></router-view>
  </div>
</template>
<script>
import { ERR_OK } from 'api/config';
import { uais } from 'common/js/util';
import Slider from 'base/slider/slider';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { playlistMixin } from 'common/js/mixin';
import { mapMutations } from 'vuex';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      // 首页banner
      banners: [],
      // 推荐歌单
      playLists: [],
      loadedImg: false,
      // 请求偏移参数
      offset: 20,
      // 是否正在请求数据
      requesting: false,
      // 是否显示加载动画
      showLoading: true,
      isIos: false
    };
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this.isIos = uais('ios');
    this._getBanners();
    this._getPlaylists();
  },
  methods: {
    // 歌单列表点击事件
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      });

      this.setSongMenu(item);
    },
    // 监听是否有播放列表，即是否有mini播放器，调整scroll的底部高度，避免内容被mini播放器覆盖
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '1.2rem' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    },
    // 获取banner数据
    async _getBanners() {
      // 获取banner数据
      const url = this.HOST + '/banner';
      const res = await this.$http.get(url);
      if (res.status === ERR_OK) {
        console.log('成功请求banner数据');
        this.banners = res.data.banners;
      }
    },
    // 获取推荐歌单
    async _getPlaylists() {
      const url = this.HOST + `/top/playlist?limit=${this.offset}&order=hot`;
      this.requesting = true;
      this.showLoading = true;
      const res = await this.$http.get(url);
      if (res.status === ERR_OK) {
        console.log(`成功请求推荐歌单---${this.offset}`);
        this.playLists = this.playLists.concat(res.data.playlists);
        this.offset += 20;
      }
      this.requesting = false;
      this.showLoading = false;
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
    },
    // 上拉加载更多
    pullingUp() {
      if (!this.requesting) {
        this._getPlaylists();
      }
    },
    ...mapMutations({
      setSongMenu: 'SET_SONG_MENU'
    })
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 0.88rem;
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
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: $font-size-large;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 0.4rem 0.2rem 0.4rem;
        .icon {
          flex: 0 0 0.8rem;
          width: 0.8rem;
          padding-right: 0.4rem;
          img {
            width: 0.8rem;
            height: 0.8rem;
          }
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 0.4rem;
          overflow: hidden;
          font-size: $font-size-small;
          .name {
            margin-bottom: 0.1rem;
            color: $color-text;
            font-size: $font-size-medium;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .desc {
            color: $color-text-d;
            white-space: nowrap;
            text-overflow: ellipsis;
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
