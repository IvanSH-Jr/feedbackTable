import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



import App from './App.vue'

import '../node_modules/bulma/css/bulma.css'
import  'axios'
import router from './router'





library.add(fas)
createApp(App)
        .component('font-awesome-icon', FontAwesomeIcon,)
        .use(router)
        .mount('#app')
        
/*
const app = createApp(App)

app.component('fa', FontAwesomeIcon)
app.use(router).mount('#app')*/