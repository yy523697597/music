<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) of dots" :key="index" :class="{'active':currentPageIndex===index}"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import { addClass } from 'common/js/dom.js';

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    // 循环
    loop: {
      type: Boolean,
      default: true
    },
    // 自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 自动轮播间隔
    interval: {
      type: Number,
      default: 3000
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }

      // 修复调整窗口大小造成的轮播图宽度问题
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        } else {
          this._setSliderWidth(true);
          this.slider.refresh();
        }
      });
    });
  },
  methods: {
    // 设置slider的宽度
    _setSliderWidth(isResize) {
      // 获取父容器的所有子元素
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      // 获取最外层容器的宽度
      let sliderWidth = this.$refs.slider.clientWidth;

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        // 为slider的item添加 slider-item的className
        addClass(child, 'slider-item');
        // 设置item的宽度为最外层容器的宽度
        child.style.width = sliderWidth + 'px';
        width += sliderWidth;
      }

      // 如果开启循环,需要在前后多加一张图片,共两张
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }

      // 设置父容器的宽度
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    // 初始化指示点dots
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    // 初始化slider
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        // 允许点击
        click: true,
        // 允许横向滚动
        scrollX: true,
        // 不允许纵向滚动
        scrollY: false,
        // 取消惯性
        momentum: false,
        // 轮播图需要开启此选项
        snap: {
          // 循环
          loop: this.loop,
          // 滑动切换阈值
          threshold: 0.1,
          // 切换动画速度
          speed: 400
        }
      });
      // 监听图片滚动完成事件
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        // 开启循环的话,头部会多一个图片,所以需要减一
        if (this.loop) {
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;

        if (this.autoPlay) {
          // 需要先清除timer,不然的话有可能会切换一页后,又马上切换一页
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    // 播放slider
    _play() {
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        // 使用goToPage方法可以跳转到指定页面
        this.slider.goToPage(pageIndex, 400);
      }, this.interval);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable';

.slider {
  min-height: 1px;
  position: relative;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      position: relative;
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
      .type {
        position: absolute;
        right: 0;
        top: 70%;
        font-size: $font-size-medium;
        padding: 0 0.2rem 0 0.4rem;
        width: 1.2rem;
        text-align: center;
        height: 0.5rem;
        line-height: 0.5rem;
        border-top-left-radius: 0.15rem;
        background-color: $color-theme;
        color: #fff;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0.24rem;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
      margin: 0 0.08rem;
      width: 0.16rem;
      height: 0.16rem;
      border-radius: 50%;
      background: $color-text-l;
      &.active {
        width: 0.4rem;
        border-radius: 0.1rem;
        background: $color-theme;
      }
    }
  }
}
</style>
