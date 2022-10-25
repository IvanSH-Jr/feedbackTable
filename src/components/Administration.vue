<template>
    <section class="section section-conf">
        
        <div class="content-table"> 
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ФИО</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th>Пароль</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(data, index) in userInfoTable" :value="data" :key="index"
                            @dblclick="rowIsChoosenIndex=index, rowIsChoosen=true"
                        >
                            <td>{{data.userid}}</td>
                            <td>{{data.fio}}</td>
                            <td>{{data.email}}</td>
                            <td>{{data.lvl}}</td>
                            <td>{{data.password}}</td>
                        </tr>
                    </tbody>
                </table>
        </div>     
           <!-------------------------------------------------------------------------------------------------------------->
            <div class="modal is-active" v-if="modalWindow || rowIsChoosen ">
                <div class="modal-background modal-background-edit">
                    <div class="notification is-danger notification-edit" v-if="errorNotify">
                        <button class="delete" @click="errorNotify=false"></button>
                        <strong>Ошибка ввода данных! Поля не могут быть пустыми!</strong>
                    </div>
                     <div class="notification is-success notification-edit" v-if="successNotify">
                        <button class="delete" @click="successNotify=false"></button>
                        <strong v-if="updateUser">Пользователь изменён!</strong>
                        <strong v-else>Пользователь создан!</strong>
                    </div>
                </div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title" v-if="modalWindow">Создание пользователя</p>
                        <p class="modal-card-title" v-else>Изменить пользователя</p>
                        <button class="delete" aria-label="close" @click="modalWindow=false, rowIsChoosen=false"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="field">
                            <label class="label">USERID</label>  
                            <div class="control">
                                <input v-model="userInfoTable[rowIsChoosenIndex].userid" class="input" type="text" disabled>
                            </div>  
                        </div>
                        <div class="field">
                            <label class="label">ФИО</label>
                            <div class="control">
                                <input 
                                    class="input" :class="{'is-danger': inputDanger}"  
                                    v-if="rowIsChoosen"
                                    v-model="userInfoTable[rowIsChoosenIndex].fio"
                                >
                                <input
                                    class="input"
                                    :class="{'is-danger': inputDanger}"
                                    type="text" placeholder="Введите Ф.И.О."   
                                    v-else
                                    v-model="userInfo.fio"
                                >
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input 
                                    class="input" :class="{'is-danger': inputDanger}"  
                                    v-if="rowIsChoosen"
                                    v-model="userInfoTable[rowIsChoosenIndex].email"
                                >
                                <input
                                    class="input"
                                    :class="{'is-danger': inputDanger}"
                                    type="text" placeholder="Введите Email"   
                                    v-else
                                    v-model="userInfo.email"
                                >
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Роль</label>
                            <div class="select" :class="{'is-danger': inputDanger}">
                                <select v-if="rowIsChoosen" v-model="userInfoTable[rowIsChoosenIndex].lvl" >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                                <select v-else v-model="userInfo.lvl">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                                    
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Пароль</label>
                            <div class="control">
                                <input 
                                    class="input" :class="{'is-danger': inputDanger}"  
                                    v-if="rowIsChoosen"
                                    v-model="userInfoTable[rowIsChoosenIndex].password"
                                >
                                <input
                                    class="input"
                                    :class="{'is-danger': inputDanger}"
                                    type="text" placeholder="Введите Пароль"   
                                    v-else
                                    v-model="userInfo.password"
                                >
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" v-if="modalWindow" @click="newUserCreate">Создать</button>
                        <button class="button is-success" v-else @click="userChanger">Применить</button>
                        <button class="button" @click="clearModalWindow">Отменить</button>
                    </footer>
                </div>

            </div>
        
    </section>
    
</template>

<script>
import axios from 'axios'
import store from '../store'
import '../router'
import '../../node_modules/bulma/css/bulma.css'

export default{
    data(){
        return{
            //новый
            userInfo: {
                userid: undefined,
                fio: undefined,
                email: undefined,
                lvl: undefined,
                password: undefined
            },
            //modalWindow
            modalWindow: false,
            inputDanger: false,
            successNotify: false,
            errorNotify: false,
            inputSuccess: false,
            //для загруженных
            userInfoTable: [],
            //для изменения
            updateUser: false,
            //для выбора элементов таблицы
            rowIsChoosen: false,
            rowIsChoosenIndex: '',
        }
    },

    methods:{
        getAllUsers: async function(){
            await axios
                .get(`http://${store.state.url}:${process.env.VUE_APP_PORT}/getUsers`)
                .then(response => {
                    this.userInfoTable = response.data
                    
                })
                .catch(error => console.log(error))    
        },  

        newUserCreate: async function(){
            for(let key in this.userInfo){
                if(this.userInfo[key] === undefined){
                    console.log('Поле ' + key + ' пустое!')
                    this.inputDanger = true
                    this.errorNotify = true
                }
            }

            if(!this.inputDanger){
                console.log(JSON.stringify(this.userInfo))
                await axios({
                    url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/createUser`,
                    method: 'POST',
                    data: [JSON.stringify(this.userInfo)] 
                })
                .then(response =>  {
                    
                    if(response.statusText === 'OK'){
                        this.successNotify = true
                        this.getAllUsers()
                    }
                })
                .catch(error => (console.log(error)))

            }
           
        },

        userChanger: async function(){
            console.log(JSON.stringify(this.userInfoTable[this.rowIsChoosenIndex]))
            await axios({
                url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/userChanger`,
                method: 'POST',
                data: [JSON.stringify(this.userInfoTable[this.rowIsChoosenIndex])]
            })
            .then(response => {
                console.log('statustext ' + response.statusText)
                if(response.statusText === 'OK'){
                    this.successNotify = true
                    this.updateUser = true
                    this.getAllUsers()
                }
            })
            .catch(error => (console.log(error)))
        },
        
        clearModalWindow:function(){
            this.userInfo = {
                fio: undefined,
                email: undefined,
                role: undefined,
                password: undefined
            }
            //this.modalWindow = false
            this.rowIsChoosen = false
            this.inputDanger = false
            this.modalWindow=false
            this.rowIsChoosen=false
            this.getAllUsers()
        }  
    },

    mounted: function(){
        this.getAllUsers()
    }
}
</script>

<style scoped>
.section-conf{ 
  padding: 0 3rem;
}

.top-panel{
    border: solid 4px #fefefe;
    border-radius: 8px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 30px;
    margin-top: 15px;
    height: 90px;
    position: sticky;
    top: 0;
}

.content-table table{
    width: 100%;
   
}

table tbody tr:hover {background-color: beige; }
.zxc{
  color: #fefefe;
}
.zxc:hover{
  color: #3a3b3b;
}

.modal-background-edit{
    display: flex;
    flex-direction: column-reverse;
}

.notification-edit{
    width: 15%;
    transition: 0.5s;
}
.cursorPointer:hover{
  cursor: pointer;
}

</style>