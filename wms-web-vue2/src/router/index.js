import VueRouter from "vue-router";

const routes = [
    
    { path: '/', name:'login', component: () => import('../components/LoginView.vue') },
    {
        path: '/Index', name: 'Index', component: () => import('../components/IndexView.vue'),
        children: [
            {
                path: '/Home',
                meta: {
                    title:'首页'
                }, 
                name: 'Home',
                component: () => import('../components/HomeView.vue')
            },
            // { 
            //     path: '/Admin',
            //     name: 'Admin',
            //     meta: {
            //         title:'管理员管理'
            //     },
            //     component: () => import('../components/admin/AdminManage.vue'),
            // },
            // {
            //     path: '/User',
            //     name: 'User',
            //     meta: {
            //         title:'用户管理'
            //     },
            //     component: () => import('../components/user/UserManage.vue'),
            // },
      
        ]
    },     
   
]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

export function resetRouter() {
    router.matcher = new VueRouter({
        mode: 'history',
        routes:[]
    }).matcher
}

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
 return VueRouterPush.call(this, to).catch(err => err)
}


export default router;