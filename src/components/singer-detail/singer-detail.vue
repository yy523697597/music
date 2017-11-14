<template>
<transition name="slide">
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </div>
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
          this.songs = res.data.hotSongs;
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
@import '~common/scss/variable';
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
