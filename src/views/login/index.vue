<template>
    <div class="login_container">
    	<div class="login_main">
    		<div class="login_logo">
    			<img src="img/logo.png" >
    		</div>
			<div class="login_input">
				<form method="post">
					<mt-field label="工号:" type="number" v-model.trim="loginID" placeholder="工号"></mt-field>
					<mt-field label="密码:" type="password" v-model.trim="pwd" placeholder="密码"></mt-field>
					<selected :optionsArr="selValues" v-model="post" title="职称:" placeholder="请选择职称"></selected>
					<router-link tag="a" class="login_forgetPwd" src="#" to="/login/forgetPwd">忘记密码?</router-link>					
					<button type="button" @click="loginLeave">登录</button> 
				</form>
			</div>
    	</div>
		<transition enter-active-class="animated slideInRight">
            <router-view/>
        </transition>     
    </div>
</template>

<script>
import {Indicator} from 'mint-ui'
import selected from '@/components/select.vue'
import qs from 'qs'
export default {
    name:"Login",
	data(){
		return{
			loginID:"",
			pwd:"",
			post:"班主任",
			selValues:["班主任","辅导员","院领导","校领导"]
		}
	},
	components:{
		selected
	},
	methods:{
		loginLeave(){
			if(this.loginID !== "" && this.pwd !== ""){
				Indicator.open("登录中...");
				let _self = this;
				let loginID = this.loginID;
				if(this.post === "班主任"){
					loginID += "1";
				}else if(this.post === "辅导员"){
					loginID += "2";
				}else if(this.post === "院领导"){
					loginID += "3";
				}else if(this.post === "校领导"){
					loginID += "4";
				}
				this.$ajax.post(_self.baseUrl + "/LoginModule/TeacherLogin",{           
					Name:loginID,
					Pwd:_self._self.pwd,
					Post:_self.post
				},{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					transformRequest: [function (data) {
						data = qs.stringify(data);
						return data;
					}],
				}).then(function(response){
					Indicator.close();
					localStorage.teaNum = loginID
					console.log(localStorage.teaNum);
					localStorage.post = _self.post;
					localStorage.password = _self.pwd;
					if(response.data.result == 0){
						localStorage.isLogin = true;
						localStorage.token = response.data.message;						
						_self.$router.push("home");
					}
					if(response.data.message === "用户名或密码错误"){
						_self.$message.error('用户名或密码错误');
					}
					
				}).catch(function(error){
					Indicator.close();
					_self.$message.error('连接服务器失败');
				});
			}
		},
		judgeLogin(){
			// console.log(this.$ajax.defaults.headers.common.token);
			if(localStorage.isLogin === true){
				this.$router.push('applyLeave');
			}
		}
		
	},
	mounted(){
		this.judgeLogin();
	}
}
</script>

<style scoped>
/* .login_container{
	width: 100%;
	height: 100%;
	min-width: 320px;
	max-width: 812px;
	margin: 0 auto;
} */

.login_main{
	width: 100%;
	height: 100%;
	padding: 50px;
}

.login_logo{
	margin-top: 20px;
	width: 100%;
	margin-bottom: 10px;
}

.login_logo img{
	display: block;
	margin: 0 auto;
}

.login_input{
	width: 100%;
}
.login_forgetPwd{
	float: right;
	margin-top: 5px;
	font-size: 15px;
	color:black;
}


.login_input form input:focus{
	opacity: 0.4;
	background-color: #70a1ff;
	margin-top: 5px;
}

.login_input form button{
	border: none;
	border-radius: 30px;
	background-color: #1e90ff;
	width: 100%;
	height: 50px;
	margin-top: 10px;
	font-size: 18px;
	text-align:center;
	outline: none;
}
</style>
