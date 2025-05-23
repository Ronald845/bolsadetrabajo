<template>
  <div class="login-form-wrapper">
    <div class="form-header">
      <h3 class="form-title">Iniciar Sesión</h3>
      <p class="form-subtitle">Accede a tu cuenta</p>
    </div>

    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="correo" class="form-label">
          <i class="fas fa-envelope label-icon"></i>
          Correo Electrónico
        </label>
        <div class="input-wrapper">
          <input
            type="email"
            class="form-control modern-input"
            id="correo"
            v-model="form.correo"
            :class="{ 'is-invalid': errors.correo, 'is-valid': form.correo && !errors.correo }"
            placeholder="tu@email.com"
            required
          >
          <div class="input-focus-border"></div>
        </div>
        <div v-if="errors.correo" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errors.correo }}
        </div>
      </div>
      
      <div class="form-group">
        <label for="clave" class="form-label">
          <i class="fas fa-lock label-icon"></i>
          Contraseña
        </label>
        <div class="input-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control modern-input"
            id="clave"
            v-model="form.clave"
            :class="{ 'is-invalid': errors.clave, 'is-valid': form.clave && !errors.clave }"
            placeholder="Tu contraseña"
            required
          >
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
          <div class="input-focus-border"></div>
        </div>
        <div v-if="errors.clave" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errors.clave }}
        </div>
      </div>
      
      <div v-if="error" class="alert alert-danger modern-alert">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
      </div>
      
      <button
        type="submit"
        class="btn btn-primary modern-btn w-100"
        :disabled="loading || !form.correo || !form.clave"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="fas fa-sign-in-alt me-2"></i>
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
      
      <div class="form-footer">
        <p class="register-link">
          ¿No tienes cuenta? 
          <router-link to="/register" class="link-primary">
            Regístrate aquí
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginForm',
  emits: ['login-success'],
  data() {
    return {
      form: {
        correo: '',
        clave: ''
      },
      errors: {},
      showPassword: false
    }
  },
  computed: {
    ...mapGetters(['loading', 'error'])
  },
  mounted() {
    console.log('🔵 LoginForm montado correctamente')
    console.log('📦 Store disponible:', !!this.$store)
    console.log('🛣️ Router disponible:', !!this.$router)
  },
  methods: {
    validateForm() {
      console.log('🔍 Validando formulario...')
      this.errors = {}
      
      if (!this.form.correo) {
        this.errors.correo = 'El correo es requerido'
      } else if (!/\S+@\S+\.\S+/.test(this.form.correo)) {
        this.errors.correo = 'El correo no es válido'
      }
      
      if (!this.form.clave) {
        this.errors.clave = 'La contraseña es requerida'
      }
      
      console.log('📋 Errores de validación:', this.errors)
      return Object.keys(this.errors).length === 0
    },
    
    async handleSubmit() {
      console.log('🚀 handleSubmit llamado')
      console.log('📝 Datos del formulario:', {
        correo: this.form.correo,
        clave: this.form.clave ? '****' : 'VACÍA'
      })
      
      if (!this.validateForm()) {
        console.log('❌ Validación fallida')
        return
      }
      
      try {
        console.log('🔄 Intentando login...')
        const result = await this.$store.dispatch('login', this.form)
        
        console.log('✅ Resultado del login:', result)
        
        if (result.success) {
          console.log('🎉 Login exitoso, rol detectado:', result.user.rol)
          
          // Emitir evento al padre
          this.$emit('login-success', result.user)
          
          // Navegar directamente sin esperar
          console.log('🔄 Navegando inmediatamente...')
          this.forceRedirect(result.user.rol)
        }
      } catch (error) {
        console.error('❌ Error en login:', error)
        console.error('Stack trace:', error.stack)
      }
    },
    
    forceRedirect(role) {
      console.log('🚀 forceRedirect llamado con rol:', role)
      
      // Normalizar el rol a primera letra mayúscula
      const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      console.log('📋 Rol normalizado:', normalizedRole)
      
      try {
        let targetRoute = '/'
        
        switch (normalizedRole) {
          case 'Aspirante':
            targetRoute = '/aspirante'
            break
          case 'Empresa':
            targetRoute = '/empresa'
            break
          case 'Admin':
            targetRoute = '/admin'
            break
          default:
            console.error('⚠️ Rol no reconocido:', normalizedRole)
            targetRoute = '/'
        }
        
        console.log('🎯 Navegando a:', targetRoute)
        
        // Intentar diferentes métodos de navegación
        this.$router.push(targetRoute).then(() => {
          console.log('✅ Navegación exitosa a:', targetRoute)
        }).catch((error) => {
          console.error('❌ Error al navegar:', error)
          // Intentar con replace
          this.$router.replace(targetRoute).catch((err) => {
            console.error('❌ Error con replace:', err)
            // Último intento: forzar con window.location
            window.location.href = targetRoute
          })
        })
        
      } catch (error) {
        console.error('❌ Error en redirección:', error)
      }
    }
  }
}
</script>

<style scoped>
.debug-info {
  background: #f0f0f0;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-family: monospace;
}

.login-form-wrapper {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #64748b;
  margin-bottom: 0;
  font-size: 1rem;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.label-icon {
  margin-right: 0.5rem;
  color: #3b82f6;
  width: 16px;
}

.input-wrapper {
  position: relative;
}

.modern-input {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  color: #1e293b;
}

.modern-input:focus {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.1);
  outline: none;
}

.modern-input.is-valid {
  border-color: #10b981;
  background: #f0fdf4;
}

.modern-input.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
}

.input-focus-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: all 0.3s ease;
}

.modern-input:focus + .input-focus-border {
  width: 100%;
  left: 0;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #3b82f6;
}

.error-message {
  display: flex;
  align-items: center;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.error-message i {
  margin-right: 0.5rem;
}

.modern-alert {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modern-alert i {
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.modern-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 12px;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: white;
  cursor: pointer;
}

.modern-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25);
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.modern-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.modern-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.modern-btn:hover::before {
  left: 100%;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
}

.register-link {
  color: #64748b;
  margin-bottom: 0;
  font-size: 0.9rem;
}

.link-primary {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link-primary:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Animaciones */
.form-group {
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.form-group:nth-child(3) { animation-delay: 0.3s; }
.form-group:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 576px) {
  .form-title {
    font-size: 1.5rem;
  }
  
  .modern-input {
    padding: 0.625rem 0.875rem;
  }
  
  .modern-btn {
    padding: 0.75rem 1.5rem;
  }
}
</style>