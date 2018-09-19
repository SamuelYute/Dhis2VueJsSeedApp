import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import LoginPage from './views/LoginPage'

Vue.use(Router)

const router =  new Router({
    mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
        meta: {
          requiresAuth: true
        }
    },{
      path: '/login',
      name: 'login',
      component: LoginPage,
      beforeEnter: (to, from, next) => {
          if (sessionStorage.getItem('basicAuthToken'))
          {
              next('/');
          }

          next();
      }
    }
  ]
})

router.beforeEach((to, from, next)=>{
    if (to.meta.requiresAuth)
    {
        if (sessionStorage.getItem('basicAuthToken'))
        {
            next();
        }else
        {
            next({ path : '/login'})
        }
    }else
    {
        next();
    }

})

export default router;
