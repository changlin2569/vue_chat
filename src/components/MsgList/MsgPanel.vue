<template>
  <div class="msg-container">
    <div class="header">
      <span>{{ name }}</span>
    </div>
    <div class="main"></div>
    <div class="footer">
      <el-input type="textarea" placeholder="请输入内容" v-model="value">
      </el-input>
      <el-button class="sendMsg" size="mini">发送</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const value = ref('')
    return {
      value
    }
  }
}
</script>

<style lang="less" scoped>
.msg-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;

  .header {
    width: 100%;
    // height: 40px;
    flex-basis: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #d8d5d5;
  }

  .main {
    width: 100%;
    height: 70%;
  }

  .footer {
    position: relative;
    width: 100%;
    height: 30%;
    background-color: #fff;

    .el-textarea {
      width: 100%;
      height: 100%;
      border: none;
    }

    .sendMsg {
      position: absolute;
      bottom: 10%;
      right: 5%;
    }
  }
}
</style>
