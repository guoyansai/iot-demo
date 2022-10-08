import { defineStore } from 'pinia'

export default defineStore('user', {
  state() {
    return {
      username: 'asai',
      role: 'asaicc'
    }
  }
})
