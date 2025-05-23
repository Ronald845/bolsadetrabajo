<template>
  <div class="certificaciones">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-certificate me-2 text-info"></i>
                Certificaciones y Acreditaciones
              </h2>
              <p class="text-muted mb-0">Gestiona tus certificaciones profesionales y técnicas</p>
            </div>
            <button 
              @click="mostrarModal = true" 
              class="btn btn-info"
            >
              <i class="fas fa-plus me-2"></i>
              Agregar Certificación
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar certificaciones..."
              v-model="filtroTexto"
            >
          </div>
        </div>
        <div class="col-md-4">
          <select class="form-select" v-model="filtroTipo">
            <option value="">Todos los tipos</option>
            <option v-for="tipo in tiposOptions" :key="tipo.value" :value="tipo.value">
              {{ tipo.label }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <select class="form-select" v-model="filtroEstado">
            <option value="">Todos los estados</option>
            <option v-for="estado in estadosOptions" :key="estado.value" :value="estado.value">
              {{ estado.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Lista de certificaciones -->
      <div class="row">
        <div class="col-12">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-info" role="status"></div>
            <p class="mt-2">Cargando certificaciones...</p>
          </div>
          
          <div v-else-if="certificaciones.length === 0" class="text-center py-5">
            <i class="fas fa-certificate fa-3x text-muted mb-3"></i>
            <h5>No hay certificaciones registradas</h5>
            <p class="text-muted">Agrega tus certificaciones para demostrar tus competencias</p>
            <button @click="mostrarModal = true" class="btn btn-info">
              <i class="fas fa-plus me-2"></i>
              Agregar Primera Certificación
            </button>
          </div>
          
          <div v-else>
            <div class="certificaciones-grid">
              <div 
                v-for="cert in certificacionesFiltradas" 
                :key="cert.idCertificacion"
                class="certificacion-card"
              >
                <div class="card h-100">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="cert-header">
                        <h5 class="card-title mb-1">{{ cert.nombreCertificado }}</h5>
                        <p class="text-muted mb-0">
                          <i class="fas fa-building me-1"></i>
                          {{ cert.institucion }}
                        </p>
                      </div>
                      <div class="dropdown">
                        <button 
                          class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          :id="`dropdown${cert.idCertificacion}`"
                          data-bs-toggle="dropdown"
                        >
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item" href="#" @click.prevent="editarCertificacion(cert)">
                              <i class="fas fa-edit me-2"></i>Editar
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item text-danger" href="#" @click.prevent="confirmarEliminar(cert)">
                              <i class="fas fa-trash me-2"></i>Eliminar
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <!-- Estado de la certificación -->
                    <div class="mb-3">
                      <span class="badge" :class="`bg-${getEstadoColor(cert)}`">
                        {{ getEstadoTexto(cert) }}
                      </span>
                      <span v-if="cert.codigoCertificado" class="badge bg-secondary ms-2">
                        <i class="fas fa-barcode me-1"></i>
                        {{ cert.codigoCertificado }}
                      </span>
                    </div>
                    
                    <!-- Fechas -->
                    <div class="cert-dates mb-3">
                      <div class="row text-center">
                        <div class="col-6">
                          <small class="text-muted d-block">Inicio</small>
                          <strong>{{ formatDate(cert.fechaInicio) }}</strong>
                        </div>
                        <div class="col-6">
                          <small class="text-muted d-block">
                            {{ cert.fechaFin ? 'Fin' : 'Sin vencimiento' }}
                          </small>
                          <strong>{{ cert.fechaFin ? formatDate(cert.fechaFin) : 'N/A' }}</strong>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Resultado si existe -->
                    <div v-if="cert.resultado" class="cert-result">
                      <small class="text-muted">Resultado:</small>
                      <p class="mb-0">{{ cert.resultado }}</p>
                    </div>
                    
                    <!-- Indicador de expiración -->
                    <div v-if="cert.fechaFin && getDiasParaVencer(cert.fechaFin) !== null" class="mt-2">
                      <div class="alert alert-sm" :class="getAlertaVencimiento(cert.fechaFin)">
                        <i class="fas fa-clock me-1"></i>
                        {{ getMensajeVencimiento(cert.fechaFin) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Estadísticas -->
            <div class="row mt-4">
              <div class="col-12">
                <div class="card bg-light">
                  <div class="card-body">
                    <h6 class="card-title mb-3">
                      <i class="fas fa-chart-bar me-2"></i>
                      Resumen de Certificaciones
                    </h6>
                    <div class="row text-center">
                      <div class="col-6 col-md-3">
                        <div class="stat-item">
                          <div class="stat-number text-success">{{ contarPorEstado('Vigente') }}</div>
                          <div class="stat-label">Vigentes</div>
                        </div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="stat-item">
                          <div class="stat-number text-warning">{{ contarPorEstado('Por Vencer') }}</div>
                          <div class="stat-label">Por Vencer</div>
                        </div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="stat-item">
                          <div class="stat-number text-info">{{ contarPorEstado('En Progreso') }}</div>
                          <div class="stat-label">En Progreso</div>
                        </div>
                      </div>
                      <div class="col-6 col-md-3">
                        <div class="stat-item">
                          <div class="stat-number text-primary">{{ certificaciones.length }}</div>
                          <div class="stat-label">Total</div>
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

      <!-- Modal para agregar/editar certificación -->
      <div class="modal fade" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-certificate me-2"></i>
                {{ editando ? 'Editar' : 'Agregar' }} Certificación
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarCertificacion">
                <div class="row">
                  <!-- Nombre del Certificado -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.nombreCertificado"
                      label="Nombre del Certificado"
                      icon="fas fa-certificate"
                      placeholder="Microsoft Azure Fundamentals, PMP..."
                      :required="true"
                      :error="errors.nombreCertificado"
                      help-text="Máximo 50 caracteres"
                    />
                  </div>
                  
                  <!-- Institución -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.institucion"
                      type="select"
                      label="Institución Certificadora"
                      icon="fas fa-building"
                      placeholder="Selecciona la institución"
                      :options="institucionesOptions"
                      :required="true"
                      :error="errors.institucion"
                    />
                  </div>
                  
                  <!-- Institución personalizada si selecciona "Otros" -->
                  <div v-if="form.institucion === 'Otros'" class="col-12">
                    <FormField
                      v-model="form.institucionPersonalizada"
                      label="Nombre de la Institución"
                      icon="fas fa-edit"
                      placeholder="Escribe el nombre de la institución"
                      :required="true"
                      :error="errors.institucionPersonalizada"
                    />
                  </div>
                  
                  <!-- Fechas -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.fechaInicio"
                      type="date"
                      label="Fecha de Inicio"
                      icon="fas fa-calendar-alt"
                      :required="true"
                      :error="errors.fechaInicio"
                    />
                  </div>
                  
                  <div class="col-md-6">
                    <FormField
                      v-model="form.fechaFin"
                      type="date"
                      label="Fecha de Vencimiento"
                      icon="fas fa-calendar-times"
                      help-text="Opcional - Deja vacío si no vence"
                      :error="errors.fechaFin"
                    />
                  </div>
                  
                  <!-- Resultado -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.resultado"
                      label="Resultado/Calificación"
                      icon="fas fa-trophy"
                      placeholder="Aprobado, 95%, Certificado, etc."
                      help-text="Opcional"
                    />
                  </div>
                  
                  <!-- Código de Certificado -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.codigoCertificado"
                      label="Código/ID del Certificado"
                      icon="fas fa-barcode"
                      placeholder="ABC123456, CERT-2024-001..."
                      help-text="Opcional - Para verificación"
                    />
                  </div>
                </div>
                
                <!-- Vista previa del estado -->
                <div v-if="form.fechaInicio" class="row mt-3">
                  <div class="col-12">
                    <div class="alert alert-info">
                      <h6 class="mb-2">
                        <i class="fas fa-eye me-2"></i>
                        Vista Previa
                      </h6>
                      <div class="d-flex justify-content-between align-items-center">
                        <span>Estado estimado:</span>
                        <span class="badge" :class="`bg-${getEstadoColorPreview()}`">
                          {{ getEstadoTextoPreview() }}
                        </span>
                      </div>
                      <div v-if="form.fechaFin" class="mt-2">
                        <small class="text-muted">
                          {{ getMensajeVencimientoPreview() }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal" :disabled="guardando">
                Cancelar
              </button>
              <button type="button" @click="guardarCertificacion" class="btn btn-info" :disabled="guardando || !isFormValid">
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
              <p>¿Estás seguro de que deseas eliminar esta certificación?</p>
              <div class="alert alert-warning">
                <strong>{{ certificacionAEliminar?.nombreCertificado }}</strong><br>
                <small>{{ certificacionAEliminar?.institucion }}</small>
              </div>
              <p class="text-muted small">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacion = false" :disabled="eliminando">
                Cancelar
              </button>
              <button type="button" @click="eliminarCertificacion" class="btn btn-danger" :disabled="eliminando">
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
import { TIPOS_CERTIFICACION, ESTADOS_CERTIFICACION, INSTITUCIONES_CERTIFICACION } from '../utils/constants'

export default {
  name: 'Certificaciones',
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
      
      // Filtros
      filtroTexto: '',
      filtroTipo: '',
      filtroEstado: '',
      
      certificaciones: [],
      certificacionAEliminar: null,
      aspiranteId: null,
      
      form: {
        idCertificacion: null,
        idAspirante: null,
        nombreCertificado: '',
        institucion: '',
        institucionPersonalizada: '',
        fechaInicio: '',
        fechaFin: '',
        resultado: '',
        codigoCertificado: ''
      },
      
      errors: {},
      tiposOptions: TIPOS_CERTIFICACION,
      estadosOptions: ESTADOS_CERTIFICACION,
      institucionesOptions: INSTITUCIONES_CERTIFICACION
    }
  },
  computed: {
    ...mapGetters(['user']),
    
    certificacionesFiltradas() {
      let resultado = [...this.certificaciones]
      
      // Filtro por texto
      if (this.filtroTexto) {
        resultado = resultado.filter(cert => 
          cert.nombreCertificado.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
          cert.institucion.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
          (cert.resultado && cert.resultado.toLowerCase().includes(this.filtroTexto.toLowerCase()))
        )
      }
      
      // Filtro por tipo (basado en institución)
      if (this.filtroTipo) {
        resultado = resultado.filter(cert => {
          // Lógica simple de clasificación por institución
          return cert.institucion.toLowerCase().includes(this.filtroTipo.toLowerCase())
        })
      }
      
      // Filtro por estado
      if (this.filtroEstado) {
        resultado = resultado.filter(cert => this.getEstadoTexto(cert) === this.filtroEstado)
      }
      
      return resultado.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
    },
    
    isFormValid() {
      return !this.errors.nombreCertificado && 
             !this.errors.institucion && 
             !this.errors.fechaInicio &&
             this.form.nombreCertificado && 
             this.form.institucion &&
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
      await this.cargarCertificaciones()
    }
  },
  
  methods: {
    async cargarAspiranteId() {
      try {
        // Temporal: obtener ID del aspirante
        this.aspiranteId = 1 // En producción, obtener del store o API
      } catch (error) {
        console.error('Error obteniendo ID de aspirante:', error)
        this.aspiranteId = 1
      }
    },
    
    async cargarCertificaciones() {
      try {
        this.loading = true
        const response = await aspiranteService.obtenerCertificaciones()
        // Filtrar solo las certificaciones del aspirante actual
        this.certificaciones = response.filter(cert => cert.idAspirante === this.aspiranteId)
      } catch (error) {
        console.error('Error cargando certificaciones:', error)
        this.showMessage('Error al cargar las certificaciones', 'error')
      } finally {
        this.loading = false
      }
    },
    
    editarCertificacion(certificacion) {
      this.editando = true
      this.form = {
        idCertificacion: certificacion.idCertificacion,
        idAspirante: certificacion.idAspirante,
        nombreCertificado: certificacion.nombreCertificado,
        institucion: certificacion.institucion,
        institucionPersonalizada: '',
        fechaInicio: this.formatDateForInput(certificacion.fechaInicio),
        fechaFin: certificacion.fechaFin ? this.formatDateForInput(certificacion.fechaFin) : '',
        resultado: certificacion.resultado || '',
        codigoCertificado: certificacion.codigoCertificado || ''
      }
      this.errors = {}
      this.mostrarModal = true
    },
    
    confirmarEliminar(certificacion) {
      this.certificacionAEliminar = certificacion
      this.mostrarConfirmacion = true
    },
    
    async eliminarCertificacion() {
      try {
        this.eliminando = true
        await aspiranteService.eliminarCertificacion(this.certificacionAEliminar.idCertificacion)
        
        await this.cargarCertificaciones()
        this.mostrarConfirmacion = false
        this.certificacionAEliminar = null
        this.showMessage('Certificación eliminada exitosamente', 'success')
        
      } catch (error) {
        console.error('Error eliminando certificación:', error)
        this.showMessage('Error al eliminar la certificación', 'error')
      } finally {
        this.eliminando = false
      }
    },
    
    cerrarModal() {
      this.mostrarModal = false
      this.editando = false
      this.form = {
        idCertificacion: null,
        idAspirante: null,
        nombreCertificado: '',
        institucion: '',
        institucionPersonalizada: '',
        fechaInicio: '',
        fechaFin: '',
        resultado: '',
        codigoCertificado: ''
      }
      this.errors = {}
    },
    
    validateForm() {
      this.errors = {}
      
      if (!validators.required(this.form.nombreCertificado) || !validators.maxLength(this.form.nombreCertificado, 50)) {
        this.errors.nombreCertificado = 'El nombre del certificado es requerido (máximo 50 caracteres)'
      }
      
      if (!validators.required(this.form.institucion)) {
        this.errors.institucion = 'Selecciona la institución certificadora'
      }
      
      if (this.form.institucion === 'Otros' && !validators.required(this.form.institucionPersonalizada)) {
        this.errors.institucionPersonalizada = 'Especifica el nombre de la institución'
      }
      
      if (!validators.required(this.form.fechaInicio)) {
        this.errors.fechaInicio = 'La fecha de inicio es requerida'
      }
      
      if (this.form.fechaFin && this.form.fechaInicio && new Date(this.form.fechaFin) <= new Date(this.form.fechaInicio)) {
        this.errors.fechaFin = 'La fecha de vencimiento debe ser posterior a la fecha de inicio'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async guardarCertificacion() {
      if (!this.validateForm()) return
      
      try {
        this.guardando = true
        
        const certificacionData = {
          idAspirante: this.aspiranteId,
          nombreCertificado: this.form.nombreCertificado,
          institucion: this.form.institucion === 'Otros' ? this.form.institucionPersonalizada : this.form.institucion,
          fechaInicio: this.form.fechaInicio,
          fechaFin: this.form.fechaFin || null,
          resultado: this.form.resultado || null,
          codigoCertificado: this.form.codigoCertificado || null
        }
        
        if (this.editando) {
          certificacionData.idCertificacion = this.form.idCertificacion
          await aspiranteService.actualizarCertificacion(certificacionData)
          this.showMessage('Certificación actualizada exitosamente', 'success')
        } else {
          await aspiranteService.crearCertificacion(certificacionData)
          this.showMessage('Certificación agregada exitosamente', 'success')
        }
        
        await this.cargarCertificaciones()
        this.cerrarModal()
        
      } catch (error) {
        console.error('Error guardando certificación:', error)
        this.showMessage('Error al guardar la certificación', 'error')
      } finally {
        this.guardando = false
      }
    },
    
    // Utilidades de fechas y estado
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('es-ES')
    },
    
    formatDateForInput(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toISOString().split('T')[0]
    },
    
    getDiasParaVencer(fechaFin) {
      if (!fechaFin) return null
      const hoy = new Date()
      const vencimiento = new Date(fechaFin)
      const diferencia = vencimiento - hoy
      return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
    },
    
    getEstadoTexto(cert) {
      if (!cert.fechaFin) return 'Sin Vencimiento'
      
      const dias = this.getDiasParaVencer(cert.fechaFin)
      if (dias < 0) return 'Expirado'
      if (dias <= 30) return 'Por Vencer'
      if (dias <= 90) return 'Vigente'
      return 'Vigente'
    },
    
    getEstadoColor(cert) {
      const estado = this.getEstadoTexto(cert)
      const colores = {
        'Vigente': 'success',
        'Por Vencer': 'warning',
        'Expirado': 'danger',
        'Sin Vencimiento': 'info'
      }
      return colores[estado] || 'secondary'
    },
    
    getAlertaVencimiento(fechaFin) {
      const dias = this.getDiasParaVencer(fechaFin)
      if (dias < 0) return 'alert-danger'
      if (dias <= 30) return 'alert-warning'
      return 'alert-info'
    },
    
    getMensajeVencimiento(fechaFin) {
      const dias = this.getDiasParaVencer(fechaFin)
      if (dias < 0) return `Expiró hace ${Math.abs(dias)} días`
      if (dias === 0) return 'Expira hoy'
      if (dias <= 30) return `Expira en ${dias} días`
      return `Válido por ${dias} días más`
    },
    
    // Funciones para vista previa
    getEstadoTextoPreview() {
      if (!this.form.fechaFin) return 'Sin Vencimiento'
      
      const dias = this.getDiasParaVencer(this.form.fechaFin)
      if (dias < 0) return 'Expirado'
      if (dias <= 30) return 'Por Vencer'
      return 'Vigente'
    },
    
    getEstadoColorPreview() {
      const estado = this.getEstadoTextoPreview()
      const colores = {
        'Vigente': 'success',
        'Por Vencer': 'warning',
        'Expirado': 'danger',
        'Sin Vencimiento': 'info'
      }
      return colores[estado] || 'secondary'
    },
    
    getMensajeVencimientoPreview() {
      if (!this.form.fechaFin) return 'Esta certificación no tiene fecha de vencimiento'
      return this.getMensajeVencimiento(this.form.fechaFin)
    },
    
    contarPorEstado(estado) {
      return this.certificaciones.filter(cert => this.getEstadoTexto(cert) === estado).length
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
.certificaciones {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  min-height: 100vh;
}

/* Certificaciones Grid */
.certificaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.certificacion-card .card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.certificacion-card .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Header de certificación */
.cert-header h5 {
  color: #01579b;
  font-weight: 600;
  line-height: 1.3;
}

.cert-header p {
  font-size: 0.9rem;
  margin-bottom: 0;
}

/* Fechas */
.cert-dates {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #17a2b8;
}

.cert-dates strong {
  color: #01579b;
  font-weight: 600;
}

/* Resultado */
.cert-result {
  background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #28a745;
}

/* Badges */
.badge {
  font-size: 0.75rem;
  padding: 0.4em 0.8em;
  font-weight: 500;
}

/* Alertas de vencimiento */
.alert-sm {
  padding: 0.5rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  border-radius: 6px;
}

/* Estadísticas */
.stat-item {
  padding: 1rem 0;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Modal */
.modal.show {
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 15px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  border-radius: 15px 15px 0 0;
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
}

.modal-header .btn-close {
  filter: invert(1);
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  border-radius: 0 0 15px 15px;
  background: #f8f9fa;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8, #138496);
  border: none;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: linear-gradient(135deg, #138496, #117a8b);
  color: white;
}

.btn-info:disabled {
  background: #6c757d;
  border-color: #6c757d;
}

/* Dropdowns */
.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  border-radius: 10px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

.dropdown-item {
  border-radius: 5px;
  margin: 0.125rem 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(3px);
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

/* Input Groups */
.input-group-text {
  background: white;
  border-color: #ced4da;
  color: #6c757d;
}

.form-select:focus,
.form-control:focus {
  border-color: #17a2b8;
  box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25);
}

/* Vista previa en modal */
.alert-info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  border: none;
  border-left: 4px solid #17a2b8;
}

/* Estados personalizados */
.bg-success { background-color: #28a745 !important; }
.bg-warning { background-color: #ffc107 !important; color: #212529 !important; }
.bg-danger { background-color: #dc3545 !important; }
.bg-info { background-color: #17a2b8 !important; }
.bg-secondary { background-color: #6c757d !important; }

.text-success { color: #28a745 !important; }
.text-warning { color: #ffc107 !important; }
.text-danger { color: #dc3545 !important; }
.text-info { color: #17a2b8 !important; }

/* Alert personalizado para vencimientos */
.alert-danger {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border-color: #f5c6cb;
  color: #721c24;
}

.alert-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-color: #ffeaa7;
  color: #856404;
}

/* Responsive Design */
@media (max-width: 768px) {
  .certificaciones-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .cert-dates .row {
    text-align: center;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .modal-dialog {
    margin: 1rem;
  }
  
  .dropdown-item {
    padding: 0.75rem;
    margin: 0.125rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .certificacion-card .card-body {
    padding: 1rem;
  }
  
  .btn {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
  
  .modal-header h5 {
    font-size: 1.1rem;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.certificacion-card {
  animation: fadeInUp 0.5s ease-out;
}

.certificacion-card:nth-child(even) {
  animation-delay: 0.1s;
}

.certificacion-card:nth-child(3n) {
  animation-delay: 0.2s;
}

/* Efectos hover especiales */
.certificacion-card .card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #17a2b8, #20c997, #28a745);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.certificacion-card .card:hover::before {
  opacity: 1;
}

/* Scrollbar personalizado */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #17a2b8;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #138496;
}
</style>