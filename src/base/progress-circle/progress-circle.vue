<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    // svg圆圈半径
    radius: {
      type: Number,
      default: 32
    },
    // 已经播放的时间占比
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 圆圈周长
      dashArray: Math.PI * 100
    };
  },
  computed: {
    // 未播放的圆周长
    dashOffset() {
      return (1 - this.percent) * this.dashArray;
    }
  },
  methods: {},
  components: {},
  created() {}
};
</script>

<style lang="scss">
@import '~common/scss/variable';

.progress-circle {
  position: relative;
  svg {
    width: 0.64rem;
    height: 0.64rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  circle {
    display: inline-block;
    stroke-width: 8px;
    transform-origin: center;
    // position: absolute;
    // top: 0;
    // left: 0;
    &.progress-background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
