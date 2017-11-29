/*
 * @Author: yu yi
 * @Date: 2017-11-23 11:04:07
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-11-29 15:39:00
 */

// 选择歌曲
import * as types from './mutation-types';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';

export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  // 修复切换模式为随机播放模式后，点击歌手列表的歌曲时，播放歌曲与选取歌曲不相符的bug
  if (state.playMode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  // 打开全屏播放器
  commit(types.SET_FULL_SCREEN, true);
  // 更改播放状态为正在播放
  commit(types.SET_PLAYING_STATE, true);
};

// 获取歌曲在歌曲列表中的索引
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}

// 随机播放所有歌曲
export const randomPlay = function({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  // 打开全屏播放器
  commit(types.SET_FULL_SCREEN, true);
  // 更改播放状态为正在播放
  commit(types.SET_PLAYING_STATE, true);
};
