<template>
  <mu-expansion-panel>
        <div slot="header">检索条件</div>
        <el-row>
            <el-col :span="5" :push="2">
                <span class="selTitle">学院：</span>
                <el-select v-model="College" ref="College" :disabled="disCollege" placeholder="请选择">
                    <el-option value="0" label="所有学院"></el-option>
                    <el-option
                    v-for="item in objCollege"
                    :key="(Number)(item.CollegeNum)"
                    :label="item.CollegeName"
                    :value="item.CollegeNum">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5" :push="2">
                <span class="selTitle">专业：</span>
                <el-select v-model="Specialty" :disabled="disSpecialty" ref="Specialty" placeholder="请选择">
                    <el-option value="0" label="所有专业"></el-option>
                    <el-option
                    v-for="item in getSpecialtyBycollege"
                    :key="item.SpecialtyNum"
                    :label="item.SpecialtyName"
                    :value="item.SpecialtyNum">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5" :push="2">
                <span class="selTitle">年级：</span>
                <el-select v-model="grade" ref="grade" :disabled="disGrade" placeholder="请选择">
                    <el-option value="0" label="所有年级"></el-option>
                    <el-option
                    v-for="item in getYear()" 
                    :key="item.grade" 
                    :value="item.grade"
                    :label="item.content">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5" :push="2">
                <span class="selTitle">班级：</span>
                <el-select v-model="Class" ref="classes" :disabled="disClass" placeholder="请选择">
                    <el-option value="0" label="全部"></el-option>
                    <el-option
                    v-for="item in getClassID" 
                    :key="item.ClassNum" 
                    :value="item.ClassNum"
                    :label="item.ClassName">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5" :push="2">
                <span class="selTitle">性别：</span>
                <el-select v-model="Sex" placeholder="请选择">
                    <el-option value="0" label="全部"></el-option>
                    <el-option value="男" label="男"></el-option>
                    <el-option value="女" label="女"></el-option>
                </el-select>
            </el-col>
            <template v-if="otherRecord">
                <el-col :span="5" :push="2">
                    <span class="selTitle">类别：</span>
                    <el-select v-model="LeaveRecordCategory" placeholder="请选择">
                        <el-option value="0" label="所有类别"></el-option>
                        <el-option value="1" label="上课请假"></el-option>
                        <el-option value="2" label="不留宿请假"></el-option>
                        <el-option value="3" label="早自习请假"></el-option>                        
                    </el-select>
                </el-col>
            </template>
            <template v-if="dataStatistic">
                <el-col :span="6" :push="1">
                    <span class="selTitle">类别：</span>
                    <el-select v-model="LeaveRecordCategory" placeholder="请选择">
                        <el-option value="0" label="所有类别"></el-option>
                        <el-option value="1" label="上课请假"></el-option>
                        <el-option value="2" label="不留宿请假"></el-option>
                        <el-option value="3" label="早自习请假"></el-option>
                        <el-option value="4" label="周末请假"></el-option>
                        <el-option value="5" label="早出"></el-option>
                        <el-option value="6" label="晚归"></el-option>
                    </el-select>
                </el-col>
            </template>
            <el-col v-if="showTime" :span="7" :push="2">
                <span class="selTitle">时间：</span>
                <el-date-picker
                    v-model="Time"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    >
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5" :push="10">
                <el-button type="primary" plain @click="sendData">直接查询</el-button>
            </el-col>
        </el-row>
    </mu-expansion-panel>
</template>

<script>
export default {
    name:"retrievalCondition",
    data(){
        return{
            College:"0",
            Specialty:"0",
            grade:"0",
            Class:"0",
            Time:[],
            Sex:"0",
            LeaveRecordCategory:'0',
            Post:localStorage.post,
            teaInfo:localStorage.teaInfo,
            disCollege:false,
            disSpecialty:false,
            disGrade:false,
            disClass:false,
            objCollege: [],
            objSpecialty: [],
            objClass: []
        }
    },
    props:{
        otherRecord:{
            type:Boolean,
            default:false
        },
        showTime:{
            type:Boolean,
            default:true
        },
        dataStatistic:{
            type:Boolean,
            default:false
        }
    },
    methods:{
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
        getClassNum(){
            let _self = this;
            this.$ajax.get(_self.baseUrl + "/TeacherAudit/getClassNum",{           
                params:{},
                headers: {
                    'token': localStorage.token
                    }
            }).then(function(response){
                _self.objClass = JSON.parse(response.data); 
                // console.log(response.data);   
            }).catch(function(error){
                _self.$notify.error({
                    duration:2000,
                    title: '错误',
                    message: '获取班级信息失败'
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
        setJus: function () {
            let info = JSON.parse(this.teaInfo);

            if (this.Post == "班主任") {
                let classNum = info.ClassNum.toString();
                this.College = classNum.substr(0, 2).toString();
                this.Specialty = classNum.substr(0,4);
                this.grade = (Number)(classNum.substr(4, 2));
                this.Class = classNum.substr(6, 1).toString();
                this.disCollege = true;
                this.disSpecialty = true;
                this.disGrade = true;
                this.disClass = true;
            } else if (this.Post == "辅导员") {
                this.College = info.ClassSpecialityID.substr(0, 2);
                this.disCollege  = true;
            } else if (this.Post == "院领导") {
                this.College = info.CollegeNum;
                this.disCollege = true;
            }
            localStorage.college = this.College;
            localStorage.specialty = this.Specialty;
            localStorage.grade = this.grade;
            localStorage.class = this.Class;
        },
        sendData(){
            let dataObj = {
                College:this.College,
                Specialty:this.Specialty,
                grade:this.grade,
                Class:this.Class,
                Sex:this.Sex,
                LeaveRecordCategory:this.LeaveRecordCategory,
                Time:this.Time
            };
            this.$emit("conditionData",dataObj)
        }
    },
    computed:{
        getSpecialtyBycollege: function () {        //根据学院筛选专业
            this.Specialty = "0";
            var Spe = [];
            var num = 0;
            for (var i = 0; i < this.objSpecialty.length; i++) {
                if (this.objSpecialty[i].SpecialtyCollegeID == this.College) {
                    Spe[num] = { SpecialtyName: this.objSpecialty[i].SpecialtyName, SpecialtyNum: this.objSpecialty[i].SpecialtyNum };
                    num++;
                }
            }
            num = 0;
            if (this.Post == "班主任") {
                let info = JSON.parse(this.teaInfo).ClassNum.toString();
                this.Specialty = info.substr(0, 4);
            }
            return Spe;
        },
        getClassID: function () {
            this.classNum = "0";
            let Cla = [];
            let num = 0;
            for (var i = 0; i < this.objClass.length; i++) {
                if (this.objClass[i].ClassNum.substr(0, 4) == this.Specialty && this.objClass[i].ClassNum.substr(4, 2) == this.grade) {
                    Cla[num] = { ClassNum: this.objClass[i].ClassNum.substr(6, 1), ClassName: this.objClass[i].ClassNum.substr(6, 1) + "班" };
                    num++;
                }
            }
            num = 0;
            if (this.Post == "班主任") {
                 let info = JSON.parse(this.teaInfo).ClassNum.toString();
                this.Class = info.substr(6, 1);
            }
            return Cla;
        },
       
    },
    mounted(){
        this.getCollege();
        this.getSpecialty();
        this.getClassNum();
        this.setJus();
    }
}
</script>

<style>
.selTitle{
    font-size: 18px;
    padding-right: 5px;
    font-family: "PingFang SC";
    opacity: 0.7;
}
.el-row {
    margin-bottom: 20px;
  }
</style>