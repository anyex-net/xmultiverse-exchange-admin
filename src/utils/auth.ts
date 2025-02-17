import Cookies from "js-cookie";
const TokenKey = "Big";
import i18n from "@/locale/index";
export const getToken = () => {
  return Cookies.get(TokenKey);
};

export const setToken = (token: string) => {
  return Cookies.set(TokenKey, token);
};

export const removeToken = () => {
  return Cookies.remove(TokenKey);
};
export function getRoute() {
  return Cookies.get("route") || "";
}
export const setRoute = (route: any) => {
  return Cookies.set("route", route);
};
export const localSave = (key: string, value: string) => {
  return Cookies.set(key, value);
};

export function localRead(key: string) {
  return Cookies.get(key) || "";
}
export const generateTitle = (item: any) => {
  let name = "";
  if (item.title == "首页") {
    name = "index";
  } else {
    // const name2 = item.name.split("-");
    // name = name2.length === 2 ? name2[1] : item.name;
    name = item.name;
  }
  const hasKey = i18n.global.te(name); //返回布尔值,如果lang文件夹没有配置title,则 返回false
  if (hasKey) {
    const translatedTitle = i18n.global.t(name);
    return translatedTitle;
  }
  return item.name;
};
export const changeName = (item: any) => {
  let name = i18n.global.t(item);
  return name;
};
