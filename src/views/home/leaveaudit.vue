<template>
    <div class="wa_content">
       <mt-header title="请假审核">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <no-record v-if="leaveRecord.length == 0"/>
         <div id="l_r">
             <leaveCard v-for="item in leaveRecord" @disagree="delete_r" @agree="delete_l" :key="item.LeaveRecordID" :leaveObj="item"/>
         </div>
    </div>
</template>

<script>

import leaveCard from '@/components/leaveCard.vue'
import noRecord from '@/components/noRecord.vue'
import { Indicator } from 'mint-ui'
export default {
    name:"audit_leave",
    data(){
        return{
            leaveRecord:[]
        }
    },
    components:{
        leaveCard,
        noRecord
    },
    methods: {
        getRecord(){
            Indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            let _self = this;
            let post = localStorage.post;
            let teaInfo = localStorage.teaInfo!=null?JSON.parse(localStorage.teaInfo):'';
            let classNum = "";
            let collegeNum = "";
            if(post == "班主任" || post == "辅导员"){
                classNum = teaInfo.ClassNum;
            }else if(post == "院领导"){
                collegeNum = teaInfo.CollegeNum;
            }
            this.$ajax.get(_self.baseUrl + "/TeacherAudit/selectLeaveRecord",{
                params:{post:localStorage.post,classNum:classNum,collegeNum:collegeNum},
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
                _self.$message.error('连接服务器失败');
            });
        },
        delete_l(srcElement){
            let parents = document.getElementById("l_r").childNodes;
            let index;
            for(let i=0;i<parents.length;i++){
                if(parents[i].firstElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild === srcElement){
                    index = [].indexOf.call(parents,parents[i]);
                    this.leaveRecord.splice(index,1);
                }
            }
        },
        delete_r(srcElement){
            let parents = document.getElementById("l_r").childNodes;
            let index;
            for(let i=0;i<parents.length;i++){
                if(parents[i].firstElementChild.lastElementChild.lastElementChild.childNodes[1].lastElementChild.lastElementChild === srcElement){
                    index = [].indexOf.call(parents,parents[i]);
                    this.leaveRecord.splice(index,1);
                }
            }
        }
      
    },
    mounted(){
        this.getRecord();
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
