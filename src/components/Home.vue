<template>
  <div class="home">
    <el-container>
      <el-aside width="50px">
        <div class="info-bar">
          <ul class="info-list">
            <li class="avatar">
              <img src="./../assets/img/avatar.jpg" alt="" />
            </li>
            <li @click="selectHandle('chat')">
              <i
                :class="
                  option === 'chat'
                    ? 'el-icon-chat-line-round'
                    : 'el-icon-chat-round'
                "
              ></i>
            </li>
            <el-badge :is-dot="hasReq" class="item">
              <li @click="selectHandle('user')">
                <i
                  :class="
                    option === 'user' ? 'el-icon-user-solid' : 'el-icon-user'
                  "
                ></i>
              </li>
            </el-badge>
            <li @click="exitHandle">
              <el-tooltip
                class="item"
                effect="dark"
                content="退出登录"
                placement="right-start"
              >
                <i
                  class="
                  el-icon-switch-button
                "
                ></i>
              </el-tooltip>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, reactive, getCurrentInstance } from 'vue'
const getmsgs = async function(proxy) {
  const name = window.sessionStorage.getItem('myName')
  const { data } = await proxy.$http.get(`getMsg?name=${name}`)
  return data
}
export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const router = useRouter()
    const option = ref('')
    const hasReq = ref(false)
    getmsgs(proxy).then(data => {
      hasReq.value = data.hasReq
    })
    // 避免刷新使选择的按钮恢复
    option.value = window.sessionStorage.getItem('selectInfo')

    const selectHandle = function(selectInfo) {
      option.value = selectInfo
      window.sessionStorage.setItem('selectInfo', option.value)
      if (selectInfo === 'chat') {
        router.push('msgList')
      } else {
        router.push('friends')
        hasReq.value = false
      }
    }

    const exitHandle = function() {
      proxy.$socket.close()
      window.sessionStorage.clear()
      router.push('/')
    }

    return {
      option,
      hasReq,
      selectHandle,
      exitHandle
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background: url('./../assets/bg.jpg') no-repeat center;
  background-size: cover;

  .el-aside {
    display: flex;

    .info-bar {
      flex-basis: 50px;
      height: 100%;
      background-color: #282c34;

      .info-list {
        height: 30%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        li {
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }

  .el-main {
    background-color: #fff;
  }
}
</style>
