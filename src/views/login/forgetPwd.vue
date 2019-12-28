<template>
<div class="login_content">
    <mt-header title="忘记密码">
        <router-link to="/login" slot="left">
            <mt-button @click="clearInput" icon="back">返回</mt-button>
        </router-link>
    </mt-header>
    <div class="login_input">
        <mt-field label="工号" placeholder="请输入工号" v-enter-Number :readonly="isTeaIDreadonly" type="number" v-model.trim="teaID"></mt-field>
        <selected :optionsArr="selValues" v-model="post" title="职称" placeholder="请选择职称"></selected>
        <mt-field label="验证码:" placeholder="请输入验证码" type="text" v-model="code">
            <mt-button @click="verifyCode" :disabled="disvCode" ref="vCode" size="small">{{vCodeTitle}}</mt-button>
        </mt-field>
        <mt-field label="新密码" placeholder="新密码" v-show="code == serverCode" :state="rePwd_s" type="password" v-model="newPwd"></mt-field>
        <mt-field label="确认密码" placeholder="确认密码" v-if="code == serverCode" :state="rePwd_s" type="password" @change="checkRePwd" v-model="reNewPwd"></mt-field>
        <mt-button @click="updatePwd" ref="update" :disabled="isShow" style="margin-top:15px;" type="primary" size="large">修改</mt-button>
    </div>
</div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
import selected from '@/components/select.vue'
import qs from 'qs'
export default {
    name:"updatePwd",
    data(){
        return{ 
            teaID:"",
            putTeaID:"",
            isTeaIDreadonly:false,
            code:"",
            serverCode:"123",
            newPwd:"",
            reNewPwd:"",
            rePwd_s:"",
            isShow:true,
            disvCode:false,
            disTime:60,
            vCodeTitle:"获取验证码",
            post:"班主任",
            selValues:["班主任","辅导员","院领导","校领导"]
        }
    },
    components:{
        selected
    },
    methods:{
        updatePwd(){
            if(this.teaID !== "" && this.newPwd !== "" && this.reNewPwd !== ""){
                let _self = this;
                this.$ajax.post(_self.baseUrl + "/LoginModule/updateTeaPwd",{  
                        ID:_self.putTeaID,
                        passnew:_self.reNewPwd
                },{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					transformRequest: [function (data) {
						data = qs.stringify(data);
						return data;
					}],
				}).then(function(response){
                    if(response.data.message === "success"){
                         MessageBox.alert('密码修改成功').then(function(){
                            localStorage.code = null;
                            _self.$router.push('/login');
                        });
                    }
                    if(response.data.message === "error"){
                        MessageBox.alert('密码修改失败，请稍后重试！').then(function(){
                            localStorage.code = null;
                        });
                    }
                   
                }).catch(function(error){
                    MessageBox("错误!");
                });
            }
        },
        checkRePwd(){
            if(this.reNewPwd !== this.newPwd){
                this.rePwd_s = "error";
                Toast('两次密码输入不一致');
                this.reNewPwd = "";
                this.isShow = true;
            }else{
                this.rePwd_s = "success";
            }
        },
        clearInput(){
            this.oldPwd_s = "";
            this.rePwd_s = "";
            this.oldPwd = "";
            this.newPwd = "";
            this.reNewPwd = "";
        },
        verifyCode(){
            if(this.teaID !== ""){
                let _self = this;
                if(this.teaID.length < 8){
                    Toast({
                            message: '工号应为八位数字',
                            duration:2000
                        });
                    return false;
                }
                this.putTeaID = this.teaID;
                if(this.post === "班主任"){
					this.putTeaID += "1";
				}else if(this.post === "辅导员"){
					this.putTeaID += "2";
				}else if(this.post === "院领导"){
					this.putTeaID += "3";
				}else if(this.post === "校领导"){
					this.putTeaID += "4";
				}
                this.$ajax.get(_self.baseUrl + "/LoginModule/sendSMS",{           
                    params:{
                        userID:_self.putTeaID,
                        post:"教师"                        
                    },
                    timeout: 1000 * 60 * 2
                }).then(function(response){
                    console.log(response);
                    if(response.data == -7){
                        // MessageBox('错误','教师预留手机号码不存在');
                        _self.$message.error('教师预留手机号码不存在');
                    }else if(response.data == -1){
                        // MessageBox("短信发送失败,请稍后再试!");
                        _self.$message.error('短信发送失败,请稍后再试!');
                    }else if(response.data > 0){
                        Toast({
                            message: '短信发送成功',
                            duration:2000
                        });
                        localStorage.code = String(response.data);
                        _self.serverCode = localStorage.code;
                        _self.isTeaIDreadonly = true;
                        _self.disvCode = true;
                        let countDown = setInterval(function(){
                            if(_self.disTime !== 0){
                                _self.vCodeTitle = _self.disTime--;
                            }else{
                                clearInterval(countDown);
                                _self.disvCode = false;
                                _self.disTime = 60;
                                _self.vCodeTitle = "获取验证码";
                            }
                            
                        },1000);
                    }                   
                }).catch(function(error){
                     _self.$message.error('连接服务器失败!');
                });
            }
        },
        
    },
    watch:{
        reNewPwd(value){
            if(value === this.newPwd){
                this.isShow = false;
            }else{
                this.isShow = true;
            }
        }
    },
    mounted(){
    }
}
</script>

<style scoped>
.login_input{
	width: 100%;
}
.updatePwd{
	border: none;
	background-color: #1e90ff;
	width: 100%;
	height: 50px;
	margin-top: 10px;
	font-size: 18px;
	text-align:center;
	outline: none;
    color: #524e4e;
}
</style>
