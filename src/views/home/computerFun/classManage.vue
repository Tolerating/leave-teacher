<template>
    <div class="wa_content">
       <mt-header title="班级管理">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div class="tabBar">
            <mu-button flat color="success" @click="dialogVisible = true">添加班级</mu-button>
            <el-dialog
                title="添加班级"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                width="30%">
                <el-form ref="form" label-width="100px">
                    <el-form-item label="学院名称：">
                        <el-select v-model="College" ref="College" placeholder="请选择">
                            <el-option
                            v-for="item in objCollege"
                            :key="(Number)(item.CollegeNum)"
                            :label="item.CollegeName"
                            :value="item.CollegeNum">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业名称：">
                        <el-select v-model="Specialty" ref="Specialty" placeholder="请选择">
                            <el-option
                            v-for="item in getSpecialtyBycollege"
                            :key="item.SpecialtyNum"
                            :label="item.SpecialtyName"
                            :value="item.SpecialtyNum">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属年级：">
                        <el-select v-model="grade" ref="grade"  placeholder="请选择">
                            <el-option
                            v-for="item in getYear()" 
                            :key="item.grade" 
                            :value="item.grade"
                            :label="item.content">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级号：">
                        <el-select v-model="Class" placeholder="请选择班级号">
                            <el-option 
                            v-for="item in 10"
                            :key="item"
                            :value="item"
                            :label="item+'班'"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班主任：">
                        <el-select v-model="classHeadTeacherID" placeholder="请选择">
                            <el-option
                            v-for="item in objClassHeadTeacher"
                            :key="item.TeacherNum"
                            :label="item.TeacherName"
                            :value="item.TeacherNum">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="辅导员：">
                        <el-select v-model="classSpeTeacherID"  placeholder="请选择">
                            <el-option
                            v-for="item in objClassSpeTeacher"
                            :key="item.TeacherNum"
                            :label="item.TeacherName"
                            :value="item.TeacherNum">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="cancelDialog">取 消</el-button>
                    <el-button type="primary" :disabled="grade == '' || Class == '' || classHeadTeacherID == '' || classSpeTeacherID == ''" @click="addClass">添 加</el-button>
                </span>
            </el-dialog>        
        </div>
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
                prop="ClassNum"
                label="班级编号">
                </el-table-column>
                <el-table-column
                prop="SpecialtyName"
                label="专业名称">
                </el-table-column>
                <el-table-column
                prop="ClassName"
                label="班级名称">
                </el-table-column>
                <el-table-column
                prop="classTeacherName"
                label="班主任姓名"
                >
                </el-table-column>
                <el-table-column
                prop="ClassHeadTeacherID"
                label="班主任工号"
                >
                </el-table-column>
                <el-table-column
                prop="speTeacherName"
                label="辅导员姓名"
                >
                </el-table-column>
                <el-table-column
                prop="ClassSpecialityTeacherID"
                label="辅导员工号"
                >
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" plain @click="editClass(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" plain @click="deleteClass(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>            
            </el-table>
            <pagination @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange' :test='test'/>
        </div>
        <el-dialog
            title="编辑班级"
            :visible.sync="editDialog"
            :close-on-click-modal="false"
            width="30%">
            <el-form ref="form" label-width="100px">
                <el-form-item label="编号：">
                    {{row.ClassID}}
                </el-form-item>
                <el-form-item label="专业名称：">
                    {{row.SpecialtyName}}
                </el-form-item>
                <el-form-item label="班级名称：">
                    {{row.ClassName}}
                </el-form-item>
                <el-form-item label="班主任：">
                    <el-select v-model="classHeadTeacherID" ref="HeadTeacher" placeholder="请选择">
                        <el-option
                        v-for="item in objClassHeadTeacher"
                        :key="item.TeacherNum"
                        :label="item.TeacherName"
                        :value="item.TeacherNum">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="辅导员：">
                    <el-select v-model="classSpeTeacherID" ref="SpeTeacher" placeholder="请选择">
                        <el-option
                        v-for="item in objClassSpeTeacher"
                        :key="item.TeacherNum"
                        :label="item.TeacherName"
                        :value="item.TeacherNum">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="classHeadTeacherID = '';classSpeTeacherID = '';editDialog = false,row = {}">取 消</el-button>
                <el-button type="primary" :disabled="classHeadTeacherID == '' || classSpeTeacherID == ''" @click="updateClass">完 成</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import qs from 'qs'
export default {
    name:"classManage",
    data(){
        return{
           tableData4: [],
            search:"",
            dialogVisible :false,
            editDialog:false,
            fileList: [],
            currentPage4: 1,
            sizeRange:5,
            College:"21",
            Specialty:"2101",
            grade:"",
            Class:"",
            classHeadTeacherID:"",
            classSpeTeacherID:"",
            Post:localStorage.post,
            teaInfo:localStorage.teaInfo,
            objCollege: [],
            objSpecialty: [],
            objClass: [],
            objClassHeadTeacher: [],
            objClassSpeTeacher: [],
            row:{},
            rowIndex:""

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
            this.$ajax.get(_self.baseUrl + "/BelongManagement/selectClass",{           
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
        cancelDialog(){
            this.grade = "";
            this.Class = "";
            this.classHeadTeacherID = "";
            this.classSpeTeacherID = "";
            this.dialogVisible = false;
        },
        addClass(){
            let _self = this;
            let speSelect = this.$refs.Specialty;
            console.log(speSelect.selected.$el.innerText);
            let ClassNum = this.Specialty + this.grade + this.Class;
            let ClassName = speSelect.selected.$el.innerText + this.grade + "-" + this.Class;
             _self.$ajax.post(_self.baseUrl + "/BelongManagement/insertClass",{           
                ClassHeadTeacherID:_self.classHeadTeacherID,
                speTeacherID:_self.classSpeTeacherID,
                ClassNum:ClassNum,
                ClassName:ClassName,
                ClassSpecialityID:_self.Specialty
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
                _self.dialogVisible = false;
                if (data == "1") {
                     _self.$notify.success({
                        title: '成功',
                        message: '添加班级成功!'
                    });
                    _self.initTable();
                }
                else if (data == "-4") {
                     _self.$notify.error({
                        title: '失败',
                        message: '该班级已注册!'
                    });
                }
                else if (data == "-3") {
                    _self.$notify.error({
                        title: '失败',
                        message: '班主任已注册其他班级!'
                    });
                }
                else if (data == "-2") {
                    _self.$notify.error({
                        title: '失败',
                        message: '教师工号不存在!'
                    });
                }
                else if (data == "-1") {
                     _self.$notify.error({
                        title: '失败',
                        message: '添加失败!'
                    });
                }
            }).catch(function(error){
                _self.$notify.error({
                    title: '失败',
                    message: '添加失败!'
                });
            });


            
        },
        editClass(index,row){
            this.row = row;
            this.classHeadTeacherID = "";
            this.classSpeTeacherID = "";
            this.rowIndex = index;
            this.editDialog = true;
        },
        deleteClass(index,row){
            let _self = this;
             this.$confirm(`确认删除 ${row.ClassName} ?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     _self.$ajax.get(_self.baseUrl + "/BelongManagement/deleteClass",{           
                        params:{ClassID:row.ClassID},
                        headers: {
                            'token': localStorage.token
                            }
                    }).then(function(response){
                        let data = response.data;
                        if(data > 0){
                            _self.tableData4.splice(_self.tableData4.indexOf(row),1);
                            _self.$notify.success({
                                duration:2000,
                                title: '成功',
                                message: '班级已删除'
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
        updateClass(){
            let _self = this;
            let headTeacherName = this.$refs.HeadTeacher.selected.$el.innerText;
            let specialtyTeacherName = this.$refs.SpeTeacher.selected.$el.innerText;
            console.log(headTeacherName);
            this.$ajax.get(_self.baseUrl + "/BelongManagement/updateClass",{           
                params:{
                    ClassHeadTeacherID:_self.classHeadTeacherID,
                    ClassHeadTeacherName:headTeacherName,
                    ClassSpeTeacherID:_self.classSpeTeacherID,
                    ClassID:_self.row.ClassID
                },
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                let data = response.data;
                _self.editDialog = false;
                if(data.result == "0"){
                    _self.row.classTeacherName = headTeacherName;
                    _self.row.ClassHeadTeacherID = _self.classHeadTeacherID;
                    _self.row.ClassSpecialityTeacherID = _self.classSpeTeacherID;
                    _self.row.speTeacherName = specialtyTeacherName;
                    _self.$notify.success({
                        duration:2000,
                        title: '成功',
                        message: '修改成功'
                    });

                }else{
                    if(data.result == "-1"){
                        _self.$notify.error({
                            duration:2000,
                            title: '失败',
                            message: '修改失败'
                        });
                    }else{
                        _self.$notify.error({
                            duration:2000,
                            title: '失败',
                            message: data.message
                        });
                    }
                }  
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '连接服务器失败'
                });
            });
        },
        getCollege(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/TeacherAudit/getCollegesm",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                 _self.objCollege = JSON.parse(response.data);   
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '获取学院信息失败'
                });
            });

        },
        getSpecialty(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/TeacherAudit/getSpecialtysm",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                 _self.objSpecialty = JSON.parse(response.data); 
                 console.log(response.data);  
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '获取专业信息失败'
                });
            });
            
        },
        getYear: function () {
            var date = new Date();
            var year = date.getFullYear().toString().substr(2, 2);
            var month = date.getMonth() + 1;
            var array = [];
            if (month > 8) {
                for (var i = 0; i < 3; i++) {
                    array[i] = { grade: (year - i).toString(), content:"所属年级:"+(year - i) }
                }
            } else {
                for (var i = 0; i < 3; i++) {
                    array[i] = { grade: (year - (i + 1)).toString(), content:"所属年级:"+ (year - (i + 1)) }
                }
            }
            return array.reverse();

        },
        getClassHeadTeacher(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/BelongManagement/SelectTeacherInfoClass",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                console.log(response.data);
                _self.objClassHeadTeacher = JSON.parse(response.data);   
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '连接服务器失败'
                });
            });
        },
        getClassSpeTeacher(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/BelongManagement/SelectTeacherInfoSpe",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                _self.objClassSpeTeacher = JSON.parse(response.data);   
            }).catch(function(error){
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
            let table = this.tableData4;
            if(search){
                return table.filter(data => {
                    return Object.keys(data).some(key => {
                        return String(data[key]).toLowerCase().indexOf(search) > -1
                    })
                })
            }
            return table
        },
        getSpecialtyBycollege: function () {        //根据学院筛选专业
            // this.Specialty = "0";
            var Spe = [];
            var num = 0;
            for (var i = 0; i < this.objSpecialty.length; i++) {
                if (this.objSpecialty[i].SpecialtyCollegeID == this.College) {
                    Spe[num] = { SpecialtyName: this.objSpecialty[i].SpecialtyName, SpecialtyNum: this.objSpecialty[i].SpecialtyNum };
                    num++;
                }
            }
            if(num != 0){
                this.Specialty = Spe[0].SpecialtyNum.toString();
            }
            
            num = 0;
            return Spe;
        },
    },
    mounted(){
        this.initTable();
        this.getCollege();
        this.getSpecialty();
        this.getClassHeadTeacher();
        this.getClassSpeTeacher();
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