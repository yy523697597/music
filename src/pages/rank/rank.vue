<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="officialInfo" ref="topList">
      <!-- 官方榜 -->
      <ul class="container">
        <span class="rank-title">官方榜</span>
        <li class="item" v-for="(officialRankItem,index) of officialInfo" :key="index" @click="selectItem(officialRankItem)">
          <div class="icon">
            <img :src="officialRankItem.avatar">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) of officialRankItem.songs" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.name}} - {{song.artists[0].name}}</span>
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
import { mapMutations } from 'vuex';

export default {
  mixins: [playlistMixin],
  props: {},
  data() {
    return {
      // 官方榜单
      officialInfo: [],
      idxOfficial: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  methods: {
    // 选择歌曲
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });

      this.setTopList(item);
    },
    // 获取排行榜信息
    _getRankInfo() {
      // 官方榜的地址
      let rankUrl = `${this.HOST}/top/list?idx=${this.idxOfficial.shift()}`;
      // 获取官方榜的信息
      this.$http.get(rankUrl).then(res => {
        if (res.data.code === ERR_OK) {
          // 获取排行版封面图片
          let avatar = res.data.playlist.coverImgUrl;
          // 获取排行榜歌单的id
          let id = res.data.playlist.id;
          let title = res.data.playlist.name;
          // 根据返回的排行榜id，使用获取歌单详情的接口去获取排行榜歌曲
          let rankDetailUrl = `${this.HOST}//playlist/detail?id=${
            res.data.playlist.id
          }`;

          this.$http.get(rankDetailUrl).then(res => {
            // console.log(res.data);
            if (res.data.code === ERR_OK) {
              // 定义一个临时对象，用于存储排行榜的封面和3首歌曲,歌单id
              let temp = {
                title,
                id,
                avatar,
                songs: res.data.result.tracks.splice(0, 3)
              };

              // 将临时对象添加到官方榜单的数组中
              this.officialInfo.push(temp);
              // console.log(this.officialInfo);
              if (this.idxOfficial.length) {
                // 此处使用递归来保证每次请求的顺序都是一致的，但是会导致显示速度非常慢
                this._getRankInfo();
              }
            }
          });
        }
      });
    },
    _getRankContent(index) {},
    // 优化有mini播放器的页面状态
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '1.2rem' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$nextTick(() => {
        this.$refs.topList.refresh();
      });
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
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
  top: 1.26rem;
  bottom: 0;
  // .container {
  //   margin-top: -0.2rem;
  // }
  .rank-title {
    color: #fff;
    font-size: $font-size-medium;
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
        img {
          width: 100%;
          height: 100%;
        }
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

