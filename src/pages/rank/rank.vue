<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="officialInfo" ref="topList">
      <!-- 官方榜 -->
      <ul class="container" v-show="showRank">
        <span class="rank-title">官方榜</span>
        <li class="item" v-for="(officialRankItem,index) of officialInfo" :key="index" @click="selectItem(officialRankItem)">
          <div class="icon">
            <img :src="officialRankItem.avatar+(isIos?'?imageView&thumbnail=200x0&quality=75&tostatic=0&type=jpg':'_.webp?imageView&thumbnail=200x0&quality=75&tostatic=0&type=webp')">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) of officialRankItem.songs" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.name}} - {{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!showRank">
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
import { uais } from 'common/js/util';

export default {
  mixins: [playlistMixin],
  props: {},
  data() {
    return {
      // 官方榜单
      officialInfo: [],
      idxOfficial: [0, 1, 2, 3, 4, 5, 6, 7],
      showRank: false,
      // 是否是ios系统
      isIos: false
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
    async _getRankInfo() {
      // 使用map方法返回promise对象
      let tempArr = this.idxOfficial.map(async item => {
        // 官方榜的地址
        let rankUrl = `${this.HOST}/top/list?idx=${item}`;
        // 获取官方榜的信息
        let res = await this.$http.get(rankUrl);

        if (res.data.code === ERR_OK) {
          // 获取排行版封面图片
          let avatar = res.data.playlist.coverImgUrl;
          // 获取排行榜歌单的id
          let id = res.data.playlist.id;
          let title = res.data.playlist.name;
          let temp = {
            title,
            id,
            avatar,
            songs: res.data.playlist.tracks.splice(0, 3)
          };
          return temp;
        }
      });
      // 使用Promise.all来保证并发的异步的顺序，对比使用递归的方法，速度有极大的提升
      this.officialInfo = await Promise.all(tempArr);
      this.showRank = true;
      console.log('成功获取排行榜');
    },
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
    this.isIos = uais('ios');
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
  top: 0.88rem;
  bottom: 0;
  // .container {
  //   margin-top: -0.2rem;
  // }
  .rank-title {
    color: #222;
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
        color: $color-text-l;
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

