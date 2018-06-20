 <template>
    <div>
        <app-header />
        <el-table
        :data="logList"
        style="width: 96%"
        border
        :cell-style="cellStyle"
        >
            <el-table-column
                prop="index"
                label="序号"
                width="60" fixed>
            </el-table-column>
            <el-table-column
                prop="logUserName"
                label="操作人"
                width="160"
                fixed
            >
            </el-table-column>
            <el-table-column
                prop="logTime"
                label="操作时间"
                width="180"
                fixed>
            </el-table-column>
            <el-table-column
                prop="logContent"
                label="操作内容"
                width="800">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage3"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalLogs">
            </el-pagination>
        </div>

    </div>

  </template>


<script>
    import Head from '@/components/Header.vue'
    export default {
        data(){
            return {
                cellStyle:{
                    'text-align':'left'
                },
                logList:[],
                totalLogs:null,
                currentPage3:1,
            }
        },
        components:{
            'appHeader':Head
        },
        methods:{
            handleCurrentChange(ev){//当前页面变化
                this.currentPage3 = ev;
                this.getDaga(ev-1);
            },
            getDaga(page){
                var _self = this;
                $.ajax({
                    url:'/system/users/logs',
                    type:'post',
                    data:{
                        page:page||0,
                        pageLength:10
                    },
                    success:(res)=>{
                        console.log(res);
                        _self.totalLogs = res.data.count;
                        _self.solveData(res.data.logs);
                    }
                })
            },
            solveData(arr){
                for(var i = 0;i<arr.length;i++){
                    arr[i].index = (this.currentPage3-1)*10+i+1;
                }
                this.logList = arr;
            }
            
        },
        beforeMount(){
            this.getDaga();
        }
    }
</script>

<style scoped>
    .el-table{
        margin:0 auto;
        margin-top:12px;
    }
    .pagination{
        margin:30px 0;
    }
    .head{
        padding:0 20px; 
    }

</style>

