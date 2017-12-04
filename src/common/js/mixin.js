/*
 * @Author: yu yi
 * @Date: 2017-12-04 11:16:06
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-12-04 14:36:28
 */

import { mapGetters } from 'vuex';
export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  activated() {
    this.handlePlaylist(this.playlist);
  },
  watch: {
    playlist(newval) {
      this.handlePlaylist(newval);
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement own handlePlaylist method');
    }
  }
};
