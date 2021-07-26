<template>
  <div class="message-box">
    <div class="list">
      <div class="header" @click="addDialogVisible = true">
        添加用户
        <i class="el-icon-circle-plus-outline"></i>
      </div>
      <div class="user-list">
        <ul>
          <li class="user-item selected">
            <el-badge :value="reqNumber" :hidden="reqNumber === 0" class="item">
              <span>好友请求列表</span>
            </el-badge>
          </li>
          <li
            :class="'user-item'"
            v-for="(item, index) in friendsList.friends"
            :key="index"
          >
            <img src="./../../assets/img/avatar.jpg" alt="" />
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="message">
      <Request
        :list="friendsList.requestList"
        @updateFriends="updateFriends"
      ></Request>
    </div>
    <!-- 添加好友对话框 -->
    <el-dialog
      title="输入用户名添加"
      v-model="addDialogVisible"
      width="30%"
      @close="friendName = ''"
    >
      <input v-model="friendName" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFriendHandle">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Request from './Request.vue'
const getFriends = async function(proxy) {
  const { data } = await proxy.$http.get('friends')
  return data
}
export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const friendsList = reactive({
      requestList: [],
      friends: []
    })
    const reqNumber = ref(0)
    // 获取好友列表
    getFriends(proxy).then(data => {
      const { requestList, friends } = data
      friendsList.requestList = requestList
      friendsList.friends = friends
      reqNumber.value = requestList.length
    })

    const addDialogVisible = ref(false)
    const friendName = ref('')
    const addFriendHandle = async function() {
      if (!friendName.value.trim().length) {
        ElMessage.error('用户名不能为空')
        return
      }
      const fName = window.sessionStorage.getItem('myName')
      const {
        data: { isUp }
      } = await proxy.$http.post('reqFriend', {
        toName: friendName.value,
        fName
      })
      addDialogVisible.value = false
    }

    // 更新剩余请求数量
    const updateFriends = function(num, newList) {
      reqNumber.value = num
      friendsList.friends = newList
    }
    return {
      addDialogVisible,
      friendName,
      addFriendHandle,
      friendsList,
      reqNumber,
      updateFriends
    }
  },
  components: {
    Request
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
