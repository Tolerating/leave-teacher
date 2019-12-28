<template>
<div class="wa_content">
    <mt-header class="header" title="修改密码">
        <router-link to="/home" slot="left">
            <mt-button @click="clearInput" icon="back">返回</mt-button>
        </router-link>
    </mt-header>
    <div class="login_input">
        <mt-field label="旧密码" placeholder="旧密码" :state="oldPwd_s" type="password" @change="checkOldPwd" v-model="oldPwd"></mt-field>
        <mt-field label="新密码" placeholder="新密码" type="password" v-model="newPwd"></mt-field>
        <mt-field label="确认密码" placeholder="确认密码" :state="rePwd_s" type="password" @change="checkRePwd" v-model="reNewPwd"></mt-field>
        <mt-button @click="updatePwd" style="margin-top:15px;" type="primary" size="large">修改</mt-button>
    </div>
</div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
import qs from 'qs'
export default {
    name:"updatePwd",
    data(){
        return{
            oldPwd:"",
            newPwd:"",
            reNewPwd:"",
            oldPwd_s:"",
            rePwd_s:""
        }
    },
    components:{

    },
    methods:{
        updatePwd(){
            if(this.oldPwd !== "" && this.newPwd !== "" && this.reNewPwd !== ""){
                let _self = this;
                this.$ajax.post(_self.baseUrl + "/TeacherAudit/updatePwd",{
                    pwd:_self.reNewPwd
                },{
					headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'token':localStorage.token
					},
					transformRequest: [function (data) {
						data = qs.stringify(data);
						return data;
					}],
				}).then(function(response){
                    let data = response.data;
                    if(data.result == 0){
                         MessageBox.alert('密码修改成功').then(function(){
                             localStorage.isLogin = false;
                            _self.$router.push('/login');
                        });
                    }else if(response.data == "未登录"){
                        localStorage.isLogin = false;
                        _self.$router.push('/login');
                    }else{
                        _self.$message.error('密码修改失败,请稍后再试!');
                    }
                   
                }).catch(function(error){
                    _self.$message.error('用户名或密码错误');
                });
            }
        },
        checkOldPwd(){
            if(this.oldPwd !== localStorage.password){
                Toast('旧密码不一致');
                this.oldPwd_s = "error";
                this.oldPwd = "";
            }else{
                this.oldPwd_s = "success";
            }
        },
        checkRePwd(){
            if(this.reNewPwd !== this.newPwd){
                this.rePwd_s = "error";
                Toast('两次密码输入不一致');
                this.reNewPwd = "";
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
        }
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
}
.login_input{
	width: 100%;
}
</style>
