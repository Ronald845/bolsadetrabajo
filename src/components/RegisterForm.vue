<template>
  <div class="register-wrapper">
    <div class="header">
      <h3>Crear Cuenta</h3>
      <p>Completa tu información</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Email -->
      <div class="form-group">
        <label><i class="fas fa-envelope"></i>Correo Electrónico</label>
        <input
          type="email"
          v-model="form.correo"
          :class="{ 'error': errors.correo }"
          placeholder="tu@email.com"
          required
        >
        <div v-if="errors.correo" class="error-msg">
          <i class="fas fa-exclamation-circle"></i>{{ errors.correo }}
        </div>
      </div>
      
      <!-- Passwords Row -->
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label><i class="fas fa-lock"></i>Contraseña</label>
            <div class="input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.clave"
                :class="{ 'error': errors.clave }"
                placeholder="Contraseña segura"
                required
              >
              <button type="button" class="toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.clave" class="error-msg">
              <i class="fas fa-exclamation-circle"></i>{{ errors.clave }}
            </div>
          </div>
        </div>
        
        <div class="col">
          <div class="form-group">
            <label><i class="fas fa-lock"></i>Confirmar Contraseña</label>
            <div class="input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="form.confirmarClave"
                :class="{ 'error': errors.confirmarClave }"
                placeholder="Repetir contraseña"
                required
              >
              <button type="button" class="toggle" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.confirmarClave" class="error-msg">
              <i class="fas fa-exclamation-circle"></i>{{ errors.confirmarClave }}
            </div>
          </div>
        </div>
      </div>

      <!-- Password Strength Meter -->
      <PasswordStrengthMeter 
        v-if="form.clave"
        :password="form.clave"
        @validation-change="handlePasswordValidation"
        @password-generated="handleGeneratedPassword"
      />
      
      <!-- User Type -->
      <div class="form-group">
        <label><i class="fas fa-user-tag"></i>Tipo de Usuario</label>
        <select v-model="form.rol" :class="{ 'error': errors.rol }" required>
          <option value="">Selecciona el tipo de usuario</option>
          <option value="Aspirante">Aspirante (Busco trabajo)</option>
          <option value="Empresa">Empresa (Publico ofertas)</option>
        </select>
        <div v-if="errors.rol" class="error-msg">
          <i class="fas fa-exclamation-circle"></i>{{ errors.rol }}
        </div>
      </div>
      
      <!-- Profile Section for Aspirante -->
      <div v-if="form.rol === 'Aspirante'" class="profile-section">
        <h6>Información Personal</h6>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Primer Nombre</label>
              <input v-model="profileForm.primerNombre" :class="{ 'error': errors.primerNombre }" required>
              <div v-if="errors.primerNombre" class="error-msg">
                <i class="fas fa-exclamation-circle"></i>{{ errors.primerNombre }}
              </div>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Segundo Nombre (Opcional)</label>
              <input v-model="profileForm.segundoNombre">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Primer Apellido</label>
              <input v-model="profileForm.primerApellido" :class="{ 'error': errors.primerApellido }" required>
              <div v-if="errors.primerApellido" class="error-msg">
                <i class="fas fa-exclamation-circle"></i>{{ errors.primerApellido }}
              </div>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Segundo Apellido (Opcional)</label>
              <input v-model="profileForm.segundoApellido">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Puesto que Busca (Opcional)</label>
          <input v-model="profileForm.puestoBusca" placeholder="Ej: Desarrollador, Contador, etc.">
        </div>
      </div>
      
      <!-- Profile Section for Company -->
      <div v-if="form.rol === 'Empresa'" class="profile-section">
        <h6>Información de la Empresa</h6>
        <div class="form-group">
          <label>Nombre de la Empresa</label>
          <input v-model="profileForm.nombreEmpresa" :class="{ 'error': errors.nombreEmpresa }" required>
          <div v-if="errors.nombreEmpresa" class="error-msg">
            <i class="fas fa-exclamation-circle"></i>{{ errors.nombreEmpresa }}
          </div>
        </div>
        <div class="form-group">
          <label>Nombre del Representante</label>
          <input v-model="profileForm.nombreRepresentante" :class="{ 'error': errors.nombreRepresentante }" required>
          <div v-if="errors.nombreRepresentante" class="error-msg">
            <i class="fas fa-exclamation-circle"></i>{{ errors.nombreRepresentante }}
          </div>
        </div>
        <div class="form-group">
          <label>Descripción de la Empresa (Opcional)</label>
          <textarea v-model="profileForm.descripcionEmpresa" rows="3" placeholder="Breve descripción de la empresa..."></textarea>
        </div>
      </div>
      
      <!-- Alerts -->
      <div v-if="error" class="alert error-alert">
        <i class="fas fa-exclamation-triangle"></i>{{ error }}
      </div>
      <div v-if="successMessage" class="alert success-alert">
        <i class="fas fa-check-circle"></i>{{ successMessage }}
      </div>
      
      <!-- Submit Button -->
      <button type="submit" class="submit-btn" :disabled="loading || !isFormValid">
        <span v-if="loading" class="spinner"></span>
        <i v-else class="fas fa-user-plus"></i>
        {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
      </button>
      
      <!-- Footer -->
      <div class="footer">
        <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
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
  components: { PasswordStrengthMeter },
  
  data: () => ({
    form: { correo: '', clave: '', confirmarClave: '', rol: '' },
    profileForm: {
      primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '', puestoBusca: '',
      nombreEmpresa: '', nombreRepresentante: '', descripcionEmpresa: ''
    },
    errors: {},
    successMessage: '',
    passwordValid: false,
    showPassword: false,
    showConfirmPassword: false
  }),
  
  computed: {
    ...mapGetters(['loading', 'error']),
    isFormValid() {
      return this.passwordValid && this.form.correo && this.form.clave && this.form.confirmarClave && this.form.rol && !Object.keys(this.errors).length
    }
  },
  
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.correo) this.errors.correo = 'El correo es requerido'
      else if (!validators.email(this.form.correo)) this.errors.correo = 'El correo no es válido'
      
      if (!this.form.clave) this.errors.clave = 'La contraseña es requerida'
      else if (!validators.password.isValid(this.form.clave)) this.errors.clave = errorMessages.password.invalid
      
      if (!this.form.confirmarClave) this.errors.confirmarClave = 'Confirma tu contraseña'
      else if (!validators.passwordConfirmation(this.form.clave, this.form.confirmarClave)) this.errors.confirmarClave = errorMessages.password.confirmation
      
      if (!this.form.rol) this.errors.rol = 'Selecciona el tipo de usuario'
      
      if (this.form.rol === 'Aspirante') {
        if (!this.profileForm.primerNombre) this.errors.primerNombre = 'El primer nombre es requerido'
        if (!this.profileForm.primerApellido) this.errors.primerApellido = 'El primer apellido es requerido'
      } else if (this.form.rol === 'Empresa') {
        if (!this.profileForm.nombreEmpresa) this.errors.nombreEmpresa = 'El nombre de la empresa es requerido'
        if (!this.profileForm.nombreRepresentante) this.errors.nombreRepresentante = 'El nombre del representante es requerido'
      }
      
      return !Object.keys(this.errors).length && this.passwordValid
    },
    
    handlePasswordValidation(isValid) {
      this.passwordValid = isValid
    },
    
    handleGeneratedPassword(newPassword) {
      this.form.clave = newPassword
      this.form.confirmarClave = newPassword
      this.$nextTick(() => this.validateForm())
    },
    
    async handleSubmit() {
      if (!this.validateForm()) return
      
      try {
        const userResult = await this.$store.dispatch('register', this.form)
        
        if (userResult.success) {
          const userId = userResult.data.id
          
          if (this.form.rol === 'Aspirante' || this.form.rol === 'Empresa') {
            await this.$store.dispatch('createProfile', {
              profileData: { idUsuario: userId, ...this.profileForm },
              userType: this.form.rol
            })
          }
          
          this.successMessage = '🎉 ¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.'
          this.$emit('register-success')
          setTimeout(() => this.$router.push('/login'), 2000)
        }
      } catch (error) {
        console.error('Error en registro:', error)
      }
    }
  }
}
</script>

