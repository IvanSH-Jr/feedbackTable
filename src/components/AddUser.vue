<template>
  <table class="table is-bordered is-striped is-narrow is-hoverable ">
      <thead>
            <tr>
                <th>ФИО</th>
                <th>Email</th>
                <th>Роль</th>
            </tr>
      </thead>

      <tbody>
          <tr v-for="(data, i) in tableOfUsers" :value="data" :key="i">
              <td>{{data.fio}}</td>
              <td>{{data.email}}</td>
              <td>{{data.role}}</td>
          </tr>
      </tbody>

  </table>
</template>

<script>
import axios from 'axios';
export default {
    name: 'adduser',
    data(){
        return{
        createUser:{
            fio: "",
            email: "",
            role: ""
        },
        userData:[],
        tableOfUsers: [],

        }
        

    },

    methods: {
        getUsersData: async function(){
            await axios
              .get(`https://aspz.spbec-mining.ru:8080/userList`)
              .then(response => (this.userData = response))
              .catch(error => console.log(error))
            console.log('Подключаюсь к БД uniqueusers')
            console.log(this.userData)
            for(let steps = 0; steps < this.userData.data.length; steps++)
            {
                this.tableOfUsers.push(this.userData.data[steps])
            }
            console.log('Для таблицы на веб')
            console.log(this.tableOfUsers)
        }
    },
    mounted: function() {
     
        console.log('Таблица уникальных юзеров')
        //this.getYourUrl()
        this.getUsersData()
        
    
     },

}
</script>

<style>

</style>