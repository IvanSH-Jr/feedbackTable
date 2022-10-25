<template>
<div>
<section class="section section-conf">
    <div id="pageUp"></div>
    <div class="forButtons" @click="panelShow=false">
      <div class="forButtons__end">
        <div class="forButtons__end__buttons">
          <div class="addNote__Button">
            <a href="#pageDown" class="page-down-none">
              <button class="button is-normal is-dark my_button-color" v-on:click="createTask">Создать запись</button>
            </a>
          </div>

          <div class="addNote__Button">
            <button class="button is-normal is-dark my_button-color" v-on:click="deniedTask" :disabled="!panelShow">Редактировать</button>
          </div> 

        </div>

        <div class="switcher">
          <div class="pretty p-switch p-fill">
            <input type="checkbox" v-model="myNotesFlag"/>
              <div class="state p-info">
                <label>Ваши записи</label>
              </div>
          </div>
         
          <div class="pretty p-switch p-fill">
            <input type="checkbox" v-model="adressToYouFlag"/>
              <div class="state p-info">
                <label>Адресовано вам</label>
              </div>
          </div>

          <div class="pretty p-switch p-fill">
            <input type="checkbox" v-model="statusSolvedFlag"/>
              <div class="state p-info">
                <label>Показать решённые </label>
              </div>
          </div>
       
        </div>
        
      </div>
    </div>
    
  <div class="angles-center"><a href="#pageDown"><font-awesome-icon class="fa-2x cursorPointer zxc" icon="angle-double-down" /></a></div>

  <div class="tableBorder">
    <table>

      <thead>
        <tr class="tableHead">
              <th><strong>№</strong></th>
              <th><strong>Запись</strong></th>
              <th>
                <strong>Автор</strong>
              </th>
              <th><strong>Дата</strong></th>
              <th><strong>Кому адресовано</strong></th>
              <th><strong>Статус</strong></th>
              <th><strong>Комментарии</strong></th>
              <!--<th><strong><input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/></strong></th>-->
        </tr>
      </thead>
      <tbody>
        <tr class="tableBody" v-bind:class="{'active': isActive==data.id}"
            v-for="(data, i) in filterNotes" :value="data" :key="i"
            @click.capture="selectedRow = data,isActive = showFullText =  data.id, panelShow=true, stopCreate=false, iconType='angle-up'"
            >
            <td>
              <span>{{data.id}}</span>
            </td>
            <td class="forTable">
              <div>
                <span class="forTable__span" :class="{'forTable__spanNone': showFullText == data.id}">{{data.problem}}</span>
                <div class="centerIcon">
                  <font-awesome-icon v-if="showFullText == data.id" class="fa-2x cursorPointer angleColor" icon='angle-up' @click="showFullText = 0, isActive = 0"/>
                  <font-awesome-icon v-else class="fa-2x cursorPointer angleColor" icon='angle-down'/>
                </div>
              </div>
            </td>
            <td class="tableBody__who">{{data.fio}}</td>
            <td>{{data.date}}</td>
            <td>
               <div>
                 <span 
                   v-for="(name, index) in data.towhom" :key="index">
                   {{name}}
                   <span v-if="(data.towhom.length - 1) > 0">, </span>
                 </span> 
               </div>
             </td>
            <td :class="{
              danger:  data.state == 'Не решено', 
              warning: data.state == 'Принято в работу',
              success: data.state == 'Решено',
              testing: data.state == 'На проверке'
              }">
                <div>
                  <span>{{data.state}}</span>
                </div>
            </td>      
            <td><a class="showComments" @click.self="discussion = true">Показать</a></td>
        </tr>
      </tbody>
    </table>
    <DiscussionVue v-if="discussion" v-bind:selected-row="selectedRow" @close-discussion="discussion=false">
    </DiscussionVue>
