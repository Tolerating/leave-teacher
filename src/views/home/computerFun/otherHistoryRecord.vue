<template>
    <div class="wa_content">
       <mt-header title="其他历史记录">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>

        <condition @conditionData="receiveData" :otherRecord="true"></condition>

        <div class="table">
            <el-row>
                <el-col :span="5" :push="19">
                    <el-input
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    v-model="search"
                    >                    
                </el-input>                
                </el-col>
            </el-row>
            
            <el-table
                :data="updateTable.slice((currentPage4-1)*sizeRange,currentPage4*sizeRange)"
                style="width: 100%"
                size="medium"
                >
                <el-table-column
                fixed
                prop="LeaveRecordStudentID"
                label="学号"
                width="100"
                >
                </el-table-column>
                <el-table-column
                prop="StudentName"
                label="姓名"
                width="100"
                >
                </el-table-column>
                <el-table-column
                prop="LeaveRecordStartTime"
                label="开始时间">
                </el-table-column>
                <el-table-column
                prop="LeaveRecordEndtTime"
                label="结束时间"
                >
                </el-table-column>
                <el-table-column
                prop="LeaveRecordCategory"
                label="请假类别"
                width="100"
                >
                </el-table-column>
                <el-table-column
                prop="LeaveRecordNumDays"
                label="请假天数"
                width="80"
                >
                </el-table-column>
                <el-table-column
                prop="LeaveRecordApprover"
                label="审批人"
                >
                </el-table-column>
                <el-table-column
                prop="LeaveRecordApprovalResult"
                label="审批结果"
                width="80"
                >
                </el-table-column>
                <el-table-column
                prop="LeaveRecordApprovalTime"
                label="最后审批时间"
                >
                </el-table-column>
                <!-- <el-table-column
                prop="LeaveRecordSumLesson"
                label="总节数"
                >
                </el-table-column> -->
                <el-table-column
                prop="LeaveRecordClassNum"
                label="班级"
                >
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="查看">
                    <template slot-scope="scope">
                        <el-button type="button" size="mini" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>         
            </el-table>
            <el-row>
                <el-col :span="10" :push="14">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[5,10,25, 50, 100]"
                        :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="updateTable.length">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
            
    </div>
</template>

<script>
import moment from 'moment'
import condition from "@/components/retrievalCondition.vue"
export default {
    name:"otherHistoryRecord",
    data(){
        return{
           tableData4: [],
            search:"",
            dialogVisible :false,
            fileList: [],
            currentPage4: 1,
            sizeRange:5
        }
        
        
    },
    components:{
        condition
    },
    methods:{
        initTable(){
            let _self = this;
            let loading = _self.$loading({
                lock: true,
                text: '获取记录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$ajax.get(_self.baseUrl + "/OtherRecord/OtherLeaveRecordHistory",{           
                params:{post:localStorage.post},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                loading.close();
                _self.tableData4 = JSON.parse(response.data);   
            }).catch(function(error){
                loading.close();
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '连接服务器失败'
                });
            });
        },
        handleSizeChange(val) {
            this.sizeRange = val;
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
        },
        handleEdit(index, row) {
            let type = row.LeaveRecordCategory
            if(type == "上课请假"){
                 this.$alert(`类型：上课请假<br>
                                事由：${row.LeaveRecordReason}，需请假${row.LeaveRecordSumLesson}节课。<br/>
                                请假时间：${moment(row.LeaveRecordStartTime).format('YYYY-MM-DD')}到${moment(row.LeaveRecordEndtTime).format('YYYY-MM-DD')}<br/>
                                请假人：${row.StudentName}<br/>
                                联系电话：${row.StudentTel}<br/>
                                寝室号：${row.StudentBedroomNum}<br/>
                                班级：${row.LeaveRecordClassNum}<br/>
                                审核结果：${row.LeaveRecordApprovalResult}`, '查看详情', {
                    dangerouslyUseHTMLString: true
                });
            }else{
                this.$alert(`类型：${type}<br>
                                事由：${row.LeaveRecordReason}，需请假${row.LeaveRecordNumDays}天。<br/>
                                请假时间：${moment(row.LeaveRecordStartTime).format('YYYY-MM-DD')}到${moment(row.LeaveRecordEndtTime).format('YYYY-MM-DD')}<br/>
                                请假人：${row.StudentName}<br/>
                                联系电话：${row.StudentTel}<br/>
                                寝室号：${row.StudentBedroomNum}<br/>
                                班级：${row.LeaveRecordClassNum}<br/>
                                审核结果：${row.LeaveRecordApprovalResult}`, '查看详情', {
                    dangerouslyUseHTMLString: true
                });
            }
           
            console.log(index, row);
        },
        receiveData(val){
            let _self = this;
            let startT = "";
            let endT = "";
            if(val.Time.length != 0){
                startT = val.Time[0];
                endT = val.Time[1];
            }
            let loading = _self.$loading({
                lock: true,
                text: '获取记录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$ajax.get(_self.baseUrl + "/OtherRecord/getLeaveInfoBycon",{           
                params:{
                    start:startT,
                    end:endT,
                    College:val.College,
                    Specialty:val.Specialty,
                    grade:val.grade,
                    class1:val.Class,
                    Sex:val.Sex,
                    LeaveRecordCategory:val.LeaveRecordCategory,
                    post:localStorage.post,
                },
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                loading.close();
                 _self.tableData4 = JSON.parse(response.data); 
                 console.log(response.data);  
            }).catch(function(error){
                loading.close();
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '查询失败'
                });
            });
        }
       

    },
    computed:{
        updateTable(){
            let search = this.search;
            if(search){
                return this.tableData4.filter(data => {
                    return Object.keys(data).some(key => {
                        return String(data[key]).toLowerCase().indexOf(search) > -1
                    })
            })
            }
            return this.tableData4
        }
    },
    mounted(){
        this.initTable();
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
.table{
    margin-top: 40px;
    padding:10px 20px 10px 20px;
}
</style>