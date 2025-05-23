<template>
  <div class="logros">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-trophy me-2 text-success"></i>
                Logros y Reconocimientos
              </h2>
              <p class="text-muted mb-0">Destaca tus logros, premios y reconocimientos más importantes</p>
            </div>
            <button 
              @click="mostrarModal = true" 
              class="btn btn-success"
            >
              <i class="fas fa-plus me-2"></i>
              Agregar Logro
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
              placeholder="Buscar logros..."
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
          <select class="form-select" v-model="filtroAno">
            <option value="">Todos los años</option>
            <option v-for="ano in anosDisponibles" :key="ano" :value="ano">
              {{ ano }}
            </option>
          </select>
        </div>
      </div>

      <!-- Lista de logros -->
      <div class="row">
        <div class="col-12">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
            <p class="mt-2">Cargando logros...</p>
          </div>
          
          <div v-else-if="logros.length === 0" class="text-center py-5">
            <i class="fas fa-trophy fa-3x text-muted mb-3"></i>
            <h5>No hay logros registrados</h5>
            <p class="text-muted">Agrega tus logros y reconocimientos para destacar tu perfil profesional</p>
            <button @click="mostrarModal = true" class="btn btn-success">
              <i class="fas fa-plus me-2"></i>
              Agregar Primer Logro
            </button>
          </div>
          
          <div v-else>
            <!-- Timeline de logros -->
            <div class="timeline">
              <div 
                v-for="(logro, index) in logrosFiltrados" 
                :key="logro.idLogro"
                class="timeline-item"
                :class="{ 'timeline-item-right': index % 2 === 1 }"
              >
                <div class="timeline-marker">
                  <div class="timeline-icon" :class="`bg-${getTipoColor(logro.tipoLogro)}`">
                    <i :class="getTipoIcon(logro.tipoLogro)"></i>
                  </div>
                </div>
                
                <div class="timeline-content">
                  <div class="card logro-card">
                    <div class="card-body">
                      <!-- Header del logro -->
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="logro-header">
                          <h5 class="card-title mb-1">{{ logro.descripcionLogro }}</h5>
                          <div class="logro-meta">
                            <span class="badge" :class="`bg-${getTipoColor(logro.tipoLogro)}`">
                              <i :class="getTipoIcon(logro.tipoLogro)" class="me-1"></i>
                              {{ logro.tipoLogro }}
                            </span>
                            <span class="text-muted ms-2">
                              <i class="fas fa-calendar me-1"></i>
                              {{ formatDate(logro.fechaLogro) }}
                            </span>
                          </div>
                        </div>
                        
                        <div class="dropdown">
                          <button 
                            class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            type="button" 
                            :id="`dropdown${logro.idLogro}`"
                            data-bs-toggle="dropdown"
                          >
                            <i class="fas fa-ellipsis-v"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li>
                              <a class="dropdown-item" href="#" @click.prevent="editarLogro(logro)">
                                <i class="fas fa-edit me-2"></i>Editar
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item text-danger" href="#" @click.prevent="confirmarEliminar(logro)">
                                <i class="fas fa-trash me-2"></i>Eliminar
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <!-- Detalles adicionales si existen -->
                      <div v-if="logro.nivel || logro.posicion || logro.organizacion" class="logro-details mb-3">
                        <div class="row">
                          <div v-if="logro.nivel" class="col-md-4">
                            <small class="text-muted d-block">Nivel</small>
                            <span class="badge bg-info">{{ logro.nivel }}</span>
                          </div>
                          <div v-if="logro.posicion" class="col-md-4">
                            <small class="text-muted d-block">Posición</small>
                            <span class="badge bg-warning">{{ logro.posicion }}</span>
                          </div>
                          <div v-if="logro.organizacion" class="col-md-4">
                            <small class="text-muted d-block">Organización</small>
                            <strong>{{ logro.organizacion }}</strong>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Descripción ampliada si existe -->
                      <div v-if="logro.descripcionDetallada" class="logro-description">
                        <p class="text-muted mb-0">{{ logro.descripcionDetallada }}</p>
                      </div>
                      
                      <!-- Año destacado -->
                      <div class="logro-year">
                        <span class="year-badge">{{ getYear(logro.fechaLogro) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Estadísticas de logros -->
            <div class="row mt-5">
              <div class="col-12">
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <h6 class="card-title mb-4">
                      <i class="fas fa-chart-bar me-2"></i>
                      Estadísticas de Logros
                    </h6>
                    
                    <!-- Stats por tipo -->
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <h6 class="text-muted mb-3">Por Tipo</h6>
                        <div class="stats-grid">
                          <div 
                            v-for="tipo in tiposConLogros" 
                            :key="tipo.value"
                            class="stat-item-small"
                          >
                            <div class="stat-icon" :class="`bg-${tipo.color}`">
                              <i :class="tipo.icon"></i>
                            </div>
                            <div class="stat-info">
                              <span class="stat-label">{{ tipo.label }}</span>
                              <span class="stat-count">{{ tipo.count }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="col-md-6">
                        <h6 class="text-muted mb-3">Resumen General</h6>
                        <div class="row text-center">
                          <div class="col-6">
                            <div class="stat-number text-success">{{ logros.length }}</div>
                            <div class="stat-label">Total de Logros</div>
                          </div>
                          <div class="col-6">
                            <div class="stat-number text-info">{{ logrosUltimoAno }}</div>
                            <div class="stat-label">Este Año</div>
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

      <!-- Modal para agregar/editar logro -->
      <div class="modal fade" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-trophy me-2"></i>
                {{ editando ? 'Editar' : 'Agregar' }} Logro
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarLogro">
                <div class="row">
                  <!-- Descripción del Logro -->
                  <div class="col-12">
                    <FormField
                      v-model="form.descripcionLogro"
                      label="Título del Logro"
                      icon="fas fa-star"
                      placeholder="Primer lugar en hackathon, Mejor empleado del año..."
                      :required="true"
                      :error="errors.descripcionLogro"
                      help-text="Describe tu logro de forma clara y concisa"
                    />
                  </div>
                  
                  <!-- Tipo de Logro -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.tipoLogro"
                      type="select"
                      label="Tipo de Logro"
                      icon="fas fa-tags"
                      placeholder="Selecciona el tipo"
                      :options="tiposOptions"
                      :required="true"
                      :error="errors.tipoLogro"
                    />
                  </div>
                  
                  <!-- Fecha del Logro -->
                  <div class="col-md-6">
                    <FormField
                      v-model="form.fechaLogro"
                      type="date"
                      label="Fecha del Logro"
                      icon="fas fa-calendar-alt"
                      :required="true"
                      :error="errors.fechaLogro"
                    />
                  </div>
                  
                  <!-- Campos opcionales -->
                  <div class="col-md-4">
                    <FormField
                      v-model="form.nivel"
                      type="select"
                      label="Nivel/Alcance"
                      icon="fas fa-globe"
                      placeholder="Selecciona el nivel"
                      :options="nivelesOptions"
                      help-text="Opcional"
                    />
                  </div>
                  
                  <div class="col-md-4">
                    <FormField
                      v-model="form.posicion"
                      type="select"
                      label="Posición/Resultado"
                      icon="fas fa-medal"
                      placeholder="Selecciona la posición"
                      :options="posicionesOptions"
                      help-text="Opcional"
                    />
                  </div>
                  
                  <div class="col-md-4">
                    <FormField
                      v-model="form.organizacion"
                      label="Organización/Institución"
                      icon="fas fa-building"
                      placeholder="Universidad, empresa, fundación..."
                      help-text="Opcional"
                    />
                  </div>
                  
                  <!-- Descripción detallada -->
                  <div class="col-12">
                    <FormField
                      v-model="form.descripcionDetallada"
                      type="textarea"
                      label="Descripción Detallada"
                      icon="fas fa-file-alt"
                      placeholder="Describe el contexto, el proceso, la importancia del logro..."
                      :rows="4"
                      help-text="Opcional - Agrega detalles que ayuden a entender mejor tu logro"
                    />
                  </div>
                </div>
                
                <!-- Vista previa -->
                <div v-if="form.descripcionLogro && form.tipoLogro" class="mt-4">
                  <div class="alert alert-info">
                    <h6 class="mb-2">
                      <i class="fas fa-eye me-2"></i>
                      Vista Previa
                    </h6>
                    <div class="preview-logro">
                      <div class="d-flex align-items-start">
                        <div class="preview-icon me-3">
                          <div class="timeline-icon-small" :class="`bg-${getTipoColorByValue(form.tipoLogro)}`">
                            <i :class="getTipoIconByValue(form.tipoLogro)"></i>
                          </div>
                        </div>
                        <div class="preview-content">
                          <h6 class="mb-1">{{ form.descripcionLogro }}</h6>
                          <div class="preview-meta">
                            <span class="badge" :class="`bg-${getTipoColorByValue(form.tipoLogro)}`">
                              {{ form.tipoLogro }}
                            </span>
                            <span v-if="form.fechaLogro" class="text-muted ms-2">
                              {{ formatDate(form.fechaLogro) }}
                            </span>
                          </div>
                        </div>
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
              <button type="button" @click="guardarLogro" class="btn btn-success" :disabled="guardando || !isFormValid">
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
              <p>¿Estás seguro de que deseas eliminar este logro?</p>
              <div class="alert alert-warning">
                <strong>{{ logroAEliminar?.descripcionLogro }}</strong><br>
                <small>{{ logroAEliminar?.tipoLogro }} - {{ formatDate(logroAEliminar?.fechaLogro) }}</small>
              </div>
              <p class="text-muted small">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacion = false" :disabled="eliminando">
                Cancelar
              </button>
              <button type="button" @click="eliminarLogro" class="btn btn-danger" :disabled="eliminando">
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
import { TIPOS_LOGRO, NIVELES_LOGRO, POSICIONES_LOGRO } from '../utils/constants'

export default {
  name: 'Logros',
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
      filtroAno: '',
      
      logros: [],
      logroAEliminar: null,
      aspiranteId: null,
      
      form: {
        idLogro: null,
        idAspirante: null,
        descripcionLogro: '',
        tipoLogro: '',
        fechaLogro: '',
        nivel: '',
        posicion: '',
        organizacion: '',
        descripcionDetallada: ''
      },
      
      errors: {},
      tiposOptions: TIPOS_LOGRO,
      nivelesOptions: NIVELES_LOGRO,
      posicionesOptions: POSICIONES_LOGRO
    }
  },
  computed: {
    ...mapGetters(['user']),
    
    logrosFiltrados() {
      let resultado = [...this.logros]
      
      // Filtro por texto
      if (this.filtroTexto) {
        resultado = resultado.filter(logro => 
          logro.descripcionLogro.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
          (logro.tipoLogro && logro.tipoLogro.toLowerCase().includes(this.filtroTexto.toLowerCase())) ||
          (logro.organizacion && logro.organizacion.toLowerCase().includes(this.filtroTexto.toLowerCase()))
        )
      }
      
      // Filtro por tipo
      if (this.filtroTipo) {
        resultado = resultado.filter(logro => logro.tipoLogro === this.filtroTipo)
      }
      
      // Filtro por año
      if (this.filtroAno) {
        resultado = resultado.filter(logro => this.getYear(logro.fechaLogro) === parseInt(this.filtroAno))
      }
      
      // Ordenar por fecha descendente
      return resultado.sort((a, b) => new Date(b.fechaLogro) - new Date(a.fechaLogro))
    },
    
    anosDisponibles() {
      const anos = [...new Set(this.logros.map(logro => this.getYear(logro.fechaLogro)))]
      return anos.sort((a, b) => b - a)
    },
    
    tiposConLogros() {
      return this.tiposOptions.map(tipo => ({
        ...tipo,
        count: this.logros.filter(logro => logro.tipoLogro === tipo.value).length
      })).filter(tipo => tipo.count > 0)
    },
    
    logrosUltimoAno() {
      const anoActual = new Date().getFullYear()
      return this.logros.filter(logro => this.getYear(logro.fechaLogro) === anoActual).length
    },
    
    isFormValid() {
      return !this.errors.descripcionLogro && 
             !this.errors.tipoLogro && 
             !this.errors.fechaLogro &&
             this.form.descripcionLogro && 
             this.form.tipoLogro &&
             this.form.fechaLogro
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
      await this.cargarLogros()
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
    
    async cargarLogros() {
      try {
        this.loading = true
        const response = await aspiranteService.obtenerLogros()
        // Filtrar solo los logros del aspirante actual
        this.logros = response.filter(logro => logro.idAspirante === this.aspiranteId)
      } catch (error) {
        console.error('Error cargando logros:', error)
        this.showMessage('Error al cargar los logros', 'error')
      } finally {
        this.loading = false
      }
    },
    
    editarLogro(logro) {
      this.editando = true
      this.form = {
        idLogro: logro.idLogro,
        idAspirante: logro.idAspirante,
        descripcionLogro: logro.descripcionLogro,
        tipoLogro: logro.tipoLogro || '',
        fechaLogro: this.formatDateForInput(logro.fechaLogro),
        nivel: logro.nivel || '',
        posicion: logro.posicion || '',
        organizacion: logro.organizacion || '',
        descripcionDetallada: logro.descripcionDetallada || ''
      }
      this.errors = {}
      this.mostrarModal = true
    },
    
    confirmarEliminar(logro) {
      this.logroAEliminar = logro
      this.mostrarConfirmacion = true
    },
    
    async eliminarLogro() {
      try {
        this.eliminando = true
        await aspiranteService.eliminarLogro(this.logroAEliminar.idLogro)
        
        await this.cargarLogros()
        this.mostrarConfirmacion = false
        this.logroAEliminar = null
        this.showMessage('Logro eliminado exitosamente', 'success')
        
      } catch (error) {
        console.error('Error eliminando logro:', error)
        this.showMessage('Error al eliminar el logro', 'error')
      } finally {
        this.eliminando = false
      }
    },
    
    cerrarModal() {
      this.mostrarModal = false
      this.editando = false
      this.form = {
        idLogro: null,
        idAspirante: null,
        descripcionLogro: '',
        tipoLogro: '',
        fechaLogro: '',
        nivel: '',
        posicion: '',
        organizacion: '',
        descripcionDetallada: ''
      }
      this.errors = {}
    },
    
    validateForm() {
      this.errors = {}
      
      if (!validators.required(this.form.descripcionLogro)) {
        this.errors.descripcionLogro = 'La descripción del logro es requerida'
      }
      
      if (!validators.required(this.form.tipoLogro)) {
        this.errors.tipoLogro = 'Selecciona el tipo de logro'
      }
      
      if (!validators.required(this.form.fechaLogro)) {
        this.errors.fechaLogro = 'La fecha del logro es requerida'
      }
      
      // Validar que la fecha no sea futura
      if (this.form.fechaLogro && new Date(this.form.fechaLogro) > new Date()) {
        this.errors.fechaLogro = 'La fecha del logro no puede ser futura'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async guardarLogro() {
      if (!this.validateForm()) return
      
      try {
        this.guardando = true
        
        const logroData = {
          idAspirante: this.aspiranteId,
          descripcionLogro: this.form.descripcionLogro,
          tipoLogro: this.form.tipoLogro || null,
          fechaLogro: this.form.fechaLogro,
          nivel: this.form.nivel || null,
          posicion: this.form.posicion || null,
          organizacion: this.form.organizacion || null,
          descripcionDetallada: this.form.descripcionDetallada || null
        }
        
        if (this.editando) {
          logroData.idLogro = this.form.idLogro
          await aspiranteService.actualizarLogro(logroData)
          this.showMessage('Logro actualizado exitosamente', 'success')
        } else {
          await aspiranteService.crearLogro(logroData)
          this.showMessage('Logro agregado exitosamente', 'success')
        }
        
        await this.cargarLogros()
        this.cerrarModal()
        
      } catch (error) {
        console.error('Error guardando logro:', error)
        this.showMessage('Error al guardar el logro', 'error')
      } finally {
        this.guardando = false
      }
    },
    
    // Utilidades de formato y colores
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    formatDateForInput(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toISOString().split('T')[0]
    },
    
    getYear(dateString) {
      if (!dateString) return 0
      return new Date(dateString).getFullYear()
    },
    
    getTipoColor(tipo) {
      const tipoObj = this.tiposOptions.find(t => t.value === tipo)
      return tipoObj ? tipoObj.color : 'secondary'
    },
    
    getTipoIcon(tipo) {
      const tipoObj = this.tiposOptions.find(t => t.value === tipo)
      return tipoObj ? tipoObj.icon : 'fas fa-star'
    },
    
    getTipoColorByValue(value) {
      const tipoObj = this.tiposOptions.find(t => t.value === value)
      return tipoObj ? tipoObj.color : 'secondary'
    },
    
    getTipoIconByValue(value) {
      const tipoObj = this.tiposOptions.find(t => t.value === value)
      return tipoObj ? tipoObj.icon : 'fas fa-star'
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
.logros {
  background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
  min-height: 100vh;
}

/* Timeline Styles */
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #22c55e, #16a34a, #15803d);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.timeline-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 4px solid white;
}

.timeline-icon-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.timeline-content {
  width: 45%;
  position: relative;
}

.timeline-item-right .timeline-content {
  margin-left: auto;
}

/* Logro Cards */
.logro-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.logro-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.logro-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.logro-header h5 {
  color: #15803d;
  font-weight: 600;
  line-height: 1.3;
}

.logro-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.logro-details {
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #22c55e;
}

.logro-description {
  background: linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%);
  padding: 1rem;
  border-radius: 10px;
  border-left: 3px solid #22c55e;
  font-style: italic;
}

.logro-year {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.year-badge {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item-small {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.stat-item-small:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1rem;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-count {
  font-size: 1.25rem;
  font-weight: bold;
  color: #374151;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
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
  background: linear-gradient(135deg, #22c55e, #16a34a);
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

/* Vista previa */
.preview-logro {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  border-left: 4px solid #22c55e;
}

.preview-content h6 {
  color: #15803d;
  margin-bottom: 0.5rem;
}

.preview-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
}

/* Badges personalizados */
.badge {
  font-size: 0.75rem;
  padding: 0.4em 0.8em;
  font-weight: 500;
}

.bg-success { background-color: #22c55e !important; }
.bg-primary { background-color: #3b82f6 !important; }
.bg-info { background-color: #06b6d4 !important; }
.bg-warning { background-color: #f59e0b !important; color: #1f2937 !important; }
.bg-danger { background-color: #ef4444 !important; }
.bg-secondary { background-color: #6b7280 !important; }

.text-success { color: #22c55e !important; }
.text-info { color: #06b6d4 !important; }

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
  background-color: #f3f4f6;
  transform: translateX(3px);
}

.dropdown-item.text-danger:hover {
  background-color: #fef2f2;
  color: #dc2626 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .timeline::before {
    left: 30px;
  }
  
  .timeline-marker {
    left: 30px;
  }
  
  .timeline-content {
    width: calc(100% - 80px);
    margin-left: 80px;
  }
  
  .timeline-item-right .timeline-content {
    margin-left: 80px;
  }
  
  .timeline-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-marker {
    left: 20px;
  }
  
  .timeline-content {
    width: calc(100% - 60px);
    margin-left: 60px;
  }
  
  .timeline-item-right .timeline-content {
    margin-left: 60px;
  }
  
  .timeline-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .logro-card .card-body {
    padding: 1rem;
  }
  
  .year-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }
}

/* Animaciones */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-item:not(.timeline-item-right) .timeline-content {
  animation: slideInLeft 0.6s ease-out;
}

.timeline-item-right .timeline-content {
  animation: slideInRight 0.6s ease-out;
}
</style>