<!--------------------СОЗДАНИЕ ЗАПИСИ------------------------->
   
      <div class="modal is-active" v-if="createTable || updateTask">
        <div class="modal-background modal-background-edit">
          <Transition >
          
              <div class="notification notification-edit" :class="{'is-danger': errorNotify}" v-if="errorNotify || successNotify">
                <strong v-if="errorNotify">Ошибка ввода данных! Поля не могут быть пустыми!</strong>
              </div>
            
          </Transition>
        </div>
        <!--MODAL-WINDOW-->
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title" v-if="createTable">Создание записи</p>
            <p class="modal-card-title" v-else>Изменение записи</p>
            <button class="delete" aria-label="close" v-on:click.stop="cancelChange()"></button>
          </header>
          <section class="modal-card-body" v-if="selectedRow">
            <div class="field">
              <label class="label"><span>Номер записи</span></label>
              <input  v-if="createTable" class="input" type="text" :value="editRow.id" disabled>
              <input v-else v-model="selectedRow.id" class="input" type="text" disabled>
            </div>
            <!--PROBLEM-->
            <div class="field">
               <label class="label"><span>Текст записи</span></label>
              <div class="control">
                <textarea v-if="createTable" class="textarea is-small only-text" placeholder="Сообщение" v-model="editRow.problem"></textarea>
                <textarea v-else class="textarea is-small only-text" placeholder="Сообщение" v-model="selectedRow.problem" disabled></textarea>
              </div>
            </div>
            <!--WHO-->
            <div class="field">
              <label class="label"><span>Автор записи</span></label>
              <input v-if="createTable" class="input" type="text" :value="editRow.fio" disabled>
              <input v-else class="input" type="text" v-model="selectedRow.fio" disabled>
            </div>
            <!--DATE-->
            <div class="field">
              <label class="label"><span>Дата создания</span></label>
              <input v-if="createTable"  class="input" type="text" :value="editRow.date" disabled>
              <input v-else  class="input" type="text" :value="selectedRow.date" disabled>
            </div>
            <!--TO-WHOM-->
            <div class="field">
              <Multiselect
                v-if="createTable"
                v-model="editRow.towhom"
                mode="tags"
                placeholder="Адресат(ы)"
                :options="filterOptions "
              >
              </Multiselect>
              <Multiselect
                v-else
                v-model="selectedRow.towhom"
                mode="tags"
                placeholder="Адресат(ы)"
                :options="filterOptions"
              >
              </Multiselect>
            </div>
            <!--STATE-->
            <div class="field">
              <label class="label"><span>Статус</span></label>
              <div class="select is-info">
                <select v-if="createTable" v-model="editRow.state">
                  <option>Не решено</option>
                  <option>Принято в работу</option>
                  <option>Решено</option>
                  <option>На проверке</option>
                </select>
                <select v-else v-model="selectedRow.state">
                  <option>Не решено</option>
                  <option>Принято в работу</option>
                  <option :disabled="сhangeDenied">Решено</option>
                  <option>На проверке</option>
                </select>
              </div>
            </div>
            <!--COM-->
            <div class="field" >
              <label class="label"><span>Дополнения/Комментарий</span></label>
              <div class="control">
                <textarea v-if="createTable" class="textarea is-small only-text" placeholder="Сообщение" v-model="editRow.comment"></textarea>
                <textarea v-else class="textarea is-small only-text" placeholder="Сообщение" v-model="selectedRow.comment"></textarea>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button v-if="createTable" class="button is-success" v-on:click="saveTask">Создать</button>
            <button v-else class="button is-success" v-on:click="onChange">Применить</button>
            <button class="button" v-on:click.stop="cancelChange(), panelShow=false, updateTask=false, createTable=false, stopCreate=true" >Отменить</button>
          </footer>
        </div>
      </div>
    <div class="angles-center" id="pageDown"><a href="#pageUp"><font-awesome-icon class="fa-2x cursorPointer zxc" icon="angle-double-up" /></a></div>
   </div>



  </section>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import store from '../store'
import '../router'
import 'pretty-checkbox'
import Multiselect from '@vueform/multiselect'
import DiscussionVue from './Discussion.vue';


