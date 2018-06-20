<template>
  <div>
        <div id="login">
            <img src="/static/img/bgcolor.jpg" alt="" class="bg">
            <div class="login">
                <h3>可康安门店管理系统</h3>
                <el-input placeholder="请输入账号" v-model="userCount">
                    <template slot="prepend">账号：</template>
                </el-input>
                <el-input placeholder="请输入密码" v-model="userPwd" type="password">
                    <template slot="prepend">密码：</template>
                </el-input>
                <div class="lohin">
                    <el-button size="medium" type="primary" @click="login">登录</el-button>
                </div>
            </div>
        </div>
  </div>
</template>


<script>
    export default {
        data(){
            return {
                userCount:'',
                userPwd:''
            }
        },
        methods:{
            login(){
                const _self = this;
                $.ajax({
                    url:'/system/users/checkLogin',
                    type:'post',
                    data:{
                        account:_self.userCount,
                        password:_self.userPwd
                    },
                    success:(res)=>{
                        if(res.status!==1){
                            _self.$message.error(res.msg);
                        }else{
                            const obj = res.data;
                            localStorage.setItem('userInfo',JSON.stringify(obj));
                            _self.$router.push({name:'home'});
                        }
                    }
                })
            }
        }
    }
</script>



<style scoped>
    #login{
        position: relative;
    }
    .bg{
        display:block;
        width:100%;
    }
    .login{
        width: 522px;
        height: 318px;
        border-radius: 6px;
        background: #fff;
        margin: 0 auto;
        position: relative;
        top: -220px;
        padding-top: 64px;
        box-sizing: border-box;
        box-shadow: 0px 5px 2px #999;
    }
    .login h3 {
        height: 56px;
        width: 260px;
        line-height: 56px;
        text-align: center;
        font-weight: 400;
        color: #fff;
        font-size: 22px;
        background: #0087e7;
        position: absolute;
        top:-20px;
        left:131px;
    }
    .login h3:before{
        content: "";
        display: block;
        width: 5px;
        height: 21px;
        background: url(/static/img/loginleft.png) no-repeat;
        background-size: cover;
        position: absolute;
        left: -5px;
        top: 0;
    }
    .login h3:after{
        content: "";
        display: block;
        width: 5px;
        height: 21px;
        background: url(/static/img/loginright.png) no-repeat;
        background-size: cover;
        position: absolute;
        right: -5px;
        top: 0;
    }
    .el-input-group {
        margin-top:18px;
        width:64%;
    }
    .lohin{
        margin-top:40px;
    }
    .el-button--medium {
        width:64%;
        font-size: 16px;
        border-radius: 4px;
    }
</style>

