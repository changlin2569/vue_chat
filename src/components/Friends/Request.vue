<template>
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="用户名" width="180">
        <template #default="scope">
          <span style="margin-left: 10px">{{ scope.row.fName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="mini"
            type="danger"
            @click="responseHandle(scope.row.fName, false)"
            >拒绝</el-button
          >
          <el-button size="mini" @click="responseHandle(scope.row.fName, true)"
            >同意</el-button
          >
        </template>
      </el-table-column></el-table
    >
  </div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue'
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const responseHandle = async function(name, agree) {
      //   console.log(name)
      const { data } = await proxy.$http.post('response', {
        agree,
        friendName: name
      })
      // 响应后移除此好友请求
      for (let i = 0, len = props.list.length; i < len; i++) {
        if (props.list[i].fName === name) {
          props.list.splice(i, 1)
          break
        }
      }
      emit('updateFriends', props.list.length, data.newFriendsList)
    }
    return {
      responseHandle
    }
  }
}
</script>

<style lang="less" scoped></style>
