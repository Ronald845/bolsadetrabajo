<template>
  <div class="perfil-aspirante">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <h2 class="h4 mb-1">
            <i class="fas fa-user me-2 text-primary"></i>
            Mi Perfil Profesional
          </h2>
          <p class="text-muted mb-0">Gestiona tu información personal y profesional</p>
        </div>
      </div>

      <!-- Información Personal -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-id-card me-2 text-primary"></i>
              Información Personal
            </h5>
            <button 
              v-if="!editMode" 
              @click="enableEdit" 
              class="btn btn-primary btn-sm"
            >
              <i class="fas fa-edit me-2"></i>
              Editar
            </button>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="guardarPerfil">
            <div class="row">
              <div class="col-md-6">
                <FormField
                  v-model="form.primerNombre"
                  label="Primer Nombre"
                  icon="fas fa-user"
                  placeholder="Tu primer nombre"
                  :required="true"
                  :readonly="!editMode"
                  :error="errors.primerNombre"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.segundoNombre"
                  label="Segundo Nombre"
                  icon="fas fa-user"
                  placeholder="Tu segundo nombre (opcional)"
                  :readonly="!editMode"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.primerApellido"
                  label="Primer Apellido"
                  icon="fas fa-user"
                  placeholder="Tu primer apellido"
                  :required="true"
                  :readonly="!editMode"
                  :error="errors.primerApellido"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.segundoApellido"
                  label="Segundo Apellido"
                  icon="fas fa-user"
                  placeholder="Tu segundo apellido (opcional)"
                  :readonly="!editMode"
                />
              </div>
              <div class="col-12">
                <FormField
                  v-model="form.puestoBusca"
                  label="Puesto que Busca"
                  icon="fas fa-briefcase"
                  placeholder="Ej: Desarrollador, Contador, Diseñador..."
                  :readonly="!editMode"
                />
              </div>
            </div>
            
            <div v-if="editMode" class="d-flex justify-content-end gap-2 mt-3">
              <button type="button" @click="cancelarEdicion" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Información de Contacto -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-phone me-2 text-success"></i>
              Contacto
            </h5>
            <button 
              v-if="!editContacto" 
              @click="editContacto = true" 
              class="btn btn-success btn-sm"
            >
              <i class="fas fa-edit me-2"></i>
              Editar
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <FormField
                v-model="contacto.telefonoPersonal"
                type="tel"
                label="Teléfono Personal"
                icon="fas fa-mobile-alt"
                placeholder="0000-0000"
                :required="true"
                :readonly="!editContacto"
                :error="errors.telefonoPersonal"
              />
            </div>
            <div class="col-md-6">
              <FormField
                v-model="contacto.telefonoFijo"
                type="tel"
                label="Teléfono Fijo"
                icon="fas fa-phone"
                placeholder="0000-0000"
                :readonly="!editContacto"
              />
            </div>
          </div>
          
          <div v-if="editContacto" class="d-flex justify-content-end gap-2">
            <button @click="cancelarEdicionContacto" class="btn btn-secondary btn-sm">
              Cancelar
            </button>
            <button @click="guardarContacto" class="btn btn-success btn-sm" :disabled="loadingContacto">
              <span v-if="loadingContacto" class="spinner-border spinner-border-sm me-2"></span>
              {{ loadingContacto ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Dirección -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-map-marker-alt me-2 text-warning"></i>
              Dirección
            </h5>
            <button 
              v-if="!editDireccion" 
              @click="editDireccion = true" 
              class="btn btn-warning btn-sm"
            >
              <i class="fas fa-edit me-2"></i>
              Editar
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <FormField
                v-model="direccion.departamento"
                type="select"
                label="Departamento"
                icon="fas fa-map"
                placeholder="Selecciona departamento"
                :options="departamentosOptions"
                :disabled="!editDireccion"
                :error="errors.departamento"
              />
            </div>
            <div class="col-md-4">
              <FormField
                v-model="direccion.municipio"
                label="Municipio"
                icon="fas fa-city"
                placeholder="Tu municipio"
                :readonly="!editDireccion"
                :error="errors.municipio"
              />
            </div>
            <div class="col-md-4">
              <FormField
                v-model="direccion.detalleDireccion"
                type="textarea"
                label="Dirección Detallada"
                icon="fas fa-home"
                placeholder="Colonia, avenida, casa..."
                :readonly="!editDireccion"
                :rows="2"
                :error="errors.detalleDireccion"
              />
            </div>
          </div>
          
          <div v-if="editDireccion" class="d-flex justify-content-end gap-2 mt-3">
            <button @click="cancelarEdicionDireccion" class="btn btn-secondary btn-sm">
              Cancelar
            </button>
            <button @click="guardarDireccion" class="btn btn-warning btn-sm" :disabled="loadingDireccion">
              <span v-if="loadingDireccion" class="spinner-border spinner-border-sm me-2"></span>
              {{ loadingDireccion ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje -->
      <div v-if="message" class="alert" :class="messageClass">
        <i :class="messageIcon" class="me-2"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormField from './FormField.vue'
import { validators } from '../utils/validators'
import { DEPARTAMENTOS_EL_SALVADOR } from '../utils/constants'
import api from '../services/api'

export default {
  name: 'PerfilAspirante',
  components: { FormField },
  data() {
    return {
      editMode: false,
      editContacto: false,
      editDireccion: false,
      loading: false,
      loadingContacto: false,
      loadingDireccion: false,
      message: '',
      messageType: 'success',
      
      form: {
        idAspirante: null,
        idUsuario: null,
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        puestoBusca: ''
      },
      
      contacto: {
        idUsuario: null,
        telefonoPersonal: '',
        telefonoFijo: ''
      },
      
      direccion: {
        idUsuario: null,
        departamento: '',
        municipio: '',
        detalleDireccion: ''
      },
      
      formBackup: {},
      contactoBackup: {},
      direccionBackup: {},
      errors: {},
      
      departamentosOptions: DEPARTAMENTOS_EL_SALVADOR.map(dep => ({
        value: dep,
        label: dep
      }))
    }
  },
  computed: {
    ...mapGetters(['user']),
    messageClass() {
      return `alert-${this.messageType}`
    },
    messageIcon() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
      }
      return icons[this.messageType] || 'fas fa-info-circle'
    }
  },
  async mounted() {
    await this.cargarDatos()
  },
  methods: {
    async cargarDatos() {
      try {
        this.loading = true
        await this.cargarPerfilAspirante()
        await this.cargarContacto()
        await this.cargarDireccion()
      } catch (error) {
        console.error('Error cargando datos:', error)
        this.showMessage('Error al cargar los datos', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async cargarPerfilAspirante() {
      try {
        const response = await api.get('/Aspirante/todos')
        const aspirantes = response.data
        const aspiranteActual = aspirantes.find(asp => asp.idUsuario === this.user.idUsuario)
        
        if (aspiranteActual) {
          this.form = {
            idAspirante: aspiranteActual.idAspirante,
            idUsuario: aspiranteActual.idUsuario,
            primerNombre: aspiranteActual.primerNombre || '',
            segundoNombre: aspiranteActual.segundoNombre || '',
            primerApellido: aspiranteActual.primerApellido || '',
            segundoApellido: aspiranteActual.segundoApellido || '',
            puestoBusca: aspiranteActual.puestoBusca || ''
          }
        }
      } catch (error) {
        console.error('Error cargando perfil:', error)
      }
    },
    
    async cargarContacto() {
      try {
        const response = await api.get(`/Contacto/${this.user.idUsuario}`)
        if (response.data) {
          this.contacto = {
            idUsuario: response.data.idUsuario,
            telefonoPersonal: response.data.telefonoPersonal || '',
            telefonoFijo: response.data.telefonoFijo || ''
          }
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error cargando contacto:', error)
        }
      }
    },
    
    async cargarDireccion() {
      try {
        const response = await api.get(`/Direccion/${this.user.idUsuario}`)
        if (response.data) {
          this.direccion = {
            idUsuario: response.data.idUsuario,
            departamento: response.data.departamento || '',
            municipio: response.data.municipio || '',
            detalleDireccion: response.data.detalleDireccion || ''
          }
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error cargando dirección:', error)
        }
      }
    },
    
    enableEdit() {
      this.editMode = true
      this.formBackup = { ...this.form }
    },
    
    cancelarEdicion() {
      this.form = { ...this.formBackup }
      this.editMode = false
      this.errors = {}
    },
    
    cancelarEdicionContacto() {
      this.contacto = { ...this.contactoBackup }
      this.editContacto = false
      this.errors = {}
    },
    
    cancelarEdicionDireccion() {
      this.direccion = { ...this.direccionBackup }
      this.editDireccion = false
      this.errors = {}
    },
    
    validateForm() {
      this.errors = {}
      
      if (!validators.required(this.form.primerNombre) || !validators.minLength(this.form.primerNombre, 2)) {
        this.errors.primerNombre = 'El primer nombre es requerido (mínimo 2 caracteres)'
      }
      
      if (!validators.required(this.form.primerApellido) || !validators.minLength(this.form.primerApellido, 2)) {
        this.errors.primerApellido = 'El primer apellido es requerido (mínimo 2 caracteres)'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    validateContacto() {
      this.errors = {}
      
      if (!validators.required(this.contacto.telefonoPersonal) || !validators.telefono(this.contacto.telefonoPersonal)) {
        this.errors.telefonoPersonal = 'El teléfono personal es requerido y debe tener formato válido'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    validateDireccion() {
      this.errors = {}
      
      if (!validators.required(this.direccion.departamento)) {
        this.errors.departamento = 'Selecciona tu departamento'
      }
      
      if (!validators.required(this.direccion.municipio)) {
        this.errors.municipio = 'El municipio es requerido'
      }
      
      if (!validators.required(this.direccion.detalleDireccion)) {
        this.errors.detalleDireccion = 'La dirección detallada es requerida'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async guardarPerfil() {
      if (!this.validateForm()) return
      
      try {
        this.loading = true
        
        const aspiranteData = {
          idAspirante: this.form.idAspirante,
          idUsuario: this.user.idUsuario,
          primerNombre: this.form.primerNombre,
          segundoNombre: this.form.segundoNombre || null,
          primerApellido: this.form.primerApellido,
          segundoApellido: this.form.segundoApellido || null,
          puestoBusca: this.form.puestoBusca || null
        }
        
        await api.put('/Aspirante/editar', aspiranteData)
        this.editMode = false
        this.showMessage('Perfil actualizado exitosamente', 'success')
        
      } catch (error) {
        console.error('Error guardando perfil:', error)
        this.showMessage('Error al guardar el perfil', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async guardarContacto() {
      if (!this.validateContacto()) return
      
      try {
        this.loadingContacto = true
        this.contactoBackup = { ...this.contacto }
        
        const contactoData = {
          idUsuario: this.user.idUsuario,
          telefonoPersonal: this.contacto.telefonoPersonal,
          telefonoFijo: this.contacto.telefonoFijo || ''
        }
        
        try {
          await api.put('/Contacto/editar', contactoData)
        } catch (error) {
          if (error.response?.status === 404) {
            await api.post('/Contacto/crear', contactoData)
          } else {
            throw error
          }
        }
        
        this.editContacto = false
        this.showMessage('Información de contacto guardada', 'success')
        
      } catch (error) {
        console.error('Error guardando contacto:', error)
        this.showMessage('Error al guardar contacto', 'error')
      } finally {
        this.loadingContacto = false
      }
    },
    
    async guardarDireccion() {
      if (!this.validateDireccion()) return
      
      try {
        this.loadingDireccion = true
        this.direccionBackup = { ...this.direccion }
        
        const direccionData = {
          idUsuario: this.user.idUsuario,
          departamento: this.direccion.departamento,
          municipio: this.direccion.municipio,
          detalleDireccion: this.direccion.detalleDireccion
        }
        
        try {
          await api.put('/Direccion/editar', direccionData)
        } catch (error) {
          if (error.response?.status === 404) {
            await api.post('/Direccion/crear', direccionData)
          } else {
            throw error
          }
        }
        
        this.editDireccion = false
        this.showMessage('Dirección guardada exitosamente', 'success')
        
      } catch (error) {
        console.error('Error guardando dirección:', error)
        this.showMessage('Error al guardar dirección', 'error')
      } finally {
        this.loadingDireccion = false
      }
    },
    
    showMessage(text, type = 'success') {
      this.message = text
      this.messageType = type
      setTimeout(() => { this.message = '' }, 5000)
    }
  }
}
</script>

<style scoped>
.perfil-aspirante {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.gap-2 {
  gap: 0.5rem;
}
</style>