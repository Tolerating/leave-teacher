<template>
    <div class="wa_content">
        <mt-header title="本周周末审核">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button @click="weekAudit"  slot="right">全部审核</mt-button>
        </mt-header>
        <weekLeaveCard v-for="item in leaveRecord" :key="item.WeekDaysID" :leaveObj="item"/>
        <no-record v-if="leaveRecord.length == 0"/>
    </div>
</template>

<script>
let moment = require("moment");
import { MessageBox,Indicator } from 'mint-ui'
import weekLeaveCard from '@/components/weekdaysCard.vue'
import noRecord from '@/components/noRecord.vue'
import { locale } from 'moment';
export default {
    name:"weekLeave",
    data(){
        return{
          leaveRecord:[]
        }
    },
    components:{
        weekLeaveCard,
        noRecord
    },
    methods: {
        getLeaveRecord(){
            Indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            let _self = this;
            let teaInfo = localStorage.teaInfo!=null?JSON.parse(localStorage.teaInfo):'';
            let weekdayStartTime = moment().add(5 - new Date().getDay(),'days').format('YYYY-MM-DD');
            let weekdayEndTime = moment().add(6 - new Date().getDay(),'days').format('YYYY-MM-DD');
            this.$ajax.get(_self.baseUrl + "/TeacherAudit/WeekDayNow",{
                params:{
                    start:weekdayStartTime,
                    end:weekdayEndTime,
                    classNum:teaInfo.ClassNum,
                    post:localStorage.post
                },
                headers: {
                    'token': localStorage.token
                }
            }).then(function(response){
                Indicator.close();
                let result = response.data.result;
                if(result == 0){
                   _self.leaveRecord = JSON.parse(response.data.item); 
                }else if(response.data == "未登录"){
                    localStorage.isLogin = false;
                    _self.$router.push("/login");
                }
            }).catch(function(error){
                Indicator.close();
                MessageBox("错误","");
                _self.$message.error('连接服务器失败');
            });
        },
        weekAudit(){
            let _self = this;
            let weekdayStartTime = moment().add(5 - new Date().getDay(),'days').format('YYYY-MM-DD');
            let weekdayEndTime = moment().add(6 - new Date().getDay(),'days').format('YYYY-MM-DD');
            if(this.leaveRecord.length !== 0){
                this.$ajax.get(_self.baseUrl + "/TeacherAudit/TeacherAppr",{
                    params:{
                        start:weekdayStartTime,
                        end:weekdayEndTime,
                        classNum:teaInfo.ClassNum,
                        post:localStorage.post                        
                    },
                    headers: {
                        'token': localStorage.token
                    }
                }).then(function(response){                    
                    if(response.data == "未登录"){
                        localStorage.isLogin = false;
                        _self.$router.push("/login");
                    }else if(response.data.result == 0){
                        MessageBox.alert("审核成功").then(function(){
                            _self.leaveRecord = [];  
                        });
                    }                    
                }).catch(function(error){
                    MessageBox("错误","");
                    _self.$message.error('连接服务器失败');
                });
            }            
        }
    },
    mounted(){
        this.getLeaveRecord();
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

</style>
