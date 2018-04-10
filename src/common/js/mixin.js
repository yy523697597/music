/*
 * @Author: yu yi
 * @Date: 2017-12-04 11:16:06
 * @Last Modified by: yu yi
 * @Last Modified time: 2018-04-10 14:51:29
 */

import { mapGetters, mapMutations } from 'vuex';
import { playMode } from 'common/js/config.js';
import { shuffle } from 'common/js/util.js';

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

export const playerMixin = {
  computed: {
    // 播放模式图标
    iconMode() {
      return this.playMode === playMode.sequence
        ? 'icon-sequence'
        : this.playMode === playMode.loop ? 'icon-loop' : 'icon-random';
    },

    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'playMode',
      'sequenceList'
    ])
  },
  methods: {
    // 切换播放模式
    changeMode() {
      // mode 依 0 1 2 循环
      const mode = (this.playMode + 1) % 3;
      // 设置播放模式
      this.setPlayMode(mode);

      let list = null;
      // 随机播放
      if (mode === playMode.random) {
        // 打乱播放列表
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      // 设置播放列表
      this.setPlaylist(list);
    },
    // 切换播放模式时，不切换当前正在播放的歌曲
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    // vuex设置
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setFullScreen: 'SET_FULL_SCREEN'
    })
  }
};
