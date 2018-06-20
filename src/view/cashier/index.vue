<template>
  <div>
      <el-popover
        ref="popover2"
        placement="right-start"
        width="360"
        trigger="focus"
        >
        <div class="container">
          <p @click="addCart(it)" v-for="(it,i) in drugs" :key="i" :class="{active:it.select}">
            {{it.name}}（{{it.specName}}）
          </p>
          <p v-if="!drugs.length">暂无数据！</p>
        </div>
      </el-popover>
      <el-row style="margin-bottom:12px" type="flex" justify="space-between">
        <el-col :span="9">
          <el-input
            id="seat"
            placeholder="药品名称/药品编号"
            v-model="state"
            class="input-with-select"
            clearable
            @blur="switc=false"
            @focus="switc=true"
            v-popover:popover2>

            <el-button slot="prepend" @click="getDrug(state)"  icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table
      :data="logList"
      style="width: 100%"
      border
      v-loading="loading"
      :cell-style="cellStyle">
        <el-table-column
        prop="index"
        label="序号"
        width="80">
        </el-table-column>
        <el-table-column
        prop="drugName"
        label="药品名称">
        </el-table-column>
        <el-table-column
        prop="drugCode"
        label="药品编号"
        width="120">
        </el-table-column>

        <el-table-column
        prop="specName"
        label="规格"
        width="120">
        </el-table-column>
        <el-table-column
        prop="drugProductCompany"
        label="生产厂家">
        </el-table-column>
        <el-table-column
        prop="drugPrice"
        label="参考价格/元"
        width="110">
        </el-table-column>
        <el-table-column
        prop="unitPrice"
        label="单价/元"
        width="100">
        <template slot-scope="scope">
          <el-input :disabled="!scope.row.drugId" :min="0" @input="compute(scope.row)" v-model="scope.row.unitPrice" placeholder=""></el-input>
        </template>
        </el-table-column>
        <el-table-column
        prop="cartNum"
        label="数量"
        width="90">
        <template slot-scope="scope">
          <el-input :min="1" :disabled="!scope.row.drugId"   @input="compute(scope.row)" v-model="scope.row.cartNum" placeholder=""></el-input>
        </template>
        </el-table-column>
        <el-table-column
        prop="totalPrice"
        label="小计"
        width="110">
        <template slot-scope="scope">
          <el-input :disabled="!scope.row.drugId"   v-model="scope.row.totalPrice"  @input="computeop(scope.row)" placeholder=""></el-input>
        </template>
        </el-table-column>
        <el-table-column
        prop=""
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-button type="danger" :disabled="!scope.row.drugId"  @click="delCart(scope.row)">移除</el-button>
        </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" >
        <el-col :span="8" style="margin:12px 0">
          <span class="tyop" style="line-height:40px">合计：{{totalMoney}}</span>
          <el-button style="float:right" :disabled="!logList.length" type="primary" @click="payOll">可康安支付</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end"  class="usert">
        <el-col v-if="userInfo.userId" :span="9"><span style="float:right">额度：￥{{userInfo.currentPersonAmount}}（{{userInfo.name}}{{userInfo.mobile}}）</span></el-col>
        <el-col v-else>
          <el-button style="float:right">卡号登录</el-button>
        </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
    data() {
      return {
        loading:false,
        cellStyle:{
          'text-align':'left'
        },
        kkl:false,
        drugs: [],
        state: '',
        timeout: null,
        visbile:false,
        switc:false,
        logList:[],
        curTotal:null,
        totalMoney:0,
        userInfo:{}
      };
    },
    watch:{
      state(newV){
        this.getDrug(newV);
      }
    },
    methods: {
      webSocket(userId,type){
        let _self = this;
        let domain = 'apibeta1.colorfulflorist.com';
        let WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;

        if(this.socketBack){
          this.socketBack.close();
        }
        if(type){
          this.socket = new WS('wss://'+domain+'/system/socket?user='+userId);
          this.kop = 'wx';
        }else{
          this.kop = 'app';
        }
        this.socketBack = new WS('wss://'+domain+'/system/socketPushBack?user='+userId);
        this.socketBack.onmessage = function(ev){
          _self.orderSolve(ev.data.split(':'));
        };
      },
      orderSolve(arr){
        if(arr[0]=='message'&&arr[1]==this.userInfo.userId&&arr[2]!==''){
          if(arr[2] =='cancel'){
            	this.Notification('支付取消','用户取消支付','#E6A23C');
							this.socketBack.send('delete');
							return ;
          }
          var obj = {};
          obj.type = arr[2].split('&')[0].split('#')[1];
          obj.online = arr[2].split('&')[1].split('#')[1];
          obj.offline = arr[2].split('&')[2].split('#')[1];
          this.socketBack.send('delete');
          this.sendOrder(obj);
        }
      },
      sendOrder(obj){
        if((parseFloat(obj.online)+parseFloat(obj.offline))!=this.totalMoney){
          this.$message.warning('购物车已发生改变，请重新扫描用户!');
          return ;
        }
        var arr = this.logList;
        var _self = this;
        var arr1 = [];
        for(var i=0;i<arr.length;i++){
          arr1.push(arr[i].cartId);
        }
        $.ajax({
          type:'POST',
          url:'/system/orders/genorateOrder',
          data:{
            cartIds:arr1.join(),
            totalAmount:_self.totalMoney,
            qrCode:_self.userInfo.qrCode
          },
          success:function(res){
            console.log(res);
            if(res.status==1){
              if(obj.offline!=0){
                _self.Notification('支付成功','额度结算成功，请确认其他方式付款'+obj.offline+'元','#67C23A')
              }else{
                _self.Notification('支付成功','额度结算成功!','#67C23A')
              }
              _self.getList();
              _self.userInfo = new Object();
              if(_self.kop=='wx'){
                _self.socket.send('paysuccess');
              }
            }
          }
        })
      },
      listenBarCode(){
        this.barCode = "";
        let WX = '';
        let _self = this;
        document.onkeydown = function(event) {
          let e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
              _self.barCode = _self.barCode.toLowerCase();
              if(WX=='HHHHHHrrrr'){
                WX = 'wx';
              }else{
                WX = 'app';
              }
              if(_self.barCode.length>15){
                _self.payByCode(_self.barCode,WX);
              }
              // if(_self.barCode.length>5&&_self.barCode.length<7){
              //   _self.cardLogin(_self.barCode);
              // }
              _self.barCode = '';
              
              WX = '';
            }
            if (e && (e.key == 'Shift' || e.keyCode == 13||e.key==undefined)) {

            } else {
                if(e.key>=0 && e.key<=9){
                    _self.barCode += e.key;
                }else{
                  WX += e.key;
                }
            }
        }
      },
      payByCode(code,type){
        let _self = this;
        $.ajax({
          type:'POST',
          url:'/system/users/getAmount',
          data:{
            qrCode:code
          },
          success:function(res){
            if(res.status==1){
               _self.$message.success(res.msg);
              _self.userInfo = res.data;
              if(type&&type=='wx'){
                _self.webSocket(_self.userInfo.userId,true);
              }
              if(type&&type=='app'){
                _self.webSocket(_self.userInfo.userId,false);
              }
            }else{
              _self.$message.warning(res.msg);
            }
          }
        })
      },
      payOll(){
        let arr = this.logList;
        if(!this.userInfo.userId){
          this.$message.warning('请扫描用户或使用卡号登录！');
          return ;
        }
        if(this.kop=='wx'){
          this.socket.send(this.scoreJudge());
        }
        if(this.kop=='app'){
          console.log(0);
          let _self = this;
          $.ajax({
            type:'POST',
            url:'/system/pushMessageToApp',
            data:{
              userId:_self.userInfo.userId,
              msg:_self.scoreJudge()
            },
            success:function(res){
              console.log(res);
            }
					});
        }
        
        this.Notification('提示','请提醒客户在可康安内确认支付！','#67c23a');
      },
      scoreJudge(){
          let str = '';
					if(this.totalMoney>this.userInfo.currentPersonAmount){
						str+='type#-1&online#'+this.userInfo.currentPersonAmount+'&offline#'+(this.totalMoney-this.userInfo.currentPersonAmount);
					}else{
						str+='type#1&online#'+this.totalMoney+'&offline#'+0;
					}
					return str;
      },
      Notification(title,msg,type){
        const h = this.$createElement;
        this.$notify({
          title: title,
          type:type||'',
          message: h('span', { style: 'color:'+type}, msg)
        });
      },
      changeDetail(it){
        let _self = this;
        $.ajax({
          url:'/system/drug/editCart',
          type:'post',
          data:{
            cartId:it.cartId,
            unitPrice:it.unitPrice,
            totalPrice:it.totalPrice,
            cartNum:it.cartNum
          },
          success:(res)=>{
            console.log(res);
            if(res.status!==1){
               _self.$message.error(res.msg);
            }
          }
        })
      },
      klop(){
        let arr = this.logList;
        let yuzong = 0;
        for(let i=0;i<arr.length;i++){
          if(arr[i].totalPrice){
            yuzong+=parseInt(arr[i].totalPrice*100)/100;
          }
          if(isNaN(parseInt(arr[i].totalPrice*100))){
            console.log(arr[i]);
          }
        }
        this.totalMoney = yuzong;
      },
      delCart(it){
        let _self = this;
        $.ajax({
          url:'/system/drug/removeCart',
          type:'post',
          data:{
            cartId:it.cartId
          },
          success:(res)=>{
            if(res.status==1){
              _self.getList();
              _self.$message.success(res.msg);
            }else{
              _self.$message.error(res.msg);
            }
          }
        })
      },
      compute(it){
        it.totalPrice = parseInt(it.unitPrice*it.cartNum*100)/100;
        this.klop();
        this.changeDetail(it);
      },
      computeop(it){
        let target = (it.totalPrice/it.cartNum).toString();
        if(target.indexOf('.')==-1){
          it.unitPrice = parseInt(100*it.totalPrice/it.cartNum)/100;
          this.klop();
          this.changeDetail(it);
          return ;
        } 
        if(target.split('.')[1].length>2){
          this.$message.error('违规操作！！！');
          this.getList();
          return ;
        }
        it.unitPrice = parseInt(100*it.totalPrice/it.cartNum)/100;
        this.klop();
        this.changeDetail(it);
      },
      addCart(it){
        let _self = this;
        $.ajax({
          url:'/system/drug/orderDrugs',
          type:'post',
          data:{
            drugId:it.id
          },
          success:(res)=>{
            if(res.status==1){
              this.$message.success(res.msg);
              this.getList();
            }else{
              this.$message.error(res.msg);
            }
          }
        })
      },
      getList(){
        let _self = this;
        this.loading = true;
        $.ajax({
          url:'/system/drug/cartList',
          type:'post',
          success:(res)=>{
            _self.totalMoney = res.data.cartTotalPrice;
            _self.chuli(res.data.cartList)
          }
        })
      },
      chuli(arr){
        for(var i = 0;i<arr.length;i++){
          arr[i].index = i;
        }
        this.logList = arr;
        this.loading = false;
      },
      getDrug(name,code){
        var _self = this;
        $.ajax({
          url:'/system/drug/list',
          type:'post',
          data:{
            drugName:name,
            code:code||null,
            page:0,
            pageLength:1000
          },
          success:(res)=>{
            _self.solveData(res.data.drugList)
          }
        })
      },
      solveData(arr){
        for(let i=0;i<arr.length;i++){
          arr[i].select = false;
        }
        this.drugs = arr;
      },
      selByslide(op){
        let arr = this.drugs;
        if(op=='down'){
          let index = null;
          for(let i=0;i<arr.length;i++){
            if(arr[i].select){
              index = i;
              arr[i].select = false;
              break ;
            }
          }
          if(index==null){
            arr[0].select = true;
            return ;
          }
          if(arr.length==(index+1)){
            arr[index].select = true;
            return ;
          }
          arr[index+1].select = true;
          this.contentScroll(index+1,'down');
        }else{
          let index = 0;
          for(let i=0;i<arr.length;i++){
            if(arr[i].select){
              index = i;
              arr[i].select = false;
              break ;
            }
          }
          if(index==0) {
            arr[0].select = true;
            return ;
          } ;
          arr[index-1].select = true;
          this.contentScroll(index-1,'up');
        }
      },
      contentScroll(idx,dir){
        let position = $('.container p').eq(idx).position();
        var fatheL = $('.container').height();
        var disTop = $('.container').scrollTop();
        if(idx>9&&dir=='down'){
          if(position.top<300){

            return ;
          }
          $('.container').scrollTop((idx-9)*36+12);
        }
        if(dir=='up'){
          if(position.top<0){
            $('.container').scrollTop(disTop-Math.abs(position.top)-12);
          }
        }
        //console.log(position.top,disTop)
      }

    },
    mounted(){
      this.getList();
      $(window).on('keydown',(ev)=>{
          if(!this.switc) return;
          if(!this.drugs.length) return ;
          if(ev.keyCode==40){
            this.selByslide('down');
          }
          if(ev.keyCode==38){
            this.selByslide('up');
          }
          if(ev.keyCode==13){
            let arr = this.drugs;
            for(let i=0;i<arr.length;i++){
              if(arr[i].select){
                this.addCart(arr[i]);
                break;
              }
            }
          }
          
      });
      this.listenBarCode();
    }
}
</script>

<style scoped>
    .container{
      max-height:360px;
      overflow-y: scroll;
    }
    .container p{
      line-height: 36px;
    }
    .container p.active{
      background:#f5f7fa;
    }
    .el-input-number{
      width:68px;
    }
    .tyop{
      color:#F56C6C;
      font-size:22px;
      margin-right:12px;
    }
    .usert{
      line-height: 40px;
    }
</style>


