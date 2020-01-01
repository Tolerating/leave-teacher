<template>
    <div class="wa_content">
       <mt-header title="学院管理">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
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
                :data="test.slice((currentPage4-1)*sizeRange,currentPage4*sizeRange)"
                style="width: 100%"
                size="medium"
                >
                <el-table-column
                fixed
                prop="Num"
                label="编号">
                </el-table-column>
                <el-table-column
                prop="CollegeNum"
                label="学院编号">
                </el-table-column>
                <el-table-column
                prop="CollegeName"
                label="名称">
                </el-table-column>
                <el-table-column
                prop="TeacherName"
                label="院领导">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button plain @click="toView(scope.$index, scope.row)">查看</el-button> -->
                        <el-button type="primary" plain @click="row = scope.row;CollegeTeacher = '';CollegeName = '';editDialog = true;">编辑</el-button>
                        <el-button type="danger" plain @click="deleteCollege(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>            
            </el-table>
            <pagination @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange' :test='test'/>
        </div>
        <el-dialog
            title="编辑学院"
            :visible.sync="editDialog"
            :close-on-click-modal="false"
            width="30%">
            <el-form ref="form" label-width="100px">
                <el-form-item label="系统编号：">
                    {{row.Num}}
                </el-form-item>
                <el-form-item label="学院编号：">
                    {{row.CollegeNum}}
                </el-form-item>
                <el-form-item label="学院名称：">
                    <el-input
                        prefix-icon="el-icon-search"
                        v-model="CollegeName"
                        >                    
                    </el-input>      
                </el-form-item>
                <el-form-item label="院领导：">
                    <el-select v-model="CollegeTeacher" ref="CollegeTeacher" placeholder="请选择">
                        <el-option value="1000" label="暂无领导"></el-option>
                        <el-option
                        v-for="item in objCollegeTeacher"
                        :key="item.TeacherID"
                        :label="item.TeacherName"
                        :value="item.TeacherID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="CollegeTeacher = '';CollegeName = '';editDialog = false,row = {}">取 消</el-button>
                <el-button type="primary" :disabled="CollegeTeacher == '' || CollegeName == ''" @click="edit">完 成</el-button>
            </span>
        </el-dialog>    
    </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
export default {
    name:"collegeManage",
    data(){
        return{
            tableData4: [],
            search:"",
            editDialog :false,
            fileList: [],
            currentPage4: 1,
            sizeRange:5,
            row:{},
            CollegeName:"",
            CollegeTeacher:"",
            objCollegeTeacher:[]
        }       
        
    },
    components:{
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
            this.$ajax.get(_self.baseUrl + "/BelongManagement/CollegeManagerInfo",{           
                params:{},
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
        getCollegeTeacher(){
            let _self = this;
             this.$ajax.get(_self.baseUrl + "/BelongManagement/CollegeBossInfo",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                _self.objCollegeTeacher = JSON.parse(response.data);   
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '连接服务器失败'
                });
            });
        },
        edit(){
            let _self = this;
            let TeacherName = this.$refs.CollegeTeacher.selected.$el.innerText;
             this.$ajax.get(_self.baseUrl + "/BelongManagement/UpdateCollegeInfo",{           
                params:{
                    CollegeID:_self.Num,
                    CollegeName:_self.CollegeName,
                    TeacherNum:_self.CollegeTeacher
                },
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                let data = response.data;
                if(data == "0"){
                    _self.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '该院领导以是其他学院院领导，不可重复'
                    });
                }else if(data == "1"){
                    _self.editDialog = false;
                    _self.row.CollegeName = _self.CollegeName;
                    _self.row.TeacherName = TeacherName;
                     _self.$notify.success({
                        duration:2000,
                        title: '成功',
                        message: '修改成功'
                    });
                }else{
                     _self.$notify.error({
                        duration:2000,
                        title: '失败',
                        message: '修改失败'
                    });
                }
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '连接服务器失败'
                });
            });
        },
        deleteCollege(index,row){
            let _self = this;
             this.$confirm(`确认删除 ${row.CollegeName} ?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     _self.$ajax.get(_self.baseUrl + "/BelongManagement/CollegeDelete",{           
                        params:{CollegeNum:row.Num},
                        headers: {
                            'token': localStorage.token
                            }
                    }).then(function(response){
                        let data = response.data;
                        if(data == "1"){
                            _self.tableData4.splice(_self.tableData4.indexOf(row),1);
                            _self.$notify.success({
                                duration:2000,
                                title: '成功',
                                message: '学院已删除'
                            });                            
                        }else if(data == '0'){
                            _self.$notify.error({
                                duration:2000,
                                title: '失败',
                                message: '删除失败，该院级信息存在关联！'
                            });
                        }else{
                            _self.$notify.error({
                                duration:2000,
                                title: '失败',
                                message: '删除失败，请稍后再试！'
                            });
                        }                        
                    }).catch(function(error){
                        _self.$notify.error({
                            duration:2000,
                            title: '错误',
                            message: '连接服务器失败'
                        });
                    });
                }).catch(() => {

                });
        }
    },
    computed:{
        test(){
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
        this.getCollegeTeacher();
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