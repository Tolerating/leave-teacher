<template>
    <div class="wa_content">
       <mt-header title="教师管理">
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
                prop="TeacherNum"
                label="工号">
                </el-table-column>
                <el-table-column
                prop="TeacherName"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="TeacherSex"
                label="性别">
                </el-table-column>
                <el-table-column
                prop="CollegeName"
                label="学院">
                </el-table-column>
                <el-table-column
                prop="Post"
                label="职称">
                </el-table-column>
                <el-table-column
                prop="TeacherTel"
                label="联系方式">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="300">
                    <template slot-scope="scope">
                        <el-button plain @click="toView(scope.$index, scope.row)">查看</el-button>
                        <el-button type="primary" plain @click="edit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" plain @click="deleteTeacher(scope.$index, scope.row)">删除</el-button>
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
            title="编辑教师信息"
            :visible.sync="editDialog"
            :close-on-click-modal="false"
            width="30%">
            <el-form ref="form" label-width="120px">
                <el-form-item label="工号：">
                    {{teacherNum}} 
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input
                        v-model="teacherName"
                        >                    
                    </el-input>
                </el-form-item>
                <el-form-item label="职称：">
                    {{teacherPost}}
                </el-form-item>
                <el-form-item label="性别：">
                    <el-select v-model="teacherSex" placeholder="请选择">
                        <el-option value="男" label="男"></el-option>
                        <el-option value="女" label="女"></el-option>
                    </el-select>      
                </el-form-item>
                <el-form-item label="学院：">
                    {{teacherCollege}}
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input
                        v-model="tel"
                        @change="checkPhone"
                        >                    
                    </el-input>      
                </el-form-item>
                <el-form-item label="身份证：">
                    <el-input
                        v-model="IDCard"
                        @change="checkIDCard"
                        >                    
                    </el-input>      
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="editDialog = false,row = {}">取 消</el-button>
                <el-button type="primary" :disabled="teacherName == '' || tel == '' || IDCard == ''" @click="updateTeacher">完 成</el-button>
            </span>
        </el-dialog>   
    </div>
</template>

<script>
import qs from 'qs'
export default {
    name:"teacherManage",
    data(){
        return{
            tableData4: [],
            row:{},
            editDialog :false,
            teacherNum:'',
            teacherName:'',
            teacherPost:'',
            teacherSex:'',
            teacherCollege:'',
            tel:'',
            IDCard:'',
            search:"",
            dialogVisible :false,
            currentPage4: 1,
            sizeRange:5,
        }
        
        
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
            this.$ajax.get(_self.baseUrl + "/UserManagement/TeacherInfoAll",{           
                params:{
                    
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
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
        },
        checkPhone() {
            let reg = /^0?(13|15|17|18|14)[0-9]{9}$/;
            if (!reg.test(this.editStuTel)) {
                _self.$notify.warning({
                    duration:2000,
                    title: '提示',
                    message: '请输入正确的手机号！'
                });
                this.tel = "";
            }         

        },
        checkIDCard() {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!reg.test(this.IDCard)) {
                 _self.$notify.warning({
                    duration:2000,
                    title: '提示',
                    message: '请输入正确的身份证号码！'
                });
                this.IDCard = "";
            }
        },
        toView(index,row){
             this.$alert(`
                工号：${row.TeacherNum}<br/>
                姓名：${row.TeacherName}<br/>
                性别：${row.TeacherSex}<br/>
                学院：${row.CollegeName}<br/>
                职称：${row.Post}<br/>
                联系方式：${row.TeacherTel}<br/>
                身份证：${row.TeacherIDCard}`, '查看详情', {
                dangerouslyUseHTMLString: true
            });
        },
        deleteTeacher(index,row){
            let _self = this;
            this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.$ajax.get(_self.baseUrl + "/UserManagement/DelectTeacherOne",{           
                    params:{
                        TeacherID:row.Num,
                        Post:row.Post
                    },
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
                            message: '已删除该教师'
                        });
                    }else if(data == "3"){
                        _self.$notify.error({
                            duration:2000,
                            title: '失败',
                            message: '删除失败，该教师信息存在关联！'
                        });
                    }else{
                        _self.$notify.error({
                            duration:2000,
                            title: '失败',
                            message: '删除失败请重试！'
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
            this.teacherNum = row.TeacherNum;
            this.teacherName = row.TeacherName;
            this.teacherPost = row.Post;
            this.teacherSex = row.TeacherSex;
            this.teacherCollege = row.CollegeName;
            this.tel = row.TeacherTel;
            this.IDCard = row.TeacherIDCard;
            this.row = row;
            this.editDialog = true;
        },
        updateTeacher(){
            let _self = this;
            this.$ajax.post(_self.baseUrl + "/UserManagement/UpdateTeacherInfo",{           
                TeacherID:_self.row.Num,
                TeacherNum:_self.teacherNum,
                TeacherName:_self.teacherName,
                TeacherSex:_self.teacherSex,
                TeacherTel:_self.tel,
                TeacherCode:_self.IDCard,
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
                    _self.row.TeacherName = _self.teacherName;
                    _self.row.teacherSex = _self.TeacherSex;
                    _self.row.TeacherTel = _self.tel;
                    _self.row.TeacherIDCard = _self.IDCard;
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