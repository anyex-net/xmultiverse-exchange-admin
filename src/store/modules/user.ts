import { defineStore } from "pinia";
import { login, logout, getInfo } from "@/api/login"
import { getToken, setToken, removeToken } from "@/utils/auth"
import defAva from "@/assets/images/active.png";
import { useRouter } from "vue-router";
import useDynamicTitle from "@/utils/useDynamicTitle";
const useUserStore = defineStore("user", {
    state: () => (
        {
            token: getToken(),
            name: "",
            avatar: "",
            roles: [] as any,
        }
    ),
    actions: {
        // 登录
        userLogin(userInfo: { username: string; password: string; captcha: string; }) {
            return new Promise<void>((resolve, reject) => {
                login(userInfo).then((res: any) => {
                    if (res.code === 200) {
                        // sessionStorage.setItem("username", res.data.name);
                        // const data = getToken150AndStime(res.data.principal);
                        setToken(res.data);
                        this.token = res.data;
                        resolve();
                    }

                }).catch((error: any) => {
                    reject(error);

                })
            })
        },
        // 退出系统
        logOut() {
            return new Promise<void>((resolve, reject) => {
                logout().then(() => {
                    this.token = "";
                    this.roles = [];
                    removeToken();
                    resolve();

                }).catch((error) => {
                    reject(error);
                });
            });
        },

        FedLogOut() {
            return new Promise<void>((resolve) => {
                this.token = "";
                this.roles = [];
                removeToken();
                const router=useRouter();
                // router.push('/login').then(r =>{
                //
                // } )
                resolve();
            })
        },
        /**
         * 获取用户信息
         *
         * @returns
         */
        getInfo() {
            return new Promise((resolve, reject) => {
                getInfo().then((res:any) => {
                    if (res.code === 200) {
                        let permissionSet = res.data.permission.split(";");
                        const user = res.data
                        const avatar = (user.userLogo == "" || user.userLogo == null) ? defAva : user.userLogo;
                        if (permissionSet && permissionSet.length >= 0) {//验证返回的roles是否是一个非空数组
                            this.roles = permissionSet;
                        } else {
                            this.roles = ["ROLE_DEFAULT"]
                        }
                        this.name = user.userName;
                        this.avatar = avatar;

                    }
                    resolve(res);
                }).catch((error) => {
                    reject(error);
                })
            })
        }

    },
});
export default useUserStore;
