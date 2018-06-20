<template>
  <div>
      <app-head :options="options" type="transc" />
	  <el-table
        :data="logList"
        style="width: 100%"
        border
        :cell-style="cellStyle"
		v-loading="loading"
        >
            <el-table-column
                prop="index"
                label="序号"
				width="70"
			>
            </el-table-column>
			<el-table-column
                prop="orderunique"
                label="交易编号"
            >
            </el-table-column>
            <el-table-column
                prop="orderRealTotalAmount"
                label="额度/元"
				>
            </el-table-column>
            <el-table-column
                prop="otherPay"
                label="其他支付/元">
            </el-table-column>
			<el-table-column
                prop="orderTotalAmount"
                label="合计/元">
            </el-table-column>
			<el-table-column
                prop="orderTime"
                label="时间">
            </el-table-column>
			<el-table-column
                prop="state1"
                label="状态"
				width="120">
            </el-table-column>
			<el-table-column
                prop="logContent"
                label="操作"
				width="180">
				<template slot-scope="scope">
					<el-button :disabled="scope.row.orderStatus==-11" size="mini" @click="open2k(scope.row)">撤销</el-button>
					<el-button size="mini" @click="open3k(scope.row)" icon="el-icon-caret-bottom">查看</el-button>
				</template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage3"
            :page-size="8"
            layout="total, prev, pager, next, jumper"
            :total="totalLogs">
            </el-pagination>
        </div>
		<app-order-detail />
  </div>
</template>


<script>
  import Head from '@/components/search';
  import OrderDetail from '@/components/orderDetail'
  export default {
    data(){
      return {
		  	loading:false,
			cellStyle:{
				'text-align':'left'
			},
			logList:[],
			totalLogs:null,
			currentPage3:1,
            options:[
				{
					value:'-2',
					label:'未付款'
				},
				{
					value:'-1',
					label:'已取消'
				},
				{
					value:'2',
					label:'已支付'
				},
				{
					value:'-11',
					label:'已撤销'
				},
				{
					value:'',
					label:'全部'
				}
			],
			gridData:[],
			cancelId:null,
			searCondi:{}
      }
	},
	components:{
	  'appHead':Head,
	  'appOrderDetail':OrderDetail
    },
	methods:{
		handleCurrentChange(ev){
			this.currentPage3 = ev;
			this.getData(ev-1,this.searCondi);
		},
		getData(page,obj){
			this.loading = true;
			var _self = this;
			$.ajax({
				url:'/system/orders/orderList',
				type:'post',
				data:{
					'page':page||0,
					'pageLength':8,
					keyword:obj.keyword||null,
					orderunique:obj.orderunique||null,
					orderStatus:obj.orderStatus||null,
					startTime:obj.startTime||null,
					endTime:obj.endTime||null
				},
				success:(res)=>{
					_self.totalLogs = res.data.count;
					_self.solveData(res.data.list);
				}
			})
		},
		solveData(arr){
			for(var i = 0;i<arr.length;i++){
				arr[i].index = (this.currentPage3-1)*8+i+1;
				if(arr[i].orderStatus==-2){
					arr[i].state1 = '未付款'
				}
				if(arr[i].orderStatus==-1){
					arr[i].state1 = '已取消'
				}
				if(arr[i].orderStatus==2){
					arr[i].state1 = '已支付'
				}
				if(arr[i].orderStatus==-11){
					arr[i].state1 = '已撤销'
				}
				if(arr[i].orderStatus==null){
					arr[i].state1 = '全部'
				}
			}
			this.logList = arr;
			this.loading = false;
		},
		open2k(it){
			this.$confirm('撤销后，该交易无法恢复！', '确定撤销该交易吗？', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				center:true
				}).then(() => {
					this.cancelOrder(it.orderId);
				}).catch(() => {
				          
			});
		},
		cancelOrder(orderId){
			var _self = this;
			$.ajax({
				url:'/system/orders/cancleOrder',
				type:'post',
				data:{
					'orderId':orderId
				},
				success:(res)=>{
					if(res.status==1){
						_self.$message.success(res.msg);
						_self.getData(0,{});
					}else{
						_self.$message.error(res.msg);
					}
				}
			})
		},
		open3k(it){
			this.$bus.emit('orderDetail',{list:it.orderDrugs,info:it.userInfo});
		},
		onBus(){
			this.$bus.on('searchTransc',(data)=>{
				this.searCondi = data.data;
				this.getData(0,data.data);
			})
		}
	},
    mounted(){
		this.onBus();
		this.getData(0,this.searCondi);
	}
  }
</script>

<style scoped>
	.pagination{
		margin-top:12px;
	}
</style>

