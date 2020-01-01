<template>
    <div class="wa_content">
       <mt-header title="晚归记录">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <condition @conditionData="receiveData"></condition>
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
                prop="StudentNum"
                label="学号">
                </el-table-column>
                <el-table-column
                prop="StudentName"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="ClassName"
                label="班级">
                </el-table-column>
                <el-table-column
                prop="DelayTime"
                label="请假时间"
                >
                </el-table-column>
                <el-table-column
                prop="DelayStudentT"
                label="晚归时间"
                >
                </el-table-column>
                <el-table-column
                prop="DeatReson"
                label="请假理由"
                >
                </el-table-column>                        
            </el-table>
            <pagination @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange' :test='updateTable'/>
        </div>
            
    </div>
</template>

<script>
import condition from "@/components/retrievalCondition.vue"
import pagination from '@/components/pagination.vue'
export default {
    name:"lateRecord",
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
        condition,
        pagination
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
            this.$ajax.get(_self.baseUrl + "/ArriveEarly/AdvanceSelect",{           
                params:{
                    post:localStorage.post,
                    numone:"2"
                },
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
            // console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
            // console.log(this.currentPage4);
            // console.log(`当前页: ${val}`);
        },
        handleEdit(index, row) {
            
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
            this.$ajax.get(_self.baseUrl + "/ArriveEarly/searchLeaveDelay",{           
                params:{
                    start:startT,
                    end:endT,
                    College:val.College,
                    Specialty:val.Specialty,
                    grade:val.grade,
                    class1:val.Class,
                    Sex:val.Sex,
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