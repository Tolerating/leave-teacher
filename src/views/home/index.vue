<template>
    <div class="qj_container">
        <div id="l_index">
            <div class="index_l">
                <img src="img/tx.png" class="index_l_header" height="80" width="80">
                <mt-cell title="我的信息" class="index_l_content" @click.native="remove_c" to="/home/userInfo" is-link></mt-cell>
                <mt-cell title="修改密码" class="index_l_content" @click.native="remove_c" to="/home/updatePwd" is-link></mt-cell>
                <mt-cell title="退出登录" class="index_l_content" @click.native="loginout" is-link></mt-cell>
            </div>
            <div class="index_r">            
                <mt-header title="请假通首页">
                    <mt-button slot="left">
                        <i class="fa fa-bars block_i" @click="showMenu" aria-hidden="true"></i>
                    </mt-button>
                </mt-header>
                <div @click="showMenu" class="bg" v-show="isShow"></div>
                <mt-cell title="请假审核" v-if="post != '公寓中心'" label="上课请假、早自习请假、不留宿请假" to="/home/leaveaudit" is-link></mt-cell>       
                <mt-cell title="周末请假审核" v-if="post == '辅导员' || post == '班主任'" to="/home/weekLeave" is-link></mt-cell>
                <template v-if="browserType == 0">
                    <mu-card style="width: 100%;background-color: #ecf0f1;">
                        <mu-card-header title="电脑端功能">
                            <mu-avatar slot="avatar">
                            <img src="img/computer.jpg">
                            </mu-avatar>
                        </mu-card-header>
                        <mu-card-text>
                            <mu-expansion-panel v-if="post == '公寓中心'" :expand="panel === 'panel1'" @change="toggle('panel1')">
                                <div slot="header">师生数据导入</div>
                                <mt-cell title="学生数据导入" is-link to="/home/stuImport"></mt-cell>
                                <mt-cell title="教师数据导入" is-link to="/home/teaImport"></mt-cell>
                            </mu-expansion-panel>
                            <mu-expansion-panel :expand="panel === 'panel2'" @change="toggle('panel2')">
                                <div slot="header">请假历史记录</div>
                                <mt-cell title="其他历史记录" label="不上课请假、不留宿请假、早自习请假" is-link to="/home/otherHistoryRecord"></mt-cell>
                                <mt-cell title="周末历史记录" is-link to="/home/weekHistoryRecord"></mt-cell>
                            </mu-expansion-panel>
                            <mu-expansion-panel :expand="panel === 'panel3'" @change="toggle('panel3')">
                                <div slot="header">早出晚归记录</div>
                                <mt-cell title="早出记录" is-link to="/home/earlyRecord"></mt-cell>
                                <mt-cell title="晚归记录" is-link to="/home/lateRecord"></mt-cell>
                            </mu-expansion-panel>
                            <mu-expansion-panel v-if="post == '公寓中心'" :expand="panel === 'panel4'" @change="toggle('panel4')">
                                <div slot="header">所属管理</div>
                                <mt-cell title="班级管理" is-link to="/home/classManage"></mt-cell>
                                <mt-cell title="专业管理" is-link to="/home/specialtyManage"></mt-cell>
                                <mt-cell title="学院管理" is-link to="/home/collegeManage"></mt-cell>
                            </mu-expansion-panel>
                            <mu-expansion-panel v-if="post != '院领导'" :expand="panel === 'panel5'" @change="toggle('panel5')">
                                <div slot="header">用户管理</div>
                                <mt-cell v-if="post != '班主任' && post != '辅导员'" title="教师管理" is-link to="/home/teacherManage"></mt-cell>
                                <mt-cell title="学生管理" is-link to="/home/studentManage"></mt-cell>
                            </mu-expansion-panel>
                            <mt-cell title="数据统计" is-link to="/home/dataStatistics"></mt-cell>
                        </mu-card-text>
                    </mu-card>
                    
                </template>                
            </div>
        </div>        
        <transition enter-active-class="animated slideInRight"
                    >
            <router-view/>
        </transition>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import leaveCard from '@/components/leaveCard.vue'
export default {
    name:"homePage",
    data(){
        return{
            panel:'',
            isShow:false,
            post:localStorage.post,
            browserType:0,      //0表示电脑端,1表示移动端
        }
    },
    components:{
        leaveCard,
    },
    methods: {
        showMenu(){
            let docu = document.getElementById("l_index");
            if(this.isShow == true){
                docu.className = "container_index";
                this.isShow = false;
            }else{
                docu.className = "container_index move_l"; 
                this.isShow = true;           
            }
        },
        remove_c(){
            let docu = document.getElementById("l_index");
            docu.className = "container_index";
            this.isShow = false;
            
        },
        loginout(){
            let _self = this;
            MessageBox.confirm('确定退出登录?').then(function(response) {
                localStorage.clear();
                localStorage.isLogin = false;
                // localStorage.token = "";
                _self.$router.push('login');
            }).catch(function(error){

            });
        },
        getTeacherInfo(){
            let _self = this;
            console.log(localStorage.teaInfo);
            if(localStorage.teaInfo == undefined && localStorage.teaNum != undefined){
                this.$ajax.get(_self.baseUrl + "/LoginModule/getTeacherInfo",{           
                params:{ID:localStorage.teaNum,Post:localStorage.post},
                headers: {
                    'token': localStorage.token
                    }
                }).then(function(response){
                    let data = response.data;
                    if(data.result == -1){
                        _self.$message.error('教师信息获取失败,请刷新页面!');
                    }else if(data.result == 0){
                        let info = data.message;
                        localStorage.teaInfo = info;                        
                    }else if(response.data == "未登录"){
                        localStorage.isLogin = false;
                        _self.$router.push("/login");
                    }    
                }).catch(function(error){
                    _self.$message.error('连接服务器失败');
                });
            }            
        },
        checkLogin(){
            // console.log(typeof localStorage.isLogin);
            if(localStorage.isLogin === false || localStorage.isLogin == undefined){
                this.$router.push('login');
            }
        },
        testBrowser(){
            let win = window.navigator.userAgent.toLowerCase();
            if(/mobi|android|touch|mini/i.test(win)){
                this.browserType = 1;
            }else{
                this.browserType = 0;
            }
            console.log(/mobi|android|touch|mini/i.test(win));
        },
        toggle (panel) {
            this.panel = panel === this.panel ? '' : panel;
        }
      
    },
    mounted(){
        this.getTeacherInfo();
        this.checkLogin();
        this.testBrowser();
    }
}
</script>

<style scoped>
#l_index{
    transition: all 0.3s;
}

.container_index{
    width:100%;
    height: 100%;
}
.index_l{
    position: absolute;
    left: -100px;
    width: 100px;
    height: 100%;
    margin: 0;
    padding: 0;
}

.index_l_header{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: black;
    margin: 5px 10px 5px 10px;
}

.index_r{
    float: left;
    width: 100%;
    height: 100%;
}

.hide{
    display: none;
}
.block_i{
    font-size: 25px;
}

.move_l{
    transform: translateX(100px);
    transition: 0.3 all;
    background-color: black;
}
.bg{
    position: absolute;
    width: 100%;
    height:100%;
    z-index: 50;
    background-color: #888888c4;
}
</style>
