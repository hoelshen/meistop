<template>
  <div class="kb">
    <div class="flex-center">
      <div
        class="kb-input kb-input__ul"
        @tap="showKeyboard"
      >
        <div
          :style="'border-color:'+baseBorder"
          style="background-color: #F5F5F5"
          class="kb-input__li"
          @click="clickProvin"
        >
          {{ textBaseArr[0] }}
        </div>
        <div
          style="background-color: #F5F5F5"
          :style="'border-color:'+baseBorder"
          class="kb-input__li"
        >
          {{ textBaseArr[1] }}
        </div>
        <div
          :style="'border-color:'+baseBorder"
          style="background-color: #F5F5F5"

          class="kb-input__li"
        >
          {{ textBaseArr[2] }}
        </div>
        <div
          :style="'border-color:'+baseBorder"
          style="background-color: #F5F5F5"

          class="kb-input__li"
        >
          {{ textBaseArr[3] }}
        </div>
        <div
          :style="'border-color:'+baseBorder"
          style="background-color: #F5F5F5"

          class="kb-input__li"
        >
          {{ textBaseArr[4] }}
        </div>
        <div
          :style="'border-color:'+baseBorder"
          style="background-color: #F5F5F5"

          class="kb-input__li"
        >
          {{ textBaseArr[5] }}
        </div>
        <div
          :style="'border-color:'+baseBorder"
          style="background-color: #F5F5F5"

          class="kb-input__li"
        >
          {{ textBaseArr[6] }}
        </div>
        <div
          :style="'border-color:'+baseBorder"
          style="background-color: #F5F5F5"

          class="kb-input__li"
          :class="isEnergy ? 'kb-input__new-energy' : ''"
          @tap="energy(7)"
        >
          {{ textBaseArr[7] }}
        </div>
      </div>
    </div>

    <div class="kb-keyboard">
      <!-- <div class="kb-keyboard__over" v-show="show" @tap="closeKeyboard"></div> -->
      <div
        v-show="show"
        class="kb-keyboard__panle flex-center row-wrap kb-keyboard__panle-style"
      >
        <!--省份简写键盘-->
        <div
          v-for="proItem in province "
          v-show="!isAlph"
          :key="proItem"
          :data-val="proItem"
          class="kb-keyboard__td kb-keyboard__td-theme"
          hover-class="kb-keyboard__td-tap-theme"
          :hover-start-time="0"
          :hover-stay-time="40"
          @tap="tapKeyboard"
        >
          {{ proItem }}
        </div>

        <!--数字键盘-->
        <div class="row-nowrap">
          <button
            v-for="numItem in natural"
            v-show="isAlph"
            :key="numItem"
            :data-val="numItem"
            class="kb-keyboard__td-num kb-keyboard__td-theme"
            hover-class="kb-keyboard__td-tap-theme"
            :hover-start-time="0"
            :hover-stay-time="40"
            :disabled="!isNum"
            @tap="tapKeyboard"
          >
            {{ numItem }}
          </button>
        </div>

        <!--字母键盘-->
        <div class="row-nowrap">
          <div
            v-for="alItem in 'QWERTYUPAS'"
            v-show="isAlph"
            :key="alItem"
            :data-val="alItem"
            class="kb-keyboard__td-alph kb-keyboard__td-theme"
            hover-class="kb-keyboard__td-tap-theme"
            :hover-start-time="0"
            :hover-stay-time="40"
            @tap="tapKeyboard"
          >
            <text>{{ alItem }}</text>
          </div>
        </div>
        <div class="row-nowrap">
          <div
            v-for="alItem in 'DFGHJKLZ-'"
            v-show="isAlph"
            :key="alItem"
            :data-val="alItem"
            class="kb-keyboard__td-alph kb-keyboard__td-theme"
            hover-class="kb-keyboard__td-tap-theme"
            :hover-start-time="0"
            :hover-stay-time="40"
            @tap="tapKeyboard"
          >
            <text
              v-if="alItem === '-'"
              class="kb-keyboard__del"
            />
            <text v-else>
              {{ alItem }}
            </text>
          </div>
        </div>
        <div class="row-nowrap">
          <div
            v-for="alItem in 'XCVBNM' "
            v-show="isAlph"
            :key="alItem"
            :data-val="alItem"
            class="kb-keyboard__td-alph kb-keyboard__td-theme"
            hover-class="kb-keyboard__td-tap-theme"
            :hover-start-time="0"
            :hover-stay-time="40"
            @tap="tapKeyboard"
          >
            <text>{{ alItem }}</text>
          </div>

          <!-- 完成按钮 -->
          <div
            v-if="isAlph && textArr.length > 6"
            class="kb-keyboard__td-finished kb-keyboard__finished"
            hover-class="kb-keyboard__td-tap-fin-theme"
            :hover-start-time="0"
            :hover-stay-time="60"
            @tap="tapFinished"
          >
            {{ extraKey }}
          </div>
          <div
            v-if="isAlph && textArr.length < 7"
            class="kb-keyboard__td-finished kb-keyboard__finished-base"
          >
            {{ extraKey }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    province: {
      type: String,
      default: "京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝"
    },
    natural: {
      type: String,
      default: "1234567890"
    },
    baseBorder: {
      type: String,
      default: "#6f85ff"
    },
    extraKey: {
      type: String,
      default: "完成"
    },
    plateNum: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isNum: false,
      isAlph: true,
      isEnergy: true,
      textBaseArr: ["闽", "", "", "", "", "", "", ""],
      textArr: [],
      tapVal: ""
    };
  },
  computed: {},
  mounted() {
    this.textArr = ['闽']
  },
  methods: {
    showKeyboard() {
      this.$emit("update:show", true);
    },
    closeKeyboard() {
      this.$emit("update:show", false);
    },
    clickProvin() {
      console.log('clickPro: ');
      this.textArr = '';
      this.textBaseArr.splice(0, 7, "");
      this.isAlph = false;
    },
    tapKeyboard(e) {
      this.tapVal = e.currentTarget.dataset.val;

      if (this.tapVal === "-") {
        this.textArr.pop();
        this.textBaseArr.splice(this.textArr.length, 1, "");
        if (this.textArr.length === 7 && !this.isEnergy && this.tapVal !== "") {
          this.isEnergy = true;
          this.tapVal = "";
        }
      } else {
        if (this.textArr.length > 7) return false;
        if (this.textArr.length > 6 && this.isEnergy) {
          this.textBaseArr.splice(6, 1, this.tapVal);
          this.textArr.splice(6, 1, this.tapVal);
          return false;
        }
        this.textArr = [...this.textArr, this.tapVal];
        this.textBaseArr.splice(this.textArr.length - 1, 1, this.tapVal);
        this.$emit("update:plateNum", this.textArr.join(""));
      }

      if (this.textArr.length === 1) {
        this.isAlph = true;
        this.isNum = false;
      } else if (this.textArr.length === 0) {
        this.isAlph = false;
        this.isNum = false;
      } else {
        this.isNum = true;
      }
      this.$emit("update:plateNum", this.textArr.join(""));
    },
    tapFinished(e) {
      let textValue = this.textArr.join("");
      this.$emit("keyboard", textValue);
    },
    energy(index) {
      console.log('index: ', index);
      console.log('this.isEnergy: ', this.isEnergy);
      console.log('this.isEnergy: ', this.textArr.length);

      if (index === 7 && this.isEnergy && this.textArr.length === 7) {
        this.isEnergy = false;
      }
    }
  }
};
</script>
<style>
.kb {
  width: 100%;
  height: 100%;
}
.kb-input {
  width: 100%;
  height: 60px;
  font-size: 18px;
  position: relative;
}
.kb-input__ul {
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  -webkit-justify-content: space-around;
  position: relative;
  padding: 40rpx 20rpx;
  height: 60px;
  z-index: 999;
}
.kb-input__li {
  color: #333333;
  font-size: 54rpx;
  background-color:#d6d6d6;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  width: 34px;
  height: 50px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: #ffffff;
}
.kb-input__active {
  border: 1px solid #24c6dc;
}
.kb-input__new-energy {
  width: 36px;
  height: 50px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABkCAYAAAA7Ska5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NzY0OThBQ0I1QTgxMUU5OENENzhFM0Q5MUYzQUQ4QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NzY0OThBREI1QTgxMUU5OENENzhFM0Q5MUYzQUQ4QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc3NjQ5OEFBQjVBODExRTk4Q0Q3OEUzRDkxRjNBRDhCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc3NjQ5OEFCQjVBODExRTk4Q0Q3OEUzRDkxRjNBRDhCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+pdctrQAABpVJREFUeNrsnVtPVUcU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);
  background-size: 100% 100%;
  border: none;
  border-radius: 5px;
}

