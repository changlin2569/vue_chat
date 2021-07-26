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
            @click="selectUser(item.name, index, item.sId)"
          >
            <img src="./../../assets/img/avatar.jpg" alt="" />
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="message">
      <MsgPanel
        :name="selectUserInfo.name"
        :sId="selectUserInfo.sId"
        v-if="selectUserInfo.index !== -1"
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
      // console.log(data)
      const myName = window.sessionStorage.getItem('myName')
      userItems.push(
        ...data.filter(item => {
          return item.name !== myName
        })
      )
      // console.log(userItems)
    })
    // 监听其他用户上线
    proxy.$socket.on('upUser', data => {
      // console.log(data)
      userItems.push(data)
    })

    // 监听用户下线
    proxy.$socket.on('exit', exitName => {
      // console.log(data)
      for (let i = 0, len = userItems.length; i < len; i++) {
        if (userItems[i].name === exitName) {
          userItems.splice(i, 1)
          break
        }
      }
    })

    const selectUserInfo = reactive({
      sId: '',
      name: '',
      index: -1
    })
    const selectUser = function(name, index, sId) {
      // e.currentTarget.style.backgroundColor = '#cacaca'
      selectUserInfo.name = name
      selectUserInfo.index = index
      selectUserInfo.sId = sId
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
