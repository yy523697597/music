<template>
  <div class="recommend">
      <div class="recommend-content">
        <div class="slider-wrapper"></div>
        <div class="recommend-list">
        <div class="list-title">热门歌单推荐</div>
        <ul></ul>
      </div>
      </div>
      
  </div>
</template>
<script>
export default {
  created() {
    this._getRecommend();
  },
  methods: {
    _getRecommend() {
      const url = this.HOST + 'banner';
      this.$http.get(url).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 1.76rem;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 1.3rem;
        line-height: 1.3rem;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 0.4rem 0.4rem 0.4rem;
        .icon {
          flex: 0 0 1.2rem;
          width: 1.2rem;
          padding-right: 0.4rem;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 0.4rem;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 0.2rem;
            color: $color-text;
          }
          .desc {
            color: $color-text-d;
          }
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
