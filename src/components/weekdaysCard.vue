<template>
    <div class="c_main">
        <mu-expansion-panel>
            <div slot="header">{{leaveObj.StudentName}}&nbsp;&nbsp;<span style="color:red;">{{leaveObj.StudentID}}</span>&nbsp;&nbsp;{{leaveObj.ClassName}}</div>
            <mu-list textline="three-line">
                <mu-list-item avatar :ripple="false" button>
                    <mu-list-item-action>
                        时间：
                    </mu-list-item-action>
                    <mu-list-item-content>
                        <mu-list-item-title>审核状态：{{leaveObj.WeekDaysApprovalResult}}</mu-list-item-title>
                        <mu-list-item-sub-title>
                        周五晚：{{leaveObj.Fridayn}}<br>周六晚：{{leaveObj.Saturdayn}}
                        </mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
            </mu-list>
            <input type="hidden" :value="leaveObj.WeekDaysID" ref="leaveID">
            <mu-chip style="margin-right:5px;" class="demo-chip" slot="action">电话：{{leaveObj.Tel}}</mu-chip>
        </mu-expansion-panel>
    </div>   
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
    name:"weekdayCard",
    data(){
        return{
           
        }
    },
    props:{
        leaveObj:Object
    },
}
</script>

<style scoped>
.c_main{
    width: 100%;
}
</style>
