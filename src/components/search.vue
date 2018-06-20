<template>
    <div>
        <template v-if="type=='count'">
            <el-row class="search">
                <el-col :span="5">
                    <el-input clearable v-model="ss1" placeholder="账号/姓名/手机号"></el-input>
                </el-col>
                <el-col :span="5" :md="{span:6}">
                    <el-select v-model="value" placeholder="请选择" >
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="1" :md="{span:3}">
                    <el-button @click="seatch" :disabled="value==''&&ss1==''" type="primary" icon="el-icon-search">搜索</el-button>
                </el-col>
                <el-col :span="4" :md="{span:3}">
                    <el-button @click="addManger" type="primary" icon="el-icon-circle-plus-outline">新增</el-button>
                </el-col>
            </el-row>
        </template>
        <template v-if="type=='jiesuan'">
            <div class="dico search">
                <el-row class="search" width="100%" >
                    <el-col :span="6">
                        <el-input clearable  v-model="searchCondi.orderCode" placeholder="结算单号"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-input clearable  v-model="searchCondi.orderunique" placeholder="交易编号"></el-input>
                    </el-col>
                    <el-col :span="2" :md="{span:3}">
                        <el-select v-model="searchCondi.balanceStatus" placeholder="请选择" >
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3" :md="{span:4}">
                        <el-date-picker
                        v-model="searchCondi.startTime"
                        type="date"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="3" :md="{span:4}">
                        <el-date-picker
                        v-model="searchCondi.endTime"
                        type="date"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        @change="dayel">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">
                        <el-button @click="seatch2" type="primary" icon="el-icon-search">搜索</el-button>
                    </el-col>
                    <el-col :span="3" :md="{span:2}">
                        <el-button @click="exportTable" type="primary" icon="el-icon-download">导出</el-button>
                    </el-col>
                </el-row>
            </div>
        </template>
        <template v-if="type=='transc'">
            <div class="dico search">
                <el-row class="search" width="100%" >
                    <el-col :span="6">
                        <el-input clearable  v-model="searchCondi1.orderunique" placeholder="交易编号"></el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-input clearable  v-model="searchCondi1.keyword" placeholder="客户姓名/手机号"></el-input>
                    </el-col>
                    <el-col :span="2" :md="{span:3}">
                        <el-select v-model="searchCondi1.orderStatus" placeholder="请选择" >
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3" :md="{span:4}">
                        <el-date-picker
                        v-model="searchCondi.startTime"
                        type="date"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="3" :md="{span:4}">
                        <el-date-picker
                        v-model="searchCondi.endTime"
                        type="date"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        @change="dayel">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">
                        <el-button @click="seatch3" type="primary" icon="el-icon-search">搜索</el-button>
                    </el-col>
                    <el-col :span="3" :md="{span:2}">
                        <el-button @click="exportTable" type="primary" icon="el-icon-download">导出</el-button>
                    </el-col>
                </el-row>
            </div>
        </template>
     </div>
</template>

<script>
    export default {
        props:['options','type'],
        data(){
            return {
                value:'',
                ss1:'',
                searchCondi:{
                    orderCode:'',
                    orderunique:'',
                    balanceStatus:'',
                    startTime:'',
                    endTime:''
                },
                searchCondi1:{
                    keyword:'',
                    orderunique:'',
                    orderStatus:'',
                    startTime:'',
                    endTime:''
                }
            }
        },
        methods:{
            dayel(ev){
                //console.log(ev);
            },
            addManger(){
                this.$bus.emit('changePwd',{type:'add',});
            },
            seatch3(){
                this.$bus.emit('searchTransc',{data:this.searchCondi1});
            },
            seatch2(){
                this.$bus.emit('searchJie',{data:this.searchCondi});
            },
            seatch(){
                this.$bus.emit('searchCount',{s1:this.ss1,s2:this.value});
            },
            exportTable(){
               
            }
        }
    }
</script>


<style>
    .search{
        margin-bottom:12px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:100%;
    }
    .dico .el-col{
        margin-right:12px;
    }
</style>

