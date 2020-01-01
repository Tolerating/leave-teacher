<template>
    <div class="c_main">
        <mu-expansion-panel>
            <div slot="header">{{leaveObj.StudentName}}&nbsp;&nbsp;<span style="color:red;">{{leaveObj.StudentNum}}</span>&nbsp;&nbsp;{{leaveObj.LeaveRecordClassName}}</div>
            <mu-list textline="three-line">
                <mu-list-item avatar :ripple="false" button>
                    <mu-list-item-action>
                        时间：
                    </mu-list-item-action>
                    <mu-list-item-content>
                        <mu-list-item-title>{{leaveObj.LeaveRecordCategory}}</mu-list-item-title>
                        <mu-list-item-sub-title>
                        {{leaveObj.LeaveRecordStartTime}}至<br>{{leaveObj.LeaveRecordEndtTime}}&nbsp;共{{leaveObj.LeaveRecordNumDays}}天
                        </mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>

                <mu-list-item avatar :ripple="false" button>
                    <mu-list-item-action>
                        事由：
                    </mu-list-item-action>
                    <mu-list-item-content>
                        <mu-list-item-title>寝室：{{leaveObj.StudentBedroomNum}}</mu-list-item-title>
                        <mu-list-item-sub-title @click="showReason">
                            {{leaveObj.LeaveRecordReason}}
                        </mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-list-item avatar :ripple="false" button>
                    <mu-list-item-action>
                        审批人：
                    </mu-list-item-action>
                    <mu-list-item-content>
                        <mu-list-item-title>{{leaveObj.LeaveRecordApprover}}</mu-list-item-title>
                    </mu-list-item-content>
                </mu-list-item>
            </mu-list>
            <input type="hidden" :value="leaveObj.LeaveRecordID" ref="leaveID">
            <mu-chip style="margin-right:5px;" class="demo-chip" slot="action">电话：{{leaveObj.StudentTel}}</mu-chip>
            <mu-button slot="action" flat @click="notThrough">不通过</mu-button>
            <mu-button slot="action" flat color="primary" @click="through">通过</mu-button>
        </mu-expansion-panel>
    </div>   
</template>
<script>
import { MessageBox } from 'mint-ui'
export default {
    name:"leaveCard",
    data(){
        return{
           
        }
    },
    props:{
        leaveObj:Object
    },
    methods:{
        showReason(e){
            MessageBox('事由',e.srcElement.innerText);   
        },
        notThrough(e){
            let id = this.$refs.leaveID.value;
            let _self = this;
            MessageBox.confirm("确认不通过?").then(action =>{
               _self.$ajax.get(_self.baseUrl + "/TeacherAudit/Notthrough",{
                    params:{
                        leaveID:id
                    },
                    headers: {
                        'token': localStorage.token
                    }
                }).then(function(response){
                    let result = response.data.result;
                   if(result == 0){
                       MessageBox.alert("不通过审核成功").then(function(){
                           _self.$emit("disagree",e.target);
                       });
                   }else if(result == -1){
                       MessageBox('提示',"不通过审核失败，请稍后再试！");
                   }else if(result == -2){
                       MessageBox('提示',"短信发送失败，不通过审核失败！");
                   }
                }).catch(function(error){
                     MessageBox('错误',"连接服务器失败！");
                });
            }).catch(function(){
                
            });
            
        },
        through(e){
            let id = this.$refs.leaveID.value;
            let _self = this;
            let post = localStorage.post;
            let teaInfo = localStorage.teaInfo!=null?JSON.parse(localStorage.teaInfo):'';
            let ClassSpecialityID = "";
            let ClassSpecialityTeacherID = "";
            if(post == "班主任" || post == "辅导员"){
                ClassSpecialityID = teaInfo.ClassSpecialityID;
                ClassSpecialityTeacherID = teaInfo.ClassSpecialityTeacherID;
            }
            MessageBox.confirm("确认通过?").then(action =>{
                _self.$ajax.get(_self.baseUrl + "/TeacherAudit/updateLeaveRecord",{
                    params:{
                        leaveID:id,
                        specTeacherID:ClassSpecialityTeacherID,
                        SpecialityID:ClassSpecialityID
                    },
                    headers: {
                        'token': localStorage.token,
                    }
                }).then(function(response){
                    let result = response.data.result;
                    if(result == 0){
                        MessageBox.alert("通过审核成功").then(function(){
                           _self.$emit("agree",e.target);
                        });
                    }else if(result == -1){
                        MessageBox('提示',"通过审核失败，请稍后再试！");
                    }else if(result == -2){
                        MessageBox('提示',"短信发送失败，通过审核失败！");
                    }
                }).catch(function(error){
                    MessageBox('错误',"连接服务器失败！");
                });
            }).catch(function(){

            });
        },
    }
}
</script>

<style scoped>
.c_main{
    width: 100%;
}
</style>
