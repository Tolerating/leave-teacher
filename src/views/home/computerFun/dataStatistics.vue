<template>
    <div class="wa_content">
        <mt-header title="学生管理">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <condition @conditionData="receiveData" :showTime="true" :dataStatistic="true"></condition>
        <div>
            <div style=" height:1px;border:none; "></div>
            <h2 id="H1" align="center">请假数据统计</h2>
            <h3 id="Big1" style="color: Red; font-weight: bold;" align="center">{{total}}人</h3>
        </div>        
        <div id="main" style="height: 450px;width:100%;"></div>
    </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require("echarts/lib/chart/pie")
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
import qs from 'qs'
import condition from "@/components/retrievalCondition.vue"
export default {
    name:'dataStatistics',
    data(){
        return{
            total:0
        }
    },
    components:{
        condition
    },
    methods:{
        receiveData(val){            
            let _self = this;
            let loading = _self.$loading({
                lock: true,
                text: '获取信息中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let startT = "";
            let endT = "";
            if(val.Time.length != 0 && val.Time != null){
                startT = val.Time[0];
                endT = val.Time[1];
            }
            if(val.LeaveRecordCategory == "0"){
                this.$ajax.get(_self.baseUrl + "/DataStatistics/GetOrderHistoryCount",{           
                    params:{
                        start:startT,
                        end:endT,
                        College:val.College,
                        Specialty:val.Specialty,
                        grade:val.grade,
                        class1:val.Class,
                        Sex:val.Sex
                    }
                    
                }).then(function(response){
                    loading.close();
                    let data = JSON.parse(response.data);
                    console.log(data);
                    _self.total = data.Total;
                    _self.initChartPie(data.Data);                        
                    
                }).catch(function(error){
                    console.log(error);
                    loading.close();
                    _self.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '连接服务器失败'
                    });
                });
            }else{
                this.$ajax.get(_self.baseUrl + "/DataStatistics/GetOrderHistoryCountByLeaveRecordCategory",{           
                    params:{
                        start:startT,
                        end:endT,
                        College:val.College,
                        Specialty:val.Specialty,
                        grade:val.grade,
                        class1:val.Class,
                        Sex:val.Sex,
                        LeaveRecordCategory:val.LeaveRecordCategory
                    }
                   
                }).then(function(response){
                    loading.close();
                    let data = JSON.parse(response.data);
                    console.log(data);
                    _self.total = data.Total;
                    _self.initChartPie(data.Data);                    
                    
                }).catch(function(error){
                    loading.close();
                    console.log(error);
                    _self.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '连接服务器失败'
                    });
                });
            }
        },
        initChartPie(history){
            var myChart = echarts.init(document.getElementById("main"), {
                noDataLoadingOption: {
                    text: '暂无数据',
                    effect: 'bubble',
                    effectOption: {
                        effect: {
                            n: 0 //气泡个数为0
                        }
                    },
                    textStyle: {
                        fontSize: 32,
                        fontWeight: 'bold'
                    }
                }
            });
            var data = [];
            var name = [];
            let flag = 0;
            $.each(history, function () {
                if (this[1] > 0) {
                    data.push({
                        value: this[1],
                        name: this[0]
                    });
                    name.push(this[0]);
                    flag ++;
                }
            });
            if(flag === 0){
                _self.$notify.warning({
                    duration:2000,
                    title: '提示',
                    message: '暂无数据'
                });
            }
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: name
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    feature: {
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [
                {
                    name: '请假记录统计',
                    type: 'pie',
                    center: ['50%', '60%'],
                    data: data,
                    label: {
                        normal: {
                            position: 'inside',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 11
                            }
                        }
                    }
                }
                ]
            };
            if (navigator.userAgent.match(/mobile/i)) {
                option.legend = {};
                option.series[0].center = ['50%', '50%'];
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            // myChart.hideLoading();
        },
        GetHistoryPie(){
            console.log(this.GetHistoryPie);
            
        }

    },
    mounted(){
        this.receiveData({
            College:localStorage.college,
            Specialty:localStorage.specialty,
            grade:localStorage.grade,
            Class:localStorage.class,
            Sex:"0",
            LeaveRecordCategory:"0",
            Time:[]
        });
    }
}
</script>

<style scoped>
.wa_content{
    width: 100%;
    margin: 0 auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color:white;
    height: 100%;
    overflow: scroll;
}
.tabBar{
    float: left;
    margin: 10px 0px 0px 20px;
}
.table{
    margin-top: 50px;
    padding:10px 20px 10px 20px;
}
</style>