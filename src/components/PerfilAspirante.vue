<template>
  <div class="perfil-aspirante">
    <div class="container py-4">
      <!-- Header -->
      <div class="card border-0 bg-primary text-white mb-4">
        <div class="card-body text-center py-4">
          <h2 class="mb-1"><i class="fas fa-user-circle me-2"></i>Mi Perfil Profesional</h2>
          <p class="mb-0 opacity-75">Gestiona tu información personal y profesional</p>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="message" class="alert alert-dismissible fade show mb-4" :class="messageClass">
        <i :class="messageIcon" class="me-2"></i>{{ message }}
        <button type="button" class="btn-close" @click="message = ''"></button>
      </div>

      <!-- Secciones -->
      <div v-for="section in sections" :key="section.id" class="card shadow-sm mb-4">
        <!-- Header de Sección -->
        <div class="card-header text-white d-flex justify-content-between align-items-center" :class="`bg-${section.color}`">
          <h5 class="mb-0"><i :class="section.icon" class="me-2"></i>{{ section.title }}</h5>
          <div>
            <div v-if="section.loading" class="spinner-border spinner-border-sm text-light me-2"></div>
            <button v-if="!section.editMode" @click="toggleEdit(section.id)" class="btn btn-light btn-sm" :disabled="section.loading">
              <i class="fas fa-edit me-1"></i>Editar
            </button>
            <div v-else class="btn-group">
              <button @click="saveSection(section.id)" class="btn btn-success btn-sm" :disabled="section.loading">
                <i class="fas fa-save me-1"></i>Guardar
              </button>
              <button @click="cancelEdit(section.id)" class="btn btn-secondary btn-sm" :disabled="section.loading">
                <i class="fas fa-times me-1"></i>Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- Contenido -->
        <div class="card-body">
          <!-- Modo Vista -->
          <div v-if="!section.editMode" class="row">
            <div v-for="field in section.fields" :key="field.key" :class="`col-md-${field.col || 12} mb-3`">
              <div class="d-flex align-items-start">
                <i :class="field.icon" class="text-muted me-2 mt-1"></i>
                <div class="flex-grow-1">
                  <small class="text-muted d-block">{{ field.label }}</small>
                  <div class="fw-medium">
                    <!-- Fecha con edad -->
                    <span v-if="field.key === 'fechaNacimiento' && section.data[field.key]">
                      {{ formatearFecha(section.data[field.key]) }}
                      <span v-if="edadCalculada" class="badge bg-info ms-2">{{ edadCalculada }} años</span>
                    </span>
                    <!-- Redes sociales -->
                    <div v-else-if="field.key === 'redesSociales' && section.data[field.key]" class="redes-sociales-display">
                      <div v-for="red in section.data[field.key].split('\n')" :key="red" class="mb-1">
                        <small class="text-primary">{{ red.trim() }}</small>
                      </div>
                    </div>
                    <!-- Campo normal -->
                    <span v-else>{{ section.data[field.key] || 'No especificado' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modo Edición -->
          <form v-else @submit.prevent="saveSection(section.id)">
            <div class="row">
              <div v-for="field in section.fields" :key="field.key" :class="`col-md-${field.col || 12} mb-3`">
                <label class="form-label">
                  <i :class="field.icon" class="me-1"></i>{{ field.label }}
                  <span v-if="field.required" class="text-danger">*</span>
                </label>

                <!-- Input por tipo -->
                <input v-if="!field.type || field.type === 'text' || field.type === 'tel' || field.type === 'date'"
                  v-model="section.data[field.key]" :type="field.type || 'text'" class="form-control"
                  :class="{ 'is-invalid': errors[field.key] }" :placeholder="field.placeholder" :required="field.required" />

                <select v-else-if="field.type === 'select'" v-model="section.data[field.key]" class="form-select"
                  :class="{ 'is-invalid': errors[field.key] }" :required="field.required">
                  <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>

                <textarea v-else-if="field.type === 'textarea'" v-model="section.data[field.key]" class="form-control"
                  :class="{ 'is-invalid': errors[field.key] }" :rows="field.rows || 3" :placeholder="field.placeholder" :required="field.required"></textarea>

                <div v-if="field.helpText" class="form-text">{{ field.helpText }}</div>
                <div v-if="errors[field.key]" class="invalid-feedback">{{ errors[field.key] }}</div>

                <!-- Edad en tiempo real -->
                <div v-if="field.key === 'fechaNacimiento' && section.data[field.key]" class="edad-display">
                  <i class="fas fa-birthday-cake me-1"></i>Edad: {{ calcularEdad(section.data[field.key]) }} años
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading global -->
      <div v-if="sections.every(s => s.loading)" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2 text-muted">Cargando tu información...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validators, validadoresSalvador, erroresSalvador, formatearDocumento, calcularEdad } from '../utils/validators'
import { DEPARTAMENTOS_EL_SALVADOR, GENEROS, TIPOS_DOCUMENTO_IDENTIDAD } from '../utils/constants'
import api from '../services/api'

export default {
  name: 'PerfilAspirante',
  data() {
    return {
      message: '', messageType: 'success', errors: {},
      sections: [
        {
          id: 'personal', title: 'Información Personal', icon: 'fas fa-id-card', color: 'primary',
          editMode: false, loading: false, data: {}, backup: {},
          fields: [
            { key: 'primerNombre', label: 'Primer Nombre', icon: 'fas fa-user', required: true, col: 6 },
            { key: 'segundoNombre', label: 'Segundo Nombre', icon: 'fas fa-user', col: 6 },
            { key: 'primerApellido', label: 'Primer Apellido', icon: 'fas fa-user', required: true, col: 6 },
            { key: 'segundoApellido', label: 'Segundo Apellido', icon: 'fas fa-user', col: 6 },
            { key: 'genero', label: 'Género', icon: 'fas fa-venus-mars', type: 'select', options: [{ value: '', label: 'Seleccionar...' }, ...GENEROS], col: 6 },
            { key: 'fechaNacimiento', label: 'Fecha de Nacimiento', icon: 'fas fa-calendar-alt', type: 'date', col: 6, helpText: 'Opcional - Para calcular tu edad' },
            { key: 'tipoDocumentoIdentidad', label: 'Tipo de Documento', icon: 'fas fa-id-card', type: 'select', options: [{ value: '', label: 'Seleccionar...' }, ...TIPOS_DOCUMENTO_IDENTIDAD], col: 4 },
            { key: 'numeroDocumentoIdentidad', label: 'Número de Documento', icon: 'fas fa-hashtag', placeholder: 'Ejemplo: 03458765-2', col: 4, helpText: 'DUI: 12345678-9' },
            { key: 'nit', label: 'NIT (Opcional)', icon: 'fas fa-receipt', placeholder: '1234-567890-123-4', col: 4, helpText: 'Número de Identificación Tributaria' },
            { key: 'nup', label: 'NUP (Opcional)', icon: 'fas fa-passport', placeholder: 'PE123456', col: 6, helpText: 'Número Único Provisional para extranjeros' },
            { key: 'puestoBusca', label: 'Puesto que Busca', icon: 'fas fa-briefcase', col: 6 }
          ]
        },
        {
          id: 'contacto', title: 'Contacto', icon: 'fas fa-phone', color: 'success',
          editMode: false, loading: false, data: {}, backup: {},
          fields: [
            { key: 'telefonoPersonal', label: 'Teléfono Personal', icon: 'fas fa-mobile-alt', type: 'tel', required: true, col: 6 },
            { key: 'telefonoFijo', label: 'Teléfono Fijo', icon: 'fas fa-phone', type: 'tel', col: 6 },
            { key: 'redesSociales', label: 'Redes Sociales', icon: 'fas fa-share-alt', type: 'textarea', placeholder: 'LinkedIn: linkedin.com/in/tuperfil\nGitHub: github.com/tuusuario\nInstagram: @tuusuario', rows: 3, col: 12, helpText: 'URLs completas, handles (@usuario) o nombres de usuario. Una por línea.' }
          ]
        },
        {
          id: 'direccion', title: 'Dirección', icon: 'fas fa-map-marker-alt', color: 'warning',
          editMode: false, loading: false, data: {}, backup: {},
          fields: [
            { key: 'departamento', label: 'Departamento', icon: 'fas fa-map', type: 'select', options: [{ value: '', label: 'Seleccionar...' }, ...DEPARTAMENTOS_EL_SALVADOR.map(dep => ({ value: dep, label: dep }))], required: true, col: 4 },
            { key: 'municipio', label: 'Municipio', icon: 'fas fa-city', required: true, col: 4 },
            { key: 'detalleDireccion', label: 'Dirección Detallada', icon: 'fas fa-home', type: 'textarea', required: true, col: 4 }
          ]
        }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    messageClass() { return `alert-${this.messageType}` },
    messageIcon() { 
      const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }
      return icons[this.messageType] || 'fas fa-info-circle'
    },
    edadCalculada() {
      const fechaNacimiento = this.getSection('personal').data.fechaNacimiento
      return fechaNacimiento ? calcularEdad(fechaNacimiento) : null
    }
  },
  
  watch: {
    'sections.0.data.numeroDocumentoIdentidad'(newValue) {
      const tipoDoc = this.getSection('personal').data.tipoDocumentoIdentidad
      if (tipoDoc === 'DUI' && newValue) {
        this.$nextTick(() => {
          this.getSection('personal').data.numeroDocumentoIdentidad = formatearDocumento.dui(newValue)
        })
      }
    },
    'sections.0.data.nit'(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.getSection('personal').data.nit = formatearDocumento.nit(newValue)
        })
      }
    },
    'sections.0.data.nup'(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.getSection('personal').data.nup = formatearDocumento.nup(newValue)
        })
      }
    },
    'sections.0.data.tipoDocumentoIdentidad'() {
      this.getSection('personal').data.numeroDocumentoIdentidad = ''
      this.errors.numeroDocumentoIdentidad = ''
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
      await Promise.all(loadPromises)
    },
    
    async loadSectionData(sectionId) {
      const loaders = {
        personal: async () => {
          const response = await api.get('/Aspirante/todos')
          const aspirante = response.data.find(asp => asp.idUsuario === this.user.idUsuario)
          if (aspirante) {
            this.getSection('personal').data = {
              idAspirante: aspirante.idAspirante, idUsuario: aspirante.idUsuario,
              primerNombre: aspirante.primerNombre || '', segundoNombre: aspirante.segundoNombre || '',
              primerApellido: aspirante.primerApellido || '', segundoApellido: aspirante.segundoApellido || '',
              puestoBusca: aspirante.puestoBusca || '', genero: aspirante.genero || '',
              fechaNacimiento: aspirante.fechaNacimiento ? aspirante.fechaNacimiento.split('T')[0] : '',
              tipoDocumentoIdentidad: aspirante.tipoDocumentoIdentidad || '',
              numeroDocumentoIdentidad: aspirante.numeroDocumentoIdentidad || '',
              nit: aspirante.nit || '', nup: aspirante.nup || ''
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
                telefonoFijo: response.data.telefonoFijo || '',
                redesSociales: response.data.redesSociales || ''
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
    
    getSection(id) { return this.sections.find(s => s.id === id) },
    
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
        personal: () => {
          if (!this.validateRequired(section.data.primerNombre, 2)) {
            this.errors.primerNombre = 'El primer nombre es requerido (mínimo 2 caracteres)'
          }
          if (!this.validateRequired(section.data.primerApellido, 2)) {
            this.errors.primerApellido = 'El primer apellido es requerido (mínimo 2 caracteres)'
          }
          if (section.data.fechaNacimiento && !validadoresSalvador.fechaNacimiento(section.data.fechaNacimiento)) {
            this.errors.fechaNacimiento = erroresSalvador.fechaNacimiento
          }
          if (section.data.fechaNacimiento && !validadoresSalvador.edadMinima(section.data.fechaNacimiento, 16)) {
            this.errors.fechaNacimiento = erroresSalvador.edadMinima
          }
          const tipoDoc = section.data.tipoDocumentoIdentidad
          const numeroDoc = section.data.numeroDocumentoIdentidad
          if (tipoDoc && numeroDoc && tipoDoc === 'DUI' && !validadoresSalvador.dui(numeroDoc)) {
            this.errors.numeroDocumentoIdentidad = erroresSalvador.dui
          }
          if (section.data.nit && !validadoresSalvador.nit(section.data.nit)) {
            this.errors.nit = erroresSalvador.nit
          }
          if (section.data.nup && !validadoresSalvador.nup(section.data.nup)) {
            this.errors.nup = erroresSalvador.nup
          }
        },
        contacto: () => {
          if (!validators.required(section.data.telefonoPersonal) || !validators.telefono(section.data.telefonoPersonal)) {
            this.errors.telefonoPersonal = 'El teléfono personal es requerido y debe tener formato válido'
          }
          if (section.data.redesSociales && !validadoresSalvador.redesSociales(section.data.redesSociales)) {
            this.errors.redesSociales = erroresSalvador.redesSociales
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
      
      rules[sectionId]?.()
      return Object.keys(this.errors).length === 0
    },
    
    validateRequired(value, minLength = 1) {
      return validators.required(value) && validators.minLength(value, minLength)
    },
    
    async saveSection(sectionId) {
      if (!this.validateSection(sectionId)) return
      
      const section = this.getSection(sectionId)
      section.loading = true
      
      try {
        await this.saveSectionData(sectionId, section)
        section.editMode = false
        let msg = `${section.title} actualizada exitosamente`
        if (sectionId === 'personal' && section.data.fechaNacimiento) {
          const edad = calcularEdad(section.data.fechaNacimiento)
          if (edad) msg += `. Edad: ${edad} años`
        }
        this.showMessage(msg, 'success')
      } catch (error) {
        this.showMessage(`Error al guardar ${section.title}`, 'error')
      } finally {
        section.loading = false
      }
    },
    
    async saveSectionData(sectionId, section) {
      const savers = {
        personal: async () => {
          const data = {
            ...section.data, idUsuario: this.user.idUsuario,
            segundoNombre: section.data.segundoNombre || null,
            segundoApellido: section.data.segundoApellido || null,
            puestoBusca: section.data.puestoBusca || null,
            genero: section.data.genero || null,
            fechaNacimiento: section.data.fechaNacimiento || null,
            tipoDocumentoIdentidad: section.data.tipoDocumentoIdentidad || null,
            numeroDocumentoIdentidad: section.data.numeroDocumentoIdentidad || null,
            nit: section.data.nit || null, nup: section.data.nup || null
          }
          await api.put('/Aspirante/editar', data)
        },
        contacto: async () => {
          const data = {
            idUsuario: this.user.idUsuario,
            telefonoPersonal: section.data.telefonoPersonal,
            telefonoFijo: section.data.telefonoFijo || '',
            redesSociales: section.data.redesSociales || null
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
    },
    
    formatearFecha(fecha) {
      if (!fecha) return 'No especificado'
      return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    
    calcularEdad(fechaNacimiento) {
      if (!fechaNacimiento) return null
      const fecha = new Date(fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - fecha.getFullYear()
      const cumplioEsteAno = hoy >= new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())
      if (!cumplioEsteAno) edad--
      return edad
    }
  }
}
</script>

<style scoped>
.perfil-aspirante { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; }
.card { border: none; border-radius: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15); }
.card-header { border-radius: 15px 15px 0 0 !important; border-bottom: none; }
.edad-display { font-size: 0.9rem; color: #6b7280; margin-top: 0.25rem; font-style: italic; padding: 0.5rem; background: #f0f9ff; border-radius: 6px; border-left: 3px solid #3b82f6; }
.redes-sociales-display { background: #f8fafc; border-radius: 6px; padding: 0.5rem; border-left: 3px solid #10b981; }
.form-label { font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
.form-control:focus, .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25); }
.btn { border-radius: 8px; font-weight: 500; transition: all 0.2s ease; }
.btn:hover { transform: translateY(-1px); }
.alert { border: none; border-radius: 10px; font-weight: 500; }
.alert-success { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46; }
.alert-danger { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #991b1b; }
.alert-warning { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; }
@media (max-width: 768px) {
  .card-header .btn-group .btn { font-size: 0.8rem; padding: 0.375rem 0.5rem; }
  .card-header h5 { font-size: 1rem; }
}
</style>