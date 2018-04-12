<template>
  <div class="loading">
    <div class='loader loader4'>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <div>
                      <div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '拼命加载中...'
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~common/scss/variable.scss';
.loading {
  width: 100%;
  height: 2rem;
  position: relative;
  .desc {
    line-height: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    color: #222;
    width: 100%;
  }
  .loader {
    width: 1rem;
    height: 1rem;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes rotate2 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    border-top-color: rgb(25, 163, 65);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    border-top-color: rgb(240, 196, 20);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    border-top-color: rgb(25, 163, 65);
  }
}
@keyframes rotate2 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    border-top-color: rgb(25, 163, 65);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    border-top-color: rgb(240, 196, 20);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    border-top-color: rgb(25, 163, 65);
  }
}
* {
  box-sizing: border-box;
}

body {
  background: #f9f9f9;
  padding-bottom: 100px;
}

h1,
h3 {
  display: block;
  margin: 0px auto;
  text-align: center;
  font-family: 'Tahoma';
  font-weight: lighter;
  color: rgb(25, 163, 65);
  letter-spacing: 1.5px;
}

h1 {
  margin: 0.5rem auto;
}

.loader {
  position: relative;
  margin: 0.75rem auto;
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  overflow: hidden;
}
.loader div {
  height: 100%;
}

/* loader 1 */
.loader1,
.loader1 div {
  border-radius: 50%;
  padding: 8px;
  border: 2px solid transparent;
  -webkit-animation: rotate linear 3.5s infinite;
  animation: rotate linear 3.5s infinite;
  border-top-color: rgb(25, 163, 65);
  border-bottom-color: rgb(240, 196, 20);
}

/*loader 2  */
.loader2,
.loader2 div {
  border-radius: 50%;
  padding: 8px;
  border: 2px solid transparent;
  -webkit-animation: rotate linear 3.5s infinite;
  animation: rotate linear 3.5s infinite;
  border-top-color: rgb(240, 196, 20);
  border-left-color: rgb(25, 163, 65);
  border-right-color: rgb(25, 163, 65);
}

/*loader 3  */
.loader3,
.loader3 div {
  border-radius: 50%;
  padding: 8px;
  border: 2px solid transparent;
  -webkit-animation: rotate linear 3.5s infinite;
  animation: rotate linear 3.5s infinite;
  border-top-color: rgb(25, 163, 65);
  border-left-color: rgb(240, 196, 20);
  -webkit-animation-timing-function: cubic-bezier(0.55, 0.38, 0.21, 0.88);
  animation-timing-function: cubic-bezier(0.55, 0.38, 0.21, 0.88);
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
}

/* loader 4 */
.loader4,
.loader4 div {
  border-radius: 50%;
  padding: 8px;
  border: 2px solid transparent;
  -webkit-animation: rotate linear 3.5s infinite;
  animation: rotate linear 3.5s infinite;
  border-radius: 50%;
  padding: 4px;
  -webkit-animation: rotate2 4s infinite linear;
  animation: rotate2 4s infinite linear;
}

div:hover {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}

.loader,
.loader * {
  will-change: transform;
}
</style>
