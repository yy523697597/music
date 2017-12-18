<template>
  <div class="search">
    <div class="search-box-wrapper">
      <div class="search-box-wrapper">
        <search-box @query="onQueryChange" ref="searchBox"></search-box>
      </div>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" :data="shortcut">
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
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory"></search-list>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <!-- 歌手详情路由 -->
    <router-view></router-view>
  </div>
</template>
<script>
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import SearchList from 'base/search-list/search-list';
import Scroll from 'base/scroll/scroll';
import { mapActions, mapGetters } from 'vuex';
import { getHotKey } from 'common/js/getHotKey';

export default {
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll
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
    onQueryChange(newquery) {
      this.query = newquery;
    },
    // 获取热门搜索词
    _getHotKey() {
      getHotKey().then(res => {
        console.log(res);
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
    ...mapActions(['saveSearchHistory'])
  },
  created() {
    this._getHotKey();
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';
@import '~common/scss/mixin';

.search {
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
