<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="officialInfo" ref="topList">
      <!-- 官方榜 -->
      <ul>
        <span class="rank-title">官方榜</span>
        <li class="item" v-for="(officialRankItem,index) of officialInfo" :key="index">
          <div class="icon">
            <img :src="officialRankItem.avatar" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) of officialRankItem.songs" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.name}} - {{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!officialInfo">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading';
import Scroll from 'base/scroll/scroll';
import { ERR_OK } from 'common/js/config';
import { playlistMixin } from 'common/js/mixin';

export default {
  mixins: [playlistMixin],
  props: {},
  data() {
    return {
      // 官方榜单
      officialInfo: []
    };
  },
  methods: {
    // 获取排行榜信息
    _getRankInfo() {
      // 官方榜
      const idxOfficial = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10];
      for (var i = 0; i < idxOfficial.length; i++) {
        // 官方榜的地址
        let rankUrl = `${this.HOST}/top/list?idx=${idxOfficial[i]}`;
        // 获取官方榜的信息
        this.$http.get(rankUrl).then(res => {
          if (res.data.code === ERR_OK) {
            // 获取排行版封面图片
            let avatar = res.data.result.coverImgUrl;

            // 根据返回的排行榜id，使用获取歌单详情的接口去获取排行榜歌曲
            let rankDetailUrl = `${this.HOST}//playlist/detail?id=${res.data
              .result.id}`;

            this.$http.get(rankDetailUrl).then(res => {
              if (res.data.code === ERR_OK) {
                // 定义一个临时对象，用于存储排行榜的封面和3首歌曲
                let temp = {
                  avatar,
                  songs: res.data.playlist.tracks.splice(0, 3)
                };
                // 将临时对象添加到官方榜单的数组中
                this.officialInfo.push(temp);
              }
            });
          }
        });
      }
    },
    // 优化有mini播放器的页面状态
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '1.2rem' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$nextTick(() => {
        this.$refs.topList.refresh();
      });
    }
  },
  components: { Loading, Scroll },
  created() {
    this._getRankInfo();
  }
};
</script>

<style scoped lang="scss">
@import '~common/scss/variable';
@import '~common/scss/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .rank-title {
    color: #fff;
    font-size: $font-size-large;
    border-left: 2px solid $color-theme;
    padding-left: 0.1rem;
    margin-left: 0.4rem;
  }
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 0.4rem;
      padding-top: 0.4rem;
      height: 2rem;
      &:last-child {
        padding-bottom: 0.4rem;
      }
      .icon {
        flex: 0 0 2rem;
        width: 2rem;
        height: 2rem;
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 0.4rem;
        height: 2rem;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
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
</style>

