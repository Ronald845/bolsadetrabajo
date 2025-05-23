<template>
  <div class="experiencia-laboral">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-briefcase me-2 text-success"></i>
                Experiencia Laboral
              </h2>
              <p class="text-muted mb-0">Gestiona tu historial profesional y experiencia de trabajo</p>
            </div>
            <button 
              @click="mostrarModal = true" 
              class="btn btn-success"
            >
              <i class="fas fa-plus me-2"></i>
              Agregar Experiencia
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de experiencias -->
      <div class="row">
        <div class="col-12">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
            <p class="mt-2">Cargando experiencias laborales...</p>
          </div>
          
          <div v-else-if="experiencias.length === 0" class="text-center py-5">
            <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
            <h5>No hay experiencias laborales registradas</h5>
            <p class="text-muted">Agrega tu primera experiencia laboral para completar tu perfil profesional</p>
            <button @click="mostrarModal = true" class="btn btn-success">
              <i class="fas fa-plus me-2"></i>
              Agregar Experiencia
            </button>
          </div>
          
          <div v-else>
            <!-- Timeline de experiencias -->
            <div class="timeline">
              <div 
                v-for="(experiencia, index) in experienciasOrdenadas" 
                :key="experiencia.idExperiencia"
                class="timeline-item"
                :class="{ 'timeline-item-current': !experiencia.fechaFin }"
              >
                <div class="timeline-marker">
                  <i class="fas fa-briefcase"></i>
                </div>
                <div class="timeline-content">
                  <div class="card experiencia-card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="flex-grow-1">
                          <h5 class="card-title mb-1">{{ experiencia.puestoTrabajo }}</h5>
                          <h6 class="card-subtitle text-success mb-2">{{ experiencia.nombreEmpresa }}</h6>
                        </div>
                        <div class="d-flex gap-2">
                          <span v-if="!experiencia.fechaFin" class="badge bg-success">Actual</span>
                          <div class="dropdown">
                            <button 
                              class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                              type="button" 
                              :id="`dropdown${experiencia.idExperiencia}`"
                              data-bs-toggle="dropdown"
                            >
                              <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                              <li>
                                <a class="dropdown-item" href="#" @click.prevent="editarExperiencia(experiencia)">
                                  <i class="fas fa-edit me-2"></i>Editar
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item text-danger" href="#" @click.prevent="confirmarEliminar(experiencia)">
                                  <i class="fas fa-trash me-2"></i>Eliminar
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div class="experiencia-info">
                        <div class="row mb-3">
                          <div class="col-md-6">
                            <div class="info-item">
                              <i class="fas fa-calendar-alt text-muted me-2"></i>
                              <span>{{ formatFecha(experiencia.fechaInicio) }}</span>
                              <span v-if="experiencia.fechaFin"> - {{ formatFecha(experiencia.fechaFin) }}</span>
                              <span v-else class="text-success"> - Actualidad</span>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="info-item">
                              <i class="fas fa-clock text-muted me-2"></i>
                              <span>{{ calcularDuracion(experiencia.fechaInicio, experiencia.fechaFin) }}</span>
                            </div>
                          </div>
                          <div v-if="experiencia.telefonoEmpresa" class="col-md-6">
                            <div class="info-item">
                              <i class="fas fa-phone text-muted me-2"></i>
                              <span>{{ experiencia.telefonoEmpresa }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="funciones-section">
                          <h6 class="mb-2">
                            <i class="fas fa-tasks me-2"></i>
                            Funciones y Responsabilidades:
                          </h6>
                          <div class="funciones-content">
                            {{ experiencia.funciones }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para agregar/editar experiencia -->
      <div class="modal fade" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-briefcase me-2"></i>
                {{ editando ? 'Editar' : 'Agregar' }} Experiencia Laboral
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarExperiencia">
                <div class="row">
                  <!-- Puesto de Trabajo -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.puestoTrabajo"
                      label="Puesto de Trabajo"
                      icon="fas fa-user-tie"
                      placeholder="Desarrollador, Contador, Gerente..."
                      :required="true"
                      :error="errors.puestoTrabajo"
                      help-text="Máximo 20 caracteres"
                    />
                  </div>
                  
                  <!-- Nombre de la Empresa -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.nombreEmpresa"
                      label="Nombre de la Empresa"
                      icon="fas fa-building"
                      placeholder="Nombre de la empresa u organización"
                      :required="true"
                      :error="errors.nombreEmpresa"
                      help-text="Máximo 50 caracteres"
                    />
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
                    <div class="mb-3">
                      <div class="form-check mb-2">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="trabajoActual"
                          v-model="trabajoActual"
                          @change="onTrabajoActualChange"
                        >
                        <label class="form-check-label" for="trabajoActual">
                          <i class="fas fa-clock me-2"></i>
                          Trabajo actual
                        </label>
                      </div>
                      <FormField
                        v-if="!trabajoActual"
                        v-model="form.fechaFin"
                        type="date"
                        label="Fecha de Finalización"
                        icon="fas fa-calendar-check"
                        :min="form.fechaInicio"
                        :max="fechaHoy"
                        :error="errors.fechaFin"
                      />
                    </div>
                  </div>
                  
                  <!-- Teléfono de la Empresa -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.telefonoEmpresa"
                      type="tel"
                      label="Teléfono de la Empresa"
                      icon="fas fa-phone"
                      placeholder="0000-0000 (opcional)"
                      help-text="Para referencias laborales"
                    />
                  </div>
                  
                  <!-- Estado del empleo -->
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">
                        <i class="fas fa-info-circle me-2"></i>
                        Estado
                      </label>
                      <div class="form-control-plaintext">
                        <span class="badge" :class="`bg-${getEstadoColor()}`">
                          {{ getEstadoExperiencia() }}
                        </span>
                        <small class="text-muted ms-2">
                          {{ getDuracionTexto() }}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Funciones y Responsabilidades -->
                  <div class="col-12">
                    <FormField
                      v-model="form.funciones"
                      type="textarea"
                      label="Funciones y Responsabilidades"
                      icon="fas fa-tasks"
                      placeholder="Describe las principales funciones que realizaste en este puesto..."
                      :required="true"
                      :rows="4"
                      :error="errors.funciones"
                      help-text="Describe detalladamente tus responsabilidades y logros en este puesto"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal" :disabled="guardando">
                Cancelar
              </button>
              <button type="button" @click="guardarExperiencia" class="btn btn-success" :disabled="guardando || !isFormValid">
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
              <p>¿Estás seguro de que deseas eliminar esta experiencia laboral?</p>
              <div class="alert alert-warning">
                <strong>{{ experienciaAEliminar?.puestoTrabajo }}</strong><br>
                <small>{{ experienciaAEliminar?.nombreEmpresa }}</small>
              </div>
              <p class="text-muted small">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacion = false" :disabled="eliminando">
                Cancelar
              </button>
              <button type="button" @click="eliminarExperiencia" class="btn btn-danger" :disabled="eliminando">
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
import { TIPOS_EMPLEO, NIVELES_PUESTO, SECTORES_EMPRESA } from '../utils/constants'

export default {
  name: 'ExperienciaLaboral',
  components: { FormField },
  data() {
    return {
      loading: false,
      guardando: false,
      eliminando: false,
      mostrarModal: false,
      mostrarConfirmacion: false,
      editando: false,
      trabajoActual: false,
      message: '',
      messageType: 'success',
      
      experiencias: [],
      experienciaAEliminar: null,
      aspiranteId: null,
      
      form: {
        idExperiencia: null,
        idAspirante: null,
        puestoTrabajo: '',
        nombreEmpresa: '',
        fechaInicio: '',
        fechaFin: '',
        funciones: '',
        telefonoEmpresa: ''
      },
      
      errors: {},
      tiposEmpleoOptions: TIPOS_EMPLEO,
      nivelesPuestoOptions: NIVELES_PUESTO,
      sectoresEmpresaOptions: SECTORES_EMPRESA
    }
  },
  computed: {
    ...mapGetters(['user']),
    
    fechaHoy() {
      return new Date().toISOString().split('T')[0]
    },
    
    experienciasOrdenadas() {
      return [...this.experiencias].sort((a, b) => {
        // Primero los trabajos actuales (sin fecha fin)
        if (!a.fechaFin && b.fechaFin) return -1
        if (a.fechaFin && !b.fechaFin) return 1
        
        // Luego por fecha de inicio (más reciente primero)
        return new Date(b.fechaInicio) - new Date(a.fechaInicio)
      })
    },
    
    isFormValid() {
      return !this.errors.puestoTrabajo && 
             !this.errors.nombreEmpresa && 
             !this.errors.fechaInicio &&
             !this.errors.fechaFin &&
             !this.errors.funciones &&
             this.form.puestoTrabajo && 
             this.form.nombreEmpresa && 
             this.form.fechaInicio &&
             this.form.funciones
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
      await this.cargarExperiencias()
    }
  },
  
  methods: {
    async cargarAspiranteId() {
      try {
        const response = await aspiranteService.obtenerExperiencias()
        const experiencias = response.filter(e => e.aspirante?.idUsuario === this.user.idUsuario)
        if (experiencias.length > 0) {
          this.aspiranteId = experiencias[0].idAspirante
        } else {
          // Fallback: obtener desde el store o API
          this.aspiranteId = this.user.idAspirante || 1 // temporal
        }
      } catch (error) {
        console.error('Error obteniendo ID de aspirante:', error)
        this.aspiranteId = 1 // temporal para pruebas
      }
    },
    
    async cargarExperiencias() {
      try {
        this.loading = true
        const response = await aspiranteService.obtenerExperiencias()
        // Filtrar solo las experiencias del aspirante actual
        this.experiencias = response.filter(e => e.idAspirante === this.aspiranteId)
      } catch (error) {
        console.error('Error cargando experiencias:', error)
        this.showMessage('Error al cargar las experiencias laborales', 'error')
      } finally {
        this.loading = false
      }
    },
    
    editarExperiencia(experiencia) {
      this.editando = true
      this.form = {
        idExperiencia: experiencia.idExperiencia,
        idAspirante: experiencia.idAspirante,
        puestoTrabajo: experiencia.puestoTrabajo,
        nombreEmpresa: experiencia.nombreEmpresa,
        fechaInicio: experiencia.fechaInicio ? experiencia.fechaInicio.split('T')[0] : '',
        fechaFin: experiencia.fechaFin ? experiencia.fechaFin.split('T')[0] : '',
        funciones: experiencia.funciones,
        telefonoEmpresa: experiencia.telefonoEmpresa || ''
      }
      this.trabajoActual = !experiencia.fechaFin
      this.errors = {}
      this.mostrarModal = true
    },
    
    confirmarEliminar(experiencia) {
      this.experienciaAEliminar = experiencia
      this.mostrarConfirmacion = true
    },
    
    async eliminarExperiencia() {
      try {
        this.eliminando = true
        await aspiranteService.eliminarExperiencia(this.experienciaAEliminar.idExperiencia)
        
        await this.cargarExperiencias()
        this.mostrarConfirmacion = false
        this.experienciaAEliminar = null
        this.showMessage('Experiencia laboral eliminada exitosamente', 'success')
        
      } catch (error) {
        console.error('Error eliminando experiencia:', error)
        this.showMessage('Error al eliminar la experiencia laboral', 'error')
      } finally {
        this.eliminando = false
      }
    },
    
    cerrarModal() {
      this.mostrarModal = false
      this.editando = false
      this.trabajoActual = false
      this.form = {
        idExperiencia: null,
        idAspirante: null,
        puestoTrabajo: '',
        nombreEmpresa: '',
        fechaInicio: '',
        fechaFin: '',
        funciones: '',
        telefonoEmpresa: ''
      }
      this.errors = {}
    },
    
    onTrabajoActualChange() {
      if (this.trabajoActual) {
        this.form.fechaFin = ''
        this.errors.fechaFin = ''
      }
    },
    
    validateForm() {
      this.errors = {}
      
      if (!validators.required(this.form.puestoTrabajo) || !validators.maxLength(this.form.puestoTrabajo, 20)) {
        this.errors.puestoTrabajo = 'El puesto de trabajo es requerido (máximo 20 caracteres)'
      }
      
      if (!validators.required(this.form.nombreEmpresa) || !validators.maxLength(this.form.nombreEmpresa, 50)) {
        this.errors.nombreEmpresa = 'El nombre de la empresa es requerido (máximo 50 caracteres)'
      }
      
      if (!validators.required(this.form.fechaInicio)) {
        this.errors.fechaInicio = 'La fecha de inicio es requerida'
      } else if (new Date(this.form.fechaInicio) > new Date()) {
        this.errors.fechaInicio = 'La fecha de inicio no puede ser futura'
      }
      
      if (!this.trabajoActual && this.form.fechaFin) {
        if (new Date(this.form.fechaFin) < new Date(this.form.fechaInicio)) {
          this.errors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio'
        } else if (new Date(this.form.fechaFin) > new Date()) {
          this.errors.fechaFin = 'La fecha de fin no puede ser futura'
        }
      }
      
      if (!validators.required(this.form.funciones) || !validators.minLength(this.form.funciones, 10)) {
        this.errors.funciones = 'Las funciones son requeridas (mínimo 10 caracteres)'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async guardarExperiencia() {
      if (!this.validateForm()) return
      
      try {
        this.guardando = true
        
        const experienciaData = {
          idAspirante: this.aspiranteId,
          puestoTrabajo: this.form.puestoTrabajo,
          nombreEmpresa: this.form.nombreEmpresa,
          fechaInicio: this.form.fechaInicio,
          fechaFin: this.trabajoActual ? null : (this.form.fechaFin || null),
          funciones: this.form.funciones,
          telefonoEmpresa: this.form.telefonoEmpresa || null
        }
        
        if (this.editando) {
          experienciaData.idExperiencia = this.form.idExperiencia
          await aspiranteService.actualizarExperiencia(experienciaData)
          this.showMessage('Experiencia laboral actualizada exitosamente', 'success')
        } else {
          await aspiranteService.crearExperiencia(experienciaData)
          this.showMessage('Experiencia laboral agregada exitosamente', 'success')
        }
        
        await this.cargarExperiencias()
        this.cerrarModal()
        
      } catch (error) {
        console.error('Error guardando experiencia:', error)
        this.showMessage('Error al guardar la experiencia laboral', 'error')
      } finally {
        this.guardando = false
      }
    },
    
    getEstadoExperiencia() {
      if (!this.form.fechaFin || this.trabajoActual) {
        return 'Trabajo Actual'
      } else {
        return 'Trabajo Anterior'
      }
    },
    
    getEstadoColor() {
      return this.getEstadoExperiencia() === 'Trabajo Actual' ? 'success' : 'secondary'
    },
    
    getDuracionTexto() {
      if (!this.form.fechaInicio) return ''
      
      const inicio = this.form.fechaInicio
      const fin = this.trabajoActual ? null : this.form.fechaFin
      
      return this.calcularDuracion(inicio, fin)
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
.experiencia-laboral {
 background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
 min-height: 100vh;
}

/* Timeline Styles */
.timeline {
 position: relative;
 padding-left: 2rem;
}

.timeline::before {
 content: '';
 position: absolute;
 left: 1rem;
 top: 0;
 bottom: 0;
 width: 2px;
 background: linear-gradient(to bottom, #10b981, #d1fae5);
}

.timeline-item {
 position: relative;
 margin-bottom: 2rem;
}

.timeline-marker {
 position: absolute;
 left: -2.25rem;
 top: 1rem;
 width: 2.5rem;
 height: 2.5rem;
 background: #10b981;
 border: 3px solid white;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 color: white;
 font-size: 0.875rem;
 box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
 z-index: 2;
}

.timeline-item-current .timeline-marker {
 background: linear-gradient(135deg, #10b981, #059669);
 animation: pulse-success 2s infinite;
}

@keyframes pulse-success {
 0% {
   box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
 }
 70% {
   box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
 }
 100% {
   box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
 }
}

.timeline-content {
 margin-left: 1rem;
}

.experiencia-card {
 border: none;
 border-radius: 15px;
 box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
 transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.experiencia-card:hover {
 transform: translateY(-2px);
 box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}

.timeline-item-current .experiencia-card {
 border-left: 4px solid #10b981;
}

.info-item {
 display: flex;
 align-items: center;
 margin-bottom: 0.5rem;
 font-size: 0.9rem;
}

.funciones-section {
 background: #f8fafc;
 border-radius: 10px;
 padding: 1rem;
 border-left: 4px solid #10b981;
}

.funciones-content {
 font-size: 0.9rem;
 line-height: 1.5;
 color: #4b5563;
 white-space: pre-line;
}

/* Modal Styles */
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

/* Form Styles */
.form-check-input:checked {
 background-color: #10b981;
 border-color: #10b981;
}

.form-check-label {
 font-weight: 500;
 color: #374151;
}

/* Button Styles */
.btn {
 border-radius: 8px;
 font-weight: 500;
 transition: all 0.2s ease;
}

.btn:hover {
 transform: translateY(-1px);
}

.btn-success {
 background: linear-gradient(135deg, #10b981, #059669);
 border: none;
}

.btn-success:hover {
 background: linear-gradient(135deg, #059669, #047857);
}

/* Badge Styles */
.badge {
 font-size: 0.75rem;
 padding: 0.35em 0.65em;
}

/* Responsive */
@media (max-width: 768px) {
 .timeline {
   padding-left: 1.5rem;
 }
 
 .timeline::before {
   left: 0.75rem;
 }
 
 .timeline-marker {
   left: -1.75rem;
   width: 2rem;
   height: 2rem;
 }
 
 .timeline-content {
   margin-left: 0.5rem;
 }
 
 .modal-dialog {
   margin: 1rem;
 }
}

/* Dropdown Styles */
.dropdown-toggle::after {
 display: none;
}

.dropdown-menu {
 border-radius: 10px;
 border: none;
 box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
 border-radius: 5px;
 margin: 0.125rem;
 transition: all 0.2s ease;
}

.dropdown-item:hover {
 background-color: #f3f4f6;
 transform: translateX(2px);
}
</style>