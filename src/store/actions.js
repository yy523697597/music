/*
 * @Author: yu yi
 * @Date: 2017-11-23 11:04:07
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-11-23 11:18:03
 */

// 选择歌曲
import * as types from './mutation-types';
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  // 打开全屏播放器
  commit(types.SET_FULL_SCREEN, true);
  // 更改播放状态为正在播放
  commit(types.SET_PLAYING_STATE, true);
};
