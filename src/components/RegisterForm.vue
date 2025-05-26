<template>
  <div class="register-form-wrapper">
    <div class="form-header">
      <h3 class="form-title">Crear Cuenta</h3>
      <p class="form-subtitle">Completa tu información</p>
    </div>

    <form @submit.prevent="handleSubmit" class="register-form">
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
            :class="{ 'is-invalid': errors.correo }"
            placeholder="tu@email.com"
            required
          >
        </div>
        <div v-if="errors.correo" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errors.correo }}
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6">
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
                :class="{ 'is-invalid': errors.clave }"
                placeholder="Contraseña segura"
                required
              >
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.clave" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.clave }}
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="form-group">
            <label for="confirmarClave" class="form-label">
              <i class="fas fa-lock label-icon"></i>
              Confirmar Contraseña
            </label>
            <div class="input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control modern-input"
                id="confirmarClave"
                v-model="form.confirmarClave"
                :class="{ 'is-invalid': errors.confirmarClave }"
                placeholder="Repetir contraseña"
                required
              >
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.confirmarClave" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.confirmarClave }}
            </div>
          </div>
        </div>
      </div>

      <!-- 🆕 MEDIDOR DE FUERZA DE CONTRASEÑA -->
      <PasswordStrengthMeter 
        v-if="form.clave"
        :password="form.clave"
        @validation-change="handlePasswordValidation"
        @password-generated="handleGeneratedPassword"
      />
      
      <div class="form-group">
        <label for="rol" class="form-label">
          <i class="fas fa-user-tag label-icon"></i>
          Tipo de Usuario
        </label>
        <div class="input-wrapper">
          <select
            class="form-select modern-input"
            id="rol"
            v-model="form.rol"
            :class="{ 'is-invalid': errors.rol }"
            required
          >
            <option value="">Selecciona el tipo de usuario</option>
            <option value="Aspirante">Aspirante (Busco trabajo)</option>
            <option value="Empresa">Empresa (Publico ofertas)</option>
            <!-- Admin NO aparece en el registro público -->
          </select>
        </div>
        <div v-if="errors.rol" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errors.rol }}
        </div>
      </div>
      
      <!-- Campos adicionales para Aspirante -->
      <div v-if="form.rol === 'Aspirante'" class="profile-section">
        <h6 class="section-title">Información Personal</h6>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="primerNombre" class="form-label">Primer Nombre</label>
              <input
                type="text"
                class="form-control modern-input"
                id="primerNombre"
                v-model="profileForm.primerNombre"
                :class="{ 'is-invalid': errors.primerNombre }"
                required
              >
              <div v-if="errors.primerNombre" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.primerNombre }}
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="segundoNombre" class="form-label">Segundo Nombre (Opcional)</label>
              <input
                type="text"
                class="form-control modern-input"
                id="segundoNombre"
                v-model="profileForm.segundoNombre"
              >
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="primerApellido" class="form-label">Primer Apellido</label>
              <input
                type="text"
                class="form-control modern-input"
                id="primerApellido"
                v-model="profileForm.primerApellido"
                :class="{ 'is-invalid': errors.primerApellido }"
                required
              >
              <div v-if="errors.primerApellido" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.primerApellido }}
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="segundoApellido" class="form-label">Segundo Apellido (Opcional)</label>
              <input
                type="text"
                class="form-control modern-input"
                id="segundoApellido"
                v-model="profileForm.segundoApellido"
              >
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="puestoBusca" class="form-label">Puesto que Busca (Opcional)</label>
          <input
            type="text"
            class="form-control modern-input"
            id="puestoBusca"
            v-model="profileForm.puestoBusca"
            placeholder="Ej: Desarrollador, Contador, etc."
          >
        </div>
      </div>
      
      <!-- Campos adicionales para Empresa -->
      <div v-if="form.rol === 'Empresa'" class="profile-section">
        <h6 class="section-title">Información de la Empresa</h6>
        
        <div class="form-group">
          <label for="nombreEmpresa" class="form-label">Nombre de la Empresa</label>
          <input
            type="text"
            class="form-control modern-input"
            id="nombreEmpresa"
            v-model="profileForm.nombreEmpresa"
            :class="{ 'is-invalid': errors.nombreEmpresa }"
            required
          >
          <div v-if="errors.nombreEmpresa" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.nombreEmpresa }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="nombreRepresentante" class="form-label">Nombre del Representante</label>
          <input
            type="text"
            class="form-control modern-input"
            id="nombreRepresentante"
            v-model="profileForm.nombreRepresentante"
            :class="{ 'is-invalid': errors.nombreRepresentante }"
            required
          >
          <div v-if="errors.nombreRepresentante" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.nombreRepresentante }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="descripcionEmpresa" class="form-label">Descripción de la Empresa (Opcional)</label>
          <textarea
            class="form-control modern-input"
            id="descripcionEmpresa"
            v-model="profileForm.descripcionEmpresa"
            rows="3"
            placeholder="Breve descripción de la empresa..."
          ></textarea>
        </div>
      </div>
      
      <div v-if="error" class="alert alert-danger modern-alert">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
      </div>
      
      <div v-if="successMessage" class="alert alert-success modern-alert-success">
        <i class="fas fa-check-circle"></i>
        {{ successMessage }}
      </div>
      
      <button
        type="submit"
        class="btn btn-success modern-btn w-100"
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="fas fa-user-plus me-2"></i>
        {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
      </button>
      
      <div class="form-footer">
        <p class="login-link">
          ¿Ya tienes cuenta? 
          <router-link to="/login" class="link-primary">
            Inicia sesión aquí
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PasswordStrengthMeter from './PasswordStrengthMeter.vue'
import { validators, errorMessages } from '../utils/validators'

export default {
  name: 'RegisterForm',
  emits: ['register-success'],
  components: {
    PasswordStrengthMeter
  },
  data() {
    return {
      form: {
        correo: '',
        clave: '',
        confirmarClave: '',
        rol: ''
      },
      profileForm: {
        // Para Aspirante
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        puestoBusca: '',
        // Para Empresa
        nombreEmpresa: '',
        nombreRepresentante: '',
        descripcionEmpresa: ''
      },
      errors: {},
      successMessage: '',
      passwordValid: false,
      showPassword: false,
      showConfirmPassword: false
    }
  },
  
  computed: {
    ...mapGetters(['loading', 'error']),
    
    isFormValid() {
      return this.passwordValid && 
             this.form.correo && 
             this.form.clave && 
             this.form.confirmarClave && 
             this.form.rol &&
             Object.keys(this.errors).length === 0
    }
  },
  
  methods: {
    validateForm() {
      this.errors = {}
      
      // Validación de email
      if (!this.form.correo) {
        this.errors.correo = 'El correo es requerido'
      } else if (!validators.email(this.form.correo)) {
        this.errors.correo = 'El correo no es válido'
      }
      
      // 🆕 VALIDACIÓN ROBUSTA DE CONTRASEÑA (SOLO FRONTEND)
      if (!this.form.clave) {
        this.errors.clave = 'La contraseña es requerida'
      } else if (!validators.password.isValid(this.form.clave)) {
        this.errors.clave = errorMessages.password.invalid
      }
      
      // Validación de confirmación
      if (!this.form.confirmarClave) {
        this.errors.confirmarClave = 'Confirma tu contraseña'
      } else if (!validators.passwordConfirmation(this.form.clave, this.form.confirmarClave)) {
        this.errors.confirmarClave = errorMessages.password.confirmation
      }
      
      // Validación de rol
      if (!this.form.rol) {
        this.errors.rol = 'Selecciona el tipo de usuario'
      }
      
      // Validaciones específicas por rol
      if (this.form.rol === 'Aspirante') {
        if (!this.profileForm.primerNombre) {
          this.errors.primerNombre = 'El primer nombre es requerido'
        }
        if (!this.profileForm.primerApellido) {
          this.errors.primerApellido = 'El primer apellido es requerido'
        }
      } else if (this.form.rol === 'Empresa') {
        if (!this.profileForm.nombreEmpresa) {
          this.errors.nombreEmpresa = 'El nombre de la empresa es requerido'
        }
        if (!this.profileForm.nombreRepresentante) {
          this.errors.nombreRepresentante = 'El nombre del representante es requerido'
        }
      }
      
      return Object.keys(this.errors).length === 0 && this.passwordValid
    },
    
    // 🆕 MANEJAR CAMBIOS EN VALIDACIÓN DE CONTRASEÑA
    handlePasswordValidation(isValid) {
      this.passwordValid = isValid
      console.log('🔐 Validación de contraseña:', isValid)
    },
    
    // 🆕 MANEJAR CONTRASEÑA GENERADA
    handleGeneratedPassword(newPassword) {
      console.log('🎲 Nueva contraseña generada')
      this.form.clave = newPassword
      this.form.confirmarClave = newPassword
      
      // Triggear validación
      this.$nextTick(() => {
        this.validateForm()
      })
    },
    
    async handleSubmit() {
      console.log('📝 Iniciando proceso de registro...')
      
      if (!this.validateForm()) {
        console.log('❌ Validación del formulario fallida')
        return
      }
      
      try {
        console.log('📝 Iniciando registro para rol:', this.form.rol)
        
        // Primero crear el usuario
        const userResult = await this.$store.dispatch('register', this.form)
        
        if (userResult.success) {
          const userId = userResult.data.id
          console.log('✅ Usuario creado con ID:', userId)
          
          // ⚠️ SOLO crear perfil para Aspirante y Empresa
          // Admin NO necesita perfil adicional porque no tiene tabla asociada
          if (this.form.rol === 'Aspirante' || this.form.rol === 'Empresa') {
            console.log('👤 Creando perfil para:', this.form.rol)
            
            const profileData = {
              idUsuario: userId,
              ...this.profileForm
            }
            
            await this.$store.dispatch('createProfile', {
              profileData,
              userType: this.form.rol
            })
            
            console.log('✅ Perfil creado exitosamente')
          } else if (this.form.rol === 'Admin') {
            console.log('🛡️ Admin creado - No requiere perfil adicional')
          }
          
          this.successMessage = '🎉 ¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.'
          this.$emit('register-success')
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        }
      } catch (error) {
        console.error('❌ Error en registro:', error)
      }
    }
  },
  
  // 🔍 Debug del estado del componente
  watch: {
    passwordValid(newVal) {
      console.log('👀 Password valid changed:', newVal)
    },
    
    'form.clave'(newVal) {
      if (newVal) {
        console.log('👀 Password changed, length:', newVal.length)
      }
    }
  }
}
</script>

<style scoped>
.register-form-wrapper {
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

.register-form {
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
  color: #22c55e;
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
  border-color: #22c55e;
  box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.1);
  outline: none;
}

.modern-input.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
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
  z-index: 10;
}

