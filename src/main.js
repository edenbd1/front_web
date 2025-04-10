import SignUp from './components/SignUp.vue';
import SignIn from './components/SignIn.vue';
import Contacts from './components/Contacts.vue';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import 'uno.css';
import '@una-ui/preset/una.css';

const routes = [
  {
    name: 'Home',
    path: '/',
    redirect: to => {
      const token = localStorage.getItem('token');
      return token ? '/contacts' : '/signin';
    },
  },
  {
    name: 'SignIn',
    path: '/signin',
    component: SignIn,
    meta: { requiresAuth: false, hideForAuth: true },
  },
  {
    name: 'SignUp',
    path: '/signup',
    component: SignUp,
    meta: { requiresAuth: false, hideForAuth: true },
  },
  {
    name: 'Contacts',
    path: '/contacts',
    component: Contacts,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  // Redirect authenticated users away from login/signup pages
  if (to.meta.hideForAuth && token) {
    next('/contacts');
  }
  // Redirect unauthenticated users away from protected pages
  else if (to.meta.requiresAuth && !token) {
    next('/signin');
  } 
  else {
    next();
  }
});

createApp(App)
  .use(router)
  .mount('#app');