.kb-keyboard {
  width: 100vw;
  background-color: #ffffff;
}

.kb-keyboard__over {
  z-index: 888;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.kb-keyboard__panle {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 999;
}
.kb-keyboard__panle-style {
  border-bottom: 8px solid #eaf1f9;
  border-top: 10px solid #eaf1f9;

  --from: #eaf1f9;
  --to: #eaf1f9;

  background: linear-gradient(130deg, var(--from), var(--to));
  background: -webkit-linear-gradient(130deg, var(--from), var(--to));
}
.kb-keyboard__td {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  width: calc((100vw - 4px) / 9);
  font-size: 18px;
  height: 48px;
  margin: 2px;
  border-radius: 5px;
}
.kb-keyboard__td-num {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  width: calc((100vw - 4px) / 12);
  font-size: 18px;
  height: 48px;
  margin: 2px;
  border-radius: 5px;
}
.kb-keyboard__td-alph {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  width: calc((100vw - 4px) / 12);
  font-size: 18px;
  height: 48px;
  margin: 2px;
  border-radius: 5px;
}
.kb-keyboard__td-finished {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  height: 48px;
  margin-top: 2px;
  margin-left: 4px;
  font-size: 14px;
  padding: 0 4px;
  border-radius: 5px;
}
.kb-keyboard__del {
  width: 100%;
  height: 100%;
  background: url(data:image/png;base64,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0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAA+6SURBVHja7N3NUVtpGobhxxE0jsAigoadd6OOwDiCbkfQEAE4gsERDB2B5Qha7L5dyxEYR9AiAvdCx1UeBo/1e3ilc11VWpgyuPwU6Ob8CJ59+fIlAFDRM5ECQKQAQKQAECkAECkARAoARAoARAoAkQIAkQJApABApABApAAQKQAQKQBECgBECgBECgCRAgCRAkCkAECkAECkABApABApAEQKAEQKAEQKAJECAJECQKQAQKQAECkAECkAECkARAoARAoAkQIAkQIAkQJApABApAAQKQAQKQAQKQBECgBECgCRAgCRAgCRAkCkAECkABApABApABApAEQKAEQKAJECAJECQKSsAIBIAYBIASBSACBSAIgUAIgUAIgUACIFACIFgEgBgEgBgEgBIFIAIFIAiBQAiBQAiBQAIgUAIgWASAGASAGASAEgUgAgUgCIFACIFAAiJVIAiBQAiBQAIgUAIgWASAGASAGASAEgUgAgUgCIFACIFACIFAAiBQAiBYBIAYBIAYBIASBSACBSAIgUAIgUAIgUACIFACIFgEgBgEgBgEgBIFIAIFIAiBQAiBQAIgUAIgUAIgWASAGASAEgUgAgUgAgUgCIFACIFAAiBQAiBQAiBYBIAYBIASBSACBSACBSAIgUAIgUACIFACIFACIFgEgBgEgBIFIAIFIAiJQVABApABApAEQKAEQKAJECAJECAJECQKQAQKQAECkAECkAECkARAoARAoAkQIAkQIAkQJApABApAAQKQAQKQAQKQBECgBECgCRAgCRAkCkRAoAkQIAkQJApABApAAQKQAQKQAQKQBECgBECgCRAgCRAgCRAkCkAECkABApABApABApAEQKAEQKAJECAJECAJECQKQAQKQAECkAECkAECkARAoARAoAkQIAkQJApABApABApAAQKQAQKQBECgBECgBECgCRAgCRAkCkAECkAECkABApABApAEQKAEQKAEQKAJECAJECQKQAQKQAQKQAECkAECkARAoARAoAkbICACIFACIFgEgBgEgBIFIAIFIAIFIAiBQAiBQAIgUAIgUAIgWASAGASAEgUgAgUgAgUtv28uVLI+zeUZJXSc6SnCQZmYTvmCa56x6zJB92+Y+11iwuUiI1YKMkl0l+MwUbhmvSBetOpERKpNiGyyTn3VEUbDNYN0n+ECmREinWcZTkfZKxKdihuy5W75LMRUqkRIplnCT509ETPZp3R+xrHVmJlEiJlEBBH6ZJLrK42UKkREqkEChKOs/iFKBIiZRIIVCUNEnyJktcqxIpkRIpgYKnMEvyy49CJVIiJVICBU9l3oVqJlIiJVICBXsXKpESKZESKKgQqtM88tMqREqkREqgoIJZHrlGJVIiJVICBVVMkrwWKZESKYGCqi6SXIuUSImUQEFVp+lupBApkRIpgYJqpllcnxIpkRIpgYKSLpJci5RIiZRAQUXzJMettbkpREqkBAoqettauzKDSImUQIGjKZFCpAQKVnTRWrs2g0iJlEBBRbPW2qkZREqkBAqqOm6t3ZlBpERKoKCid621czOIlEgJFFTklJ9IiZRAQWnP3eUnUiIlUFDV69baxAwiJVICBRV5Ya9IiZRAQVm3rbWxGURKpAQKKnLzhEiJlEBBXa21Z1YQKZESKBApkUKkBApESqRESqDgUPzSWpuaQaRESqBApESKAUZKoECkREqkBApECpESKYECkRIpkRIoQKRESqQECkRKpBhEpAQKREqkREqgQKQQKZESKBApkWKvIyVQIFIiJVICBSKFSImUQG3XfZJpklmSUZJxkhdmWdttt+eo+xz8WaQQKZESqPVcJLl+5O1nSW6S/GSipb1LcpVk/uDt427jQ42VSImUSAnUbp5cuu/4v2eUZDKAI4FteNNF/XuOuq0PcUuREimREqite9t91/8jh/zk2legvo3+J5FCpIYbKYFa3vP872kpodpdoL6aJHklUojU8CIlUMv72O21CqHaPFDpjl4vRQqRGlakBGo1t1lczF+VUG0WqGRxQ8p7kUKkhhMpgVrdLMnpmu8rVOsHypEUIjWwSAnU+o6T3AlVr4FKkr+y+qlWkRIp9jBSArWZSZLXG7z/EEO1aaDG3efsoREpkRIpgSr5pDukUG1jq08H+jkrUiIlUgIlVHu+0Z85vNN8IiVSIiVQQiVQIiVS7EOkBEqoBEqkRIqSkRIooRIokRIpSkZKoIRKoERKpCgZKYESKoESKZGiZKQESqgESqREipKREiihEiiREilKRkqghEqgREqkRKpkpARKqARKpBCpkpESKKESKJFCpEpGSqCESqBECpEqGSmBEiqBEilEqmSkBEqoBEqkEKmSkRIooeo7VAIlUiIlUgIlVCVDJVAiJVIiJVBCVTJUAiVSIiVSAiVUJUMlUCIlUiIlUJQMlUCJlEiJlEBRMlQCJVIiJVICRclQCZRIiZRILRUpgRKqvkMlUCIlUiwVKYESqr5DJVAiJVIsFSmBou9QCZRIiRRLRUqg6DtUAiVSIsVSkRIo+g6VQImUSLFUpASKvkMlUCIlUiwVKYGi71AJlEiJFEtFapTkL4Gix1CNk0wESqREih9Fyhc7TxGqTficFSmRGlCkbpL8ag32JFQCJVIiNaBIjbsveNiHUAmUSInUwCI1SfLKEuxBqARKpERqYIE6SvK3JdiDUAmUSInUACN1luS9JSgeKoESKZEaaKSuklxagsKhEiiREimRgpKhEiiREimREilKR2qa7f4qekRKpEQKgdrq6T6hEimRGmikzuLGCeoGSqhESqQGHqmjuAWd2oESKpESqYGHahIv5qV2oIRKpERqwJEax49Fon6ghEqkRGqgkUqS6yS/W4PigRIqkRKpgUbKFz37EiihEimRGmCkksUvPZwl+ckq9BCoo2znlx4KlUiJ1EAilSxe2T8VKnoI1NefJLHNX0WPSInUgUdKqOgzUNv8mEIlUiI1kEgJFX0GSqhESqRYOVJCRZ+BEiqREilWjpRQ0WeghEqkRIqVIyVU9BkooRIpkWLlSAmVQPUZKKESKZFi5UgJlUD1GSihEimRYuVICZVA9RkooRIpkWLlSAmVQPUZKKESKZESqZfrvJtQCVRfgRIqkRIpkVqLUAlUX4ESKpESKZESKoEqHSihEimREimhEqjSgRIqkRIpkRIqgSodKKESKZESKaESqNKBEiqREimREiqBKh0ooRIpkRIpoRKo0oESKpESKZESKoEqHSihEimREimhEqjSgRIqkRIpkRIqgSodKKESKZESKaESqMH8n4cYKpESqUFGSqgESqhESqQoHSmhEiihEimRonSkhEqghEqkRIrSkRIqgRIqkRIpSkdKqARKqERKpCgdKaESKKESKZGidKSESqD2datZkhcihUgdfqSEanMfkpwJVK+hGnebiRQiNYBICdVmjpPcCVTvoZom+ZdIIVLDiJRQredzkpFAPUmorpJcihQiNZxICdXqbrM49SRQ/YfqLMl7kUKkhhUpoVrNLMmpQD1JqBxJIVIDjZRQrWaVa1ICtb1QTZK8EilEapiREqrlve2+qxeo/kI1SvLpAP//IiVSIiVUu3ly6XYSqN2H6pC3FCmREimh2pmr7qjqobMk/+meXFnOdbfl/MHbx0n+fcCxFymREimh2ql5t9Msi1NS46x/izqLLafdhicDOBIVKZESKaECkRIpDjFSQgUiJVIiJVQgUoiUSAkViJRIcZCREioQKZESKaECkUKkREqoQKREioOMlFCBSImUSAkViBQiJVJCBSIlUhxkpIQKREqkREqoQKQQKZESKuhJa+2ZFURKpIQKREqkECmhApESKZESKjgEH1trJ2YQKZESKqjotrU2NoNIiZRQQUVvW2tXZhApkRIqqOh1a21iBpESKaGCip631uZmECmREiqoxk0TIiVSQgVlvWutnZtBpERKqKCi49banRlESqSECqpxqk+kREqooKw3rbUbM4iUSAkVVHOfZOSuPpESKaGCiryAV6RESqjAUZRIIVJCBat4k+SmtWYJkRIpoYJSbpOMk0SkREqkhAqqOU0yEymREimhgmouklx//YNIiZRICRVU8SHJ2bdvECmREimhggo+ZnEdai5SIiVSQgWV3CcZPQyUSImUSAkVVAjUON2NEiIlUiIlVFDF5yyuQc2+9xdESqRESqjgKTx6DUqkREqkhAqe2ockv/0oUCIlUiIlVNC3/3odlEiJlEghVFRwm+Q8/+f6k0iJlEghVPTtvovTzTrvLFIiJVLDc9SF6mdTsEOfk1wlmWSJa08iJVIixUPXSX43A1t22x013Wzjg4mUSInUsI2673Z/NQUbhmnSPe62+YFFSqREimRxCvCse5wkeWESHnGfxY0Pd91j2j12RqRECgCRAgCRAgCRAkCkAECkABApABApABApAEQKAEQKAJECAJECAJECQKQAQKQAECkAECkAECkARAoARAoAkQIAkQIAkQJApABApAAQKQAQKQBEygoAiBQAiBQAIgUAIgWASAGASAGASAEgUgAgUgCIFACIFACIFAAiBQAiBYBIAYBIAYBIASBSACBSAIgUAIgUAIgUACIFACIFgEgBgEgBIFIiBYBIAYBIASBSACBSAIgUAIgUAIgUACIFACIFgEgBgEgBgEgBIFIAIFIAiBQAiBQAiBQAIgUAIgWASAGASAGASAEgUgAgUgCIFACIFACIFAAiBQAiBYBIAYBIASBSACBSACBSAIgUAIgUACIFACIFACIFgEgBgEgBIFIAIFIAIFIAiBQAiBQAIgUAIgUAIgWASAGASAEgUgAgUgAgUgCIFACIFAAiBQAiBYBIWQEAkQIAkQJApABApAAQKQAQKQAQKQBECgBECgCRAgCRAgCRAkCkAECkABApABApABApAEQKAEQKAJECAJECAJECQKQAQKQAECkAECkAREqkABApABApAEQKAEQKAJECAJECAJECQKQAQKQAECkAECkAECkARAoARAoAkQIAkQIAkQJApABApAAQKQAQKQAQKQBECgBECgCRAgCRAgCRAkCkAECkABApABApAEQKAEQKAEQKAJECAJECQKQAQKQAQKQAECkAECkARAoARAoARAoAkQIAkQJApABApABApAAQKQAQKQBECgBECgBECgCRAgCRAkCkAECkABApKwAgUgAgUgCIFACIFAAiBQAiBQAiBYBIAYBIASBSACBSACBSAIgUAIgUACIFACIFACIFgEgBgEgBIFIAIFIAIFIAiBQAiBQAIgUAIgWASIkUACIFACIFgEgBgEgBIFIAIFIAIFIAiBQAiBQAIgUAIgUAIgWASAGASAEgUgAgUgAgUgCIFACIFAAiBQAiBQDf+GcAz3gyaMWLPusAAAAASUVORK5CYII=);
  background-size: 100% 100%;
}
.kb-keyboard__finished {
  border: 1px solid #2f62ed;
  background-color: #2f62ed;
  color: #ffffff;
}
.kb-keyboard__finished-base {
  border: 1px solid #cdd0d5;
  background-color: #cdd0d5;
  color: #1e1e1e;
}
.kb-keyboard__td-theme {
  border: 1px solid #cdd0d5;
  color: #1e1e1e;
  box-shadow: 3px 3px 1px #cdd0d5;
  -webkit-box-shadow: 3px 3px 1px #cdd0d5;
  background: #fff;
}
.kb-keyboard__td-tap-theme {
  border: 1px solid #cdd0d5;
  color: #1e1e1e;
  --from: #e5e2e2;
  --to: #e5e5e5;

  background: linear-gradient(130deg, var(--from), var(--to));
  background: -webkit-linear-gradient(130deg, var(--from), var(--to));
}
.kb-keyboard__td-tap-fin-theme {
  border: 1px solid #cdd0d5;
  color: #fff;
  --from: #cdd0d5;
  --to: #b8b8b9;

  background: linear-gradient(130deg, var(--from), var(--to));
  background: -webkit-linear-gradient(130deg, var(--from), var(--to));
}

.flex-center {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
}

.row-wrap {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
}
.row-nowrap {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
}
.kb-dot {
  position: relative;
  top: 5px;
  font-size: 36px;
  font-weight: bold;
  width: 14px;
  height: 50px;
  text-align: center;
  color: #b7c2ff;
}
</style>
