<template>
  <div class="singer" ref="singer">
    <listview :data="artists" @pullingUp="pullingUp" @select="selectSinger" ref="singerList"></listview>
    <!-- 歌手详情页的子路由 -->
    <router-view/>
  </div>
</template>
<script>
import Listview from 'base/listview/listview';
import { mapMutations } from 'vuex';
import { playlistMixin } from 'common/js/mixin';

export default {
  mixins: [playlistMixin],
  components: {
    Listview
  },
  data() {
    return {
      offset: 0,
      limit: 20,
      // 歌手数据
      artists: [],
      // 是否有更多歌手
      haveMore: true,
      // 是否正在请求数据
      requesting: false
    };
  },
  created() {
    this._getSinger(this.offset, this.limit);
  },
  methods: {
    // 监听是否有播放列表，即是否有mini播放器，调整scroll的底部高度，避免内容被mini播放器覆盖
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '.7rem' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$nextTick(() => {
        this.$refs.singerList.refresh();
      });
    },
    // offset 起始位置
    // limit 获取数量
    async _getSinger(offset, limit) {
      const url = this.HOST + `/top/artists?offset=${offset}&limit=${limit}`;
      this.requesting = true;
      const res = await this.$http.get(url);
      if (res.data.code === 200) {
        console.log(`成功请求歌手列表---${this.offset}`);
        // 设置偏移
        this.offset += limit;
        this.haveMore = res.data.more;
        this.artists = this.artists.concat(res.data.artists);
      }
      this.requesting = false;
    },
    // 上拉加载更多
    pullingUp() {
      if (this.haveMore) {
        if (!this.requesting) {
          this._getSinger(this.offset, this.limit);
        }
      } else {
        alert('我是有底线的...');
      }
    },
    // 歌手点击事件，需要跳转到歌手详情页
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });

      this.setSinger(singer);
    },
    // 下拉刷新
    // pullingDown() {
    //   this._getSinger(0, 20);
    //   alert('正在努力加载...');
    // },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';

.singer {
  position: fixed;
  width: 100%;
  top: 0.88rem;
  bottom: 0;
  .singer-content {
    height: 100%;
    overflow: hidden;
    .list-group {
      padding-bottom: 0.6rem;

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 0.4rem 0 0 0.6rem;
        .avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }

        .name {
          margin-left: 0.4rem;
          color: $color-text-l;
          font-size: $font-size-medium;
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
