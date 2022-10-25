<template>
    <section class="hero is-fullheight"> 
        <div class="hero-body has-background-white has-text-black is-paddingless is-relative">
            <div class="container">
                <div class="column is-4 is-offset-4 is-paddingless">

                
                    <section class="box">
                        <p class="title has-text-centered has-text-weight-bold is-size-5">Авторизация</p>
                        <div class="field">
                            <div class="control has-icons-left is-clearfix">
                                <span class="icon is-left"><font-awesome-icon class="fa-1x cursorPointer" icon="user" aria-hidden="true" /></span>
                                <input type="text" :placeholder="textLogin" :class="['input', {'is-danger' : errorLogin}]" v-model="inputUserData.email">
                            </div>
                        </div>
                        <div class="field">
                            <div class="control has-icons-left is-clearfix">
                                <span class="icon is-left"><font-awesome-icon class="fa-1x cursorPointer" icon="key" aria-hidden="true" /></span>
                                <input type="password" autocomplete="current-password" :placeholder="textPassword" :class="['input', {'is-danger' : errorPassword}]" v-model="inputUserData.password">
                            </div>
                        </div>
                        <button type="button"  class="button is-link is-fullwidth" @click="signIn" :disabled="buttonDisabled">Вход</button>
                       
                    </section>
                </div>
            </div>
        </div>
          <div>
  </div>
    </section>
      
</template>
<script>
import axios from 'axios'
import '../../node_modules/bulma/css/bulma.css'
import '../router'
import store from '../store'
//import authorization from '../../statusVerify'
   'use strict'
/* @ is an alias to /src */
// Общие компоненты

export default {
   
    data(){
        return{
           inputUserData: {
                header: 'Authentication',
                email: '',
                password: ''
           },
           textLogin: 'Введите @email',
           textPassword: 'Введите пароль',
           errorLogin: false,
           errorPassword: false,
       }
   },

    methods: {
        signIn: async function(){
            
            await axios({
                url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/authentication`,
                method: 'POST',
                data: [this.inputUserData] 
            })
            .then(response => {
                console.log(response)
                if(response.data.header == 'Authorization'){
                    //authorization()
                    localStorage.setItem('access_token', response.data.accessToken)
                    localStorage.setItem('refresh_token', response.data.refreshToken)
                    localStorage.setItem('userFIO', response.data.userfio)
                    localStorage.setItem('userRole', response.data.userlvl)
                    localStorage.setItem('userId', response.data.userID)
                    this.errorLogin = this.errorPassword = false
                    this.$router.push('/table')
                }
                else{
                    this.errorLogin = this.errorPassword = true
                    this.textLogin = this.textPassword = 'Ошибка почты или пароля!'
                }
            })
            .catch(function(res){
                console.log('Error ' +  JSON.stringify(res))
            })
           
        },
   },

   computed: {
       buttonDisabled(){
           return !this.inputUserData.email || !this.inputUserData.password
       }
   }
}  
</script>
