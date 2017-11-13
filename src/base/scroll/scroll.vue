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
        click: this.click
      });
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    }
  },
  // 追踪传入的data的变化,data变化后就刷新scroll
  watch: {
    data() {
      this.$nextTick(() => {
        console.log(this.data);
        this.refresh();
        console.log(111);
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

