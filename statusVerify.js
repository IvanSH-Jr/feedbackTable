import store from './src/store'
import axios from 'axios'
import './src/router'

async function authorization(){
  let tokenStatus = 'NONE'

  let sendFromCLI = {
    head: 'ACCESS_TOKEN',
    token: localStorage.getItem('access_token'),
    userfio: localStorage.getItem('userFIO'),
    userid: localStorage.getItem('userId'),
    userlvl: localStorage.getItem('userRole')
  }

  //console.log(sendFromCLI)
  //console.log('SEND ACCESS')
  const accessCheckBack = await accessCheck(sendFromCLI, tokenStatus)

  if(accessCheckBack == 'ACCESS-IS-VALID'){
    //console.log('ifACCESS-IS-VALID ' + accessCheckBack)
    return accessCheckBack
  }

  const refreshCheckBack = await refreshCheck(sendFromCLI, tokenStatus)
  //console.log(refreshCheckBack)

  if(refreshCheckBack == 423){
    //console.log('if423 ' + refreshCheckBack)
    return refreshCheckBack
  }

  if(refreshCheckBack.header == 'Authorization'){
    localStorage.setItem('access_token', refreshCheckBack.accessToken)
    localStorage.setItem('refresh_token', refreshCheckBack.refreshToken)
    //localStorage.setItem('userFIO', refreshCheckBack.userfio)
    //localStorage.setItem('userRole', refreshCheckBack.userlvl)
    localStorage.setItem('userId', refreshCheckBack.userID)
    return 'OLD_TO_NEW_UPDATE'
  }
}

async function accessCheck(sendFromCLI, tokenStatus){
  let tokenStatusBack = tokenStatus
  await axios({
    url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/authorization`,
    method: 'POST',
    data: sendFromCLI
  })
  .then(response => {
    tokenStatusBack = response.data
  })
  .catch(error => (console.log(error)))
  return tokenStatusBack
}

async function refreshCheck(sendFromCLI, tokenStatus){
  let tokenStatusBack = tokenStatus
  sendFromCLI.head = 'REFRESH_TOKEN'
  sendFromCLI.token = localStorage.getItem('refresh_token')
  await axios({
    url: `http://${store.state.url}:${process.env.VUE_APP_PORT}/authorization`,
    method: 'POST',
    data: sendFromCLI
  })
  .then(response => {
    tokenStatusBack = response.data
  })
  .catch(error => (console.log(error)))
  return tokenStatusBack
}

export default authorization