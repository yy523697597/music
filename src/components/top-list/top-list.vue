<template>
  <transition name="slide">
    <music-list :title="title" :songs="playlist" :bg-image="bgImage" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { ERR_OK } from 'common/js/config';
import MusicList from 'components/music-list/music-list';
import { mapGetters } from 'vuex';
export default {
  props: {},
  data() {
    return {
      playlist: [],
      rank: true
    };
  },
  computed: {
    ...mapGetters(['topList']),
    title() {
      return this.topList.title;
    },
    bgImage() {
      return this.topList.avatar;
    }
  },
  methods: {
    // 获取榜单详情
    _getRankDetail() {
      const rankDetailUrl = `${this.HOST}//playlist/detail?id=${this.topList
        .id}`;
      this.$http.get(rankDetailUrl).then(res => {
        if (res.data.code === ERR_OK) {
          this.playlist = res.data.playlist.tracks;
        }
      });
    }
  },
  components: { MusicList },
  created() {
    this._getRankDetail();
  }
};
</script>

<style scoped lang="scss">

</style>
