import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

// Inicializar autenticación desde localStorage ANTES de montar la app
console.log('🚀 Inicializando aplicación...')
store.dispatch('initializeAuth').then(() => {
  console.log('✅ Auth inicializado:', store.getters.isAuthenticated)
  
  app.use(store)
  app.use(router)
  app.mount('#app')
})