<template>
  <div class="singer">
    <listview :data="artists"></listview>
  </div>
</template>
<script>
import Listview from 'base/listview/listview';
export default {
  components: {
    Listview
  },
  data() {
    return {
      offset: 0,
      limit: 20,
      // 歌手数据
      artists: []
    };
  },
  created() {
    this._getSinger(this.offset, this.limit);
    setTimeout(() => {
      this._getSinger(this.offset, this.limit);
    }, 3000);
  },
  methods: {
    // offset 起始位置
    // limit 获取数量
    _getSinger(offset, limit) {
      const url = this.HOST + `/top/artists?offset=${offset}&limit=${limit}`;
      this.$http.get(url).then(res => {
        if (res.data.code === 200) {
          // 设置偏移
          this.offset += limit;
          this.artists = res.data.artists;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';

.singer {
  position: fixed;
  width: 100%;
  top: 1.76rem;
  bottom: 0;
  .singer-content {
    height: 100%;
    overflow: hidden;
    .list-group {
      padding-bottom: 0.6rem;

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 0.4rem 0 0 0.6rem;
        .avatar {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }

        .name {
          margin-left: 0.4rem;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
