/*
 * @Author: yu yi
 * @Date: 2017-11-22 17:23:23
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-12-14 10:09:01
 */

import { playMode } from 'common/js/config.js';
import { loadSearch } from 'common/js/cache.js';

const state = {
  // 歌手数据
  singer: {},
  // 播放器的播放状态
  playing: false,
  // 播放器是否全屏
  fullScreen: false,
  // 支持多种播放模式播放列表
  playlist: [],
  // 顺序播放的播放列表
  sequenceList: [],
  // 当前播放模式
  playMode: playMode.sequence,
  // 当前播放歌曲索引
  currentIndex: -1,
  // 歌单对象
  songMenu: {},
  // 排行榜歌单对象
  topList: {},
  // 搜索历史
  searchHistory: loadSearch()
};

export default state;
