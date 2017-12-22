/*
 * @Author: yu yi
 * @Date: 2017-12-14 09:29:56
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-12-22 11:14:00
 */
<template>
  <scroll class="suggest" :data="resultSongs" @pullingUp="searchMore" ref="suggest" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list" v-show="resultSingers.length||resultSongs.length">
      <li class="suggest-item" v-for="(singer,index) of resultSingers" :key="index" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{singer.name}}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="(song,index) of resultSongs" :key="index" @click="selectSong(song)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{song.name}} - {{song.artists[1]?`${song.artists[0].name}/${song.artists[1].name}`:song.artists[0].name}}</p>
        </div>
      </li>
      <div class="end" v-if="!this.hasMore">
        ------我是有底线的------
      </div>
    </ul>
    <div class="no-result-wrapper" v-if="!resultSongs.length && !resultSingers.length">
      <no-result title=" 抱歉，暂无搜索结果 "></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { ERR_OK } from 'common/js/config';
import Scroll from 'base/scroll/scroll';
import NoResult from 'base/no-result/no-result';
import { mapMutations, mapActions } from 'vuex';
export default {
  props: {
    // 搜索关键字
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 搜索结果返回条数
      limit: 30,
      // 搜索偏移位置
      offset: 0,
      // 返回的搜索歌曲结果
      resultSongs: [],
      // 返回的歌手搜索结果
      resultSingers: [],
      // 是否还有更多的标志位
      hasMore: true,
      // 关键词的歌曲总量
      songCount: null,
      beforeScroll: true
    };
  },
  watch: {
    query() {
      // 关键词改变就置空歌曲结果数组
      this.resultSongs = [];
      this.resultSingers = [];
      this._searchSongs();
      this._searchSinger();
    }
  },
  methods: {
    listScroll() {
      this.$emit('listScroll');
    },
    // 搜索关键字返回歌曲
    _searchSongs() {
      const searchSongsUrl = `${this.HOST}/search?keywords=${this
        .query}&limit=${this.limit}&offset=${this.offset}`;

      this.$http.get(searchSongsUrl).then(res => {
        if (res.data.code === ERR_OK && res.data.result.songCount) {
          this.songCount = res.data.result.songCount;
          // 融合返回歌曲结果的数组
          this.resultSongs = this.resultSongs.concat(res.data.result.songs);
          // 如果歌曲数组的数量与总数相同，就将还有更多歌曲的标志位改成false
          this.resultSongs.length === this.songCount
            ? (this.hasMore = false)
            : (this.hasMore = true);
        }
      });
    },
    _searchSinger() {
      // 搜索歌手
      const searchSingersUrl = `${this.HOST}/search?keywords=${this
        .query}&limit=${this.limit}&offset=${this.offset}&type=100`;

      this.$http.get(searchSingersUrl).then(res => {
        if (res.data.code === ERR_OK && res.data.result.artists) {
          // 融合返回歌手结果的数组
          this.resultSingers = this.resultSingers.concat(
            res.data.result.artists.splice(0, 3)
          );
        }
      });
    },
    // 上拉加载更多
    searchMore() {
      // 如果没有更多歌曲了，就不发送加载更多的请求了
      if (!this.hasMore) {
        return;
      }
      this.offset += this.limit;
      this._searchSongs();
    },
    // 在搜索结果中点击歌手
    selectSinger(newSinger) {
      this.setSinger(newSinger);
      this.$router.push({
        path: `/search/${newSinger.id}`
      });
      this.$emit('select');
    },
    selectSong(song) {
      // 获取的song的数据结构和播放器要求的数据结构不匹配
      const songUrl = `${this.HOST}/song/detail?ids=${song.id}`;
      this.$http.get(songUrl).then(res => {
        if (res.data.code === ERR_OK) {
          const resultSong = res.data.songs[0];
          this.insertSong(resultSong);
        }
      });
      this.$emit('select');
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  components: { Scroll, NoResult },
  created() {}
};
</script>

<style scoped lang="scss">
@import '~common/scss/variable';
@import '~common/scss/mixin';

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 0.6rem;
    .suggest-item {
      display: flex;
      align-items: center;
      // padding-bottom: 0.4rem;
    }
    .icon {
      flex: 0 0 0.6rem;
      width: 0.6rem;
      padding-bottom: 0.3rem;
      [class^='icon-'] {
        font-size: 0.38rem;
        color: $color-text-d;
        margin-top: -0.2rem;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;
      .text {
        @include no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  .end {
    color: $color-theme;
    font-size: 0.28rem;
    text-align: center;
    padding-bottom: 0.4rem;
  }
}
</style>
