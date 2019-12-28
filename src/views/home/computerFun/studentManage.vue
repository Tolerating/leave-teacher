<template>
    <div class="wa_content">
       <mt-header title="学生管理">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <condition @conditionData="receiveData" :showTime="false"></condition>
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
                prop="StudentNum"
                label="学号">
                </el-table-column>
                <el-table-column
                prop="StudentName"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="Sex"
                label="性别">
                </el-table-column>
                <el-table-column
                prop="CollegeName"
                label="学院">
                </el-table-column>
                <el-table-column
                prop="ClassName"
                label="班级">
                </el-table-column>
                <el-table-column
                prop="StudentParentTel"
                label="联系方式">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="300">
                    <template slot-scope="scope">
                        <el-button plain @click="toView(scope.$index, scope.row)">查看</el-button>
                        <el-button type="primary" plain @click="edit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" plain @click="deleteStudent(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>            
            </el-table>
            <el-row>
                <el-col :span="10" :push="14">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[5,10, 25, 50, 100]"
                        :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="test.length">
                    </el-pagination>
                </el-col>
            </el-row>
            
        </div>
        <el-dialog
            title="编辑学生信息"
            :visible.sync="editDialog"
            :close-on-click-modal="false"
            width="30%">
            <el-form ref="form" label-width="120px">
                <el-form-item label="学号：">
                    {{studentNum}}  
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input
                        v-model="studentName"
                        >                    
                    </el-input>
                </el-form-item>
                <el-form-item label="性别：">
                    <el-select v-model="studnetSex" placeholder="请选择">
                        <el-option value="男" label="男"></el-option>
                        <el-option value="女" label="女"></el-option>
                    </el-select>      
                </el-form-item>
                <el-form-item label="班级：">
                    <el-select v-model="studnetClass" ref="studentClass" placeholder="请选择">
                        <el-option
                            v-for="item in objClass"
                            :key="item.ClassNum"
                            :value="item.ClassNum"
                            :label="item.ClassName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="寝室号：">
                    <el-input
                        v-model="bedroomNum"
                        >                    
                    </el-input>      
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input
                        v-model="tel"
                        @change="checkPhone(1)"
                        >                    
                    </el-input>      
                </el-form-item>
                <el-form-item label="父母联系方式：">
                    <el-input
                        v-model="parentTel"
                        @change="checkPhone(2)"
                        >                    
                    </el-input>      
                </el-form-item>
                <el-form-item label="身份证：">
                    <el-input
                        v-model="IDCard"
                        >                    
                    </el-input>      
                </el-form-item>
                <el-form-item label="家庭住址：">
                    <el-input
                        v-model="address"
                        >                    
                    </el-input>      
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="editDialog = false,row = {}">取 消</el-button>
                <el-button type="primary" :disabled="studentName == '' || bedroomNum == '' || tel == '' || parentTel == '' || IDCard == '' || address == ''" @click="updateStudent">完 成</el-button>
            </span>
        </el-dialog>   
            
    </div>
</template>

