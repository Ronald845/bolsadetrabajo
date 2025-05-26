<template>
  <div class="certificaciones">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-certificate me-2 text-info"></i>Certificaciones y Acreditaciones
              </h2>
              <p class="text-muted mb-0">Gestiona tus certificaciones profesionales y técnicas</p>
            </div>
            <button @click="mostrarModal = true" class="btn btn-info" :disabled="!aspiranteId">
              <i class="fas fa-plus me-2"></i>Agregar Certificación
            </button>
          </div>
        </div>
      </div>

      <!-- Debug info (temporal - solo desarrollo) -->
      <div v-if="debugMode" class="alert alert-info mb-4">
        <strong>🔍 Debug Info:</strong><br>
        Usuario ID: {{ user?.idUsuario }}<br>
        Aspirante ID: {{ aspiranteId || 'No encontrado' }}<br>
        Certificaciones cargadas: {{ certificaciones.length }}
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-4" v-for="filtro in filtrosConfig" :key="filtro.key">
          <div class="input-group" v-if="filtro.type === 'search'">
            <span class="input-group-text"><i :class="filtro.icon"></i></span>
            <input type="text" class="form-control" :placeholder="filtro.placeholder" v-model="filtros[filtro.key]">
          </div>
          <select v-else class="form-select" v-model="filtros[filtro.key]">
            <option value="">{{ filtro.placeholder }}</option>
            <option v-for="opcion in filtro.options" :key="opcion.value" :value="opcion.value">{{ opcion.label }}</option>
          </select>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="row">
        <div class="col-12">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-info"></div>
            <p class="mt-2">Cargando certificaciones...</p>
          </div>

          <!-- Error de perfil -->
          <div v-else-if="!aspiranteId" class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h5>Error al cargar perfil</h5>
            <p class="text-muted">No se pudo obtener tu información de aspirante</p>
            <button @click="cargarAspiranteId" class="btn btn-info">
              <i class="fas fa-refresh me-2"></i>Reintentar
            </button>
          </div>

          <!-- Sin certificaciones -->
          <div v-else-if="certificaciones.length === 0" class="text-center py-5">
            <i class="fas fa-certificate fa-3x text-muted mb-3"></i>
            <h5>No hay certificaciones registradas</h5>
            <p class="text-muted">Agrega tus certificaciones para demostrar tus competencias</p>
            <button @click="mostrarModal = true" class="btn btn-info">
              <i class="fas fa-plus me-2"></i>Agregar Primera Certificación
            </button>
          </div>

          <!-- Lista de certificaciones -->
          <div v-else>
            <div class="certificaciones-grid">
              <div v-for="cert in certificacionesFiltradas" :key="cert.idCertificacion" class="certificacion-card">
                <div class="card h-100">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="cert-header">
                        <h5 class="card-title mb-1">{{ cert.nombreCertificado }}</h5>
                        <p class="text-muted mb-0">
                          <i class="fas fa-building me-1"></i>{{ cert.institucion }}
                        </p>
                      </div>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li v-for="accion in accionesCert" :key="accion.key">
                            <a class="dropdown-item" href="#" @click.prevent="accion.metodo(cert)" :class="accion.class">
                              <i :class="accion.icon" class="me-2"></i>{{ accion.label }}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <!-- Estado y código -->
                    <div class="mb-3">
                      <span class="badge" :class="`bg-${getEstadoColor(cert)}`">{{ getEstadoTexto(cert) }}</span>
                      <span v-if="cert.codigoCertificado" class="badge bg-secondary ms-2">
                        <i class="fas fa-barcode me-1"></i>{{ cert.codigoCertificado }}
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
                          <small class="text-muted d-block">{{ cert.fechaFin ? 'Fin' : 'Sin vencimiento' }}</small>
                          <strong>{{ cert.fechaFin ? formatDate(cert.fechaFin) : 'N/A' }}</strong>
                        </div>
                      </div>
                    </div>

                    <!-- Resultado -->
                    <div v-if="cert.resultado" class="cert-result">
                      <small class="text-muted">Resultado:</small>
                      <p class="mb-0">{{ cert.resultado }}</p>
                    </div>

                    <!-- Alerta de vencimiento -->
                    <div v-if="cert.fechaFin && getDiasParaVencer(cert.fechaFin) !== null" class="mt-2">
                      <div class="alert alert-sm" :class="getAlertaVencimiento(cert.fechaFin)">
                        <i class="fas fa-clock me-1"></i>{{ getMensajeVencimiento(cert.fechaFin) }}
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
                      <i class="fas fa-chart-bar me-2"></i>Resumen de Certificaciones
                    </h6>
                    <div class="row text-center">
                      <div class="col-6 col-md-3" v-for="(stat, key) in estadisticasConfig" :key="key">
                        <div class="stat-item">
                          <div class="stat-number" :class="stat.class">{{ contarPorEstado(stat.estado) }}</div>
                          <div class="stat-label">{{ stat.label }}</div>
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

      <!-- Modal Principal -->
      <div class="modal fade" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-certificate me-2"></i>{{ editando ? 'Editar' : 'Agregar' }} Certificación
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarCertificacion">
                <div class="row">
                  <div v-for="campo in camposForm" :key="campo.key" :class="campo.colClass || 'col-md-6'">
                    <FormField v-model="form[campo.key]" v-bind="campo" :error="errors[campo.key]" />
                  </div>

                  <!-- Institución personalizada -->
                  <div v-if="form.institucion === 'Otros'" class="col-12">
                    <FormField v-model="form.institucionPersonalizada" label="Nombre de la Institución" 
                      icon="fas fa-edit" placeholder="Escribe el nombre de la institución" 
                      :required="true" :error="errors.institucionPersonalizada" />
                  </div>
                </div>

                <!-- Vista previa -->
                <div v-if="form.fechaInicio" class="row mt-3">
                  <div class="col-12">
                    <div class="alert alert-info">
                      <h6 class="mb-2"><i class="fas fa-eye me-2"></i>Vista Previa</h6>
                      <div class="d-flex justify-content-between align-items-center">
                        <span>Estado estimado:</span>
                        <span class="badge" :class="`bg-${getEstadoColorPreview()}`">{{ getEstadoTextoPreview() }}</span>
                      </div>
                      <div v-if="form.fechaFin" class="mt-2">
                        <small class="text-muted">{{ getMensajeVencimientoPreview() }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal" :disabled="guardando">Cancelar</button>
              <button type="button" @click="guardarCertificacion" class="btn btn-info" :disabled="guardando || !isFormValid">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Confirmación -->
      <div class="modal fade" :class="{ show: mostrarConfirmacion }" :style="{ display: mostrarConfirmacion ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>Confirmar Eliminación
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
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacion = false" :disabled="eliminando">Cancelar</button>
              <button type="button" @click="eliminarCertificacion" class="btn btn-danger" :disabled="eliminando">
                <span v-if="eliminando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-trash me-2"></i>
                {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrops -->
      <div v-if="mostrarModal || mostrarConfirmacion" class="modal-backdrop fade show" 
        @click="mostrarModal ? cerrarModal() : (mostrarConfirmacion = false)"></div>

      <!-- Mensaje -->
      <div v-if="message" class="alert mt-4" :class="`alert-${messageType}`">
        <i :class="messageIcon" class="me-2"></i>{{ message }}
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
import api from '../services/api'

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
      debugMode: true, // Cambiar a false en producción
      
      certificaciones: [],
      certificacionAEliminar: null,
      aspiranteId: null,
      
      filtros: { texto: '', tipo: '', estado: '' },
      
      form: {
        idCertificacion: null, idAspirante: null, nombreCertificado: '', institucion: '', 
        institucionPersonalizada: '', fechaInicio: '', fechaFin: '', resultado: '', codigoCertificado: ''
      },
      
      errors: {},
      
      // Configuraciones estáticas
      filtrosConfig: [
        { key: 'texto', type: 'search', icon: 'fas fa-search', placeholder: 'Buscar certificaciones...' },
        { key: 'tipo', placeholder: 'Todos los tipos', options: TIPOS_CERTIFICACION },
        { key: 'estado', placeholder: 'Todos los estados', options: ESTADOS_CERTIFICACION }
      ],
      
      accionesCert: [
        { key: 'editar', label: 'Editar', icon: 'fas fa-edit', metodo: this.editarCertificacion },
        { key: 'eliminar', label: 'Eliminar', icon: 'fas fa-trash', class: 'text-danger', metodo: this.confirmarEliminar }
      ],
      
      estadisticasConfig: {
        vigentes: { estado: 'Vigente', class: 'text-success', label: 'Vigentes' },
        porVencer: { estado: 'Por Vencer', class: 'text-warning', label: 'Por Vencer' },
        sinVencimiento: { estado: 'Sin Vencimiento', class: 'text-info', label: 'Sin Vencimiento' },
        total: { estado: null, class: 'text-primary', label: 'Total' }
      }
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    fechaHoy() {
      return new Date().toISOString().split('T')[0]
    },
    
    certificacionesFiltradas() {
      let resultado = [...this.certificaciones]
      
      if (this.filtros.texto) {
        const busqueda = this.filtros.texto.toLowerCase()
        resultado = resultado.filter(cert =>
          cert.nombreCertificado.toLowerCase().includes(busqueda) ||
          cert.institucion.toLowerCase().includes(busqueda) ||
          (cert.resultado && cert.resultado.toLowerCase().includes(busqueda))
        )
      }
      
      if (this.filtros.tipo) {
        resultado = resultado.filter(cert => cert.institucion.toLowerCase().includes(this.filtros.tipo.toLowerCase()))
      }
      
      if (this.filtros.estado) {
        resultado = resultado.filter(cert => this.getEstadoTexto(cert) === this.filtros.estado)
      }
      
      return resultado.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
    },
    
    isFormValid() {
      return !Object.keys(this.errors).length && this.form.nombreCertificado && this.form.institucion && 
             this.form.fechaInicio && (this.form.institucion !== 'Otros' || this.form.institucionPersonalizada)
    },
    
    messageIcon() {
      const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }
      return icons[this.messageType] || 'fas fa-info-circle'
    },
    
    camposForm() {
      return [
        { key: 'nombreCertificado', label: 'Nombre del Certificado', icon: 'fas fa-certificate', placeholder: 'Microsoft Azure Fundamentals, PMP...', required: true, 'help-text': 'Máximo 50 caracteres' },
        { key: 'institucion', type: 'select', label: 'Institución Certificadora', icon: 'fas fa-building', placeholder: 'Selecciona la institución', options: INSTITUCIONES_CERTIFICACION, required: true },
        { key: 'fechaInicio', type: 'date', label: 'Fecha de Inicio', icon: 'fas fa-calendar-alt', required: true, max: this.fechaHoy },
        { key: 'fechaFin', type: 'date', label: 'Fecha de Vencimiento', icon: 'fas fa-calendar-times', 'help-text': 'Opcional - Deja vacío si no vence', min: this.form.fechaInicio },
        { key: 'resultado', label: 'Resultado/Calificación', icon: 'fas fa-trophy', placeholder: 'Aprobado, 95%, Certificado, etc.', 'help-text': 'Opcional' },
        { key: 'codigoCertificado', label: 'Código/ID del Certificado', icon: 'fas fa-barcode', placeholder: 'ABC123456, CERT-2024-001...', 'help-text': 'Opcional - Para verificación' }
      ]
    }
  },
  
  async mounted() {
    await this.cargarAspiranteId()
    if (this.aspiranteId) await this.cargarCertificaciones()
  },
  
  methods: {
    async cargarAspiranteId() {
      try {
        const response = await api.get('/Aspirante/todos')
        const aspirante = response.data.find(asp => asp.idUsuario === this.user.idUsuario)
        
        if (aspirante) {
          this.aspiranteId = aspirante.idAspirante
        } else {
          this.showMessage('No se encontró tu perfil de aspirante. Contacta al administrador.', 'error')
        }
      } catch (error) {
        this.showMessage('Error al cargar tu perfil de aspirante', 'error')
      }
    },
    
    async cargarCertificaciones() {
      if (!this.aspiranteId) return
      
      try {
        this.loading = true
        const response = await aspiranteService.obtenerCertificaciones()
        this.certificaciones = response.filter(cert => cert.idAspirante === this.aspiranteId)
      } catch (error) {
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
        this.showMessage('Error al eliminar la certificación', 'error')
      } finally {
        this.eliminando = false
      }
    },
    
    cerrarModal() {
      this.mostrarModal = false
      this.editando = false
      this.form = {
        idCertificacion: null, idAspirante: null, nombreCertificado: '', institucion: '', 
        institucionPersonalizada: '', fechaInicio: '', fechaFin: '', resultado: '', codigoCertificado: ''
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
      } else if (new Date(this.form.fechaInicio) > new Date()) {
        this.errors.fechaInicio = 'La fecha de inicio no puede ser futura'
      }
      
      if (this.form.fechaFin && this.form.fechaInicio && new Date(this.form.fechaFin) <= new Date(this.form.fechaInicio)) {
        this.errors.fechaFin = 'La fecha de vencimiento debe ser posterior a la fecha de inicio'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async guardarCertificacion() {
      if (!this.validateForm() || !this.aspiranteId) {
        if (!this.aspiranteId) this.showMessage('Error: No se pudo identificar tu perfil de aspirante', 'error')
        return
      }
      
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
        let errorMessage = 'Error al guardar la certificación'
        if (error.response?.status === 400) errorMessage = `Error de datos: ${error.response.data || 'Datos inválidos'}`
        else if (error.response?.status === 401) errorMessage = 'Error de autenticación. Inicia sesión nuevamente.'
        else if (error.response?.status === 500) errorMessage = 'Error del servidor. Contacta al administrador.'
        
        this.showMessage(errorMessage, 'error')
      } finally {
        this.guardando = false
      }
    },
    
    // Utilidades de fechas y estado
    formatDate(dateString) {
      return dateString ? new Date(dateString).toLocaleDateString('es-ES') : 'N/A'
    },
    
    formatDateForInput(dateString) {
      return dateString ? new Date(dateString).toISOString().split('T')[0] : ''
    },
    
    getDiasParaVencer(fechaFin) {
      if (!fechaFin) return null
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const vencimiento = new Date(fechaFin)
      vencimiento.setHours(0, 0, 0, 0)
      return Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    },
    
    getEstadoTexto(cert) {
      if (!cert.fechaFin) return 'Sin Vencimiento'
      const dias = this.getDiasParaVencer(cert.fechaFin)
      if (dias < 0) return 'Expirado'
      if (dias <= 30) return 'Por Vencer'
      return 'Vigente'
    },
    
    getEstadoColor(cert) {
      const colores = { 'Vigente': 'success', 'Por Vencer': 'warning', 'Expirado': 'danger', 'Sin Vencimiento': 'info' }
      return colores[this.getEstadoTexto(cert)] || 'secondary'
    },
    
    getAlertaVencimiento(fechaFin) {
      const dias = this.getDiasParaVencer(fechaFin)
      if (dias < 0) return 'alert-danger'
      if (dias <= 30) return 'alert-warning'
      return 'alert-info'
    },
    
    getMensajeVencimiento(fechaFin) {
      const dias = this.getDiasParaVencer(fechaFin)
      if (dias < 0) return `Expiró hace ${Math.abs(dias)} día${Math.abs(dias) === 1 ? '' : 's'}`
      if (dias === 0) return 'Expira hoy'
      if (dias === 1) return 'Expira mañana'
      if (dias <= 30) return `Expira en ${dias} día${dias === 1 ? '' : 's'}`
      return `Válido por ${dias} día${dias === 1 ? '' : 's'} más`
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
      const colores = { 'Vigente': 'success', 'Por Vencer': 'warning', 'Expirado': 'danger', 'Sin Vencimiento': 'info' }
      return colores[this.getEstadoTextoPreview()] || 'secondary'
    },
    
    getMensajeVencimientoPreview() {
      return this.form.fechaFin ? this.getMensajeVencimiento(this.form.fechaFin) : 'Esta certificación no tiene fecha de vencimiento'
    },
    
    contarPorEstado(estado) {
      if (estado === null) return this.certificaciones.length
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
.certificaciones { background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%); min-height: 100vh; }

.certificaciones-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
.certificacion-card .card { border: none; border-radius: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; overflow: hidden; position: relative; }
.certificacion-card .card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
.certificacion-card .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #17a2b8, #20c997, #28a745); opacity: 0; transition: opacity 0.3s ease; }
.certificacion-card .card:hover::before { opacity: 1; }

.cert-header h5 { color: #01579b; font-weight: 600; line-height: 1.3; }
.cert-header p { font-size: 0.9rem; margin-bottom: 0; }

.cert-dates { background: #f8f9fa; border-radius: 10px; padding: 1rem; border-left: 4px solid #17a2b8; }
.cert-dates strong { color: #01579b; font-weight: 600; }

.cert-result { background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #28a745; }

.badge { font-size: 0.75rem; padding: 0.4em 0.8em; font-weight: 500; }
.alert-sm { padding: 0.5rem 0.75rem; margin-bottom: 0; font-size: 0.875rem; border-radius: 6px; }

.stat-item { padding: 1rem 0; }
.stat-number { font-size: 2.5rem; font-weight: bold; line-height: 1; }
.stat-label { font-size: 0.9rem; color: #6c757d; font-weight: 500; margin-top: 0.25rem; }

.modal.show { background: rgba(0, 0, 0, 0.5); }
.modal-content { border-radius: 15px; border: none; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
.modal-header { border-bottom: 1px solid #e9ecef; border-radius: 15px 15px 0 0; background: linear-gradient(135deg, #17a2b8, #138496); color: white; }
.modal-header .btn-close { filter: invert(1); }
.modal-footer { border-top: 1px solid #e9ecef; border-radius: 0 0 15px 15px; background: #f8f9fa; }

.btn { border-radius: 8px; font-weight: 500; padding: 0.5rem 1rem; transition: all 0.2s ease; }
.btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); }
.btn-info { background: linear-gradient(135deg, #17a2b8, #138496); border: none; color: white; }
.btn-info:hover:not(:disabled) { background: linear-gradient(135deg, #138496, #117a8b); color: white; }
.btn-info:disabled { background: #6c757d; border-color: #6c757d; }

.dropdown-toggle::after { display: none; }
.dropdown-menu { border-radius: 10px; border: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 0.5rem 0; }
.dropdown-item { border-radius: 5px; margin: 0.125rem 0.5rem; padding: 0.5rem 0.75rem; transition: all 0.2s ease; }
.dropdown-item:hover { background-color: #f8f9fa; transform: translateX(3px); }
.dropdown-item.text-danger:hover { background-color: #f8d7da; color: #721c24 !important; }

.input-group-text { background: white; border-color: #ced4da; color: #6c757d; }
.form-select:focus, .form-control:focus { border-color: #17a2b8; box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25); }

.alert-info { background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%); border: none; border-left: 4px solid #17a2b8; }
.alert-danger { background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); border-color: #f5c6cb; color: #721c24; }
.alert-warning { background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-color: #ffeaa7; color: #856404; }

.bg-success { background-color: #28a745 !important; }
.bg-warning { background-color: #ffc107 !important; color: #212529 !important; }
.bg-danger { background-color: #dc3545 !important; }
.bg-info { background-color: #17a2b8 !important; }
.bg-secondary { background-color: #6c757d !important; }

.text-success { color: #28a745 !important; }
.text-warning { color: #ffc107 !important; }
.text-danger { color: #dc3545 !important; }
.text-info { color: #17a2b8 !important; }

@media (max-width: 768px) {
  .certificaciones-grid { grid-template-columns: 1fr; gap: 1rem; }
  .cert-dates .row { text-align: center; }
  .stat-number { font-size: 2rem; }
  .modal-dialog { margin: 1rem; }
  .dropdown-item { padding: 0.75rem; margin: 0.125rem; }
}

@media (max-width: 576px) {
  .container { padding-left: 1rem; padding-right: 1rem; }
  .certificacion-card .card-body { padding: 1rem; }
  .btn { font-size: 0.875rem; padding: 0.5rem 0.75rem; }
  .modal-header h5 { font-size: 1.1rem; }
}

@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.certificacion-card { animation: fadeInUp 0.5s ease-out; }
.certificacion-card:nth-child(even) { animation-delay: 0.1s; }
.certificacion-card:nth-child(3n) { animation-delay: 0.2s; }
</style>