export default {
 
  components: {
    Multiselect,
    DiscussionVue
  },

  data (){
    return{
      editRow: {
        id: "",
        problem: "",
        fio: "",
        userid: "",
        date: "",
        towhom: [],
        state: "Не решено",
        comment: ''
      },
      file: '',
      iconType: 'angle-down',
      showFullText: false,
      discussion: false,
      selectedRow: {},
      editRow_Error: false,
      burgerOpen: false,
      inputUserData: {
        name: '',
        email: '',
        role: '',
        password: ''
      },
      //
      tableData: [],
      createTable: false,
      myNotesFlag: false,
      adressToYouFlag: false,
      statusSolvedFlag: false,
      updateTask: false,
      сhangeDenied: false,
      errorNotify: false,
      successNotify: false,
      update_Row: false,
      row_Create: false,
      bigData: {},
      isActive: 0,
      stopCreate: true,
      //для серевера
      yourURL: '',
      transToServer:{},
      flag:  false,
      /////////////
      idCounter: 0,
      checkbox: false,
      changeBox: true,
      //Для даты создания записи
      toDayDate: "",
      //панель управления
      panelShow: false,
      cancelData: '',
      value: [],
      adminFlag: false,
      characterSelected: [
          'Шадрин И.И.', 
          'Дьячков Е.В.',
          'Шкурат Е.В.', 
          'Хорев А.О.',  
          'Горнак А.М.', 
          'Быков А.Г.',  
          'Лучкин Д.В.',
          'Фочкин В.И.'
      ],
    }
  },

  

  methods:{

    handleFileUpload(){
      this.file = this.$refs.file.files[0]
      //console.log(this.file)
      let formData = new FormData()
      formData.append('file', this.file)
      console.log(formData)
    },
    createTask: function(e){
      if(e){
        moment.locale('ru')
        this.toDayDate = new Date()
        this.createTable = true
        this.editRow.id = this.idCounter + 1
        this.editRow.date = moment(this.toDayDate).format('L')
      }
    },

    saveTask: async function(e){
      if(e){
        this.editRow_Error = false
        //console.log(this.editRow)
        /*
        for(let key in this.editRow){
          if(this.editRow[key] == '' || this.editRow[key] == undefined){
            this.editRow_Error = true
          }
        }*/
        if(this.editRow_Error){
          this.errorNotify = true
        }else{
          if(this.checkbox){
            this.checkbox = false
          }
         this.checkbox = false
          await axios({
            url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/createTask`,
            method: 'POST',
            headers:{
            },
            data: [this.editRow]
            })
          .then(response => {
            if(response.status == 200)
            {
              store.state.updatedFlag = true
              this.successNotify = true
              this.row_Create = true
              this.getAllData()
            }
          
            })

            this.editRow = {
              id: this.idCounter,
              problem: "",
              fio: localStorage.getItem('userFIO'),
              date: "",
              towhom: [],
              state: "",
              comment:''
            }
          this.createTable = false 
        }
      } 
    },

    deniedTask: function(){
      this.updateTask=true
      //console.log(this.selectedRow.fio)
      //console.log(localStorage.getItem('userFIO'))
      if(this.selectedRow.fio !== localStorage.getItem('userFIO')){
       this.сhangeDenied = true
      } 
    },

    onChange: async function(e){
        if(e){
          this.flag = true
          this.notify = true
          this.checkbox = false
          let author = localStorage.getItem('userFIO')
          //console.log(this.selectedRow)
          this.selectedRow.towhom = this.filterToWhom(this.selectedRow.towhom)
          console.log(this.selectedRow.towhom)
          await axios({
            url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/updateTask`,
            method: 'POST',
            data: [this.selectedRow, author]
              })
              .then(res => {
                console.log(res.data) 
                this.updateTask = false
                this.getAllData()
              })
              .catch(error => (console.log(error)))
      }
        
    },

    getAllData: async function(){
      moment.locale('ru') 
      await axios
        .get(`http://${store.state.url}:${process.env.VUE_APP_PORT}/getAllTask`)
        .then(response => (
          this.tableData = response.data
          ))
        .catch(error => console.log(error))

        this.idCounter = this.tableData.length
        for(let steps = 0; steps < this.tableData.length; steps++){
          this.tableData[steps].date =  moment(this.tableData[steps].date).format('L')
          //console.log(this.tableData[steps+1].problem)
        }
        
        //console.log(this.tableData)
    },

    cancelChange: async function(){
      this.errorNotify = false
      this.successNotify = false
      this.isActive = 0
      this.updateTask=false
      this.editRow = {
        id: "",
        problem: "",
        fio: localStorage.getItem('userFIO'),
        userid: "",
        date: "",
        towhom: [],
        state: "Не решено",
        comment: ''
      }       
      if(this.createTable == true){
        this.createTable = false
        this.checkbox=false
        this.editRow = {
          id: "",
          problem: "",
          fio: localStorage.getItem('userFIO'),
          userid: "",
          date: "",
          towhom: [],
          state: "Не решено",
          comment: ''
        }       
      }
      else{
          this.panelShow = false
          this.checkbox=false
          this.getAllData()
          }
    },

    filterToWhom: function(arrCheck){
      //console.log(this.selectedRow)
      //console.log(arrCheck.length)
      for(let step = 0; step < arrCheck.length; step++){
        console.log(arrCheck[step])
        if(arrCheck[step] == this.selectedRow.fio){
          this.selectedRow.towhom.splice(step, 1)
          return this.selectedRow.towhom
        }
      }
      return arrCheck
    },

  },

  mounted: function() {
    this.getAllData()
    this.editRow.fio = localStorage.getItem('userFIO')
    this.editRow.userid = localStorage.getItem('userId')
    //this.filterNotes()
  },

  computed: {
    filterNotes(){
      if(this.myNotesFlag){
      //let yourNotes = this.tableData.filter(item => (item.fio == localStorage.getItem('userFIO')) || (item.towhom.find(user => user == localStorage.getItem('userFIO'))) )
        let yourNotes = this.tableData.filter(item => (item.fio == localStorage.getItem('userFIO')))
      //console.log(yourNotes)
      return yourNotes
      }
      if(this.adressToYouFlag){
        let toYouNotes = this.tableData.filter(item => (item.towhom.find(user => user == localStorage.getItem('userFIO'))))
        //console.log(toYouNotes)
        return toYouNotes
      }
      if(this.statusSolvedFlag){
        let solvedNotes = this.tableData.filter(item => (item.state == 'Решено'))
        return solvedNotes
      }
      if(!this.statusSolvedFlag){
        let unSolvedNotes = this.tableData.filter(item => (item.state !== 'Решено'))
        return unSolvedNotes
      }
    return this.tableData
    },
  
    filterOptions(){
      if(this.createTable || this.updateTask){
        //console.log('ct ' + this.createTable + ' ut ' + this.updateTask + 'who ' + this.editRow.fio)
        for(let step = 0; step < this.characterSelected.length; step++){
          if(this.characterSelected[step] == this.editRow.fio){
            let newCharacters = this.characterSelected.slice()
            newCharacters.splice(step, 1)
            //console.log(newCharacters)
            return newCharacters
          }
        }
      }
    return this.characterSelected
    }
  }   
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.section-conf{ 
  padding: 0 3rem;
}

.modal-background-edit{
    display: flex;
    flex-direction: column-reverse;
}
.notification-edit{
    width: 15%;
    margin-left: 10px;
    margin-bottom: 10px;
}
.danger{
  background-color: rgb(241, 70, 104, .6);
}
.warning{
  background-color: rgb(255, 224, 138, .6);
}
.success{
  background-color: rgb(72, 199, 142, .6);
}
.testing{
  background-color: rgb(62, 142, 208, .6);
}
.select-text-color{
  color: forestgreen;
}

.forButtons{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: rgb(37, 104, 104);
  z-index: 1;
  height: 90px;
}
.forButtons__end{
  display: flex;
  justify-content: space-between;
  width: 58.2%;
}
.forButtons__end__buttons{
  display: flex;
}
.addNote__Button:nth-child(n + 2){
  margin-left: 20px;
}


.switcher{
  color: #fefefe;
  display: flex;
  align-items: center;
}
.pretty.p-switch input:checked~.state.p-info:before {
    border-color: #fefefe;
}

.pretty.p-switch .state:before{
  border: 1.5px solid #fefefe;
}
.pretty .state label:before {
    border-color: #fefefe;
}
.my_button-color{ 
  background-color: rgb(72, 199, 142, .6);
}

.zxc{
  color: #fefefe;
}

.zxc:hover{
  color: rgb(72, 199, 142, .7);
}

.angles-center{
  text-align: center;
  margin: 5px auto;
}

.forTable{
  text-align: left;
}
.forTable div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.forTable div .centerIcon{
  display: flex;
  align-items: center;
}
.forTable__span{
  width: 450px;
  vertical-align: middle;
  overflow: hidden;
  display: inline-block; 
  text-overflow: ellipsis;
  white-space: nowrap;
}
.forTable__spanNone{
  overflow: auto;
  text-overflow: clip;
  white-space: normal;
}

.panelShow__Buttons{
  margin: 15px 15px 10px 10px;
}

.active{
  background-color: #afd6f0 !important;
}

.page-down-none{
  outline: none;
  text-decoration: none;
}

.showComments{
  outline: none;
  text-decoration: none;
}

table{ 
  width:100%;
} 

.only-text{
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-size: 20px;
}
.tableHead{
  background: #46c88f;
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-size: 20px;
}
.tableHead th{padding: 12px 16px; border: 1px solid #3a3b3b;  text-align:center; vertical-align: middle;}

.tableHead  th{ position: sticky; top: 88px; background: #46c88f; z-index: 1;}

.tableBody{
  background-color: #fefefe;
}

.tableBody__who{
  width: 12%;
}
table td {padding: 12px 16px; border: 1px solid #3a3b3b;font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif; font-size: 20px;  vertical-align: middle; text-align: center;}
table tbody tr:hover {background-color: rgb(229, 226, 226); }
.cursorPointer:hover{
  cursor: pointer;
}

.angleColor{
  color: rgba(128, 130, 130, 0.6);
}

.bulma-box{
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}

.forFooter-contact{
  font-family: "Source Sans Pro", "Helvetica Neue", Arial;
  font-size: 25px;
}

.forFooter-line{
  background-color: #b5b5b5;
  margin: 0;
}

</style>