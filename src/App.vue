<template>
<div  v-if="$router.currentRoute.value.path != '/LogIn'">
  <div class="burger__Button" >
            <font-awesome-icon v-if="!close_menu" class="fa-2x cursorPointer " icon="bars" aria-hidden="true" @click="burgerSHow" />
            <font-awesome-icon v-else class="fa-2x cursorPointer " icon="times" aria-hidden="true" @click="burgerSHow" />
  </div>
  <Transition>
    <div class="burger-menu"  v-bind:class="{'v-enter-active': burgerOpen, 'v-leave-to': !burgerOpen }">
        <div class="burger-menu-item1">
          <div class="burger-menu-item1-child">
            <img src="../public/miner.png" alt="Placeholder image">
            <span class="user-info">{{personFIO}}</span>
          </div>
        </div>
        <div class="burger-menu-item2">
            <nav class="burger-menu-list">
                <ul class="menu-list">
                 <!-- <li class="cursorPointer zxc" @click="closeInBurgerMenu">Закрыть</li>-->
                  <li class="cursorPointer" @click="$router.push('/create_user'), burgerOpen=false, close_menu=false" v-if="management">Управление</li>
                  <li class="cursorPointer" @click="$router.push('/readme'), burgerOpen=false, close_menu=false">Инструкция</li>
                  <li class="cursorPointer" @click="$router.push('/table'), burgerOpen=false, close_menu=false">Таблица</li>
                  <li class="cursorPointer" @click="exitTable()">Выход</li>
                </ul>
            </nav>
        </div> 
    </div>
  </Transition>
</div>

  <router-view @click="burgerOpen=false, close_menu=false"/>

</template>

<script>
import './router'
import store from './store'
import axios from 'axios'
export default {
  name: 'App',
  data(){
    return{
      burgerOpen: false,
      close_menu: false,
      management: false,
      personFIO: localStorage.getItem('userFIO'),
      exitData : {
        header: 'EXIT',
        userfio: localStorage.getItem('userFIO'),
        userid: localStorage.getItem('userId')
      }
    }
  },
  methods:{
    exitTable: async function(){
      console.log(this.exitData)
      await axios({
        url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/exitTable`,
        method: 'POST',
        data: this.exitData
        })
        .then(response => {
          if(response.data == '707'){
            this.$router.push('/LogIn')
            //localStorage.clear()
          }
        })
        .catch(error => console.log(error))
    },

    burgerSHow: function(e){
      if(e){
        this.burgerOpen == false ? (this.burgerOpen=true) : (this.burgerOpen=false)
        this.close_menu = !this.close_menu
        this.userFIO = store.state.userFIO
      }
    }
  },
  mounted: function(){
    if(localStorage.getItem('userRole') == 'superuser'){
      this.management = true
    }
  }
}
</script>

<style scoped>
.v-enter-active{ 
  transition: .8s ease;
  width: 12%;
  transform: translateX(0%);
}

.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.burger__Button{
  z-index: 39;
  margin-top:1.5%;
  margin-left: 0.6%;
  position:fixed;
  height: 90px;
  color: #fefefe;
}

.user-info{ 
  color: #fefefe;
}
.burger__Button:hover{
  color: rgb(72, 199, 142, .7);
}

.menu-list{
  text-align: center;
  width: 150px;
}
  .menu-list li{ 
  margin-bottom: 20px;
  background-color: #3a3b3b;
  color: #fefefe;
  border: solid 2px #fefefe;
  border-radius: 8px;
  transition: .4s;
}

.menu-list li:hover{
  background-color: rgb(72, 199, 142, .7);
  transition: .5s;
}


.burger-menu{
  position: fixed;
  left: 0;top: 0;
  z-index: 10;
  
  height: 100%;
  background-color: rgb(61, 66, 71);
  display: flex;
  align-items: center;
  flex-direction: column;
  /*transition: 3.5s;*/
  /*transition: all 0.5s ease;
  */
}

.burger-menu-item1{ 
  text-align: center;
  width: 150px;
  margin-top: 150px;
  margin-bottom: 80px;
  border: solid 2px #fefefe;
  border-radius: 8px;
}

.burger-menu-item1-child{
  margin: 7px 7px;
}
.cursorPointer:hover{
  cursor: pointer;
}

</style>
