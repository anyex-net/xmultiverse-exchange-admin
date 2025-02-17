import useUserStore  from "@/store/modules/user";
import useTagsViewStore from "@/store/modules/tagsView";
import {useRouter} from "vue-router";
import {getCodeImg} from "@/api/login";
import Cookies from "js-cookie";
import {ref, resolveDirective} from "vue"
import {ElForm} from "element-plus"
import {lodashFunc} from "@/utils/dateTime"
import {encrypt,decrypt} from "@/utils/digest"
export default ()=>{
    const loginFormRef=ref<InstanceType<typeof ElForm>>();
    const codeUrl=ref<string>("");
    const loginForm=ref<{username:string;password:string;captcha:string;rememberMe:boolean}>({
        username: "",
		password: "",
		rememberMe: false,
		captcha: "",
    });
	let loading=ref<boolean>(false);
	const redirect=ref<any>(undefined);
	const userStore=useUserStore();
	const tagsViewStore=useTagsViewStore();
	const router=useRouter();
    const loginRules={
        username: [
			{ required: true, trigger: "blur", message: "用户名不能为空" },
		],
		password: [
			{ required: true, trigger: "blur", message: "密码不能为空" },
		],
		captcha: [
			{ required: true, trigger: "change", message: "验证码不能为空" },
		],
    }
	//获取验证码
	const getCode=()=>{
		getCodeImg({
			scene:'login'
		}).then((res:any)=>{
			if(res.code===200){
				codeUrl.value=res.data
			}
		})
	}
	getCode();
	const getCookie=()=>{
		const username = Cookies.get("username");
		const password = Cookies.get("password");
		const rememberMe = Cookies.get("rememberMe");
		// prettier-ignore
		loginForm.value.username = username === undefined ? loginForm.value.username : username;
		// prettier-ignore
		loginForm.value.password = password === undefined ? loginForm.value.password : decrypt(password) as string;
		// prettier-ignore
		loginForm.value.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe);
	}
	getCookie();
	const handleLogin=()=>{
		loginFormRef.value?.validate((valid:boolean)=>{
			if(valid){
				tagsViewStore.clearView([])
				loading.value=true;
				let loginForms={
					username:loginForm.value.username,
					password:loginForm.value.password,
					captcha: loginForm.value.captcha
				}

				if(loginForm.value.rememberMe){
					Cookies.set("username",loginForm.value.username,{expires:30});
					Cookies.set("passsword",encrypt(loginForm.value.password).toString(),{expires:30});
					Cookies.set("rememberMe",loginForm.value.rememberMe.toString(),{expires:30});

				}else{
					Cookies.remove("username");
					Cookies.remove("passsword");
					Cookies.remove("rememberMe");
				}

				userStore.userLogin(loginForms).then(()=>{
					// 跳转到首页
					router.push({path:redirect.value || "/"}).catch(()=>{});

				}).catch((error)=>{
					loading.value=false;
					getCode();
				})

			}
		})

	}

    return{
        loginFormRef,loginForm,loginRules,handleLogin,codeUrl,getCode,loading
    }
}
