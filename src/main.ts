import "@babel/polyfill";//(一定要在最上面，第一行)

import { createApp, Directive } from 'vue'
// import './style.css'
import App from './App.vue';
const app=createApp(App)
import router from '@/router';
import { createPinia } from "pinia";
import Cookies from "js-cookie";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/vs2015.css";
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css';
import locale from "element-plus/es/locale/lang/zh-cn"
// 全局css
import "@/assets/styles/index.scss";
import * as directive from "@/directive";
// 自定义svg图标组件
import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon/index.vue";
import "./permission";
// 引入i18n
import i18n from './locale';
import plugins from "./plugins";
import {parseTime,dateTimeSub,resetForm,cleanTableSelection,setTableRowSelected,addDateRange,selectDictLabel,selectDictLabels,handleTree} from "@/utils/dateTime";
// 分页组件
import Pagination from "@/components/Pagination/index.vue";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar/index.vue";
// element-plus图标
import elementIcons from "@/components/SvgIcon/svgicon";
// 表单搜索重置组件
import FormSearch from "@/components/FormSearch/index.vue";
//  Vue-Cropper
import VueCropper from "vue-cropper";
import "vue-cropper/dist/index.css";
declare module  '@vue/runtime-core' {
    interface ComponentCustomProperties{
        parseTime:Function
        dateTimeSub: Function;
		resetForm: Function;
        cleanTableSelection: Function;
        setTableRowSelected: Function;
		handleTree: Function;
		addDateRange: Function;
		selectDictLabel: Function;
		selectDictLabels: Function;
    }
}
import {copyText} from "@/directive/copyText";
// 注册复制文本指令
app.directive("copyText",copyText);
// // 批量注册自定义指令
Object.keys(directive).forEach((key)=>{
    app.directive(key,(directive as {[key:string]:Directive})[key]);
});
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.dateTimeSub = dateTimeSub;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.cleanTableSelection = cleanTableSelection;
app.config.globalProperties.setTableRowSelected = setTableRowSelected;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
// 全局组件挂载
app.component("Pagination",Pagination);
app.component("RightToolbar",RightToolbar);
app.component("svg-icon", SvgIcon);
app.component("FormSearch",FormSearch);
// 初始化路由
app.use(router);
app.use(plugins);
app.use(elementIcons);
app.use(createPinia());
app.use(ElementPlus,{
    locale:locale,
    size:Cookies.get("size") || "default"
});
app.use(i18n);
app.use(hljsVuePlugin);
app.use(VueCropper);
// app.use(directive);
app.mount('#app')

