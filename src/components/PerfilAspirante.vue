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

      <!-- Secciones dinámicas -->
      <div v-for="section in sections" :key="section.id" class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i :class="`${section.icon} me-2 text-${section.color}`"></i>
              {{ section.title }}
            </h5>
            <button 
              v-if="!section.editMode" 
              @click="toggleEdit(section.id)"
              :class="`btn btn-${section.color} btn-sm`"
            >
              <i class="fas fa-edit me-2"></i>
              Editar
            </button>
          </div>
        </div>

        <div class="card-body">
          <form @submit.prevent="saveSection(section.id)">
            <div class="row">
              <div 
                v-for="field in section.fields" 
                :key="field.key"
                :class="`col-md-${field.col || 12}`"
              >
                <FormField
                  v-model="section.data[field.key]"
                  :type="field.type || 'text'"
                  :label="field.label"
                  :icon="field.icon"
                  :placeholder="field.placeholder || `Tu ${field.label.toLowerCase()}`"
                  :required="field.required"
                  :readonly="!section.editMode"
                  :disabled="field.disabled && !section.editMode"
                  :options="field.options"
                  :rows="field.rows"
                  :error="errors[field.key]"
                />
              </div>
            </div>
            
            <div v-if="section.editMode" class="d-flex justify-content-end gap-2 mt-3">
              <button 
                type="button" 
                @click="cancelEdit(section.id)" 
                class="btn btn-secondary btn-sm"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :class="`btn btn-${section.color} btn-sm`"
                :disabled="section.loading"
              >
                <span v-if="section.loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ section.loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Mensaje global -->
      <div v-if="message" :class="messageClass" class="alert alert-dismissible fade show">
        <i :class="messageIcon" class="me-2"></i>
        {{ message }}
        <button type="button" class="btn-close" @click="message = ''"></button>
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
      message: '',
      messageType: 'success',
      errors: {},
      
      sections: [
        {
          id: 'personal',
          title: 'Información Personal',
          icon: 'fas fa-id-card',
          color: 'primary',
          editMode: false,
          loading: false,
          data: {
            idAspirante: null,
            idUsuario: null,
            primerNombre: '',
            segundoNombre: '',
            primerApellido: '',
            segundoApellido: '',
            puestoBusca: ''
          },
          backup: {},
          fields: [
            { key: 'primerNombre', label: 'Primer Nombre', icon: 'fas fa-user', required: true, col: 6 },
            { key: 'segundoNombre', label: 'Segundo Nombre', icon: 'fas fa-user', col: 6 },
            { key: 'primerApellido', label: 'Primer Apellido', icon: 'fas fa-user', required: true, col: 6 },
            { key: 'segundoApellido', label: 'Segundo Apellido', icon: 'fas fa-user', col: 6 },
            { key: 'puestoBusca', label: 'Puesto que Busca', icon: 'fas fa-briefcase', col: 12 }
          ]
        },
        {
          id: 'contacto',
          title: 'Contacto',
          icon: 'fas fa-phone',
          color: 'success',
          editMode: false,
          loading: false,
          data: {
            idUsuario: null,
            telefonoPersonal: '',
            telefonoFijo: ''
          },
          backup: {},
          fields: [
            { key: 'telefonoPersonal', label: 'Teléfono Personal', icon: 'fas fa-mobile-alt', type: 'tel', required: true, col: 6 },
            { key: 'telefonoFijo', label: 'Teléfono Fijo', icon: 'fas fa-phone', type: 'tel', col: 6 }
          ]
        },
        {
          id: 'direccion',
          title: 'Dirección',
          icon: 'fas fa-map-marker-alt',
          color: 'warning',
          editMode: false,
          loading: false,
          data: {
            idUsuario: null,
            departamento: '',
            municipio: '',
            detalleDireccion: ''
          },
          backup: {},
          fields: [
            { 
              key: 'departamento', 
              label: 'Departamento', 
              icon: 'fas fa-map', 
              type: 'select',
              options: DEPARTAMENTOS_EL_SALVADOR.map(dep => ({ value: dep, label: dep })),
              required: true,
              col: 4 
            },
            { key: 'municipio', label: 'Municipio', icon: 'fas fa-city', required: true, col: 4 },
            { key: 'detalleDireccion', label: 'Dirección Detallada', icon: 'fas fa-home', type: 'textarea', required: true, col: 4 }
          ]
        }
      ]
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
    await this.loadAllData()
  },
  
  methods: {
    // Cargar todos los datos
    async loadAllData() {
      const loadPromises = this.sections.map(async (section) => {
        try {
          section.loading = true
          await this.loadSectionData(section.id)
        } catch (error) {
          console.error(`Error loading ${section.id}:`, error)
          this.showMessage(`Error al cargar ${section.title}`, 'error')
        } finally {
          section.loading = false
        }
      })
      
      await Promise.all(loadPromises)
    },
    
    // Cargar datos por sección
    async loadSectionData(sectionId) {
      const loaders = {
        personal: async () => {
          const response = await api.get('/Aspirante/todos')
          const aspirante = response.data.find(asp => asp.idUsuario === this.user.idUsuario)
          
          if (aspirante) {
            this.getSection('personal').data = {
              idAspirante: aspirante.idAspirante,
              idUsuario: aspirante.idUsuario,
              primerNombre: aspirante.primerNombre || '',
              segundoNombre: aspirante.segundoNombre || '',
              primerApellido: aspirante.primerApellido || '',
              segundoApellido: aspirante.segundoApellido || '',
              puestoBusca: aspirante.puestoBusca || ''
            }
          }
        },
        
        contacto: async () => {
          try {
            const response = await api.get(`/Contacto/${this.user.idUsuario}`)
            if (response.data) {
              this.getSection('contacto').data = {
                idUsuario: response.data.idUsuario,
                telefonoPersonal: response.data.telefonoPersonal || '',
                telefonoFijo: response.data.telefonoFijo || ''
              }
            }
          } catch (error) {
            if (error.response?.status !== 404) throw error
          }
        },
        
        direccion: async () => {
          try {
            const response = await api.get(`/Direccion/${this.user.idUsuario}`)
            if (response.data) {
              this.getSection('direccion').data = {
                idUsuario: response.data.idUsuario,
                departamento: response.data.departamento || '',
                municipio: response.data.municipio || '',
                detalleDireccion: response.data.detalleDireccion || ''
              }
            }
          } catch (error) {
            if (error.response?.status !== 404) throw error
          }
        }
      }
      
      await loaders[sectionId]?.()
    },
    
    // Obtener sección por ID
    getSection(id) {
      return this.sections.find(s => s.id === id)
    },
    
    // Manejo de edición
    toggleEdit(sectionId) {
      const section = this.getSection(sectionId)
      section.editMode = !section.editMode
      
      if (section.editMode) {
        section.backup = { ...section.data }
      }
      this.errors = {}
    },
    
    cancelEdit(sectionId) {
      const section = this.getSection(sectionId)
      section.data = { ...section.backup }
      section.editMode = false
      this.errors = {}
    },
    
    // Validaciones unificadas
    validateSection(sectionId) {
      this.errors = {}
      const section = this.getSection(sectionId)
      
      const validationRules = {
        personal: () => {
          if (!this.validateRequired(section.data.primerNombre, 2)) {
            this.errors.primerNombre = 'El primer nombre es requerido (mínimo 2 caracteres)'
          }
          if (!this.validateRequired(section.data.primerApellido, 2)) {
            this.errors.primerApellido = 'El primer apellido es requerido (mínimo 2 caracteres)'
          }
        },
        
        contacto: () => {
          if (!validators.required(section.data.telefonoPersonal) || !validators.telefono(section.data.telefonoPersonal)) {
            this.errors.telefonoPersonal = 'El teléfono personal es requerido y debe tener formato válido'
          }
        },
        
        direccion: () => {
          const requiredFields = [
            { field: 'departamento', message: 'Selecciona tu departamento' },
            { field: 'municipio', message: 'El municipio es requerido' },
            { field: 'detalleDireccion', message: 'La dirección detallada es requerida' }
          ]
          
          requiredFields.forEach(({ field, message }) => {
            if (!validators.required(section.data[field])) {
              this.errors[field] = message
            }
          })
        }
      }
      
      validationRules[sectionId]?.()
      return Object.keys(this.errors).length === 0
    },
    
    validateRequired(value, minLength = 1) {
      return validators.required(value) && validators.minLength(value, minLength)
    },
    
    // Guardar datos unificado
    async saveSection(sectionId) {
      if (!this.validateSection(sectionId)) return
      
      const section = this.getSection(sectionId)
      section.loading = true
      
      try {
        await this.saveSectionData(sectionId, section)
        section.editMode = false
        this.showMessage(`${section.title} actualizada exitosamente`, 'success')
        
      } catch (error) {
        console.error(`Error saving ${sectionId}:`, error)
        this.showMessage(`Error al guardar ${section.title}`, 'error')
      } finally {
        section.loading = false
      }
    },
    
    // Guardar datos por sección
    async saveSectionData(sectionId, section) {
      const savers = {
        personal: async () => {
          const data = {
            ...section.data,
            idUsuario: this.user.idUsuario,
            segundoNombre: section.data.segundoNombre || null,
            segundoApellido: section.data.segundoApellido || null,
            puestoBusca: section.data.puestoBusca || null
          }
          await api.put('/Aspirante/editar', data)
        },
        
        contacto: async () => {
          const data = {
            idUsuario: this.user.idUsuario,
            telefonoPersonal: section.data.telefonoPersonal,
            telefonoFijo: section.data.telefonoFijo || ''
          }
          await this.saveOrCreate('/Contacto', data)
        },
        
        direccion: async () => {
          const data = {
            idUsuario: this.user.idUsuario,
            departamento: section.data.departamento,
            municipio: section.data.municipio,
            detalleDireccion: section.data.detalleDireccion
          }
          await this.saveOrCreate('/Direccion', data)
        }
      }
      
      await savers[sectionId]?.()
    },
    
    // Método auxiliar para crear o actualizar
    async saveOrCreate(endpoint, data) {
      try {
        await api.put(`${endpoint}/editar`, data)
      } catch (error) {
        if (error.response?.status === 404) {
          await api.post(`${endpoint}/crear`, data)
        } else {
          throw error
        }
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