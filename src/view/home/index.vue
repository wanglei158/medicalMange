<template>
  <div>
    <el-container>
        <el-header height="90px">
          <app-header  />
        </el-header>
        <el-container>
            <el-aside width="auto">
              <app-aside />
            </el-aside>
            <el-container >
              <el-main id="tank" >
                <router-view></router-view>
              </el-main>
            </el-container>
        </el-container>
    </el-container>
  </div>
</template>


<script>
    import Aside from '@/components/Aside';
    import Header from '@/components/Header';
      export default {
        data(){
          return {

          }
        },
        components:{
          'appHeader':Header,
          'appAside':Aside
        },
        methods:{
          
        },
        mounted(){
          var opHeight = window.innerHeight-90;
          $('#tank').css('height',opHeight+'px');
        }
      }
</script>




<style scoped>
  
  @media screen and (max-width:1200px){
    #tank{
      max-width:900px;
    }
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-header{
    height:90px;
    background:#0087e7;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-main{
    line-height: inherit;
  }
</style>

