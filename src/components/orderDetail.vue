<template>
  <div>
       <el-dialog title="订单详情" :visible.sync="dialogTableVisible" width="60%">
            <el-table :data="gridData"  :cell-style="cellStyle" >
                <el-table-column property="drugName" label="药品名称" width="200"></el-table-column>
                <el-table-column property="specNames" label="规格" width="120"></el-table-column>
                <el-table-column property="singlePrice" label="单价"></el-table-column>
                <el-table-column property="drugNum" label="数量" ></el-table-column>
                <el-table-column property="drugPrice" label="总价"></el-table-column>
            </el-table>
            <el-row justify="end" type="flex" style="line-height:48px">
                <el-col :span="5">
                    {{userInfo.userName}}
                </el-col>
                <el-col :span="5">
                    {{userInfo.userPhone}}
                </el-col>
            </el-row>
        </el-dialog>
  </div>
</template>


<script>
    export default {
        data(){
            return {
                cellStyle:{
                    'text-align':'left'
                },
                dialogTableVisible:false,
                gridData:[],
                userInfo:{}
            }
        },
        methods:{
            onBus(){
                this.$bus.on('orderDetail',(data)=>{
                    this.dialogTableVisible = true;
                    var arr = data.list;
                    this.userInfo = data.info;
                    for(var i= 0;i<arr.length;i++){
                        arr[i].singlePrice = arr[i].drugPrice/arr[i].drugNum;
                    }
                    this.gridData = arr;
                })
            }
        },
        mounted(){
            this.onBus();
        }
    }
</script>
