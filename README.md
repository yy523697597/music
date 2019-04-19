# 基于Vue2.0的播放器，具有推荐、歌手、排行、搜索四大页面，且具有一个完整的音乐播放器内核。

### 媲美原生，酷炫动画、完美交互、功能完善，数据来源于网易云音乐。

#### 项目描述：

1.使用vue-router作为前端路由、使用Vuex进行状态管理、使用axios与服务器端进行通讯、使用webpack2.0进行构建

2.使用ES6语法进行开发，且使用ESlint进行编码风格管理

3.13个可在其他业务中直接复用的基础组件

1. confirm：确认对话框组件

   2.listview：通讯录列表组件

   3.loading：加载态组件

   4.no-result：无结果展示组件

   5.progress-bar：进度条组件

   6.progress-circle：圆形进度条组件

   7.scroll：移动端滚动组件

   8.search-box：搜索框组件

   9.search-list：搜索列表组件

   10.slider：轮播图组件

   11.switches：开关切换组件

   12.top-tip：顶部消息提示组件

   13. song-list：歌曲列表组件



4. 15个具体的业务组件
   1. add-song：添加歌曲到列表组件
   2. disc：歌单详情页组件
   3. m-header：页面头部组件
   4. music-list：歌曲列表页面组件
   5. player：播放器内核组件
   6. playlist：播放列表组件
   7. rank：排行榜页面组件
   8. recommend：推荐页面组件
   9. 9.search：搜索页面组件
   10. singer：歌手页面组件
   11. singer-detail：歌手详情页组件
   12. suggest：搜索提示列表组件
   13. tab：顶部导航栏组件
   14. top-list：排行榜详情页组件
   15. user-center：用户中心页组件





5. 技术栈MVVM框架：Vue.js （版本2.x）

   状态管理：Vuex

   前端路由：Vue Router

   服务端通讯：axios

   移动端滚动库：better-scroll

   构建工具：webpack 2.0

   源码：es6

   API提供：基于node.js的网易云音乐API
