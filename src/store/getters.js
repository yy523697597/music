/*
 * @Author: yu yi
 * @Date: 2017-11-22 17:31:57
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-11-22 17:34:22
 */
export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playlist = state => state.playlist;

export const sequenceList = state => state.sequenceList;

export const playMode = state => state.playMode;

export const currentIndex = state => state.currentIndex;

export const currentSong = state => {
  return state.playlist[state.currentIndex];
};
