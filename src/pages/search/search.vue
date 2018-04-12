<template>
  <div class="search">
    <div class="search-box-wrapper">
      <div class="search-box-wrapper">
        <search-box @query="onQueryChange" ref="searchBox"></search-box>
      </div>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li v-for="(item,index) of hotKey" :key="index" class="item" @click="addQuery(item.k)">
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="search-history" v-show="searchHistory.length ">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @selectSearch="addQuery" @deletSearch="deletSearch"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" title="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <!-- 歌手详情路由 -->
    <router-view></router-view>
  </div>
</template>
<script>
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import SearchList from 'base/search-list/search-list';
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import { mapActions, mapGetters } from 'vuex';
import { getHotKey } from 'common/js/getHotKey';
import { playlistMixin } from 'common/js/mixin';

export default {
  mixins: [playlistMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  },
  data() {
    return {
      query: '',
      hotKey: []
    };
  },
  computed: {
    ...mapGetters(['searchHistory']),
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    }
  },
  methods: {
    // 判断是否有mini播放器
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '1.2rem' : '';
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.searchResult.style.bottom = bottom;
      // 需要在nextTick中调用，否则会报错
      this.$nextTick(() => {
        this.$refs.shortcut.refresh();
        this.$refs.suggest.refresh();
      });
    },
    onQueryChange(newquery) {
      this.query = newquery;
    },
    // 获取热门搜索词
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === 0) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    // 移动端输入完成，滚动列表时，隐藏输入法键盘
    blurInput() {
      this.$refs.searchBox.blur();
    },
    // 保存搜索历史
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    // 热门搜索词点击事件
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    // 删除搜索历史
    deletSearch(query) {
      this.deletSearchHistory(query);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    clearSearchHistory() {
      this.clearSearchHistory();
    },
    ...mapActions([
      'saveSearchHistory',
      'deletSearchHistory',
      'clearSearchHistory'
    ])
  },
  created() {
    this._getHotKey();
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';
@import '~common/scss/mixin';

.search {
  position: fixed;
  width: 100%;
  top: 0.88rem;
  bottom: 0;
  .search-box-wrapper {
    margin: 0.4rem;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 3.56rem;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 0.4rem 0.4rem 0.4rem;
      }
      .title {
        margin-bottom: 0.4rem;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 0.1rem 0.2rem;
        margin: 0 0.4rem 0 0;
        border-radius: 0.12rem;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
  .search-history {
    position: relative;
    margin: 0 0.4rem;
    .title {
      display: flex;
      align-items: center;
      height: 0.8rem;
      font-size: $font-size-medium;
      color: $color-text-l;
      .text {
        flex: 1;
      }
      .clear {
        @include extend-click();
      }
      .icon-clear {
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 3rem;
    bottom: 0;
  }
}
</style>
