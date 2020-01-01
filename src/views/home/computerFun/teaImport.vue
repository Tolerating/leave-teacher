<template>
    <div class="wa_content">
       <mt-header title="教师数据导入">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div class="tabBar">
            <mu-button flat color="success" @click="dialogVisible = true">教师数据导入</mu-button>
            <mu-button flat color="success" @click="download">Excel模板下载</mu-button>
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
                <el-upload
                    ref="upload"
                    action
                    :limit="1"
                    :file-list="fileList"
                    accept=".xls,.xlsx"
                    :auto-upload="false"
                    :on-change="changed">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                </el-upload>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
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
                prop="TeacherNum"
                label="工号">
                </el-table-column>
                <el-table-column
                prop="TeacherName"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="Post"
                label="职称">
                </el-table-column>
                <el-table-column
                prop="TeacherTel"
                label="联系方式"
                >
                </el-table-column>
                <el-table-column
                prop="TeacherApprovalResult"
                label="审核状态"
                >
                </el-table-column>            
            </el-table>
            <pagination @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange' :test='test'/>
        </div>
            
    </div>
</template>

<script>
import XLSX from 'xlsx'
import qs from 'qs'
import pagination from '@/components/pagination.vue'
export default {
    name:"teaImport",
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
        pagination
    },
    methods:{
        initTable(){
            let _self = this;
            let loading = _self.$loading({
                lock: true,
                text: '获取教师信息...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$ajax.get(_self.baseUrl + "/Import/selectTeacherAll",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                loading.close();
                let data = response.data;
                console.log(data);
                _self.tableData4 = JSON.parse(data);
                if(response.data == "未登录"){
                    localStorage.isLogin = false;
                    _self.$router.push("/login");
                }    
            }).catch(function(error){
                loading.close();
                _self.$notify.error({
                    title: '错误',
                    message: '连接服务器失败!'
                });
            });
        },
        download(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/Import/StudentExcel",{           
                params:{
                    ExcelType:"T"
                },
                responseType:"blob"
            }).then(function(response){
                let data = response.data;
                console.log(data);
                var elink = document.createElement('a');
                elink.download = "ExcleTeacher.xls";
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
        submitUpload() {
            let _self = this;
            // console.log(this.$refs.upload);
            // this.$refs.upload.submit();
            var file = this.fileList[0];
            // console.log(file);
            if (file.name != "") {
                this.$confirm('确认上传?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let loading = _self.$loading({
                        lock: true,
                        text: '上传中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let persons = [];  //存储获取到的数据
                    let fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        let data = e.target.result,
                        workbook = XLSX.read(data, {
                            type: 'binary'
                        }); 
                        // 读取表Sheet1
                        workbook.Sheets.Sheet1.A1.w = "TeacherNum";
                        workbook.Sheets.Sheet1.B1.w = "TeacherPass";
                        workbook.Sheets.Sheet1.C1.w = "TeacherName";
                        workbook.Sheets.Sheet1.D1.w = "TeacherSex";
                        workbook.Sheets.Sheet1.E1.w = "TeacherTel";
                        workbook.Sheets.Sheet1.F1.w = "Post";
                        workbook.Sheets.Sheet1.G1.w = "TeacherIDCard";
                        persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1));                      
                        _self.$ajax.post(_self.baseUrl + "/Import/importTeacher",{           
                            Data:persons,
                        },{
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            transformRequest: [function (data) {
                                data = qs.stringify(data);
                                return data;
                            }],
                        }).then(function(response){
                            loading.close();
                            let data = response.data;
                            _self.fileList = [];
                            if(data.length != 0){
                                _self.$alert(`工号为 <strong><i>${data.toString()}</i></strong> 的教师已注册该系统<br>其余教师信息导入成功,请刷新页面以获取最新信息`, '提示', {
                                    dangerouslyUseHTMLString: true
                                });
                            }else{
                                _self.$notify({
                                    title: '成功',
                                    message: '教师信息导入成功!请刷新页面以获取最新信息',
                                     type: 'success'
                                });
                            }
                        }).catch(function(error){
                            loading.close();
                            _self.fileList = [];
                            // console.log("axios"+error);
                            _self.$notify.error({
                                title: '失败',
                                message: '请刷新页面重试!'
                            });
                        });
                    }
                    fileReader.readAsBinaryString(file);   
                }).catch(() => {
                    _self.fileList = [];
                    _self.$message({
                        type: 'info',
                        message: '已取消导入'
                    });  
                    
                            
                });
            }
        },
        changed(file,fileList){
            this.fileList[0] = file.raw;
        },
        handleSizeChange(val) {
            this.sizeRange = val;
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
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