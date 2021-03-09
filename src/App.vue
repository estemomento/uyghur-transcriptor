<template>
  <div class="container">
    <div class="input-wrapper" :id="fromType">
      <div><textarea v-model="origin"></textarea></div>
    </div>
    <div class="info">
      <h1>Uyghur Scripts Converter</h1>
      <div class="setting">
        <select v-model="fromType">
          <option value="uey">Uyghur Arab Script</option>
          <option value="uyy">Uyghur New Script</option>
          <option value="uly">Uyghur Latin Script</option>
        </select>
        ->
        <select v-model="toType">
          <option value="uey">Uyghur Arab Script</option>
          <option value="uyy">Uyghur New Script</option>
          <option value="uly">Uyghur Latin Script</option>
        </select>
      </div>
      <div class="paste-source">
        <span><strong>UYY</strong>: Əə Ⱬⱬ Ƣƣ Ⱪⱪ Ⱨⱨ Ɵɵ Üü</span>
        |
        <span><strong>ULY</strong>: Öö Üü Ëë</span>
      </div>
      <p>Copyright 2018 - {{ new Date().getFullYear() }} Aleko Lau</p>
    </div>
    <div class="input-wrapper" :id="toType">
      <div><textarea v-model="converted"></textarea></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorld from './components/HelloWorld.vue'
import { convert } from './tools/convert'

@Options({
  components: {
    HelloWorld
  },
  data: () => ({
    origin: '',
    converted: '',
    fromType: 'uey',
    toType: 'uly'
  }),
  watch: {
    origin (str, prevStr) {
      console.log(str, prevStr)
      this.converted = convert(str, this.fromType, this.toType)
    }
  }
})
export default class App extends Vue {}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
body {
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #000;
}
.container {
  display: grid;
  grid-template: ~'1fr 100px 1fr / 1fr';
  width: 100vw;
  height: 100vh;
}
.info, .input-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px;
  & > div:first-child {
    width: 100%;
    height: 100%;
  }
}
.info {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.paste-source {
  border: 1px solid #000;
  padding: 12px;
  font-size: 20px;
}
textarea {
  width: 100%;
  height: 100%;
  padding: 8px;
  font-size: 32px;
  background: transparent;
  resize: none;
}
#uey textarea {
    direction: rtl;
  }
.input-wrapper>div::before {
  bottom: 10%;
  z-index: -1;
  position: absolute;
  font-size: calc(6vw + 6vh);
  color: #ccc;
}
#uey>div::before {
  left: 10%;
  content: 'ئۇيغۇر';
}
#uyy>div::before {
  right: 10%;
  content: 'Uyƣur';
}
#uly>div::before {
  right: 10%;
  content: 'Uyghur';
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
    color: #fff;
  }
  textarea {
    color: #fff;
  }
  .input-wrapper>div::before {
    color: #333;
  }
  .paste-source {
    border: 1px solid #fff;
  }
}
</style>
