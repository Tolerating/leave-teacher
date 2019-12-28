<template>
    <a style="color:black;">
        <mt-field :label="title" @click.native="showSel"  v-model="Result" :placeholder="placeholder"></mt-field>        
        <div class="select" v-show="isShow === true">
            <transition 
                enter-active-class="animated fadeInUp"
                leave-active-class="animated fadeInUp"
            >
                <div v-show="isShow === true" class="select_content">
                    <div style="height:39px;border-bottom:1px solid #eaeaea">
                        <span @click="cancel" class="s_c_action s_c_cancel f_left">取消</span>
                        <span @click="confirm" class="s_c_action s_c_cancel f_right">确定</span>
                    </div>
                    <div class="clearFix">
                        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker> 
                    </div>
                </div>
            </transition>
            <div class="bg" @click="hideBg"></div>
        </div>        
    </a>       
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
    data(){
        return{
            isShow:false,
            Result:this.inputResult,
            selResult:"",
            slots: [
                {
                flex: 1,
                values: this.optionsArr,
                className: 'slot1',
                textAlign: 'center'
                },
            ]
        }
    },
    model:{
        prop:"inputResult",
        event:"returnData"
    },
    props:{
        optionsArr:Array,
        title:String,
        placeholder:String,
        inputResult:String,
    },
    methods:{
        cancel(){
            this.isShow = false;
        },
        showSel(){
            this.isShow = true;
        },
        confirm(){
            this.isShow = false;
            this.Result = this.selResult;
            // console.log("||");
            this.$emit("returnData",this.Result);
        },
        onValuesChange(picker, values) {
            this.selResult = picker.getValues()[0];
        },
        hideBg(){
            this.isShow = false;
        }
    },
    
}
</script>

<style scoped>

.datetime{
    margin-bottom: 50px;
}
.bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 10;
}
.select{
    width: 100%;
}
.select_content{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    background-color:white;
}
.s_c_action{
    display: inline-block;
    width: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #26a2ff;
}
</style>
