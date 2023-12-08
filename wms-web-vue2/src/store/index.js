import vue from "vue";
import Vuex from "vuex";
import router from "../router";
import createPersistedState from "vuex-persistedstate";

vue.use(Vuex);

function addNewRouter(menuList) {
    let routes = router.options.routes;
    routes.forEach((routeItem) => {
        if (routeItem.path == '/Index') {
            menuList.forEach(menu => {
                let childRoute = {
                          
                path: '/' + menu.menuclick,
                name: menu.menuname,
                meta: {
                    title:'menu.menuname'
                },
                component: () => import('../components/' + menu.menucomponent),
            
                }

                routeItem.children.push(childRoute);
            })
        }
    })
   
    router.addRoutes(routes);
}


export default new Vuex.Store({
    state: {
        menu: [],
    },
    mutations: {
        setMenu(state,menuList) {
            state.menu = menuList;
            addNewRouter(menuList);
        },
        setRouter(state, menuList) {
            state.menu = menuList;
            addNewRouter(menuList);
        }
    },

    // actions: {
    //     addNAsync(context) {
    //         setTimeout(() => {
    //             context.commit('add')
    //         },1000)
    //         }

    // },
    getters: {
        getMenu(state) {
            return state.menu;
            }
    },

    plugins: [createPersistedState()]
    
});