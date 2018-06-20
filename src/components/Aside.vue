<template>
  <div>
      <el-row>
          <el-col :span="24">
                <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                @select="changeItem"
                background-color="#D3DCE6"
                text-color="#343434"
                active-text-color="#0087e7"
                :collapse="isCollapse"
                router
                >
                <el-menu-item index="cash">
                    <img :src="activeIndex=='cash'?'/static/img/cartx.png':'/static/img/cart.png'" alt="">
                    <span slot="title">收银结算</span>
                </el-menu-item>
                <el-menu-item index="transc">
                    <img :src="activeIndex=='transc'?'/static/img/trascx.png':'/static/img/trasc.png'" alt="">
                    <span slot="title">交易列表</span>
                </el-menu-item>
                <el-menu-item index="acount">
                    <img :src="activeIndex=='acount'?'/static/img/orderx.png':'/static/img/order.png'" alt="">
                    <span slot="title">结算列表</span>
                </el-menu-item>
                <el-menu-item index="count">
                    <img :src="activeIndex=='count'?'/static/img/countx.png':'/static/img/count.png'" alt="">
                    <span slot="title">账户管理</span>
                </el-menu-item>
                </el-menu>
          </el-col>
      </el-row>
  </div>
</template>

<script>
    export default {
        data(){
            return {
                activeIndex:'cash',
                isCollapse:false
            }
        },
        watch:{
            $route(to,from){
                this.routerMatch(to.name); 
            }
        },
        methods:{
            handleOpen(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                //console.log(key, keyPath);
            },
            changeItem(index){
                this.activeIndex = index;
            },
            routerMatch(name){
                this.activeIndex = name;
            }
        },
        mounted(){
            this.routerMatch(this.$router.currentRoute.name);
        }
    }
</script>

<style scoped>
    .el-aside img{
        width:18px;
        margin-right:5px;
    }
</style>

