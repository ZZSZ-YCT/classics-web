import Article from "../pages/article/Article.vue";
import Login from "../pages/login/Login.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/:catchAll(.*)',
        name: 'Home',
        component: Article,
        meta: {
            title: 'ZZSZ 英才二班典籍'
        },
        children: [
            {
                path: 'login',
                name: 'Login',
                component: Login,
                meta: {
                    title: 'Sign in'
                }
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;