<script>
import qs from 'qs'
import condition from "@/components/retrievalCondition.vue"
export default {
    name:"studentManage",
    data(){
        return{
           tableData4: [],
           objClass:[],
           row:{},
            search:"",
            editDialog :false,
            currentPage4: 1,
            sizeRange:5,
            studentNum:"",
            studentName:"",
            studnetSex:"",
            studnetClass:"",
            bedroomNum:"",
            tel:"",
            parentTel:"",
            IDCard:"",
            address:""
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
                text: '获取信息中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$ajax.get(_self.baseUrl + "/UserManagement/StudentInfoAll",{           
                params:{
                    College:"0",
                    Specialty:"0",
                    grade:"0",
                    class1:"0",
                    Sex:"0"
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
        getClass(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/TeacherAudit/getClassNum",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                _self.objClass = JSON.parse(response.data);   
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '连接服务器失败'
                });
            });
        },
        checkPhone: function (tp) {
            let reg = /^0?(13|15|17|18|14)[0-9]{9}$/;
            if (tp == 1) {
                if (!reg.test(this.editStuTel)) {
                    this.$message({
                        message: '请输入正确的手机号！',
                        type: 'warning'
                    });
                    this.tel = "";
                }
            } else if (tp == 2) {
                if (!reg.test(this.editStuParentTel)) {
                    this.$message({
                        message: '请输入正确的手机号！',
                        type: 'warning'
                    });
                    this.parentTel = "";
                }
            }

        },
        handleSizeChange(val) {
            this.sizeRange = val;
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
        },
        receiveData(val){
            console.log(val);
            let _self = this;
            let loading = _self.$loading({
                lock: true,
                text: '获取记录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$ajax.get(_self.baseUrl + "/UserManagement/StudentInfoAll",{           
                params:{
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
                //  console.log(response.data);  
            }).catch(function(error){
                loading.close();
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '查询失败'
                });
            });
        },
        toView(index,row){
             this.$alert(`
                学号：${row.StudentNum}<br/>
                姓名：${row.StudentName}<br/>
                性别：${row.Sex}<br/>
                学院：${row.CollegeName}<br/>
                班级：${row.ClassName}<br/>
                联系方式：${row.Tel}<br/>
                父母联系方式：${row.StudentParentTel}<br/>
                身份证：${row.IDCode}<br/>
                寝室号：${row.bedroom}<br/>
                家庭住址：${row.Address}`, '查看详情', {
                dangerouslyUseHTMLString: true
            });
        },
        deleteStudent(index,row){
            let _self = this;
            this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     _self.$ajax.get(_self.baseUrl + "/UserManagement/DelectStudentone",{           
                        params:{StudentNum:row.StudentNum},
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
                                message: '已删除该学生'
                            });
                        }else{
                            _self.$notify.error({
                                duration:2000,
                                title: '失败',
                                message: '删除失败'
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
        },
        edit(index,row){
            this.studentNum = row.StudentNum;
            this.studentName = row.StudentName;
            this.studnetSex = row.Sex;
            this.studnetClass = row.ClassNum;
            this.bedroomNum = row.bedroom;
            this.tel = row.Tel;
            this.parentTel = row.StudentParentTel;
            this.IDCard = row.IDCode;
            this.address = row.Address;
            this.row = row;
            this.editDialog = true;
        },
        updateStudent(){
            let _self = this;
            let className = this.$refs.studentClass.selected.$el.innerText;
            this.$ajax.post(_self.baseUrl + "/UserManagement/UpdateStudent",{           
                StudentID:_self.studentNum,
                StudentName:_self.studentName,
                StudentSex:_self.studnetSex,
                StudentClassID:_self.studnetClass,
                StudentTel:_self.tel,
                StudentCode:_self.IDCard,
                StudentAddress:_self.address,
                StudentParentTel:_self.parentTel,
                bedroomNum:_self.bedroomNum
            },{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                transformRequest: [function (data) {
                    data = qs.stringify(data);
                    return data;
                }],
            }).then(function(response){
                let data = response.data;
                _self.editDialog = false;
                if(data == "1"){ 
                    _self.row.StudentName = _self.studentName;
                    _self.row.Sex = _self.studnetSex;
                    _self.row.ClassName = className;
                    _self.row.Tel = _self.tel;
                    _self.row.StudentParentTel = _self.parentTel;
                    _self.row.IDCode = _self.IDCard;
                    _self.row.Address = _self.address;
                    _self.$notify.success({
                        duration:2000,
                        title: '成功',
                        message: '修改成功'
                    });
                }else{
                    _self.$notify.error({
                        duration:2000,
                        title: '错误',
                        message: '修改失败'
                    });
                }
                
            }).catch(function(error){
                console.log(error);
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '连接服务器失败'
                });
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
        this.getClass();
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