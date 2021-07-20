<template>
  <div class="message-box">
    <div class="list">
      <div class="header">
        当前在线用户
      </div>
      <div class="user-list">
        <ul>
          <li
            :class="{
              'user-item': true,
              selected: index === selectUserInfo.index ? true : false
            }"
            v-for="(item, index) in userItems"
            :key="index"
            @click="selectUser(item, index, $event)"
          >
            <img src="./../../assets/img/avatar.jpg" alt="" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="message">
      <MsgPanel
        :name="selectUserInfo.name"
        v-if="selectUserInfo.name !== ''"
      ></MsgPanel>
    </div>
  </div>
</template>

<script>
import { reactive, getCurrentInstance, ref } from 'vue'
import MsgPanel from './MsgPanel.vue'

const getUser = async function(proxy) {
  const { data } = await proxy.$http.get('/msgList')
  return data
}

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const userItems = reactive([])
    // 获取已经上线的用户
    getUser(proxy).then(data => {
      userItems.push(...data)
      // console.log(data)
    })
    // 监听其他用户上线
    proxy.$socket.on('upUser', data => {
      // console.log(data)
      userItems.push(data)
    })

    const selectUserInfo = reactive({
      name: '',
      index: -1
    })
    const selectUser = function(item, index) {
      // console.log(e.currentTarget)
      // e.currentTarget.style.backgroundColor = '#cacaca'
      selectUserInfo.name = item
      selectUserInfo.index = index
    }
    return {
      userItems,
      selectUser,
      selectUserInfo
    }
  },
  components: {
    MsgPanel
  }
}
</script>

<style lang="less" scoped>
.message-box {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .list {
    width: 20%;
    height: 100%;
    background-color: #eee;

    .header {
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-bottom: 1px dashed #282c34;
    }

    .user-list {
      .user-item {
        display: flex;
        width: 100%;
        height: 50px;
        padding: 5px 0 0 10px;
        cursor: pointer;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        span {
          line-height: 40px;
          font-size: 18px;
          margin-left: 10px;
        }
      }

      .selected {
        background-color: #cacaca;
      }
    }
  }

  .message {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
}
</style>
