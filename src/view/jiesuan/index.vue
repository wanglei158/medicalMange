<template>
  <div>
      <app-head :options="options" type="jiesuan" />
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
                prop="orderCode"
                label="结算单号"
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
					<el-button size="mini" @click="open2k">咨询</el-button>
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
					value:'1',
					label:'等待结算'
				},
				{
					value:'2',
					label:'结算挂起'
				},
				{
					value:'3',
					label:'结算完成'
				},
				{
					value:'',
					label:'全部'
				}
			],
			gridData:[],
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
				url:'/system/orders/balanceList',
				type:'post',
				data:{
					'page':page||0,
					'pageLength':8,
					orderCode:obj.orderCode||null,
					orderunique:obj.orderunique||null,
					balanceStatus:obj.balanceStatus||null,
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
				if(arr[i].balanceStatus==1){
					arr[i].state1 = '等待结算'
				}
				if(arr[i].balanceStatus==2){
					arr[i].state1 = '结算挂起'
				}
				if(arr[i].balanceStatus==3){
					arr[i].state1 = '结算完成'
				}
				if(arr[i].balanceStatus==null){
					arr[i].state1 = '全部'
				}
			}
			this.logList = arr;
			this.loading = false;
		},
		open2k(){
			this.$alert('详情请咨询：400-101-5573',
			{
				callback:(actions)=>{
					//console.log(actions);
				}
			}
			);
		},
		open3k(it){
			this.$bus.emit('orderDetail',{list:it.orderDrugs,info:it.userInfo});
		},
		onBus(){
			this.$bus.on('searchJie',(data)=>{
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

