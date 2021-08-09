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
      <ul class="menulist">
        <li class="item" @click="selectFile = !selectFile">
          <i class="el-icon-folder"></i>
        </li>
      </ul>
      <input v-if="selectFile" type="file" @change="fileChange" />
      <el-input
        v-else
        type="textarea"
        placeholder="请输入内容"
        v-model="content"
      >
      </el-input>
      <el-button class="sendMsg" size="mini" @click="sendMsg">发送</el-button>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, reactive } from 'vue'

// 每个切片的大小
const SIZE = 1 * 1024 * 1024
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    sId: {
      type: String,
      required: true
    },
    contentList: {
      type: Array,
      required: true
    }
  },

  setup(props) {
    const { proxy } = getCurrentInstance()
    const content = ref('')
    // const contentList = reactive({})
    // 发送消息
    const sendMsg = function() {
      if (!selectFile.value) {
        if (content.value.trim().length === 0) {
          return
        }
        const toName = props.name
        const fName = window.sessionStorage.getItem('myName')
        proxy.$socket.emit('sendMsg', {
          toId: props.sId,
          fName,
          content: content.value
        })
        // if (!Array.isArray(contentList[toName])) {
        //   contentList[toName] = []
        // }
        props.contentList.push({
          type: 1,
          content: content.value
        })
        content.value = ''
      } else {
        sendFileHandle()
      }
    }

    // 文件
    const selectFile = ref(false)
    const fileInfo = reactive([])
    const fileChange = function(e) {
      const file = e.target.files[0]
      if (!file) {
        return
      }
      fileInfo.length = 0
      fileInfo.push(file)
    }
    // 对文件进行切片
    const sliceFile = function() {
      const [file] = fileInfo
      const { size, name } = file
      const sliceFileList = []
      let cur = 0
      let index = 0
      while (cur < size) {
        sliceFileList.push({
          file: file.slice(cur, cur + SIZE),
          hash: index++,
          name
        })
        cur += SIZE
      }
      return sliceFileList
    }
    // 处理切片并发送
    const uploadFile = async function(sliceFileList) {
      const uploadFileList = sliceFileList.map(({ file, hash, name }) => {
        const formdata = new FormData()
        formdata.append('chunk', file)
        formdata.append('hash', hash)
        formdata.append('name', name)
        return proxy.$http.post('uploadFile', formdata)
      })
      // 并发上传切片
      await Promise.all(uploadFileList)
      // 切片上传完毕发送合并请求
      await proxy.$http.post('merge', {
        name: fileInfo[0].name,
        size: fileInfo[0].size
      })
    }
    // 点击发送文件
    const sendFileHandle = function() {
      if (!fileInfo.length) {
        return
      }
      const sliceFileList = sliceFile()
      uploadFile(sliceFileList)
    }
    return {
      content,
      sendMsg,
      // contentList,
      selectFile,
      fileChange
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

    .menulist {
      width: 100%;

      .item {
        float: left;
        margin-left: 10px;
        cursor: pointer;
        color: #9e9d9d;
      }

      .item:hover {
        color: #000;
      }
    }

    .el-textarea {
      width: 100%;
      height: 100%;
      padding: 0 0 0 10px;
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
