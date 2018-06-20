<template>
  <div>
      <app-search :options="options" type="count" />
      <el-table
        :data="countList"
        style="width: 100%"
        border
        v-loading="loading"
        :cell-style="cellStyle"
        >
            <el-table-column
                prop="index"
                label="序号"
                width="70">
            </el-table-column>
            <el-table-column
                prop="account"
                label="门店收银员账号"
                width="140"
            >
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="mobile"
                width="160"
                label="手机号">
            </el-table-column>
            <el-table-column
                prop="stat"
                width="140"
                label="状态">
            </el-table-column>
            <el-table-column
                width="180"
                prop="null"
                label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="warning"
                    @click="handleEdit(scope.$index, scope.row)">
                        <template v-if="scope.row.status">
                        冻结
                        </template>
                        <template v-else>
                        启用                        
                        </template>
                    </el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    @click="handleDelete(scope.$index, scope.row)">修改密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage3"
            :page-size="9"
            layout="total, prev, pager, next, jumper"
            :total="totalCount">
            </el-pagination>
        </div>
  </div>
</template>


<script>
    import Search from '@/components/search';
    

    export default {
        data(){
            return {
                ss1:'',
                loading:false,
                countList:[],
                cellStyle:{
                    'text-align':'left'
                },
                currentPage3:1,
                totalCount:null,
                options:[
                    {
                        value:'all',
                        label:'全部'
                    },
                    {
                        value:'0',
                        label:'冻结'
                    },
                    {
                        value:'1',
                        label:'使用中'
                    }
                ],
            }
        },
        components:{
            'appSearch':Search, 
        },
        methods:{
            handleEdit(idx,it){
                const _self = this;
                var ste = it.status?0:1;
                $.ajax({
                    url:'/system/users/statusUserAccount',
                    type:'post',
                    data:{
                        userId:it.id,
                        status:ste
                    },
                    success:(res)=>{
                        if(res.status==1){
                            _self.$message({message:res.msg,type:'success'});
                            _self.getData();
                        }else{
                            _self.$message.error(res.msg);
                        }
                    }
                })
            },
            handleDelete(idx,it){
                //
                this.uId = it.id;
                this.$bus.emit('changePwd',{type:'other',});
            },
            handleCurrentChange(ev){
                this.currentPage3 = ev;
                this.getData(ev-1);
            },
            getData(num,kw,state){
                this.loading = true;
                var _self = this;
                $.ajax({
                    url:'/system/users/userAccounts',
                    type:'post',
                    data:{
                        page:num||0,
                        pageLength:9,
                        keyword:kw||null,
                        status:state||'all'
                    },
                    success:(res)=>{
                        _self.totalCount = res.data.count;
                        _self.solveData(res.data.list);
                        
                    }
                })
            },
            solveData(arr){
                for(var i = 0;i<arr.length;i++){
                    arr[i].index = (this.currentPage3-1)*9+i+1;
                    arr[i].stat = arr[i].status?'使用中':'冻结';
                }
                this.countList = arr;
                this.loading = false;
            },
            changePwd(obj){
                const _self = this;
                $.ajax({
                    url:'/system/users/editPwd',
                    type:'post',
                    data:{
                        oldPassword:obj.oldPassword,
                        newPassword:obj.newPassword,
                        uid:_self.uId
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
            addCount(obj){
                var _self = this;
                $.ajax({
                    url:'/system/users/addUserAccount',
                    type:'post',
                    data:obj,
                    success:(res)=>{
                        if(res.status==1){
                            this.$message.success(res.msg);
                            this.getData();
                        }else{
                            this.$message.warning(res.msg);
                        }
                    }
                })
            },
            onBus(){
                this.$bus.on('searchCount',(data)=>{
                    this.getData(0,data.s1,data.s2);
                });
                this.$bus.on('changPwd_callback',(data)=>{
                    if(data.type=='other'){
                        console.log(data);
                        this.changePwd(data);
                    }
                    if(data.type="add"){
                        this.addCount(data.form);
                    }
                })
            }
        },
        mounted(){
            this.getData();
            this.onBus();
        }
    }
</script>

<style scoped>
    .pagination{
        margin-top:12px;
    }
</style>

