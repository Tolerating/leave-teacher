<template>
    <div class="wa_content">
        <mt-header class="header" title="我的信息">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <mt-field label="姓名"  readonly v-model="name"></mt-field>
        <mt-field label="教师工号" readonly v-model="ID"></mt-field>
        <mt-field label="身份"  readonly v-model="post"></mt-field>
        <mt-field label="联系方式"  readonly v-model="tel"></mt-field>
    </div>
</template>

<script>
export default {
    data(){
        return{
            name:"",
            ID:"",
            post:"",
            tel:""
        }
    },
    methods:{
        getUserInfo(){
            let _self = this;
             this.$ajax.get(_self.baseUrl + "/TeacherAudit/getTeacherInfo",{           
                    params:{Post:localStorage.post},
                    headers: {
                        'token': localStorage.token,
                    }
                }).then(function(response){
                    let data = response.data;
                    if(data.result == 0){
                        let item = JSON.parse(data.item);
                        if(item != {}){
                            _self.name = item.TeacherName;
                            _self.ID = item.TeacherNum.substr(0,8);
                            _self.post = item.Post;
                            _self.tel = item.TeacherTel;
                        }else{
                            _self.name = "无";
                            _self.ID = "无";
                            _self.post = "无";
                            _self.tel = "无";
                        }
                    }else if(data.result == -3){
                        localStorage.isLogin = false;
                        _self.$router.push("/login");
                    }else if(response.data == "未登录"){
                        localStorage.isLogin = false;
                         _self.$router.push("/login");
                    }
                   
                }).catch(function(error){
                    _self.$message.error('连接服务器失败');
                });
        }
    },
    mounted(){
        this.getUserInfo();
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
</style>
