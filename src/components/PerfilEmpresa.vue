<template>
  <div class="perfil-empresa">
    <div class="container py-4">
      <!-- Header -->
      <div class="mb-4">
        <h2 class="h4 mb-1"><i class="fas fa-building me-2 text-primary"></i>Perfil de Empresa</h2>
        <p class="text-muted mb-0">Gestiona la información de tu empresa y datos de contacto</p>
      </div>

      <!-- Secciones -->
      <div v-for="section in sections" :key="section.id" class="card shadow-sm mb-4">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i :class="`${section.icon} me-2 text-${section.color}`"></i>{{ section.title }}
          </h5>
          <button v-if="!section.editMode" @click="toggleEdit(section.id)" :class="`btn btn-${section.color} btn-sm`">
            <i class="fas fa-edit me-2"></i>Editar
          </button>
        </div>

        <div class="card-body">
          <form @submit.prevent="saveSection(section.id)">
            <div class="row">
              <div v-for="field in section.fields" :key="field.key" :class="`col-md-${field.col || 12}`">
                <FormField v-model="section.data[field.key]" v-bind="field" 
                  :readonly="!section.editMode" :error="errors[field.key]" />
              </div>
            </div>
            
            <div v-if="section.editMode" class="d-flex justify-content-end gap-2 mt-3">
              <button type="button" @click="cancelEdit(section.id)" class="btn btn-secondary btn-sm">Cancelar</button>
              <button type="submit" :class="`btn btn-${section.color} btn-sm`" :disabled="section.loading">
                <span v-if="section.loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ section.loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <h5 class="mb-0"><i class="fas fa-chart-bar me-2 text-info"></i>Estadísticas de la Empresa</h5>
        </div>
        <div class="card-body">
          <div class="row text-center">
            <div v-for="stat in estadisticasConfig" :key="stat.key" class="col-md-3">
              <div class="stat-card">
                <div :class="`stat-icon bg-${stat.color}`"><i :class="stat.icon"></i></div>
                <div class="stat-content">
                  <h4 class="stat-number">{{ getStatValue(stat.key) }}</h4>
                  <p class="stat-label">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje -->
      <div v-if="message" :class="messageClass" class="alert alert-dismissible fade show">
        <i :class="messageIcon" class="me-2"></i>{{ message }}
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
  name: 'PerfilEmpresa',
  components: { FormField },
  
  data() {
    return {
      message: '', messageType: 'success', errors: {},
      
      sections: [
        {
          id: 'empresa', title: 'Información de la Empresa', icon: 'fas fa-building', color: 'primary',
          editMode: false, loading: false, data: {}, backup: {},
          fields: [
            { key: 'nombreEmpresa', label: 'Nombre de la Empresa', icon: 'fas fa-building', required: true, col: 6, helpText: 'Máximo 50 caracteres' },
            { key: 'nombreRepresentante', label: 'Nombre del Representante', icon: 'fas fa-user-tie', required: true, col: 6, helpText: 'Máximo 60 caracteres' },
            { key: 'descripcionEmpresa', label: 'Descripción de la Empresa', icon: 'fas fa-info-circle', type: 'textarea', col: 12, rows: 4, helpText: 'Opcional - Describe tu empresa' }
          ]
        },
        {
          id: 'contacto', title: 'Información de Contacto', icon: 'fas fa-phone', color: 'success',
          editMode: false, loading: false, data: {}, backup: {},
          fields: [
            { key: 'telefonoPersonal', label: 'Teléfono Principal', icon: 'fas fa-mobile-alt', type: 'tel', required: true, col: 6, helpText: 'Teléfono principal de la empresa' },
            { key: 'telefonoFijo', label: 'Teléfono Secundario', icon: 'fas fa-phone', type: 'tel', col: 6, helpText: 'Opcional' }
          ]
        },
        {
          id: 'direccion', title: 'Ubicación de la Empresa', icon: 'fas fa-map-marker-alt', color: 'warning',
          editMode: false, loading: false, data: {}, backup: {},
          fields: [
            { key: 'departamento', label: 'Departamento', icon: 'fas fa-map', type: 'select', options: DEPARTAMENTOS_EL_SALVADOR.map(dep => ({ value: dep, label: dep })), required: true, col: 4 },
            { key: 'municipio', label: 'Municipio', icon: 'fas fa-city', required: true, col: 4 },
            { key: 'detalleDireccion', label: 'Dirección Detallada', icon: 'fas fa-building', type: 'textarea', required: true, col: 4, rows: 2 }
          ]
        }
      ],
      
      estadisticas: { totalOfertas: 0, ofertasActivas: 0, totalAplicaciones: 0, fechaRegistro: null },
      estadisticasConfig: [
        { key: 'totalOfertas', label: 'Ofertas Publicadas', icon: 'fas fa-briefcase', color: 'primary' },
        { key: 'ofertasActivas', label: 'Ofertas Activas', icon: 'fas fa-eye', color: 'success' },
        { key: 'totalAplicaciones', label: 'Aplicaciones Recibidas', icon: 'fas fa-users', color: 'warning' },
        { key: 'tiempoPlataforma', label: 'Tiempo en Plataforma', icon: 'fas fa-calendar', color: 'info' }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    messageClass() { return `alert-${this.messageType}` },
    messageIcon() { 
      const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }
      return icons[this.messageType] || 'fas fa-info-circle'
    }
  },
  
  async mounted() {
    await this.loadAllData()
  },
  
  methods: {
    async loadAllData() {
      const loadPromises = this.sections.map(async (section) => {
        section.loading = true
        try {
          await this.loadSectionData(section.id)
        } catch (error) {
          this.showMessage(`Error al cargar ${section.title}`, 'error')
        } finally {
          section.loading = false
        }
      })
      await Promise.all([...loadPromises, this.loadEstadisticas()])
    },
    
    async loadSectionData(sectionId) {
      const loaders = {
        empresa: async () => {
          const response = await api.get('/Empresa/todas')
          const empresa = response.data.find(emp => emp.idUsuario === this.user.idUsuario)
          if (empresa) {
            this.getSection('empresa').data = {
              idEmpresa: empresa.idEmpresa, idUsuario: empresa.idUsuario,
              nombreEmpresa: empresa.nombreEmpresa || '', nombreRepresentante: empresa.nombreRepresentante || '',
              descripcionEmpresa: empresa.descripcionEmpresa || ''
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
    
    async loadEstadisticas() {
      this.estadisticas = {
        totalOfertas: 0, ofertasActivas: 0, totalAplicaciones: 0,
        fechaRegistro: this.user.fechaRegistro || new Date()
      }
    },
    
    getSection(id) { return this.sections.find(s => s.id === id) },
    
    getStatValue(key) {
      return key === 'tiempoPlataforma' ? this.calcularTiempoEnPlataforma() : this.estadisticas[key] || 0
    },
    
    toggleEdit(sectionId) {
      const section = this.getSection(sectionId)
      section.editMode = !section.editMode
      if (section.editMode) section.backup = { ...section.data }
      this.errors = {}
    },
    
    cancelEdit(sectionId) {
      const section = this.getSection(sectionId)
      section.data = { ...section.backup }
      section.editMode = false
      this.errors = {}
    },
    
    validateSection(sectionId) {
      this.errors = {}
      const section = this.getSection(sectionId)
      
      const rules = {
        empresa: () => {
          if (!validators.required(section.data.nombreEmpresa) || !validators.maxLength(section.data.nombreEmpresa, 50)) {
            this.errors.nombreEmpresa = 'El nombre de la empresa es requerido (máximo 50 caracteres)'
          }
          if (!validators.required(section.data.nombreRepresentante) || !validators.maxLength(section.data.nombreRepresentante, 60)) {
            this.errors.nombreRepresentante = 'El nombre del representante es requerido (máximo 60 caracteres)'
          }
        },
        contacto: () => {
          if (!validators.required(section.data.telefonoPersonal) || !validators.telefono(section.data.telefonoPersonal)) {
            this.errors.telefonoPersonal = 'El teléfono principal es requerido y debe tener formato válido'
          }
        },
        direccion: () => {
          const requiredFields = [
            { field: 'departamento', message: 'Selecciona el departamento' },
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
      
      rules[sectionId]?.()
      return Object.keys(this.errors).length === 0
    },
    
    async saveSection(sectionId) {
      if (!this.validateSection(sectionId)) return
      
      const section = this.getSection(sectionId)
      section.loading = true
      
      try {
        await this.saveSectionData(sectionId, section)
        section.editMode = false
        this.showMessage(`${section.title} actualizada exitosamente`, 'success')
      } catch (error) {
        this.showMessage(`Error al guardar ${section.title}`, 'error')
      } finally {
        section.loading = false
      }
    },
    
    async saveSectionData(sectionId, section) {
      const savers = {
        empresa: async () => {
          const data = { ...section.data, idUsuario: this.user.idUsuario, descripcionEmpresa: section.data.descripcionEmpresa || null }
          await api.put('/Empresa/editar', data)
        },
        contacto: async () => {
          const data = { idUsuario: this.user.idUsuario, telefonoPersonal: section.data.telefonoPersonal, telefonoFijo: section.data.telefonoFijo || '' }
          await this.saveOrCreate('/Contacto', data)
        },
        direccion: async () => {
          const data = { idUsuario: this.user.idUsuario, departamento: section.data.departamento, municipio: section.data.municipio, detalleDireccion: section.data.detalleDireccion }
          await this.saveOrCreate('/Direccion', data)
        }
      }
      await savers[sectionId]?.()
    },
    
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
    
    calcularTiempoEnPlataforma() {
      if (!this.user?.fechaRegistro) return '0 días'
      
      const fechaRegistro = new Date(this.user.fechaRegistro)
      const fechaActual = new Date()
      const diffDays = Math.ceil(Math.abs(fechaActual - fechaRegistro) / (1000 * 60 * 60 * 24))
      
      if (diffDays < 30) return `${diffDays} días`
      if (diffDays < 365) {
        const meses = Math.floor(diffDays / 30)
        return `${meses} mes${meses > 1 ? 'es' : ''}`
      }
      const años = Math.floor(diffDays / 365)
      return `${años} año${años > 1 ? 's' : ''}`
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
.perfil-empresa { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; }
.card { border: none; border-radius: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15); }
.gap-2 { gap: 0.5rem; }
.stat-card { display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 1.5rem; border-radius: 15px; background: white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease; height: 100%; }
.stat-card:hover { transform: translateY(-5px); }
.stat-icon { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; color: white; font-size: 1.5rem; }
.stat-content { text-align: center; }
.stat-number { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #2d3748; }
.stat-label { font-size: 0.9rem; color: #718096; margin: 0; font-weight: 500; }
.btn { border-radius: 8px; font-weight: 500; transition: all 0.2s ease; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); border: none; }
.btn-success { background: linear-gradient(135deg, #11998e, #38ef7d); border: none; }
.btn-warning { background: linear-gradient(135deg, #f093fb, #f5576c); border: none; }
@media (max-width: 768px) {
  .stat-card { margin-bottom: 1rem; }
  .stat-number { font-size: 1.5rem; }
  .stat-icon { width: 50px; height: 50px; font-size: 1.2rem; }
}
</style>