<template>
  <div class="singer" ref="singer">
    <ul class="type">
      <span>分类：</span>
      <li v-for="singer of singerOptions" :key="singer.value" :class="listId === singer.value?'active':''" @click="getSingerList(singer.value)">{{singer.key}}</li>
    </ul>
    <ul class="letter">
      <li v-for="item of letters" :key=item :class="initial === item?'active':''" @click.stop="letterClick(item)" v-show="listId !== 5001">{{item.toUpperCase()}}</li>
    </ul>
    <listview :data="artists" @pullingUp="pullingUp" @select="selectSinger" ref="singerList"></listview>
    <!-- 歌手详情页的子路由 -->
    <router-view/>
  </div>
</template>
<script>
import Slider from 'base/slider/slider';
import Listview from 'base/listview/listview';
import { mapMutations } from 'vuex';
import { playlistMixin } from 'common/js/mixin';

export default {
  mixins: [playlistMixin],
  components: {
    Listview,
    Slider
  },
  data() {
    return {
      direction: 'horizontal',
      offset: 0,
      listId: 5001,
      limit: 20,
      initial: null,
      // 歌手数据
      artists: [],
      // 是否有更多歌手
      haveMore: true,
      // 是否正在请求数据
      requesting: false,
      singerOptions: [
        { key: '入驻歌手', value: 5001 },
        { key: '华语男歌手', value: 1001 },
        { key: '华语女歌手', value: 1002 },
        { key: '华语组合/乐队', value: 1003 },
        { key: '欧美男歌手', value: 2001 },
        { key: '欧美女歌手', value: 2002 },
        { key: '欧美组合/乐队', value: 2003 },
        { key: '日本男歌手', value: 6001 },
        { key: '日本女歌手', value: 6002 },
        { key: '日本组合/乐队', value: 6003 },
        { key: '韩国男歌手', value: 7001 },
        { key: '韩国女歌手', value: 7002 },
        { key: '韩国组合/乐队', value: 7003 },
        { key: '其他男歌手', value: 4001 },
        { key: '其他女歌手', value: 4002 },
        { key: '其他组合/乐队', value: 4003 }
      ],
      currentLetter: '热',
      letters: [
        '热',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z'
      ]
    };
  },
  created() {
    this.getSingerList(this.listId, this.offset, this.limit);
  },
  methods: {
    letterClick(initial) {
      this.initial = initial;
      this.offset = 0;
      this.getSingerList(this.listId, this.offset, this.limit, initial);
    },
    // 监听是否有播放列表，即是否有mini播放器，调整scroll的底部高度，避免内容被mini播放器覆盖
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '.7rem' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$nextTick(() => {
        this.$refs.singerList.refresh();
      });
    },
    // listId 分类id
    // offset 起始位置
    // limit 获取数量
    // initial 字母索引
    async getSingerList(listId, offset, limit, initial) {
      // 这里不能直接说是if(offset)，因为offset可能为0，强制转换会出问题
      if (offset !== undefined) {
        var url =
          this.HOST +
          `/artist/list?cat=${listId}&offset=${offset}&limit=${limit}&initial=${initial}`;
      } else {
        url = this.HOST + `/artist/list?cat=${listId}`;
      }

      // 避免多次请求
      this.requesting = true;
      this.listId = listId;

      const res = await this.$http.get(url);
      console.log(res);
      if (res.data.code === 200) {
        console.log(`成功请求歌手列表---${this.offset}`);
        // 通过判断是否传入offset来判断是否是新切换的tab
        if (offset) {
          this.artists = this.artists.concat(res.data.artists);
          this.offset += this.limit;
        } else {
          this.artists = res.data.artists;
          this.offset = this.limit;
          // 切换不同tab时需要让歌手列表滚动到顶部
          this.$refs.singerList.$children['0'].scrollTo(0, 0);
        }

        // 判断是否还有更多歌手
        this.haveMore = res.data.more;
      }
      this.requesting = false;
    },
    // 上拉加载更多
    pullingUp() {
      if (this.haveMore) {
        if (!this.requesting) {
          this.getSingerList(
            this.listId,
            this.offset,
            this.limit,
            this.initial
          );
        }
      } else {
        this.$toasted.show('我是有底线的', {
          theme: 'outline',
          position: 'bottom-center',
          duration: 2000
        });
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
.letter {
  z-index: 999;
  position: fixed;
  top: 1.9rem;
  right: 0.2rem;
  margin: auto 0;
  text-align: center;
  padding: 0.2rem 0;
  border-radius: 0.2rem;
  background-color: rgba($color: #ccc, $alpha: 0.4);
  li {
    font-size: 0.3rem;
    margin-top: 0.06rem;
    padding: 0 4px;
  }
  li.active {
    color: #31c27c;
  }
}
ul.type {
  padding-top: 0.1rem;
  height: 0.7rem;
  text-align: center;
  line-height: 0.5rem;
  display: flex;
  width: 100vw;
  white-space: nowrap;
  overflow: auto;
  span {
    display: inline-block;
    font-size: 0.28rem;
    margin-left: 0.2rem;
    flex: 0 0 60px;
  }
  li.active {
    background-color: #31c27c;
    color: #fff;
    border-radius: 20px;
  }
  li {
    vertical-align: middle;
    height: 0.5rem;
    padding: 0px 0.1rem;
    display: inline-block;
    font-size: 0.28rem;
    margin-left: 0.2rem;
    flex: 0 0 60px;
  }
}

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
