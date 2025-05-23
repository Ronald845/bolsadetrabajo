<template>
  <div class="formacion-academica">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-graduation-cap me-2 text-primary"></i>
                Formación Académica
              </h2>
              <p class="text-muted mb-0">Gestiona tu educación y estudios realizados</p>
            </div>
            <button 
              @click="mostrarModal = true" 
              class="btn btn-primary"
            >
              <i class="fas fa-plus me-2"></i>
              Agregar Formación
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de formaciones -->
      <div class="row">
        <div class="col-12">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando formaciones...</p>
          </div>
          
          <div v-else-if="formaciones.length === 0" class="text-center py-5">
            <i class="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
            <h5>No hay formaciones académicas registradas</h5>
            <p class="text-muted">Agrega tu primera formación académica para completar tu perfil</p>
            <button @click="mostrarModal = true" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>
              Agregar Formación
            </button>
          </div>
          
          <div v-else class="row">
            <div 
              v-for="formacion in formaciones" 
              :key="formacion.idFormacion"
              class="col-lg-6 mb-4"
            >
              <div class="card h-100 formacion-card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="flex-grow-1">
                      <h5 class="card-title mb-1">{{ formacion.titulo }}</h5>
                      <h6 class="card-subtitle text-muted">{{ formacion.institucion }}</h6>
                    </div>
                    <div class="dropdown">
                      <button 
                        class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                        type="button" 
                        :id="`dropdown${formacion.idFormacion}`"
                        data-bs-toggle="dropdown"
                      >
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="editarFormacion(formacion)">
                            <i class="fas fa-edit me-2"></i>Editar
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item text-danger" href="#" @click.prevent="confirmarEliminar(formacion)">
                            <i class="fas fa-trash me-2"></i>Eliminar
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div class="formacion-info">
                    <div class="mb-2">
                      <span class="badge" :class="`bg-${getTipoColor(formacion.tipoFormacion)}`">
                        {{ formacion.tipoFormacion }}
                      </span>
                    </div>
                    
                    <div class="mb-2">
                      <i class="fas fa-calendar-alt text-muted me-2"></i>
                      <span>{{ formatFecha(formacion.fechaInicio) }}</span>
                      <span v-if="formacion.fechaFin"> - {{ formatFecha(formacion.fechaFin) }}</span>
                      <span v-else class="text-success"> - En curso</span>
                    </div>
                    
                    <div class="mb-2">
                      <i class="fas fa-clock text-muted me-2"></i>
                      <span>{{ calcularDuracion(formacion.fechaInicio, formacion.fechaFin) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para agregar/editar formación -->
      <div class="modal fade" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-graduation-cap me-2"></i>
                {{ editando ? 'Editar' : 'Agregar' }} Formación Académica
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarFormacion">
                <div class="row">
                  <!-- Institución -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.institucion"
                      label="Institución Educativa"
                      icon="fas fa-university"
                      placeholder="Universidad, Instituto, Colegio..."
                      :required="true"
                      :error="errors.institucion"
                    />
                  </div>
                  
                  <!-- Título -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.titulo"
                      label="Título o Carrera"
                      icon="fas fa-certificate"
                      placeholder="Ingeniería, Bachillerato, Técnico en..."
                      :required="true"
                      :error="errors.titulo"
                    />
                  </div>
                  
                  <!-- Tipo de Formación -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.tipoFormacion"
                      type="select"
                      label="Tipo de Formación"
                      icon="fas fa-layer-group"
                      placeholder="Selecciona el tipo"
                      :options="tiposFormacionOptions"
                      :required="true"
                      :error="errors.tipoFormacion"
                    />
                  </div>
                  
                  <!-- Estado (calculado automáticamente) -->
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">
                        <i class="fas fa-info-circle me-2"></i>
                        Estado
                      </label>
                      <div class="form-control-plaintext">
                        <span class="badge" :class="`bg-${getEstadoColor()}`">
                          {{ getEstadoFormacion() }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Fecha Inicio -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.fechaInicio"
                      type="date"
                      label="Fecha de Inicio"
                      icon="fas fa-calendar-start"
                      :required="true"
                      :error="errors.fechaInicio"
                      :max="fechaHoy"
                    />
                  </div>
                  
                  <!-- Fecha Fin -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.fechaFin"
                      type="date"
                      label="Fecha de Finalización"
                      icon="fas fa-calendar-check"
                      :min="form.fechaInicio"
                      help-text="Deja vacío si aún estás estudiando"
                      :error="errors.fechaFin"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal" :disabled="guardando">
                Cancelar
              </button>
              <button type="button" @click="guardarFormacion" class="btn btn-primary" :disabled="guardando || !isFormValid">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Backdrop del modal -->
      <div v-if="mostrarModal" class="modal-backdrop fade show" @click="cerrarModal"></div>

      <!-- Modal de confirmación de eliminación -->
      <div class="modal fade" :class="{ show: mostrarConfirmacion }" :style="{ display: mostrarConfirmacion ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Confirmar Eliminación
              </h5>
              <button type="button" class="btn-close" @click="mostrarConfirmacion = false"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta formación académica?</p>
              <div class="alert alert-warning">
                <strong>{{ formacionAEliminar?.titulo }}</strong><br>
                <small>{{ formacionAEliminar?.institucion }}</small>
              </div>
              <p class="text-muted small">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacion = false" :disabled="eliminando">
                Cancelar
              </button>
              <button type="button" @click="eliminarFormacion" class="btn btn-danger" :disabled="eliminando">
                <span v-if="eliminando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-trash me-2"></i>
                {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Backdrop del modal de confirmación -->
      <div v-if="mostrarConfirmacion" class="modal-backdrop fade show" @click="mostrarConfirmacion = false"></div>

      <!-- Mensaje de éxito/error -->
      <div v-if="message" class="alert mt-4" :class="messageClass">
        <i :class="messageIcon" class="me-2"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormField from './FormField.vue'
import { aspiranteService } from '../services/aspiranteService'
import { validators } from '../utils/validators'
import { TIPOS_FORMACION } from '../utils/constants'

export default {
  name: 'FormacionAcademica',
  components: { FormField },
  data() {
    return {
      loading: false,
      guardando: false,
      eliminando: false,
      mostrarModal: false,
      mostrarConfirmacion: false,
      editando: false,
      message: '',
      messageType: 'success',
      
      formaciones: [],
      formacionAEliminar: null,
      aspiranteId: null,
      
      form: {
        idFormacion: null,
        idAspirante: null,
        institucion: '',
        titulo: '',
        fechaInicio: '',
        fechaFin: '',
        tipoFormacion: ''
      },
      
      errors: {},
      tiposFormacionOptions: TIPOS_FORMACION
    }
  },
  computed: {
    ...mapGetters(['user']),
    
    fechaHoy() {
      return new Date().toISOString().split('T')[0]
    },
    
    isFormValid() {
      return !this.errors.institucion && 
             !this.errors.titulo && 
             !this.errors.tipoFormacion &&
             !this.errors.fechaInicio &&
             !this.errors.fechaFin &&
             this.form.institucion && 
             this.form.titulo && 
             this.form.tipoFormacion &&
             this.form.fechaInicio
    },
    
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
    await this.cargarAspiranteId()
    if (this.aspiranteId) {
      await this.cargarFormaciones()
    }
  },
  
  methods: {
    async cargarAspiranteId() {
      try {
        const response = await aspiranteService.obtenerFormaciones()
        const aspirantes = response.filter(f => f.aspirante?.idUsuario === this.user.idUsuario)
        if (aspirantes.length > 0) {
          this.aspiranteId = aspirantes[0].idAspirante
        } else {
          // Obtener aspirante por ID de usuario
          const aspResponse = await this.$store.dispatch('getAspiranteByUserId', this.user.idUsuario)
          this.aspiranteId = aspResponse?.idAspirante
        }
      } catch (error) {
        console.error('Error obteniendo ID de aspirante:', error)
      }
    },
    
    async cargarFormaciones() {
      try {
        this.loading = true
        const response = await aspiranteService.obtenerFormaciones()
        // Filtrar solo las formaciones del aspirante actual
        this.formaciones = response.filter(f => f.idAspirante === this.aspiranteId)
      } catch (error) {
        console.error('Error cargando formaciones:', error)
        this.showMessage('Error al cargar las formaciones', 'error')
      } finally {
        this.loading = false
      }
    },
    
    editarFormacion(formacion) {
      this.editando = true
      this.form = {
        idFormacion: formacion.idFormacion,
        idAspirante: formacion.idAspirante,
        institucion: formacion.institucion,
        titulo: formacion.titulo,
        fechaInicio: formacion.fechaInicio ? formacion.fechaInicio.split('T')[0] : '',
        fechaFin: formacion.fechaFin ? formacion.fechaFin.split('T')[0] : '',
        tipoFormacion: formacion.tipoFormacion
      }
      this.errors = {}
      this.mostrarModal = true
    },
    
    confirmarEliminar(formacion) {
      this.formacionAEliminar = formacion
      this.mostrarConfirmacion = true
    },
    
    async eliminarFormacion() {
      try {
        this.eliminando = true
        await aspiranteService.eliminarFormacion(this.formacionAEliminar.idFormacion)
        
        await this.cargarFormaciones()
        this.mostrarConfirmacion = false
        this.formacionAEliminar = null
        this.showMessage('Formación eliminada exitosamente', 'success')
        
      } catch (error) {
        console.error('Error eliminando formación:', error)
        this.showMessage('Error al eliminar la formación', 'error')
      } finally {
        this.eliminando = false
      }
    },
    
    cerrarModal() {
      this.mostrarModal = false
      this.editando = false
      this.form = {
        idFormacion: null,
        idAspirante: null,
        institucion: '',
        titulo: '',
        fechaInicio: '',
        fechaFin: '',
        tipoFormacion: ''
      }
      this.errors = {}
    },
    
    validateForm() {
      this.errors = {}
      
      if (!validators.required(this.form.institucion) || !validators.maxLength(this.form.institucion, 50)) {
        this.errors.institucion = 'La institución es requerida (máximo 50 caracteres)'
      }
      
      if (!validators.required(this.form.titulo) || !validators.maxLength(this.form.titulo, 50)) {
        this.errors.titulo = 'El título es requerido (máximo 50 caracteres)'
      }
      
      if (!validators.required(this.form.tipoFormacion)) {
        this.errors.tipoFormacion = 'Selecciona el tipo de formación'
      }
      
      if (!validators.required(this.form.fechaInicio)) {
        this.errors.fechaInicio = 'La fecha de inicio es requerida'
      } else if (new Date(this.form.fechaInicio) > new Date()) {
        this.errors.fechaInicio = 'La fecha de inicio no puede ser futura'
      }
      
      if (this.form.fechaFin && new Date(this.form.fechaFin) < new Date(this.form.fechaInicio)) {
        this.errors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async guardarFormacion() {
      if (!this.validateForm()) return
      
      try {
        this.guardando = true
        
        const formacionData = {
          idAspirante: this.aspiranteId,
          institucion: this.form.institucion,
          titulo: this.form.titulo,
          fechaInicio: this.form.fechaInicio,
          fechaFin: this.form.fechaFin || null,
          tipoFormacion: this.form.tipoFormacion
        }
        
        if (this.editando) {
          formacionData.idFormacion = this.form.idFormacion
          await aspiranteService.actualizarFormacion(formacionData)
          this.showMessage('Formación actualizada exitosamente', 'success')
        } else {
          await aspiranteService.crearFormacion(formacionData)
          this.showMessage('Formación agregada exitosamente', 'success')
        }
        
        await this.cargarFormaciones()
        this.cerrarModal()
        
      } catch (error) {
        console.error('Error guardando formación:', error)
        this.showMessage('Error al guardar la formación', 'error')
      } finally {
        this.guardando = false
      }
    },
    
    getTipoColor(tipo) {
      const colores = {
        'Primaria': 'secondary',
        'Secundaria': 'info',
        'Técnico': 'warning',
        'Tecnólogo': 'warning',
        'Universitario': 'primary',
        'Postgrado': 'success',
        'Maestría': 'success',
        'Doctorado': 'danger'
      }
      return colores[tipo] || 'secondary'
    },
    
    getEstadoFormacion() {
      if (!this.form.fechaFin) {
        return 'En Curso'
      } else {
        return 'Completado'
      }
    },
    
    getEstadoColor() {
      return this.getEstadoFormacion() === 'En Curso' ? 'primary' : 'success'
    },
    
    formatFecha(fecha) {
      if (!fecha) return ''
      const date = new Date(fecha)
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      })
    },
    
    calcularDuracion(fechaInicio, fechaFin) {
      if (!fechaInicio) return ''
      
      const inicio = new Date(fechaInicio)
      const fin = fechaFin ? new Date(fechaFin) : new Date()
      
      const diffTime = Math.abs(fin - inicio)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const diffMonths = Math.floor(diffDays / 30)
      const diffYears = Math.floor(diffMonths / 12)
      
      if (diffYears > 0) {
        const months = diffMonths % 12
        return `${diffYears} año${diffYears > 1 ? 's' : ''}${months > 0 ? ` y ${months} mes${months > 1 ? 'es' : ''}` : ''}`
      } else if (diffMonths > 0) {
        return `${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`
      } else {
        return `${diffDays} día${diffDays > 1 ? 's' : ''}`
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
.formacion-academica {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.formacion-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.formacion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}

.modal.show {
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 15px;
  border: none;
}

.modal-header {
  border-bottom: 1px solid #e5e7eb;
  border-radius: 15px 15px 0 0;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 15px 15px;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.formacion-info {
  font-size: 0.9rem;
}

.dropdown-toggle::after {
  display: none;
}
</style>