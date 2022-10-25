<template>
    <div class="modal is-active modal-conf">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Комментарии</p>
                <button class="delete" aria-label="close" @click="$emit('closeDiscussion')"></button>
            </header>
            <section class="modal-card-body" v-if="loading">
                <article class="message is-success" 
                    v-for="(data, i) in loadComment" :value="data" :key="i"
                >
                    <div class="message-header message-header-spacebetween">
                        <p>{{data.fio}}</p>
                        <p>{{data.date}}</p>
                    </div>
                    <div class="message-body">
                        {{data.message}}
                    </div>
                </article>            
            </section>
            <section class="modal-card-body" v-else>
                <article class="message is-success">
                    <input class="input is-medium" placeholder="НЕТ ДАННЫХ / ОБСУЖДЕНИЕ НЕ НАЧАТО" disabled>
                </article>
            </section>
            <section class="modal-card-body">
                <article class="message is-success">
                    <input class="input is-medium" placeholder="Комментарий" v-model="sendNewComment.message">
                </article>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="sendComment">Отправить</button>
                <button class="button" @click="$emit('closeDiscussion')">Отменить</button>
            </footer>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import store from '../store'
import moment from 'moment'
"use strick"
export default {
    props:{
        discussionOpen: Boolean,
        selectedRow: Object
    },
    emits:[
        'closeDiscussion'
    ],
    data() {
        return{
            rowData: this.selectedRow,
            modalWindowComment: true,
            loadComment: [],
            loading: true,
            sendNewComment: {
                header: "New_Comment",
                userfio: '',
                message: '',
                commentId: ''
            },
        }
    },

    methods: {
        loadComments: async function(){
            moment.locale('ru')
            const sendDataSelect = {
                header: 'DISCUSSION-LOAD',
                commentId: this.rowData.id,
            }
            //console.log(sendDataSelect)
            await axios({
                url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/loadComments`,
                method: 'POST',
                data: sendDataSelect
            })
            .then(response => {
                //console.log(response.data)
                if(response.data == 'selectFromBase-empty'){
                    this.loading = false
                }
                for(let steps = 0; steps < response.data.length; steps++){
                    response.data[steps].date = moment(response.data[steps].date).format('L')
                }
                this.loadComment = response.data
                //console.log(this.loadComment)
            })
            .catch(error => (console.log(error)))
        },

        sendComment: async function(){
            this.sendNewComment.header = "New_Comment" 
            this.sendNewComment.userfio = localStorage.getItem('userFIO')
            this.sendNewComment.commentId = this.rowData.id
            //console.log(this.sendNewComment)
            await axios({
                url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/sendComment`,
                method: 'POST',
                data: this.sendNewComment
            })
            .then(response => {
                //console.log(response)
                if(response.status == 200){
                    this.loadComments()
                    this.sendNewComment.message = ''
                    this.loading = true
                }  
            })
            .catch(error => (console.log(error)))
        }
    },

    computed: {

    },

    mounted: function() {
        this.loadComments()
    }

}
</script>

<style scoped>
.modal-conf{
    z-index: 99;
}

.message-header-spacebetween{
    display: flex;
    justify-content: space-between;
}
</style>