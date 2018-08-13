/*
 * @Author: yu yi
 * @Date: 2017-12-04 15:38:11
 * @Last Modified by: yu yi
 * @Last Modified time: 2018-08-13 10:26:52
 */
<template>
  <transition name="slide">
    <music-list :bg-image="bgImage" :title="title" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list';
import { mapGetters } from 'vuex';
const ERR_OK = 200;
export default {
  props: {},
  data() {
    return {
      // 歌单详情页歌曲
      songs: []
    };
  },
  computed: {
    ...mapGetters(['songMenu']),
    title() {
      return this.songMenu.name;
    },
    bgImage() {
      return this.songMenu.coverImgUrl;
    }
  },
  methods: {
    // 获取歌单的歌曲
    _getSongMenuDetail() {
      const songMenuUrl = `${this.HOST}/playlist/detail?id=${this.songMenu.id}`;

      this.$http.get(songMenuUrl).then(res => {
        if (res.data.code === ERR_OK) {
          console.log(res.data);
          this.songs = res.data.playlist.tracks;
        }
      });
    }
  },
  components: {
    MusicList
  },
  created() {
    this._getSongMenuDetail();
  }
};
</script>

<style scoped lang="scss">
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
