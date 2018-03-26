/*
 * @Author: yu yi
 * @Date: 2017-11-23 11:04:07
 * @Last Modified by: yu yi
 * @Last Modified time: 2018-03-19 16:18:06
 */

// 选择歌曲
import * as types from './mutation-types';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';
import { saveSearch, deleteSearchHistory, clearSearch } from 'common/js/cache';

// 点击歌曲进行播放
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

// 在播放列表中添加一首歌曲
export const insertSong = function({ commit, state }, song) {
  // 此处必须使用slice方法来创建一个palylist的副本，不然直接修改playlist会报错
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  // 记录当前歌曲
  let currentSong = playlist[currentIndex];

  // 查找要插入的歌曲是否在播放列表中，并返回索引
  let fpIndex = findIndex(playlist, song);
  // 插入歌曲后，索引+1
  currentIndex++;
  // 插入歌曲
  playlist.splice(currentIndex, 0, song);
  // 如果播放列表中已经有这首歌，就删除这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号,直接就可以删除
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }

  // 顺序播放列表中应该插入的索引
  let currentSequenceIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSequenceIndex, 0, song);

  if (fsIndex > -1) {
    if (currentSequenceIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  // console.log(sequenceList);
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  // 打开全屏播放器
  commit(types.SET_FULL_SCREEN, true);
  // 更改播放状态为正在播放
  commit(types.SET_PLAYING_STATE, true);
};

// 保存搜索历史
export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

// 删除搜索历史
export const deletSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearchHistory(query));
};

// 清空搜索历史
export const clearSearchHistory = function({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

// 从播放列表中删除歌曲
export const deleteSong = function({ commit, state }, song) {
  // 此处必须使用slice方法来创建一个palylist的副本，不然直接修改playlist会报错
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  let pIndex = findIndex(playlist, song);
  playlist.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);

  // 如果删除的歌曲在当前播放的歌曲后面或者删除的歌曲是最后一首，就要把index减一
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--;
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);

  // 如果当前播放列表已经被删空了之后，需要更改播放器的播放状态
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false);
  } else {
    commit(types.SET_PLAYING_STATE, true);
  }
};
