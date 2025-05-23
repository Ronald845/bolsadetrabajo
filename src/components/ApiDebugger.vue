<template>
  <div class="card mt-3">
    <div class="card-header bg-info text-white">
      <h5 class="mb-0">🔧 Debug de Conexión API</h5>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <strong>URL de la API:</strong> {{ apiUrl }}
      </div>
      
      <button 
        class="btn btn-primary me-2" 
        @click="testConnection"
        :disabled="testing"
      >
        <span v-if="testing" class="spinner-border spinner-border-sm me-2"></span>
        {{ testing ? 'Probando...' : 'Probar Conexión' }}
      </button>
      
      <button 
        class="btn btn-secondary me-2" 
        @click="testLogin"
        :disabled="testing"
      >
        Probar Login (datos falsos)
      </button>
      
      <button 
        class="btn btn-warning" 
        @click="clearStorage"
      >
        Limpiar Storage
      </button>
      
      <div v-if="result" class="mt-3">
        <div :class="resultClass">
          <strong>Resultado:</strong> {{ result }}
        </div>
      </div>
      
      <div v-if="logs.length > 0" class="mt-3">
        <h6>Logs:</h6>
        <div class="border p-2 bg-light" style="max-height: 200px; overflow-y: auto;">
          <div v-for="(log, index) in logs" :key="index" class="small">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { testConnection } from '../services/api'
import axios from 'axios'

export default {
  name: 'ApiDebugger',
  data() {
    return {
      testing: false,
      result: '',
      resultClass: '',
      logs: [],
      apiUrl: process.env.VUE_APP_API_BASE_URL || 'https://localhost:7000/api'
    }
  },
  methods: {
    addLog(message) {
      this.logs.push(`${new Date().toLocaleTimeString()}: ${message}`)
    },
    
    async testConnection() {
      this.testing = true
      this.result = ''
      this.logs = []
      
      try {
        this.addLog('Iniciando test de conexión...')
        
        // Test básico de conectividad
        const response = await axios.get(`${this.apiUrl}/Usuario/todos`, {
          timeout: 5000
        })
        
        this.addLog(`Respuesta HTTP: ${response.status}`)
        this.result = '✅ Conexión exitosa con la API'
        this.resultClass = 'alert alert-success'
        
      } catch (error) {
        this.addLog(`Error: ${error.message}`)
        
        if (error.code === 'ECONNREFUSED') {
          this.result = '❌ No se puede conectar. ¿Está la API ejecutándose?'
        } else if (error.code === 'ENOTFOUND') {
          this.result = '❌ Host no encontrado. Verifica la URL.'
        } else if (error.message.includes('certificate')) {
          this.result = '❌ Error de certificado SSL. Prueba con HTTP.'
        } else {
          this.result = `❌ Error: ${error.message}`
        }
        
        this.resultClass = 'alert alert-danger'
      } finally {
        this.testing = false
      }
    },
    
    async testLogin() {
      this.testing = true
      this.result = ''
      this.logs = []
      
      try {
        this.addLog('Probando endpoint de login...')
        
        const response = await axios.post(`${this.apiUrl}/Usuario/login`, {
          correo: 'test@test.com',
          clave: 'password123'
        }, {
          timeout: 5000
        })
        
        this.addLog(`Respuesta: ${response.status}`)
        this.result = '✅ Endpoint de login responde (aunque las credenciales sean falsas)'
        this.resultClass = 'alert alert-success'
        
      } catch (error) {
        this.addLog(`Error: ${error.message}`)
        
        if (error.response?.status === 401) {
          this.result = '✅ Endpoint funciona (credenciales incorrectas, como esperado)'
          this.resultClass = 'alert alert-success'
        } else if (error.response?.status === 404) {
          this.result = '❌ Endpoint /Usuario/login no encontrado'
          this.resultClass = 'alert alert-danger'
        } else {
          this.result = `❌ Error: ${error.message}`
          this.resultClass = 'alert alert-danger'
        }
      } finally {
        this.testing = false
      }
    },
    
    clearStorage() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$store.dispatch('logout')
      this.result = '🗑️ Storage limpiado'
      this.resultClass = 'alert alert-info'
    }
  }
}
</script>