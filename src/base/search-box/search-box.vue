<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" v-model="query" class="box" :placeholder="playceholder" ref="query">
    <i @click="clear" class="icon-dismiss" v-show="query"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util';
export default {
  props: {
    // 搜索框默认提示语
    playceholder: {
      type: String,
      default: '搜索歌曲与歌手'
    }
  },
  data() {
    return {
      query: ''
    };
  },
  methods: {
    // 删除按钮
    clear() {
      this.query = '';
    },
    // 输入框失去焦点
    blur() {
      this.$refs.query.blur();
    },
    // 设置query
    setQuery(query) {
      this.query = query;
    }
  },
  components: {},
  created() {
    // 监听输入框的改变,使用节流函数
    this.$watch(
      'query',
      debounce(newQuery => {
        this.$emit('query', newQuery);
      }, 500)
    );
  }
};
</script>

<style scoped lang="scss">
@import '~common/scss/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 0.12rem;
  height: 0.8rem;
  background: $color-highlight-background;
  border-radius: 0.12rem;
  .icon-search {
    font-size: 0.48rem;
    color: $color-text-d;
  }
  .box {
    flex: 1;
    margin: 0 0.1rem;
    line-height: 0.36rem;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 0.32rem;
    color: $color-text-d;
  }
}
</style>
