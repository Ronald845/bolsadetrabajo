<template>
  <div class="perfil-empresa">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <h2 class="h4 mb-1">
            <i class="fas fa-building me-2 text-primary"></i>
            Perfil de Empresa
          </h2>
          <p class="text-muted mb-0">Gestiona la información de tu empresa y datos de contacto</p>
        </div>
      </div>

      <!-- Información de la Empresa -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-building me-2 text-primary"></i>
              Información de la Empresa
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
                  v-model="form.nombreEmpresa"
                  label="Nombre de la Empresa"
                  icon="fas fa-building"
                  placeholder="Nombre oficial de la empresa"
                  :required="true"
                  :readonly="!editMode"
                  :error="errors.nombreEmpresa"
                  help-text="Máximo 50 caracteres"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.nombreRepresentante"
                  label="Nombre del Representante"
                  icon="fas fa-user-tie"
                  placeholder="Nombre del representante legal"
                  :required="true"
                  :readonly="!editMode"
                  :error="errors.nombreRepresentante"
                  help-text="Máximo 60 caracteres"
                />
              </div>
              <div class="col-12">
                <FormField
                  v-model="form.descripcionEmpresa"
                  type="textarea"
                  label="Descripción de la Empresa"
                  icon="fas fa-info-circle"
                  placeholder="Describe tu empresa, sector, servicios, valores..."
                  :readonly="!editMode"
                  :rows="4"
                  help-text="Opcional - Ayuda a los candidatos a conocer mejor tu empresa"
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
              Información de Contacto
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
                label="Teléfono Principal"
                icon="fas fa-mobile-alt"
                placeholder="0000-0000"
                :required="true"
                :readonly="!editContacto"
                :error="errors.telefonoPersonal"
                help-text="Teléfono principal de la empresa"
              />
            </div>
            <div class="col-md-6">
              <FormField
                v-model="contacto.telefonoFijo"
                type="tel"
                label="Teléfono Secundario"
                icon="fas fa-phone"
                placeholder="0000-0000"
                :readonly="!editContacto"
                help-text="Teléfono alternativo (opcional)"
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
              Ubicación de la Empresa
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
                placeholder="Municipio de la empresa"
                :readonly="!editDireccion"
                :error="errors.municipio"
              />
            </div>
            <div class="col-md-4">
              <FormField
                v-model="direccion.detalleDireccion"
                type="textarea"
                label="Dirección Detallada"
                icon="fas fa-building"
                placeholder="Colonia, avenida, edificio, local..."
                :readonly="!editDireccion"
                :rows="2"
                :error="errors.detalleDireccion"
                help-text="Dirección completa de las oficinas"
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

      <!-- Estadísticas de la Empresa (Solo lectura) -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <h5 class="mb-0">
            <i class="fas fa-chart-bar me-2 text-info"></i>
            Estadísticas de la Empresa
          </h5>
        </div>
        <div class="card-body">
          <div class="row text-center">
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-primary">
                  <i class="fas fa-briefcase"></i>
                </div>
                <div class="stat-content">
                  <h4 class="stat-number">{{ estadisticas.totalOfertas }}</h4>
                  <p class="stat-label">Ofertas Publicadas</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-success">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="stat-content">
                  <h4 class="stat-number">{{ estadisticas.ofertasActivas }}</h4>
                  <p class="stat-label">Ofertas Activas</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-warning">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-content">
                  <h4 class="stat-number">{{ estadisticas.totalAplicaciones }}</h4>
                  <p class="stat-label">Aplicaciones Recibidas</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-info">
                  <i class="fas fa-calendar"></i>
                </div>
                <div class="stat-content">
                  <h4 class="stat-number">{{ calcularTiempoEnPlataforma() }}</h4>
                  <p class="stat-label">Tiempo en Plataforma</p>
                </div>
              </div>
            </div>
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
  name: 'PerfilEmpresa',
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
        idEmpresa: null,
        idUsuario: null,
        nombreEmpresa: '',
        nombreRepresentante: '',
        descripcionEmpresa: ''
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
      
      estadisticas: {
        totalOfertas: 0,
        ofertasActivas: 0,
        totalAplicaciones: 0,
        fechaRegistro: null
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
        await this.cargarPerfilEmpresa()
        await this.cargarContacto()
        await this.cargarDireccion()
        await this.cargarEstadisticas()
      } catch (error) {
        console.error('Error cargando datos:', error)
        this.showMessage('Error al cargar los datos', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async cargarPerfilEmpresa() {
      try {
        const response = await api.get('/Empresa/todas')
        const empresas = response.data
        const empresaActual = empresas.find(emp => emp.idUsuario === this.user.idUsuario)
        
        if (empresaActual) {
          this.form = {
            idEmpresa: empresaActual.idEmpresa,
            idUsuario: empresaActual.idUsuario,
            nombreEmpresa: empresaActual.nombreEmpresa || '',
            nombreRepresentante: empresaActual.nombreRepresentante || '',
            descripcionEmpresa: empresaActual.descripcionEmpresa || ''
          }
        }
      } catch (error) {
        console.error('Error cargando perfil de empresa:', error)
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
    
    async cargarEstadisticas() {
      try {
        // TODO: Implementar cuando tengamos endpoints de estadísticas
        // Por ahora valores por defecto
        this.estadisticas = {
          totalOfertas: 0,
          ofertasActivas: 0,
          totalAplicaciones: 0,
          fechaRegistro: this.user.fechaRegistro || new Date()
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
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
      
      if (!validators.required(this.form.nombreEmpresa) || !validators.maxLength(this.form.nombreEmpresa, 50)) {
        this.errors.nombreEmpresa = 'El nombre de la empresa es requerido (máximo 50 caracteres)'
      }
      
      if (!validators.required(this.form.nombreRepresentante) || !validators.maxLength(this.form.nombreRepresentante, 60)) {
        this.errors.nombreRepresentante = 'El nombre del representante es requerido (máximo 60 caracteres)'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    validateContacto() {
      this.errors = {}
      
      if (!validators.required(this.contacto.telefonoPersonal) || !validators.telefono(this.contacto.telefonoPersonal)) {
        this.errors.telefonoPersonal = 'El teléfono principal es requerido y debe tener formato válido'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    validateDireccion() {
      this.errors = {}
      
      if (!validators.required(this.direccion.departamento)) {
        this.errors.departamento = 'Selecciona el departamento'
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
        
        const empresaData = {
          idEmpresa: this.form.idEmpresa,
          idUsuario: this.user.idUsuario,
          nombreEmpresa: this.form.nombreEmpresa,
          nombreRepresentante: this.form.nombreRepresentante,
          descripcionEmpresa: this.form.descripcionEmpresa || null
        }
        
        await api.put('/Empresa/editar', empresaData)
        this.editMode = false
        this.showMessage('Perfil de empresa actualizado exitosamente', 'success')
        
      } catch (error) {
        console.error('Error guardando perfil:', error)
        this.showMessage('Error al guardar el perfil de la empresa', 'error')
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
    
    calcularTiempoEnPlataforma() {
      if (!this.user?.fechaRegistro) return '0 días'
      
      const fechaRegistro = new Date(this.user.fechaRegistro)
      const fechaActual = new Date()
      const diffTime = Math.abs(fechaActual - fechaRegistro)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 30) {
        return `${diffDays} días`
      } else if (diffDays < 365) {
        const meses = Math.floor(diffDays / 30)
        return `${meses} mes${meses > 1 ? 'es' : ''}`
      } else {
        const años = Math.floor(diffDays / 365)
        return `${años} año${años > 1 ? 's' : ''}`
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
.perfil-empresa {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}

.gap-2 {
  gap: 0.5rem;
}

/* Estadísticas */
.stat-card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 15px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

/* Botones */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.btn-success {
  background: linear-gradient(135deg, #11998e, #38ef7d);
  border: none;
}

.btn-warning {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  border: none;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>