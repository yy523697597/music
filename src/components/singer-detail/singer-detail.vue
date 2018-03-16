<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex';
import MusicList from 'components/music-list/music-list';
const ERR_OK = 200;

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.img1v1Url;
    }
  },
  created() {
    this._getSingerSongs(this.singer.id);
  },
  methods: {
    // 获取歌手歌曲
    _getSingerSongs(singerId) {
      const singerUrl = `${this.HOST}/artists?id=${singerId}`;
      this.$http.get(singerUrl).then(res => {
        if (res.status === ERR_OK) {
          console.log('成功请求歌手歌曲列表');
          // 此处返回的歌曲列表的数据结构有所不同，需要进行一次处理
          res.data.hotSongs.forEach(item => {
            const temp = {
              album: item.al,
              artists: item.ar,
              duration: item.dt
            };
            // 融合一个有缺失属性的对象
            item = Object.assign(temp, item);
            this.songs.push(item);
          });
        }
      });
    }
  },
  components: {
    MusicList
  }
};
</script>
<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
