"use strick"
import { createStore } from 'vuex'

let store = createStore({
    state: {
        authChekFlag: false,
        userRole:localStorage.getItem('userRole') || '',
        userFIO: localStorage.getItem('userFIO') || '',
        accessToken: localStorage.getItem('access_token') || '',
        refreshToken: localStorage.getItem('refresh_token') || '',
        userID: localStorage.getItem('userId') || '',
        last_route: localStorage.getItem('last_route') || '',
        adminFlag: false,
        updatedFlag: false,
        url: '',
        exit: false,
        port:8080,
      },
})



export default store