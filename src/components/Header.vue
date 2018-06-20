<template>
  <div class="head">
      <el-row >
          <el-col :span="9" class="lhead">可康安门店管理系统</el-col>
          <el-col :span="8" class="rhead" :xs="{span:8}">
            <el-dropdown class="portrait" >
                <div class="operat" >
                    <span class="hidden-xs-only">{{user.userName}}</span>
                    <img class="uop" src="https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png">
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <router-link :to="{path:'/log'}">
                            日志记录
                        </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item divided><span @click="changSelf" >修改密码</span></el-dropdown-item>
                    <el-dropdown-item  divided>
                        <router-link :to="{path:'/login'}">
                            退出
                        </router-link>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>  
          </el-col>
      </el-row>
       <app-change-pwd  />
  </div>
</template>

<script>
    import ChangePwd from '@/components/changePwd';
    export default {
        data(){
            return {
                user:null,
                logList:[],
            }
        },
        components:{
            'appChangePwd':ChangePwd,
        },
        methods:{
            changSelf(){
                this.$bus.emit('changePwd',{type:'self',});
            },
            changeSelfPwd(obj){
                $.ajax({
                    url:'/system/users/editPwd',
                    type:'post',
                    data:{
                        oldPassword:obj.oldPassword,
                        newPassword:obj.newPassword,
                        uid:null
                    },
                    success:(res)=>{
                        if(res.status==1){
                            this.$message.success(res.msg);
                            return ;
                        }
                        this.$message.error(res.msg);
                    }
                })
            },
            onBus(){
                this.$bus.on('changPwd_callback',(data)=>{
                    if(data.type=='self'){
                        this.changeSelfPwd(data);
                    }
                })
            }
        },
        mounted(){
            this.onBus();
        },
        beforeMount(){
            this.user = JSON.parse(localStorage.getItem('userInfo'));
        }
    }
</script>

<style scoped>
    .head{
        height:90px;
        background:#0087e7;
    }
    .lhead {
        line-height: 90px;
        color: #fff;
        font-weight: 700;
        font-size: 24px;
        margin-left: 20px;
        text-align: left;
    }
    .el-dropdown-menu__item a{
        display:block;
    }
    .rhead{
        float:right;
        margin-right:20px;
    }
    .portrait{
        display:block;
        height:72px;
    }
    .portrait .operat{
        float:right;
        display:flex;
        cursor: pointer;
    }
    .portrait span{
        color:#fff;
        line-height: 90px;
        margin-right: 12px;
    }
    .portrait i{
        display:block;
    }
    .uop{
        border-radius:50%;
        display:block;
        width:60px;
        height:60px;
        margin-top:15px;
    }
</style>

