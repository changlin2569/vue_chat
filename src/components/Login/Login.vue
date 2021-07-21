<template>
  <div class="container">
    <div class="form-box">
      <div class="box">
        <div class="avatar">
          <img src="./../../assets/img/avatar.jpg" alt="" />
        </div>
        <div class="login-form">
          <el-form
            :model="loginForm"
            :rules="loginFormRules"
            ref="loginFormRef"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="name">
              <el-input v-model="loginForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="register">注册</el-button>
          <el-button type="primary" @click="loginHandle">登录</el-button>
        </div>
      </div>
    </div>
    <!-- 注册对话框 -->
    <el-dialog title="注册" v-model="registerDialogVisible" width="30%">
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="registerFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="loginForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="registerCancel">取 消</el-button>
          <el-button type="primary" @click="registerHandle">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const loginFormRef = ref(null)
    const loginForm = reactive({
      name: '',
      password: ''
    })
    const loginFormRules = reactive({
      name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 12, message: '长度在6 到 12 位', trigger: 'blur' }
      ]
    })
    const loginHandle = function() {
      loginFormRef.value.validate(async flag => {
        if (!flag) {
          return false
        }
        const { data } = await proxy.$http.post('/login', loginForm)
        if (data.status !== 200) {
          ElMessage.error(data.msg)
          return false
        }
        ElMessage.success(data.msg)
        window.sessionStorage.setItem('token', data.token)
        window.sessionStorage.setItem('myName', loginForm.name)
        router.push('/home')
        proxy.$socket.emit('up', loginForm.name)
      })
    }

    const registerFormRef = ref(null)
    const registerDialogVisible = ref(false)
    const register = function() {
      registerDialogVisible.value = true
    }
    const registerCancel = function() {
      // 对表单进行重置
      registerFormRef.value.resetFields()
      registerDialogVisible.value = false
    }
    const registerHandle = function() {
      registerFormRef.value.validate(async flag => {
        if (!flag) {
          return false
        }
        const { data } = await proxy.$http.post('/register', loginForm)
        if (data.status !== 200) {
          ElMessage.error(data.msg)
          return false
        }
        ElMessage.success(data.msg)
        registerDialogVisible.value = false
      })
    }
    return {
      loginFormRef,
      loginForm,
      loginFormRules,
      loginHandle,
      registerFormRef,
      registerDialogVisible,
      register,
      registerCancel,
      registerHandle
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: aquamarine;

  .form-box {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    .box {
      position: relative;
      width: 500px;
      height: 300px;
      border-radius: 15px;
      background-color: #fff;

      .avatar {
        position: absolute;
        width: 100px;
        height: 100px;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .login-form {
        position: absolute;
        width: 400px;
        top: 60px;
        left: 30px;
      }
    }
  }
}
</style>
