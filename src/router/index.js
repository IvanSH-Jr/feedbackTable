import { createWebHistory, createRouter } from "vue-router";
import Authentication from "../components/Authentication.vue";
import RealTimeTable from '../components/RealTimeTable.vue';
import ReadMe from '../components/ReadMe.vue'
import Admin from '../components/Administration.vue'
import NotFound from '../components/NotFound.vue';
import store from '../store'
import authorization from "../../statusVerify.js"
const routes = [
  {
    path: "/LogIn",
    name: "LogIn",
    component: Authentication,
  },
  {
    path: "/table",
    name: "table",
    component: RealTimeTable,
  }, 
  {
    path: '/readme',
    name: 'readme',
    component: ReadMe
  },
  {
    path: '/create_user',
    name: 'create_user',
    component: Admin
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];
//process.env.BASE_URL

const router = createRouter({
  history: createWebHistory(),
  routes
});

/*
 const router = new VueRouter ({
   mode: 'history',
   routes
 })*/
router.beforeEach(async(to,  ) => {
  //console.log(to.path)
  getYoutURL()
  authorization()
    .then((res) => {
        console.log('beforeEach ' + res)
        if(res == 'ACCESS-IS-VALID' || res == 'OLD_TO_NEW_UPDATE'){
          if(to.path == '/'){
            router.push(localStorage.getItem('last_route') || '/table')
          }else{
            router.push(to.path)
            localStorage.setItem('last_route',to.path)
          }
        }
        else{
          router.push('/LogIn')
       }
    }) 
}) 

function getYoutURL(){
  store.state.url = window.location.hostname
  console.log(store.state.url)
}

export default router;