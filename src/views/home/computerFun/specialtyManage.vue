<template>
    <div class="wa_content">
       <mt-header title="专业管理">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div class="tabBar">
            <mu-button flat color="success" @click="openTip">添加专业</mu-button>
            <mu-button flat color="success" @click="download">学院专业命名规则</mu-button>
            <el-dialog
                title="添加专业"
                :visible.sync="dialogVisible"
                width="30%">
                <el-form ref="form" label-width="100px">
                    <el-form-item label="学院名称">
                        <el-select v-model="College" placeholder="请选择学院">
                            <el-option value="17" label="农业与生物技术学院"></el-option>
                            <el-option value="18" label="园林与水利工程学院"></el-option>
                            <el-option value="19" label="动物科学学院"></el-option>
                            <el-option value="20" label="经贸管理学院"></el-option>
                            <el-option value="21" label="信息技术学院"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业名称">
                        <el-input v-model="addSpecialityName"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="专业编号">
                        <el-input v-model="addSpecialityID" placeholder="请输入正确的编号" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>                
                <span slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="addSpecialityID = '';addSpecialityName='';College='';dialogVisible=false;">取消</el-button>
                    <el-button type="primary" :disabled="Number(addSpecialityID).toString() == 'NaN' || addSpecialityID == '' || addSpecialityName == '' || College == ''" @click="insertSpe">添加</el-button>
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
                prop="SpecialtyID"
                label="编号">
                </el-table-column>
                <el-table-column
                prop="CollegeName"
                label="学院名称">
                </el-table-column>
                <el-table-column
                prop="SpecialtyName"
                label="专业名称">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="deleteSpe(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>            
            </el-table>
            <pagination @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange' :test='test'/>
        </div>
            
    </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
export default {
    name:"classManage",
    data(){
        return{
            tableData4: [],
            search:"",
            dialogVisible :false,
            currentPage4: 1,
            sizeRange:5,
            College:"",
            addSpecialityName:"",
            addSpecialityID:"",
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
            this.$ajax.get(_self.baseUrl + "/BelongManagement/selectSpecialty",{           
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
        download(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/BelongManagement/downloadNamingRules",{           
                params:{},
                responseType:"blob"
            }).then(function(response){
                let data = response.data;
                console.log(data);
                var elink = document.createElement('a');
                elink.download = "学院专业编号命名规则.docx";
                elink.style.display = 'none';
                var blob = new Blob([data]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink); 
            }).catch(function(error){
                _self.$notify.error({
                    title: '错误',
                    message: '连接服务器失败!'
                });
            });
        },
        handleSizeChange(val) {
            this.sizeRange = val;
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
        },
        openTip(){
            let _self = this;
            this.$confirm('请严格遵照“学院专业命名规则”文档进行专业的添加!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.dialogVisible = true;
            }).catch(() => {
        
            });
        },
        deleteSpe(index,row){
            let _self = this;
             this.$confirm(`确认删除 ${row.SpecialtyName} ?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     _self.$ajax.get(_self.baseUrl + "/BelongManagement/deleteSpecialty",{           
                        params:{SpecialtyID:row.SpecialtyID,SpecialtyNum:row.SpecialtyNum},
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
                                message: '专业已删除'
                            });
                        }else if(data == -1){
                            _self.$notify.error({
                                duration:2000,
                                title: '失败',
                                message: '删除失败,专业存在关联'
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
        insertSpe(){
            let _self = this;
            _self.$ajax.get(_self.baseUrl + "/BelongManagement/addSpecialty",{           
                params:{
                    collegeID:_self.College,
                    ClassSpecialityName:_self.addSpecialityName,
                    ClassSpecialityID:_self.addSpecialityID
                },
                headers: {
                    'token': localStorage.token
                }
            }).then(function(response){
                let data = response.data;
                _self.dialogVisible = false;
                if(data == "6"){
                    _self.$notify.error({
                        duration:2000,
                        title: '失败',
                        message: '专业编号已存在'
                    });
                }else if(data == "2"){
                    _self.$notify.error({
                        duration:2000,
                        title: '失败',
                        message: '专业名称已存在'
                    });
                }else if(data == "5"){
                    _self.Colege = '';
                    _self.addSpecialityName = '';
                    _self.addSpecialityID = '';
                     _self.$notify.success({
                        duration:2000,
                        title: '成功',
                        message: '添加成功'
                    });
                    _self.initTable();
                }else if(data == "3"){
                     _self.$notify.error({
                        duration:2000,
                        title: '失败',
                        message: '添加失败'
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