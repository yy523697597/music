/*
 * @Author: yu yi
 * @Date: 2017-11-22 17:43:44
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-12-14 09:23:11
 */
import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.playMode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [types.SET_SONG_MENU](state, songMenu) {
    state.songMenu = songMenu;
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList;
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  }
};
export default mutations;