<style scoped>
.register-wrapper { width: 100%; }

.header { text-align: center; margin-bottom: 2rem; }
.header h3 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
.header p { color: #64748b; font-size: 1rem; }

.form-group { margin-bottom: 1.5rem; }

label { 
  display: flex; align-items: center; font-weight: 600; color: #374151; 
  margin-bottom: 0.5rem; font-size: 0.9rem; 
}
label i { margin-right: 0.5rem; color: #22c55e; width: 16px; }

.input-wrapper { position: relative; }

input, select, textarea {
  background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px;
  padding: 0.75rem 1rem; font-size: 1rem; width: 100%; color: #1e293b;
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  background: white; border-color: #22c55e; outline: none;
  box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.error { border-color: #ef4444; background: #fef2f2; animation: shake 0.5s ease-in-out; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.toggle {
  position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #64748b; cursor: pointer;
  padding: 0.25rem; border-radius: 4px; transition: color 0.3s ease; z-index: 10;
}
.toggle:hover { color: #22c55e; }

.error-msg {
  display: flex; align-items: center; color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem;
}
.error-msg i { margin-right: 0.5rem; }

.row { display: flex; gap: 1rem; }
.col { flex: 1; }

.profile-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e7f3ff 100%);
  border: 2px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;
  position: relative; overflow: hidden; animation: slideInUp 0.6s ease-out;
}
.profile-section::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
}
.profile-section h6 {
  color: #22c55e; font-weight: 600; margin-bottom: 1rem; font-size: 1.1rem;
  display: flex; align-items: center;
}
.profile-section h6::before {
  content: ''; width: 4px; height: 20px; background: #22c55e;
  border-radius: 2px; margin-right: 0.5rem;
}

.alert {
  border: none; border-radius: 12px; padding: 1rem; display: flex; align-items: center;
  margin-bottom: 1.5rem;
}
.alert i { margin-right: 0.75rem; font-size: 1.1rem; }

.error-alert {
  background: linear-gradient(135deg, #ef4444, #dc2626); color: white;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
}

.success-alert {
  background: linear-gradient(135deg, #22c55e, #16a34a); color: white;
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3);
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% { transform: scale(0.95); opacity: 0; }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}

.submit-btn {
  background: linear-gradient(135deg, #22c55e, #16a34a); border: none; border-radius: 12px;
  padding: 0.875rem 2rem; font-weight: 600; font-size: 1rem; color: white; width: 100%;
  transition: all 0.3s ease; position: relative; overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px); box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.submit-btn:disabled {
  opacity: 0.7; cursor: not-allowed; transform: none;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
}

.submit-btn i { margin-right: 0.5rem; }

.spinner {
  display: inline-block; width: 1rem; height: 1rem; margin-right: 0.5rem;
  border: 0.1em solid rgba(255,255,255,0.3); border-radius: 50%;
  border-top: 0.1em solid white; animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.footer { text-align: center; margin-top: 2rem; }
.footer p { color: #64748b; font-size: 0.9rem; }
.footer a { color: #22c55e; text-decoration: none; font-weight: 600; transition: color 0.3s ease; }
.footer a:hover { color: #16a34a; text-decoration: underline; }

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 0.75rem center;
  background-size: 16px 12px; padding-right: 2.5rem;
}

@media (max-width: 768px) {
  .header h3 { font-size: 1.6rem; }
  input, select, textarea { padding: 0.625rem 0.875rem; }
  .submit-btn { padding: 0.75rem 1.5rem; }
  .profile-section { padding: 1rem; }
  .toggle { right: 0.75rem; }
  .row { flex-direction: column; gap: 0; }
}

@media (max-width: 576px) {
  .profile-section { padding: 0.75rem; }
  .profile-section h6 { font-size: 1rem; }
  .register-wrapper { padding: 0 0.5rem; }
}
</style>