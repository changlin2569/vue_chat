<template>
  <div class="message-box">
    <div class="list">
      <div class="header">
        当前在线用户
      </div>
      <div class="user-list">
        <ul>
          <li class="user-item">
            <img src="./../../assets/img/avatar.jpg" alt="" />
            <span>admin</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="message">
      <MsgPanel name="admin"></MsgPanel>
    </div>
  </div>
</template>

<script>
import MsgPanel from './MsgPanel.vue'
export default {
  setup() {
    return {}
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
          font-size: 24px;
          margin-left: 10px;
        }
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
