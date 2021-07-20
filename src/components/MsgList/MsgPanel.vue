<template>
  <div class="msg-container">
    <div class="header">
      <span>{{ name }}</span>
    </div>
    <div class="main">
      <ul class="msg-panel">
        <li class="msg-list" v-for="(item, index) in contentList" :key="index">
          <div :class="item.type === 1 ? 'my-msg' : 'other-msg'">
            <div class="avatar">
              <img src="./../../assets/img/avatar.jpg" alt="" />
            </div>
            <div class="content">
              <span>{{ item.content }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <el-input type="textarea" placeholder="请输入内容" v-model="content">
      </el-input>
      <el-button class="sendMsg" size="mini" @click="sendMsg">发送</el-button>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, reactive } from 'vue'
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const { proxy } = getCurrentInstance()
    const content = ref('')
    const contentList = reactive([])
    const sendMsg = function() {
      if (content.value.trim().length === 0) {
        return
      }
      const fName = window.sessionStorage.getItem('name')
      proxy.$socket.emit('sendMsg', {
        toName: props.name,
        fName,
        content: content.value
      })
      contentList.push({
        type: 1,
        content: content.value
      })
      content.value = ''
    }
    proxy.$socket.on('serveMsg', data => {
      console.log(1)
      console.log(data)
      contentList.push({
        type: 2,
        content: data
      })
    })
    return {
      content,
      sendMsg,
      contentList
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
    height: 40px;
    flex-basis: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #d8d5d5;
  }

  .main {
    position: relative;
    width: 100%;
    height: 70%;

    .msg-panel {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: auto;

      .msg-list {
        padding: 10px;

        .my-msg {
          display: flex;
          flex-direction: row-reverse;
          right: 0;
        }

        .other-msg {
          display: flex;
          left: 0;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .content {
          max-width: 300px;
          margin: 0 5px;
          background-color: #98e165;

          span {
            width: 100%;
            padding: 4px;
            word-break: break-word;
            white-space: normal;
          }
        }
      }
    }
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
