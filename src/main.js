import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import 'mint-ui/lib/style.css'
import MintUI from 'mint-ui'
import 'font-awesome/css/font-awesome.css'
import axios from 'axios'
import animate from 'animate.css'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vconsole from 'vconsole';
// const vConsole =new Vconsole();
// Vue.use(vConsole);
Vue.prototype.$ajax = axios
Vue.use(ElementUI)
Vue.use(animate)
Vue.use(MintUI)
Vue.use(MuseUI)
Vue.directive('enterNumber', {
  inserted: function (el) {
    el.addEventListener("keypress",function(e){
      e = e || window.event;
      var charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
      console.log(charcode);
      var re = /^0123456789$/g;
      if(!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey){
          if(e.preventDefault){
              e.preventDefault();
          }else{
              e.returnValue = false;
          }                            
      }
    });
  }
});

axios.defaults.withCredentials=true
Vue.config.productionTip = false 
Vue.prototype.baseUrl = "http://118.25.137.129:35651/leave"
// Vue.prototype.baseUrl = "http://localhost:53285/leave"
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
