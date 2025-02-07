import {createRouter,RouteRecordRaw,createWebHashHistory,createWebHistory,} from 'vue-router'
export const Layout=()=>import("@/layout/index.vue");
// 公共路由
export const constantRoutes=[
    {
		path: "/redirect",
		component: Layout,
		hidden: true,
		children: [
			{
				path: "/redirect/:path(.*)",
				component: () => import("@/views/redirect/index.vue"),
			},
		],
	},
    {
        path:'/login',
        name:'login',
        component:()=>import('@/views/login.vue')
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/error/404.vue'),
        hidden: true
    },
    {
        path: '/401',
        component: ()=>import('@/views/error/401.vue'),
        hidden: true
    },
    {
        path:"",
        component:Layout,
        redirect:"/index",
        children:[
            {
                path:"/index",
                component:()=>import("@/views/index.vue"),
                name:"index",
                icon:"Icon3n",
                title:'首页',
                alwaysShow: true,
                meta:{title:"首页",affix:true},
            }
        ]
    },
    {
        path:"/user",
        component:Layout,
        hidden: true,
        redirect:"noredirect",
        children:[
            {
                path:"profile",
                component:()=>import("@/views/system/user/profile/index.vue"),
                name:"Profile",
                icon:"user",
                meta:{title:"个人中心"},
            },
            // {
            //     path:"groupMember",
            //     component:()=>import("@/views/openim/group/groupMember/index.vue"),
            //     name:"groupMember",
            //     icon:"user",
            //     meta:{title:"群成员"},
            // },
        ]
    },
    {
        path:"/group",
        component:Layout,
        hidden: true,
        redirect:"noredirect",
        children:[
            {
                path:"groupMember",
                component:()=>import("@/views/openim/group/groupMember/index.vue"),
                name:"groupMember",
                icon:"user",
                meta:{title:"群成员"},
            },

        ]
    },

];
// 动态路由，基于用户权限动态去加载
export const dynamicRoutes=[];
const router=createRouter({
    history:createWebHashHistory(),
    routes :constantRoutes,//配置路由
    scrollBehavior(to,from,savedPosition){
        if(savedPosition){
            return savedPosition;
        }else{
            return {top:0};
        }
    },
});
export default router;
