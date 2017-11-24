/*
 * @Author: yu yi 
 * @Date: 2017-11-24 15:04:11 
 * @Last Modified by: yu yi
 * @Last Modified time: 2017-11-24 16:08:38
 */
<template>
 <div class="progress-bar" ref="progressBar" @click="progressClick">
   <div class="bar-inner">
     <div class="progress" ref="progress" ></div>
     <div class="progress-btn-wrapper" ref="progressBtn" 
      @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd"
     >
       <div class="progress-btn"></div>
     </div>
   </div>
 </div>
</template>

<script type="text/ecmascript-6">
const progressBtnWidth = 16;
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      // 如果在进度条拖动过程中，不允许进度条跳转
      if (newPercent >= 0 && !this.touch.initial) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initial = true;
      // 第一个手指按下的位置
      this.touch.startX = e.touches[0].pageX;
      // 进度条已经移动的位置
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initial) {
        return;
      }
      // 进度条应该横向移动的偏移量,不应该超出进度条的最大宽度
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        Math.max(0, this.touch.left + deltaX),
        this.$refs.progressBar.clientWidth - progressBtnWidth
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initial = false;
      this._triggerPercent();
    },
    // 触发百分比改变
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;

      // 向外派发进度条百分比的改变
      this.$emit('percentChange', percent);
    },
    // 移动进度条和进度按钮
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
    },
    // 进度条点击事件
    progressClick(e) {
      this._offset(e.offsetX);
      this._triggerPercent();
    }
  },
  components: {},
  created() {
    this.touch = {};
  }
};
</script>

<style scoped lang="scss">
@import '~common/scss/variable';

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
    }
    .progress-btn {
      position: relative;
      top: 7px;
      left: 7px;
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      border: 3px solid $color-text;
      border-radius: 50%;
      background: $color-theme;
    }
  }
}
</style>
