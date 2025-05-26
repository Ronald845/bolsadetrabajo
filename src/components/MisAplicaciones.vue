<template>
  <div class="mis-aplicaciones">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-paper-plane me-2 text-primary"></i>Mis Aplicaciones
              </h2>
              <p class="text-muted mb-0">Seguimiento completo de todas tus postulaciones</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary" @click="mostrarFiltros = !mostrarFiltros">
                <i class="fas fa-filter me-2"></i>{{ mostrarFiltros ? 'Ocultar' : 'Filtros' }}
              </button>
              <button class="btn btn-primary" @click="refrescarAplicaciones" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-sync-alt me-2"></i>Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div v-if="mostrarFiltros" class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <h6 class="mb-0"><i class="fas fa-filter me-2"></i>Filtrar Aplicaciones</h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div v-for="filtro in filtrosConfig" :key="filtro.key" :class="filtro.colClass">
              <FormField v-model="filtros[filtro.key]" v-bind="filtro" @input="filtrarAplicaciones" @change="filtrarAplicaciones" />
            </div>
            <div class="col-md-2">
              <label class="form-label">&nbsp;</label>
              <div class="d-grid">
                <button @click="limpiarFiltros" class="btn btn-outline-secondary">
                  <i class="fas fa-times me-1"></i>Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div v-for="(stat, key) in estadisticasConfig" :key="key" class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card text-white" :class="stat.bgClass">
            <div class="stat-icon"><i :class="stat.icon"></i></div>
            <div class="stat-content">
              <h3>{{ estadisticas[stat.key] }}</h3>
              <p>{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Aplicaciones -->
      <div class="card shadow-sm">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="fas fa-list me-2"></i>Mis Aplicaciones ({{ aplicacionesFiltradas.length }})
          </h6>
          <div class="d-flex gap-2">
            <button v-for="vista in vistasConfig" :key="vista.key" class="btn btn-sm"
              :class="vistaDetallada === vista.detallada ? 'btn-primary' : 'btn-outline-primary'"
              @click="vistaDetallada = vista.detallada">
              <i :class="vista.icon"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Cargando aplicaciones...</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="aplicaciones.length === 0" class="text-center py-5">
            <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
            <h5>No tienes aplicaciones</h5>
            <p class="text-muted mb-4">Comienza aplicando a ofertas laborales que te interesen</p>
            <button @click="irAOfertas" class="btn btn-primary">
              <i class="fas fa-search me-2"></i>Buscar Ofertas
            </button>
          </div>

          <!-- No results after filter -->
          <div v-else-if="aplicacionesFiltradas.length === 0" class="text-center py-5">
            <i class="fas fa-search fa-4x text-muted mb-3"></i>
            <h5>No se encontraron aplicaciones</h5>
            <p class="text-muted mb-4">Intenta ajustar tus filtros de búsqueda</p>
            <button @click="limpiarFiltros" class="btn btn-primary">
              <i class="fas fa-refresh me-2"></i>Limpiar Filtros
            </button>
          </div>

          <!-- Vista Detallada -->
          <div v-else-if="vistaDetallada" class="row">
            <div v-for="aplicacion in aplicacionesPaginadas" :key="aplicacion.idAplicacion" class="col-lg-6 col-xl-4 mb-4">
              <div class="card aplicacion-card h-100" :class="getAplicacionCardClass(aplicacion.estado)">
                <div class="card-header d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="card-title mb-1">{{ aplicacion.oferta?.tituloPuesto || 'Oferta no disponible' }}</h6>
                    <p class="text-muted small mb-2">
                      <i class="fas fa-building me-1"></i>{{ aplicacion.oferta?.empresa?.nombreEmpresa || 'Empresa confidencial' }}
                    </p>
                    <span class="badge" :class="getEstadoBadgeClass(aplicacion.estado)">{{ aplicacion.estado }}</span>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-for="accion in getAccionesDisponibles(aplicacion)" :key="accion.key">
                        <a v-if="accion.key !== 'divider'" class="dropdown-item" href="#" 
                          @click.prevent="accion.metodo(aplicacion)" :class="accion.class">
                          <i :class="accion.icon" class="me-2"></i>{{ accion.label }}
                        </a>
                        <hr v-else class="dropdown-divider">
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="card-body">
                  <div class="aplicacion-details">
                    <div v-for="detail in getAplicacionDetails(aplicacion)" :key="detail.key" class="detail-item">
                      <i :class="detail.icon" class="text-muted me-2"></i>
                      <div>
                        <small class="text-muted d-block">{{ detail.label }}</small>
                        <span :class="detail.class">{{ detail.text }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Progreso -->
                  <div class="application-progress mt-3">
                    <div class="progress-header d-flex justify-content-between align-items-center mb-2">
                      <small class="fw-bold">Estado de Aplicación</small>
                      <small class="text-muted">{{ getProgresoTexto(aplicacion) }}</small>
                    </div>
                    <div class="progress" style="height: 6px;">
                      <div class="progress-bar" :class="getProgresoClass(aplicacion.estado)"
                        :style="{ width: getProgresoAncho(aplicacion.estado) + '%' }"></div>
                    </div>
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">{{ getDiasTranscurridos(aplicacion.fechaAplicacion) }}</small>
                    <div class="btn-group btn-group-sm">
                      <button v-for="btn in getBotonesCard(aplicacion)" :key="btn.key" class="btn" 
                        :class="btn.class" @click="btn.metodo(aplicacion)">
                        <i :class="btn.icon"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vista Lista -->
          <div v-else class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th v-for="col in columnasTabla" :key="col.key">{{ col.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aplicacion in aplicacionesPaginadas" :key="aplicacion.idAplicacion">
                  <td>
                    <div>
                      <h6 class="mb-1">{{ aplicacion.oferta?.tituloPuesto || 'Oferta no disponible' }}</h6>
                      <small class="text-muted">
                        <i class="fas fa-map-marker-alt me-1"></i>{{ aplicacion.oferta?.ubicacion || 'N/A' }}
                      </small>
                    </div>
                  </td>
                  <td><span class="fw-bold">{{ aplicacion.oferta?.empresa?.nombreEmpresa || 'Confidencial' }}</span></td>
                  <td><span class="badge" :class="getEstadoBadgeClass(aplicacion.estado)">{{ aplicacion.estado }}</span></td>
                  <td>
                    <div>
                      <span>{{ formatearFecha(aplicacion.fechaAplicacion) }}</span>
                      <small class="d-block text-muted">{{ getDiasTranscurridos(aplicacion.fechaAplicacion) }}</small>
                    </div>
                  </td>
                  <td>
                    <span v-if="aplicacion.oferta" class="text-success fw-bold">
                      ${{ formatearSalario(aplicacion.oferta.salarioMinimo) }}
                      <span v-if="aplicacion.oferta.salarioMaximo !== aplicacion.oferta.salarioMinimo">
                        - ${{ formatearSalario(aplicacion.oferta.salarioMaximo) }}
                      </span>
                    </span>
                    <span v-else class="text-muted">N/A</span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button v-for="btn in getBotonesTabla(aplicacion)" :key="btn.key" class="btn" 
                        :class="btn.class" @click="btn.metodo(aplicacion)">
                        <i :class="btn.icon"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="d-flex justify-content-center mt-4">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                  <button class="page-link" @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                <li v-for="pagina in paginasVisibles" :key="pagina" class="page-item" :class="{ active: pagina === paginaActual }">
                  <button class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</button>
                </li>
                <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                  <button class="page-link" @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Modal Historial -->
      <div v-if="mostrarHistorial" class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-history me-2"></i>Historial de Aplicación
              </h5>
              <button type="button" class="btn-close" @click="mostrarHistorial = false"></button>
            </div>
            <div class="modal-body">
              <div v-if="aplicacionSeleccionada">
                <div class="alert alert-info">
                  <h6><strong>{{ aplicacionSeleccionada.oferta?.tituloPuesto || 'Oferta no disponible' }}</strong></h6>
                  <p class="mb-0">{{ aplicacionSeleccionada.oferta?.empresa?.nombreEmpresa || 'Empresa confidencial' }}</p>
                </div>

                <!-- Timeline del historial -->
                <div class="timeline">
                  <div v-for="evento in getEventosHistorial(aplicacionSeleccionada)" :key="evento.key" class="timeline-item">
                    <div class="timeline-marker" :class="evento.markerClass"></div>
                    <div class="timeline-content">
                      <h6>{{ evento.titulo }}</h6>
                      <p class="text-muted mb-1">{{ evento.fecha }}</p>
                      <small>{{ evento.descripcion }}</small>
                    </div>
                  </div>
                </div>

                <!-- Información adicional -->
                <div class="mt-4">
                  <h6>Información de Contacto</h6>
                  <div class="alert alert-light">
                    <p class="mb-2"><strong>Estado:</strong> {{ aplicacionSeleccionada.estado }}</p>
                    <p class="mb-2"><strong>Días transcurridos:</strong> {{ getDiasTranscurridos(aplicacionSeleccionada.fechaAplicacion) }}</p>
                    <small class="text-muted">Si tienes dudas, puedes contactar directamente a la empresa o esperar su respuesta.</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarHistorial = false">Cerrar</button>
              <button v-if="aplicacionSeleccionada?.oferta" type="button" class="btn btn-primary" 
                @click="verOferta(aplicacionSeleccionada.oferta)">Ver Oferta Original</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Confirmación Retiro -->
      <div v-if="mostrarConfirmacionRetiro" class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>Confirmar Retiro
              </h5>
              <button type="button" class="btn-close" @click="mostrarConfirmacionRetiro = false"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas retirar tu aplicación?</p>
              <div v-if="aplicacionARetirar" class="alert alert-warning">
                <strong>{{ aplicacionARetirar.oferta?.tituloPuesto }}</strong><br>
                <small>{{ aplicacionARetirar.oferta?.empresa?.nombreEmpresa }}</small>
              </div>
              <p class="text-muted small">Esta acción no se puede deshacer y no podrás volver a aplicar a esta oferta.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacionRetiro = false">Cancelar</button>
              <button type="button" @click="retirarAplicacion" class="btn btn-danger" :disabled="retirando">
                <span v-if="retirando" class="spinner-border spinner-border-sm me-2"></span>
                {{ retirando ? 'Retirando...' : 'Confirmar Retiro' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrops -->
      <div v-if="mostrarHistorial || mostrarConfirmacionRetiro" class="modal-backdrop fade show" 
        @click="mostrarHistorial ? (mostrarHistorial = false) : (mostrarConfirmacionRetiro = false)"></div>

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
import api from '../services/api'

export default {
  name: 'MisAplicaciones',
  components: { FormField },
  emits: ['ir-ofertas', 'ver-oferta'],
  
  data() {
    return {
      loading: false, retirando: false, mostrarFiltros: false, mostrarHistorial: false,
      mostrarConfirmacionRetiro: false, vistaDetallada: true, message: '', messageType: 'success',
      
      aplicaciones: [], aplicacionesFiltradas: [], aplicacionSeleccionada: null, aplicacionARetirar: null, aspiranteId: null,
      
      paginaActual: 1, elementosPorPagina: 12,
      
      filtros: { busqueda: '', estado: '', fechaDesde: '' },
      estadisticas: { total: 0, enviadas: 0, aceptadas: 0, estemes: 0 },
      
      // Configuraciones
      filtrosConfig: [
        { key: 'busqueda', type: 'text', label: 'Buscar', icon: 'fas fa-search', placeholder: 'Puesto, empresa...', colClass: 'col-md-4' },
        { key: 'estado', type: 'select', label: 'Estado', icon: 'fas fa-flag', options: [
          { value: '', label: 'Todos los estados' }, { value: 'Enviada', label: 'Enviada' },
          { value: 'En Revisión', label: 'En Revisión' }, { value: 'Entrevista', label: 'Entrevista' },
          { value: 'Aceptada', label: 'Aceptada' }, { value: 'Rechazada', label: 'Rechazada' }, { value: 'Retirada', label: 'Retirada' }
        ], colClass: 'col-md-3' },
        { key: 'fechaDesde', type: 'date', label: 'Desde', icon: 'fas fa-calendar-alt', colClass: 'col-md-3' }
      ],
      
      estadisticasConfig: {
        total: { key: 'total', label: 'Total Aplicaciones', icon: 'fas fa-paper-plane', bgClass: 'bg-primary' },
        enviadas: { key: 'enviadas', label: 'En Revisión', icon: 'fas fa-clock', bgClass: 'bg-info' },
        aceptadas: { key: 'aceptadas', label: 'Aceptadas', icon: 'fas fa-check', bgClass: 'bg-success' },
        estemes: { key: 'estemes', label: 'Este Mes', icon: 'fas fa-calendar', bgClass: 'bg-warning' }
      },
      
      vistasConfig: [
        { key: 'detallada', detallada: true, icon: 'fas fa-th-large' },
        { key: 'lista', detallada: false, icon: 'fas fa-list' }
      ],
      
      columnasTabla: [
        { key: 'puesto', label: 'Puesto' }, { key: 'empresa', label: 'Empresa' },
        { key: 'estado', label: 'Estado' }, { key: 'fecha', label: 'Fecha Aplicación' },
        { key: 'salario', label: 'Salario' }, { key: 'acciones', label: 'Acciones' }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    messageIcon() {
      const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }
      return icons[this.messageType] || 'fas fa-info-circle'
    },
    
    totalPaginas() {
      return Math.ceil(this.aplicacionesFiltradas.length / this.elementosPorPagina)
    },
    
    aplicacionesPaginadas() {
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina
      const fin = inicio + this.elementosPorPagina
      return this.aplicacionesFiltradas.slice(inicio, fin)
    },
    
    paginasVisibles() {
      const total = this.totalPaginas
      const actual = this.paginaActual
      const rango = 2
      
      let inicio = Math.max(1, actual - rango)
      let fin = Math.min(total, actual + rango)
      
      const paginas = []
      for (let i = inicio; i <= fin; i++) {
        paginas.push(i)
      }
      
      return paginas
    }
  },
  
  async mounted() {
    await this.cargarAspiranteId()
    await this.cargarAplicaciones()
  },
  
  methods: {
    async cargarAspiranteId() {
      try {
        const response = await api.get('/Aspirante/todos')
        const aspirante = response.data.find(asp => asp.idUsuario === this.user.idUsuario)
        
        if (aspirante) {
          this.aspiranteId = aspirante.idAspirante
        }
      } catch (error) {
        console.error('Error obteniendo ID de aspirante:', error)
      }
    },
    
    async cargarAplicaciones() {
      if (!this.aspiranteId) return
      
      try {
        this.loading = true
        const response = await api.get(`/Aplicaciones/aspirante/${this.aspiranteId}`)
        this.aplicaciones = response.data || []
        
        await this.cargarDetallesOfertas()
        this.aplicacionesFiltradas = [...this.aplicaciones]
        this.calcularEstadisticas()
        this.filtrarAplicaciones()
      } catch (error) {
        if (error.response?.status !== 404) {
          this.showMessage('Error al cargar las aplicaciones', 'error')
        }
      } finally {
        this.loading = false
      }
    },
    
    async cargarDetallesOfertas() {
      try {
        const [ofertasResponse, empresasResponse] = await Promise.all([
          api.get('/Ofertas/todas'),
          api.get('/Empresa/todas')
        ])
        
        const ofertas = ofertasResponse.data
        const empresas = empresasResponse.data
        
        this.aplicaciones.forEach(aplicacion => {
          const oferta = ofertas.find(o => o.idOferta === aplicacion.idOferta)
          if (oferta) {
            const empresa = empresas.find(e => e.idEmpresa === oferta.idEmpresa)
            oferta.empresa = empresa
            aplicacion.oferta = oferta
          }
        })
      } catch (error) {
        console.error('Error cargando detalles de ofertas:', error)
      }
    },
    
    calcularEstadisticas() {
      const ahora = new Date()
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
      
      this.estadisticas = {
        total: this.aplicaciones.length,
        enviadas: this.aplicaciones.filter(a => a.estado === 'Enviada' || a.estado === 'En Revisión').length,
        aceptadas: this.aplicaciones.filter(a => a.estado === 'Aceptada').length,
        estemes: this.aplicaciones.filter(a => new Date(a.fechaAplicacion) >= inicioMes).length
      }
    },
    
    filtrarAplicaciones() {
      let filtradas = [...this.aplicaciones]
      
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase()
        filtradas = filtradas.filter(aplicacion =>
          (aplicacion.oferta?.tituloPuesto && aplicacion.oferta.tituloPuesto.toLowerCase().includes(busqueda)) ||
          (aplicacion.oferta?.empresa?.nombreEmpresa && aplicacion.oferta.empresa.nombreEmpresa.toLowerCase().includes(busqueda)) ||
          (aplicacion.oferta?.ubicacion && aplicacion.oferta.ubicacion.toLowerCase().includes(busqueda))
        )
      }
      
      if (this.filtros.estado) {
        filtradas = filtradas.filter(aplicacion => aplicacion.estado === this.filtros.estado)
      }
      
      if (this.filtros.fechaDesde) {
        const fechaDesde = new Date(this.filtros.fechaDesde)
        filtradas = filtradas.filter(aplicacion => new Date(aplicacion.fechaAplicacion) >= fechaDesde)
      }
      
      filtradas.sort((a, b) => new Date(b.fechaAplicacion) - new Date(a.fechaAplicacion))
      this.aplicacionesFiltradas = filtradas
      this.paginaActual = 1
    },
    
    limpiarFiltros() {
      this.filtros = { busqueda: '', estado: '', fechaDesde: '' }
      this.filtrarAplicaciones()
    },
    
    async refrescarAplicaciones() {
      await this.cargarAplicaciones()
      this.showMessage('Aplicaciones actualizadas', 'success')
    },
    
    irAOfertas() { this.$emit('ir-ofertas') },
    verOferta(oferta) { this.$emit('ver-oferta', oferta) },
    
    verHistorial(aplicacion) {
      this.aplicacionSeleccionada = aplicacion
      this.mostrarHistorial = true
    },
    
    puedeRetirar(aplicacion) {
      return ['Enviada', 'En Revisión'].includes(aplicacion.estado)
    },
    
    confirmarRetiro(aplicacion) {
      this.aplicacionARetirar = aplicacion
      this.mostrarConfirmacionRetiro = true
    },
    
    async retirarAplicacion() {
      if (!this.aplicacionARetirar) return
      
      try {
        this.retirando = true
        const index = this.aplicaciones.findIndex(a => a.idAplicacion === this.aplicacionARetirar.idAplicacion)
        if (index > -1) {
          this.aplicaciones[index].estado = 'Retirada'
          this.calcularEstadisticas()
          this.filtrarAplicaciones()
        }
        
        this.mostrarConfirmacionRetiro = false
        this.aplicacionARetirar = null
        this.showMessage('Aplicación retirada exitosamente', 'success')
      } catch (error) {
        this.showMessage('Error al retirar la aplicación', 'error')
      } finally {
        this.retirando = false
      }
    },
    
    cambiarPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina
        document.querySelector('.mis-aplicaciones')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    
    getAccionesDisponibles(aplicacion) {
      const acciones = [
        { key: 'ver', label: 'Ver Oferta', icon: 'fas fa-eye', metodo: (app) => this.verOferta(app.oferta) },
        { key: 'historial', label: 'Ver Historial', icon: 'fas fa-history', metodo: this.verHistorial }
      ]
      
      if (this.puedeRetirar(aplicacion)) {
        acciones.push(
          { key: 'divider' },
          { key: 'retirar', label: 'Retirar Aplicación', icon: 'fas fa-times', class: 'text-danger', metodo: this.confirmarRetiro }
        )
      }
      
      return acciones.filter(a => !a.key || a.key === 'divider' || (a.key === 'ver' ? aplicacion.oferta : true))
    },
    
    getBotonesCard(aplicacion) {
      const botones = []
      
      if (aplicacion.oferta) {
        botones.push({ key: 'ver', icon: 'fas fa-eye', class: 'btn-outline-primary', metodo: (app) => this.verOferta(app.oferta) })
      }
      
      botones.push({ key: 'historial', icon: 'fas fa-history', class: 'btn-outline-info', metodo: this.verHistorial })
      
      return botones
    },
    
    getBotonesTabla(aplicacion) {
      const botones = []
      
      if (aplicacion.oferta) {
        botones.push({ key: 'ver', icon: 'fas fa-eye', class: 'btn-outline-primary', metodo: (app) => this.verOferta(app.oferta) })
      }
      
      botones.push({ key: 'historial', icon: 'fas fa-history', class: 'btn-outline-info', metodo: this.verHistorial })
      
      if (this.puedeRetirar(aplicacion)) {
        botones.push({ key: 'retirar', icon: 'fas fa-times', class: 'btn-outline-danger', metodo: this.confirmarRetiro })
      }
      
      return botones
    },
    
    getAplicacionDetails(aplicacion) {
      const details = [
        { key: 'fecha', icon: 'fas fa-calendar', label: 'Aplicado el', text: this.formatearFecha(aplicacion.fechaAplicacion) }
      ]
      
      if (aplicacion.oferta) {
        details.push(
          { key: 'ubicacion', icon: 'fas fa-map-marker-alt', label: 'Ubicación', text: aplicacion.oferta.ubicacion },
          { key: 'salario', icon: 'fas fa-dollar-sign', label: 'Salario', 
            text: `${this.formatearSalario(aplicacion.oferta.salarioMinimo)}${aplicacion.oferta.salarioMaximo !== aplicacion.oferta.salarioMinimo ? ` - ${this.formatearSalario(aplicacion.oferta.salarioMaximo)}` : ''}`,
            class: 'text-success fw-bold' }
        )
      }
      
      return details
    },
    
    getEventosHistorial(aplicacion) {
      const eventos = [
        {
          key: 'enviada',
          titulo: 'Aplicación Enviada',
          fecha: this.formatearFechaCompleta(aplicacion.fechaAplicacion),
          descripcion: 'Tu aplicación fue enviada exitosamente a la empresa.',
          markerClass: 'bg-primary'
        }
      ]
      
      if (aplicacion.estado !== 'Enviada') {
        eventos.push({
          key: 'estado',
          titulo: this.getEstadoTexto(aplicacion.estado),
          fecha: 'Estado actual',
          descripcion: this.getEstadoDescripcion(aplicacion.estado),
          markerClass: this.getTimelineMarkerClass(aplicacion.estado)
        })
      }
      
      return eventos
    },
    
    getEstadoBadgeClass(estado) {
      const clases = {
        'Enviada': 'bg-primary', 'En Revisión': 'bg-info', 'Entrevista': 'bg-warning',
        'Aceptada': 'bg-success', 'Rechazada': 'bg-danger', 'Retirada': 'bg-secondary'
      }
      return clases[estado] || 'bg-secondary'
    },
    
    getAplicacionCardClass(estado) {
      const clases = { 'Aceptada': 'border-success', 'Rechazada': 'border-danger opacity-75', 'Retirada': 'border-secondary opacity-75' }
      return clases[estado] || ''
    },
    
    getProgresoAncho(estado) {
      const anchos = { 'Enviada': 20, 'En Revisión': 40, 'Entrevista': 70, 'Aceptada': 100, 'Rechazada': 100, 'Retirada': 100 }
      return anchos[estado] || 20
    },
    
    getProgresoClass(estado) {
      const clases = {
        'Enviada': 'bg-primary', 'En Revisión': 'bg-info', 'Entrevista': 'bg-warning',
        'Aceptada': 'bg-success', 'Rechazada': 'bg-danger', 'Retirada': 'bg-secondary'
      }
      return clases[estado] || 'bg-primary'
    },
    
    getProgresoTexto(aplicacion) {
      const textos = {
        'Enviada': 'Aplicación enviada', 'En Revisión': 'En proceso de revisión', 'Entrevista': 'Programada entrevista',
        'Aceptada': '¡Felicitaciones!', 'Rechazada': 'No seleccionado', 'Retirada': 'Aplicación retirada'
      }
      return textos[aplicacion.estado] || 'Estado desconocido'
    },
    
    getTimelineMarkerClass(estado) {
      const clases = { 'En Revisión': 'bg-info', 'Entrevista': 'bg-warning', 'Aceptada': 'bg-success', 'Rechazada': 'bg-danger', 'Retirada': 'bg-secondary' }
      return clases[estado] || 'bg-info'
    },
    
    getEstadoTexto(estado) {
      const textos = {
        'En Revisión': 'En Proceso de Revisión', 'Entrevista': 'Entrevista Programada', 'Aceptada': 'Aplicación Aceptada',
        'Rechazada': 'Aplicación Rechazada', 'Retirada': 'Aplicación Retirada'
      }
      return textos[estado] || estado
    },
    
    getEstadoDescripcion(estado) {
      const descripciones = {
        'En Revisión': 'La empresa está revisando tu perfil y experiencia.',
        'Entrevista': 'Has sido seleccionado para una entrevista. ¡Prepárate!',
        'Aceptada': '¡Felicitaciones! Has sido seleccionado para el puesto.',
        'Rechazada': 'En esta ocasión no fuiste seleccionado. ¡Sigue intentando!',
        'Retirada': 'Has retirado tu aplicación para esta oferta.'
      }
      return descripciones[estado] || 'Estado actualizado por la empresa.'
    },
    
    formatearSalario(salario) { return new Intl.NumberFormat('es-ES').format(salario) },
    
    formatearFecha(fecha) {
      if (!fecha) return 'N/A'
      return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    
    formatearFechaCompleta(fecha) {
      if (!fecha) return 'No especificada'
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    },
    
    getDiasTranscurridos(fechaAplicacion) {
      if (!fechaAplicacion) return 'N/A'
      const fecha = new Date(fechaAplicacion)
      const hoy = new Date()
      const diffTime = Math.abs(hoy - fecha)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Hoy'
      if (diffDays === 1) return 'Ayer'
      if (diffDays < 7) return `Hace ${diffDays} días`
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
      return `Hace ${Math.floor(diffDays / 30)} meses`
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
.mis-aplicaciones { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh; }

.stat-card { border-radius: 15px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: transform 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15); }
.stat-icon { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.2); font-size: 1.5rem; flex-shrink: 0; }
.stat-content { flex-grow: 1; }
.stat-content h3 { font-size: 2rem; font-weight: 700; margin: 0; line-height: 1; }
.stat-content p { margin: 0; opacity: 0.9; font-weight: 500; }

.card { border: none; border-radius: 15px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12); }

.aplicacion-card { transition: all 0.3s ease; border-left: 4px solid transparent; }
.aplicacion-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); }
.aplicacion-card.border-success { border-left-color: #10b981; }
.aplicacion-card.border-danger { border-left-color: #ef4444; }
.aplicacion-card.border-secondary { border-left-color: #6b7280; }

.aplicacion-details { display: flex; flex-direction: column; gap: 0.75rem; }
.detail-item { display: flex; align-items: center; gap: 0.75rem; }
.detail-item i { width: 16px; flex-shrink: 0; }

.application-progress .progress { border-radius: 10px; background-color: #e5e7eb; }
.application-progress .progress-bar { border-radius: 10px; transition: width 0.6s ease; }

.timeline { position: relative; padding-left: 2rem; }
.timeline::before { content: ''; position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: #e5e7eb; }
.timeline-item { position: relative; margin-bottom: 2rem; }
.timeline-marker { position: absolute; left: -25px; top: 0; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
.timeline-content { background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); }
.timeline-content h6 { margin: 0 0 0.5rem 0; color: #1f2937; }

.table { margin-bottom: 0; }
.table th { border-top: none; font-weight: 600; color: #374151; background-color: #f8fafc; }
.table td { vertical-align: middle; border-color: #e5e7eb; }
.table-hover tbody tr:hover { background-color: rgba(59, 130, 246, 0.05); }

.badge { font-size: 0.75rem; padding: 0.4em 0.8em; font-weight: 500; }

.btn { border-radius: 8px; font-weight: 500; transition: all 0.2s ease; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); border: none; }
.btn-success { background: linear-gradient(135deg, #10b981, #059669); border: none; }
.btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; }
.btn-info { background: linear-gradient(135deg, #06b6d4, #0891b2); border: none; }
.btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); border: none; }

.dropdown-menu { border: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 10px; }
.dropdown-item { border-radius: 5px; margin: 0.125rem; transition: all 0.2s ease; }
.dropdown-item:hover { background-color: #f3f4f6; transform: translateX(2px); }

.modal.show { background: rgba(0, 0, 0, 0.5); }
.modal-content { border-radius: 15px; border: none; }
.modal-header { border-bottom: 1px solid #e5e7eb; border-radius: 15px 15px 0 0; }
.modal-footer { border-top: 1px solid #e5e7eb; border-radius: 0 0 15px 15px; }

.pagination { border-radius: 10px; overflow: hidden; }
.page-link { border: none; color: #6b7280; font-weight: 500; transition: all 0.2s ease; }
.page-link:hover { background-color: #f3f4f6; color: #3b82f6; }
.page-item.active .page-link { background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-color: #3b82f6; }

.form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25); }

.spinner-border { width: 3rem; height: 3rem; }
.opacity-75 { opacity: 0.75 !important; }

@media (max-width: 768px) {
  .stat-card { flex-direction: column; text-align: center; gap: 0.5rem; }
  .stat-icon { width: 50px; height: 50px; font-size: 1.2rem; }
  .stat-content h3 { font-size: 1.5rem; }
  .table-responsive { font-size: 0.9rem; }
  .aplicacion-card { margin-bottom: 1rem; }
  .detail-item { font-size: 0.8rem; }
  .timeline { padding-left: 1.5rem; }
  .timeline-marker { left: -20px; width: 15px; height: 15px; }
}

@media (max-width: 576px) {
  .mis-aplicaciones .container { padding-left: 1rem; padding-right: 1rem; }
  .btn-group-sm .btn { padding: 0.25rem 0.5rem; }
  .stat-content h3 { font-size: 1.2rem; }
  .stat-content p { font-size: 0.8rem; }
}
</style>