import Vue from 'vue';
import Router from 'vue-router';
import face from '@/components/face';
import faceRotate from '@/components/faceRotate';

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      redirect: { name: 'face' }
    },
    {
      path: '/face',
      name: 'face',
      component: face
    },
    {
      path: '/faceRotate',
      name: 'faceRotate',
      component: faceRotate
    }
  ]
});