.password-toggle:hover {
  color: #22c55e;
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

.profile-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e7f3ff 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
}

.section-title {
  color: #22c55e;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: #22c55e;
  border-radius: 2px;
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
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
}

.modern-alert-success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3);
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% { transform: scale(0.95); opacity: 0; }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}

.modern-alert i,
.modern-alert-success i {
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.modern-btn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 12px;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3);
}

.modern-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.modern-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
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

.modern-btn:hover:not(:disabled)::before {
  left: 100%;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
}

.login-link {
  color: #64748b;
  margin-bottom: 0;
  font-size: 0.9rem;
}

.link-primary {
  color: #22c55e;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link-primary:hover {
  color: #16a34a;
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
.form-group:nth-child(5) { animation-delay: 0.5s; }

.profile-section {
  animation: slideInUp 0.6s ease-out;
  animation-delay: 0.7s;
  animation-fill-mode: both;
}

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

/* Estados de carga mejorados */
.modern-btn .spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.1em;
}

/* Efectos de enfoque mejorados */
.modern-input:focus {
  background: white;
  border-color: #22c55e;
  box-shadow: 
    0 0 0 0.2rem rgba(34, 197, 94, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.1);
  outline: none;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .form-title {
    font-size: 1.6rem;
  }
  
  .modern-input {
    padding: 0.625rem 0.875rem;
  }
  
  .modern-btn {
    padding: 0.75rem 1.5rem;
  }
  
  .profile-section {
    padding: 1rem;
  }
  
  .password-toggle {
    right: 0.75rem;
  }
}

@media (max-width: 576px) {
  .profile-section {
    padding: 0.75rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .register-form-wrapper {
    padding: 0 0.5rem;
  }
}

/* Estados de validación mejorados */
.modern-input.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Mejoras visuales adicionales */
.form-group:hover .modern-input:not(:focus) {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.form-select.modern-input {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  padding-right: 2.5rem;
}

/* Indicador de progreso del formulario */
.register-form::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  width: var(--form-progress, 0%);
  transition: width 0.3s ease;
  z-index: 1000;
}
</style>