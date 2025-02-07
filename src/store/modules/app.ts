import Cookies from "js-cookie";
import { defineStore } from "pinia";
import {localRead,localSave} from "../../utils/auth";
import useSettingsStore from "./settings"
const useAppStore=defineStore('app',{
state:()=>({
    sidebar:{
        opened:Cookies.get("sidebarStatus")? Cookies.get("sidebarStatus"):true,
        withoutAnimation: false,
        hide: false,
    },
    device:"desktop",
    size:Cookies.get('size')||"default",
    local:localRead('local'),
}),
actions:{
    toggleSideBar(withoutAnimation?:any){

        if(this.sidebar.hide){
            return false;
        }
        this.sidebar.opened=!this.sidebar.opened;
        this.sidebar.withoutAnimation=withoutAnimation;
        if(this.sidebar.opened){
            Cookies.set('sidebarStatus',"1");
        }else{
            Cookies.set("sidebarStatus","0");
        }

    },
    setLocal(lang:string){
        this.local=lang;
        localSave('local',lang);
    },
    closeSideBar(withoutAnimation:any){
       Cookies.set("sidebarStatus","0");
       this.sidebar.opened=false;
       this.sidebar.withoutAnimation=withoutAnimation;
    },
    toggleDevice(device:string){
        this.device=device;

    },
    setSize(size:string){
        this.size=size;
        Cookies.set("size",size);
    },
    toggleSideBarHide(status:boolean){
        this.sidebar.hide=status;
    },
},
});
export default useAppStore;
