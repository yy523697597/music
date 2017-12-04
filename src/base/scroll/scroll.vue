<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    pullUpLoad: {
      type: Boolean,
      default: true
    },
    pullDownRefresh: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        pullUpLoad: this.pullUpLoad,
        pullDownRefresh: this.pullDownRefresh
      });

      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp');
      });

      this.scroll.on('pullingDown', () => {
        this.$emit('pullingDown');
      });

      this.scroll.on('scroll', pos => {
        this.$emit('scroll', pos);
      });
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll.finishPullDown();
      this.scroll.finishPullUp();
      this.scroll && this.scroll.refresh();
    },
    scrollTo(x, y, timer) {
      this.scroll && this.scroll.scrollTo(x, y, timer);
    },
    scrollToElement(el, timer) {
      this.scroll && this.scroll.scrollToElement(el, timer);
    }
  },
  // 追踪传入的data的变化,data变化后就刷新scroll
  watch: {
    data() {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

