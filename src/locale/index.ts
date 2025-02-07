import { createI18n } from 'vue-i18n';
// element-plus 中的语言配置
import elementEnLocale from 'element-plus/es/locale/lang/en';
import elementZhLocale from 'element-plus/es/locale/lang/zh-cn';
// 自己的语言配置
import enLocale from './lang/en';
import zhLocale from './lang/zh-CN';
import { localRead } from '../utils/auth';

// 自动根据浏览器系统语言设置语言
const navLang = navigator.language
const localLang = (navLang === 'zh-cn' || navLang === 'en') ? navLang : false
let lang = localLang || localRead('local') || 'zh-cn'
// 语言配置整合
const messages = {
    'en': {
        ...enLocale,
        ...elementEnLocale,
    },
    'zh-cn': {
        ...zhLocale,
        elementZhLocale
    }
}
// 创建i18n
const i18n = createI18n({
    legacy: false,
    globalInjection: true,//全局模式,可以直接使用$t
    locale: lang,
    messages: messages
})
export default i18n;
