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
                type="password"
                class="form-control modern-input"
                id="clave"
                v-model="form.clave"
                :class="{ 'is-invalid': errors.clave }"
                placeholder="Mínimo 6 caracteres"
                required
              >
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
                type="password"
                class="form-control modern-input"
                id="confirmarClave"
                v-model="form.confirmarClave"
                :class="{ 'is-invalid': errors.confirmarClave }"
                placeholder="Repetir contraseña"
                required
              >
            </div>
            <div v-if="errors.confirmarClave" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.confirmarClave }}
            </div>
          </div>
        </div>
      </div>
      
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
        :disabled="loading"
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

export default {
  name: 'RegisterForm',
  emits: ['register-success'],
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
      successMessage: ''
    }
  },
  computed: {
    ...mapGetters(['loading', 'error'])
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.correo) {
        this.errors.correo = 'El correo es requerido'
      } else if (!/\S+@\S+\.\S+/.test(this.form.correo)) {
        this.errors.correo = 'El correo no es válido'
      }
      
      if (!this.form.clave) {
        this.errors.clave = 'La contraseña es requerida'
      } else if (this.form.clave.length < 6) {
        this.errors.clave = 'La contraseña debe tener al menos 6 caracteres'
      }
      
      if (!this.form.confirmarClave) {
        this.errors.confirmarClave = 'Confirma tu contraseña'
      } else if (this.form.clave !== this.form.confirmarClave) {
        this.errors.confirmarClave = 'Las contraseñas no coinciden'
      }
      
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
      
      return Object.keys(this.errors).length === 0
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
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
          
          this.successMessage = 'Cuenta creada exitosamente. Puedes iniciar sesión ahora.'
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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-title {
  color: #22c55e;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
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
}

.modern-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.25);
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.modern-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  animation: slideInUp 0.5s ease-out;
  animation-delay: 0.6s;
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

/* Responsive */
@media (max-width: 768px) {
  .form-title {
    font-size: 1.5rem;
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
}

@media (max-width: 576px) {
  .profile-section {
    padding: 0.75rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
}
</style>