<template>
  <div>
        <template v-if="type=='add'">
            <el-dialog title="新增账号（只能创建门店收银员账号）" width="30%" :visible.sync="dialogFormVisible" center>
                <el-form :model="form1">
                    <el-form-item label="账号" :label-width="formLabelWidth">
                        <el-input v-model="form1.account" auto-complete="off" placeholder="6~20位数字、字母、下划线"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input v-model="form1.password" auto-complete="off" placeholder="6~20位"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" :label-width="formLabelWidth" >
                        <el-input v-model="form1.username" auto-complete="off" placeholder="真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth" >
                        <el-input v-model="form1.mobile" auto-complete="off" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth" >
                        <el-radio v-model="form1.status" label="1">启用</el-radio>
                        <el-radio v-model="form1.status" label="0">冻结</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelSet1">取 消</el-button>
                    <el-button type="primary" @click="toAddCount">确 定</el-button>
                </div>
            </el-dialog>
        </template>
        <template v-else>
            <el-dialog title="修改密码" width="30%" :visible.sync="dialogFormVisible" center>
                <el-form :model="form">
                    <el-form-item label="原密码" :label-width="formLabelWidth">
                        <el-input v-model="form.oldPwd" auto-complete="off" placeholder="请输入旧密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" :label-width="formLabelWidth">
                        <el-input v-model="form.newPwd" auto-complete="off" placeholder="6~20位，特殊字符除外"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :label-width="formLabelWidth" >
                        <el-input v-model="form.rNewPwd" auto-complete="off" placeholder="再次输入新密码"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelSet">取 消</el-button>
                    <el-button type="primary" @click="toChangePwd">确 定</el-button>
                </div>
            </el-dialog>
        </template>
        
  </div>
</template>


<script>
    export default {
        data(){
            return {
                form1:{
                    account:'',
                    password:'',
                    username:'',
                    mobile:'',
                    status:'1'
                },
                dialogFormVisible: false,
                formLabelWidth: '69px',
                form: {
                    oldPwd: '',
                    newPwd: '',
                    rNewPwd: '',
                },
                type:null,
            }
        },
        methods:{
            toAddCount(){
                this.$bus.emit('changPwd_callback',{type:this.type,form:this.form1});
                this.cancelSet1();
            },
            cancelSet1(){
                this.form1.account = '';
                this.form1.password = '';
                this.form1.username = '';
                this.form1.mobile = '';
                this.form1.status = '1';
                this.dialogFormVisible = false;

            },
            cancelSet(){
                this.form.oldPwd = '';
                this.form.newPwd = '';
                this.form.rNewPwd = '';
                this.dialogFormVisible = false;
            },
            onBus(){
                this.$bus.on('changePwd',(data)=>{
                    this.dialogFormVisible = true;
                    this.type = data.type;
                })
            },
            toChangePwd(){
                if(this.form.oldPwd==''){
                    console.log(this.form.oldPwd);
                    this.$message.warning('旧密码不能为空！');
                    return ;
                }
                if(this.form.newPwd==''){
                    this.$message.warning('新密码不能为空！');
                    return ;
                }
                if(this.form.newPwd!==this.form.rNewPwd){
                    this.$message.warning('两次输入的密码不一致！');
                    return ;
                }
                this.$bus.emit('changPwd_callback',{type:this.type,oldPassword:this.form.oldPwd,newPassword:this.form.newPwd});
                this.cancelSet();
            }
        },
        mounted(){
            this.onBus();
        }
    }
</script>
