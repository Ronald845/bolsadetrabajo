<template>
  <div class="lista-ofertas">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-search me-2 text-primary"></i>Ofertas Laborales Disponibles
              </h2>
              <p class="text-muted mb-0">Encuentra tu próxima oportunidad profesional</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary" @click="toggleFiltrosAvanzados">
                <i class="fas fa-filter me-2"></i>{{ mostrarFiltrosAvanzados ? 'Ocultar' : 'Filtros' }}
              </button>
              <button class="btn btn-primary" @click="refrescarOfertas" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-sync-alt me-2"></i>Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros Rápidos -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <h6 class="mb-0"><i class="fas fa-search me-2"></i>Búsqueda Rápida</h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div v-for="filtro in filtrosRapidos" :key="filtro.key" :class="filtro.colClass">
              <FormField v-model="filtros[filtro.key]" v-bind="filtro" @input="filtrarOfertas" @change="filtrarOfertas" />
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

      <!-- Filtros Avanzados -->
      <div v-if="mostrarFiltrosAvanzados" class="card shadow-sm mb-4">
        <div class="card-header bg-light">
          <h6 class="mb-0"><i class="fas fa-sliders-h me-2"></i>Filtros Avanzados</h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div v-for="filtro in filtrosAvanzados" :key="filtro.key" :class="filtro.colClass">
              <FormField v-model="filtros[filtro.key]" v-bind="filtro" @input="filtrarOfertas" @change="filtrarOfertas" />
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
              <h3>{{ stat.getValue() }}</h3>
              <p>{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de Ofertas -->
      <div class="card shadow-sm">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="fas fa-list me-2"></i>Ofertas Disponibles ({{ ofertasFiltradas.length }})
          </h6>
          <div class="d-flex gap-2">
            <button v-for="vista in vistasConfig" :key="vista.key" class="btn btn-sm"
              :class="vistaGrid === vista.isGrid ? 'btn-primary' : 'btn-outline-primary'"
              @click="vistaGrid = vista.isGrid">
              <i :class="vista.icon"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Cargando ofertas...</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="ofertasFiltradas.length === 0" class="text-center py-5">
            <i class="fas fa-search fa-4x text-muted mb-3"></i>
            <h5>No se encontraron ofertas</h5>
            <p class="text-muted mb-4">
              {{ ofertas.length === 0 ? 'No hay ofertas disponibles en este momento' : 'Intenta ajustar tus filtros de búsqueda' }}
            </p>
            <button v-if="ofertas.length > 0" @click="limpiarFiltros" class="btn btn-primary">
              <i class="fas fa-refresh me-2"></i>Limpiar Filtros
            </button>
          </div>

          <!-- Vista Grid -->
          <div v-else-if="vistaGrid" class="row">
            <div v-for="oferta in ofertasPaginadas" :key="oferta.idOferta" class="col-lg-6 col-xl-4 mb-4">
              <div class="card oferta-card h-100">
                <div class="card-header d-flex justify-content-between align-items-start">
                  <div>
                    <span class="badge bg-success mb-2">{{ oferta.estadoOferta }}</span>
                    <h6 class="card-title mb-1">{{ oferta.tituloPuesto }}</h6>
                    <p class="text-muted small mb-0">
                      <i class="fas fa-building me-1"></i>{{ oferta.empresa?.nombreEmpresa || 'Empresa Confidencial' }}
                    </p>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-for="accion in accionesOferta" :key="accion.key">
                        <a class="dropdown-item" href="#" @click.prevent="accion.metodo(oferta)" :class="accion.getClass ? accion.getClass(oferta) : accion.class">
                          <i :class="accion.getIcon ? accion.getIcon(oferta) : accion.icon" class="me-2"></i>
                          {{ accion.getLabel ? accion.getLabel(oferta) : accion.label }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text small text-muted">{{ truncateText(oferta.descripcionPuesto, 100) }}</p>
                  <div class="oferta-details">
                    <div v-for="detail in getOfertaDetails(oferta)" :key="detail.key" class="detail-item">
                      <i :class="detail.icon" class="text-muted me-2"></i>
                      <span :class="detail.class">{{ detail.text }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Cierra: {{ formatearFecha(oferta.fechaCierre) }}</small>
                    <div class="btn-group btn-group-sm">
                      <button v-for="btn in botonesCard" :key="btn.key" class="btn"
                        :class="btn.getClass ? btn.getClass(oferta) : btn.class"
                        @click="btn.metodo(oferta)"
                        :disabled="btn.getDisabled ? btn.getDisabled(oferta) : false">
                        <span v-if="aplicando === oferta.idOferta && btn.key === 'aplicar'" class="spinner-border spinner-border-sm"></span>
                        <i v-else :class="btn.getIcon ? btn.getIcon(oferta) : btn.icon"></i>
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
                <tr v-for="oferta in ofertasPaginadas" :key="oferta.idOferta" class="cursor-pointer">
                  <td @click="verDetalle(oferta)">
                    <div>
                      <h6 class="mb-1">{{ oferta.tituloPuesto }}</h6>
                      <small class="text-muted">{{ oferta.perfilAcademico }}</small>
                    </div>
                  </td>
                  <td @click="verDetalle(oferta)">
                    <span class="fw-bold">{{ oferta.empresa?.nombreEmpresa || 'Confidencial' }}</span>
                  </td>
                  <td @click="verDetalle(oferta)">
                    <i class="fas fa-map-marker-alt text-muted me-2"></i>{{ oferta.ubicacion }}
                  </td>
                  <td @click="verDetalle(oferta)">
                    <span class="badge bg-secondary">{{ oferta.modalidadEmpleo }}</span>
                  </td>
                  <td @click="verDetalle(oferta)">
                    <span class="fw-bold text-success">
                      ${{ formatearSalario(oferta.salarioMinimo) }}
                      <span v-if="oferta.salarioMaximo !== oferta.salarioMinimo">
                        - ${{ formatearSalario(oferta.salarioMaximo) }}
                      </span>
                    </span>
                  </td>
                  <td @click="verDetalle(oferta)">
                    <small class="text-muted">{{ formatearFecha(oferta.fechaPublicacion) }}</small>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button v-for="btn in botonesTabla" :key="btn.key" class="btn"
                        :class="btn.getClass ? btn.getClass(oferta) : btn.class"
                        @click="btn.metodo(oferta)"
                        :disabled="btn.getDisabled ? btn.getDisabled(oferta) : false">
                        <span v-if="aplicando === oferta.idOferta && btn.key === 'aplicar'" class="spinner-border spinner-border-sm"></span>
                        <i v-else :class="btn.getIcon ? btn.getIcon(oferta) : btn.icon"></i>
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

      <!-- Modal Confirmación -->
      <div class="modal fade" :class="{ show: mostrarModalAplicacion }" :style="{ display: mostrarModalAplicacion ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-primary">
                <i class="fas fa-paper-plane me-2"></i>Confirmar Aplicación
              </h5>
              <button type="button" class="btn-close" @click="mostrarModalAplicacion = false"></button>
            </div>
            <div class="modal-body">
              <div v-if="ofertaSeleccionada" class="alert alert-info">
                <h6><strong>{{ ofertaSeleccionada.tituloPuesto }}</strong></h6>
                <p class="mb-2">{{ ofertaSeleccionada.empresa?.nombreEmpresa || 'Empresa Confidencial' }}</p>
                <small class="text-muted">{{ ofertaSeleccionada.ubicacion }}</small>
              </div>
              <p>¿Estás seguro de que deseas aplicar a esta oferta laboral?</p>
              <div class="alert alert-warning">
                <small>
                  <i class="fas fa-info-circle me-2"></i>
                  Una vez que apliques, la empresa podrá ver tu perfil y contactarte directamente.
                </small>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarModalAplicacion = false" :disabled="aplicandoModal">Cancelar</button>
              <button type="button" @click="confirmarAplicacion" class="btn btn-primary" :disabled="aplicandoModal">
                <span v-if="aplicandoModal" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-paper-plane me-2"></i>
                {{ aplicandoModal ? 'Aplicando...' : 'Confirmar Aplicación' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop -->
      <div v-if="mostrarModalAplicacion" class="modal-backdrop fade show" @click="mostrarModalAplicacion = false"></div>

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
  name: 'ListaOfertas',
  components: { FormField },
  emits: ['ver-detalle', 'aplicar-exitosa'],
  
  data() {
    return {
      loading: false, aplicando: null, aplicandoModal: false, mostrarFiltrosAvanzados: false,
      mostrarModalAplicacion: false, vistaGrid: true, message: '', messageType: 'success',
      
      ofertas: [], ofertasFiltradas: [], misAplicaciones: [], ofertaSeleccionada: null, aspiranteId: null,
      
      paginaActual: 1, elementosPorPagina: 12,
      
      filtros: {
        busqueda: '', modalidad: '', perfilAcademico: '', salarioMinimo: '', salarioMaximo: '',
        ubicacion: '', ordenarPor: 'recientes'
      },
      
      estadisticas: { activas: 0, nuevas: 0 },
      
      // Configuraciones
      filtrosRapidos: [
        { key: 'busqueda', type: 'text', label: 'Buscar Ofertas', icon: 'fas fa-search', placeholder: 'Título, empresa, ubicación...', colClass: 'col-md-4' },
        { key: 'modalidad', type: 'select', label: 'Modalidad', icon: 'fas fa-building', options: [
          { value: '', label: 'Todas las modalidades' }, { value: 'Presencial', label: 'Presencial' },
          { value: 'Remoto', label: 'Remoto' }, { value: 'Híbrido', label: 'Híbrido' },
          { value: 'Medio Tiempo', label: 'Medio Tiempo' }, { value: 'Tiempo Completo', label: 'Tiempo Completo' }
        ], colClass: 'col-md-3' },
        { key: 'perfilAcademico', type: 'select', label: 'Nivel Educativo', icon: 'fas fa-graduation-cap', options: [
          { value: '', label: 'Todos los niveles' }, { value: 'Sin requisitos', label: 'Sin requisitos específicos' },
          { value: 'Primaria', label: 'Educación Primaria' }, { value: 'Secundaria', label: 'Educación Secundaria' },
          { value: 'Técnico', label: 'Técnico Superior' }, { value: 'Tecnólogo', label: 'Tecnólogo' },
          { value: 'Universitario', label: 'Universitario' }, { value: 'Postgrado', label: 'Postgrado' },
          { value: 'Maestría', label: 'Maestría' }, { value: 'Doctorado', label: 'Doctorado' }
        ], colClass: 'col-md-3' }
      ],
      
      filtrosAvanzados: [
        { key: 'salarioMinimo', type: 'number', label: 'Salario Mínimo (USD)', icon: 'fas fa-dollar-sign', placeholder: '800', colClass: 'col-md-3' },
        { key: 'salarioMaximo', type: 'number', label: 'Salario Máximo (USD)', icon: 'fas fa-dollar-sign', placeholder: '2000', colClass: 'col-md-3' },
        { key: 'ubicacion', type: 'text', label: 'Ubicación', icon: 'fas fa-map-marker-alt', placeholder: 'San Salvador, Santa Ana...', colClass: 'col-md-3' },
        { key: 'ordenarPor', type: 'select', label: 'Ordenar Por', icon: 'fas fa-sort', options: [
          { value: 'recientes', label: 'Más Recientes' }, { value: 'antiguos', label: 'Más Antiguas' },
          { value: 'salario_asc', label: 'Salario: Menor a Mayor' }, { value: 'salario_desc', label: 'Salario: Mayor a Menor' },
          { value: 'alfabetico', label: 'Orden Alfabético' }
        ], colClass: 'col-md-3' }
      ],
      
      estadisticasConfig: {
        encontradas: { getValue: () => this.ofertasFiltradas.length, label: 'Ofertas Encontradas', icon: 'fas fa-briefcase', bgClass: 'bg-primary' },
        activas: { getValue: () => this.estadisticas.activas, label: 'Activas', icon: 'fas fa-eye', bgClass: 'bg-success' },
        nuevas: { getValue: () => this.estadisticas.nuevas, label: 'Nuevas (7 días)', icon: 'fas fa-clock', bgClass: 'bg-info' },
        aplicaciones: { getValue: () => this.misAplicaciones.length, label: 'Mis Aplicaciones', icon: 'fas fa-paper-plane', bgClass: 'bg-warning' }
      },
      
      vistasConfig: [
        { key: 'grid', isGrid: true, icon: 'fas fa-th' },
        { key: 'lista', isGrid: false, icon: 'fas fa-list' }
      ],
      
      columnasTabla: [
        { key: 'puesto', label: 'Puesto' }, { key: 'empresa', label: 'Empresa' },
        { key: 'ubicacion', label: 'Ubicación' }, { key: 'modalidad', label: 'Modalidad' },
        { key: 'salario', label: 'Salario' }, { key: 'fecha', label: 'Publicada' }, { key: 'acciones', label: 'Acciones' }
      ],
      
      accionesOferta: [
        { key: 'ver', label: 'Ver Detalles', icon: 'fas fa-eye', metodo: this.verDetalle },
        { key: 'aplicar', getLabel: (oferta) => this.yaAplicado(oferta.idOferta) ? 'Ya Aplicado' : 'Aplicar',
          getIcon: (oferta) => this.yaAplicado(oferta.idOferta) ? 'fas fa-check' : 'fas fa-paper-plane',
          getClass: (oferta) => this.yaAplicado(oferta.idOferta) ? 'text-muted' : 'text-success',
          metodo: this.aplicarOferta },
        { key: 'guardar', label: 'Guardar', icon: 'fas fa-bookmark', metodo: this.guardarOferta }
      ],
      
      botonesCard: [
        { key: 'ver', icon: 'fas fa-eye', class: 'btn-outline-primary', metodo: this.verDetalle },
        { key: 'aplicar', getIcon: (oferta) => this.yaAplicado(oferta.idOferta) ? 'fas fa-check' : 'fas fa-paper-plane',
          getClass: (oferta) => this.yaAplicado(oferta.idOferta) ? 'btn-success' : 'btn-outline-success',
          getDisabled: (oferta) => this.yaAplicado(oferta.idOferta) || this.aplicando === oferta.idOferta,
          metodo: this.aplicarOferta }
      ],
      
      botonesTabla: [
        { key: 'ver', icon: 'fas fa-eye', class: 'btn-outline-primary', metodo: this.verDetalle },
        { key: 'aplicar', getIcon: (oferta) => this.yaAplicado(oferta.idOferta) ? 'fas fa-check' : 'fas fa-paper-plane',
          getClass: (oferta) => this.yaAplicado(oferta.idOferta) ? 'btn-success' : 'btn-outline-success',
          getDisabled: (oferta) => this.yaAplicado(oferta.idOferta) || this.aplicando === oferta.idOferta,
          metodo: this.aplicarOferta }
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
      return Math.ceil(this.ofertasFiltradas.length / this.elementosPorPagina)
    },
    
    ofertasPaginadas() {
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina
      const fin = inicio + this.elementosPorPagina
      return this.ofertasFiltradas.slice(inicio, fin)
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
    await this.cargarOfertas()
    await this.cargarMisAplicaciones()
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
    
    async cargarOfertas() {
      try {
        this.loading = true
        const response = await api.get('/Ofertas/todas')
        this.ofertas = response.data.filter(oferta => oferta.estadoOferta === 'Activa')
        this.ofertasFiltradas = [...this.ofertas]
        this.calcularEstadisticas()
        this.filtrarOfertas()
      } catch (error) {
        this.showMessage('Error al cargar las ofertas', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async cargarMisAplicaciones() {
      if (!this.aspiranteId) return
      
      try {
        const response = await api.get(`/Aplicaciones/aspirante/${this.aspiranteId}`)
        this.misAplicaciones = response.data || []
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error cargando aplicaciones:', error)
        }
      }
    },
    
    calcularEstadisticas() {
      const ahora = new Date()
      const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      this.estadisticas = {
        activas: this.ofertas.filter(o => o.estadoOferta === 'Activa').length,
        nuevas: this.ofertas.filter(o => {
          const fechaPublicacion = new Date(o.fechaPublicacion)
          return fechaPublicacion >= hace7dias
        }).length
      }
    },
    
    filtrarOfertas() {
      let filtradas = [...this.ofertas]
      
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase()
        filtradas = filtradas.filter(oferta =>
          oferta.tituloPuesto.toLowerCase().includes(busqueda) ||
          oferta.descripcionPuesto.toLowerCase().includes(busqueda) ||
          oferta.ubicacion.toLowerCase().includes(busqueda) ||
          (oferta.empresa?.nombreEmpresa && oferta.empresa.nombreEmpresa.toLowerCase().includes(busqueda)) ||
          (oferta.conocimientoNecesarios && oferta.conocimientoNecesarios.toLowerCase().includes(busqueda))
        )
      }
      
      if (this.filtros.modalidad) {
        filtradas = filtradas.filter(oferta => oferta.modalidadEmpleo === this.filtros.modalidad)
      }
      
      if (this.filtros.perfilAcademico) {
        filtradas = filtradas.filter(oferta => oferta.perfilAcademico === this.filtros.perfilAcademico)
      }
      
      if (this.filtros.ubicacion) {
        const ubicacion = this.filtros.ubicacion.toLowerCase()
        filtradas = filtradas.filter(oferta => oferta.ubicacion.toLowerCase().includes(ubicacion))
      }
      
      if (this.filtros.salarioMinimo) {
        const salarioMin = parseFloat(this.filtros.salarioMinimo)
        filtradas = filtradas.filter(oferta => oferta.salarioMaximo >= salarioMin)
      }
      
      if (this.filtros.salarioMaximo) {
        const salarioMax = parseFloat(this.filtros.salarioMaximo)
        filtradas = filtradas.filter(oferta => oferta.salarioMinimo <= salarioMax)
      }
      
      this.ordenarOfertas(filtradas)
      this.ofertasFiltradas = filtradas
      this.paginaActual = 1
    },
    
    ordenarOfertas(ofertas) {
      const ordenMap = {
        'recientes': (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion),
        'antiguos': (a, b) => new Date(a.fechaPublicacion) - new Date(b.fechaPublicacion),
        'salario_asc': (a, b) => a.salarioMinimo - b.salarioMinimo,
        'salario_desc': (a, b) => b.salarioMaximo - a.salarioMaximo,
        'alfabetico': (a, b) => a.tituloPuesto.localeCompare(b.tituloPuesto)
      }
      
      const sortFn = ordenMap[this.filtros.ordenarPor] || ordenMap['recientes']
      ofertas.sort(sortFn)
    },
    
    limpiarFiltros() {
      this.filtros = {
        busqueda: '', modalidad: '', perfilAcademico: '', salarioMinimo: '', salarioMaximo: '',
        ubicacion: '', ordenarPor: 'recientes'
      }
      this.filtrarOfertas()
    },
    
    toggleFiltrosAvanzados() {
      this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados
    },
    
    async refrescarOfertas() {
      await this.cargarOfertas()
      await this.cargarMisAplicaciones()
      this.showMessage('Ofertas actualizadas', 'success')
    },
    
    verDetalle(oferta) {
      this.$emit('ver-detalle', oferta)
    },
    
    aplicarOferta(oferta) {
      if (!this.aspiranteId) {
        this.showMessage('Debes completar tu perfil de aspirante primero', 'warning')
        return
      }
      
      if (this.yaAplicado(oferta.idOferta)) {
        this.showMessage('Ya has aplicado a esta oferta', 'info')
        return
      }
      
      this.ofertaSeleccionada = oferta
      this.mostrarModalAplicacion = true
    },
    
    async confirmarAplicacion() {
      if (!this.ofertaSeleccionada || !this.aspiranteId) return
      
      try {
        this.aplicandoModal = true
        
        const aplicacionData = {
          idOferta: this.ofertaSeleccionada.idOferta,
          idAspirante: this.aspiranteId,
          fechaAplicacion: new Date().toISOString(),
          estado: 'Enviada'
        }
        
        await api.post('/Aplicaciones/crear', aplicacionData)
        
        this.misAplicaciones.push({
          idOferta: this.ofertaSeleccionada.idOferta,
          idAspirante: this.aspiranteId,
          estado: 'Enviada'
        })
        
        this.mostrarModalAplicacion = false
        this.ofertaSeleccionada = null
        
        this.showMessage('¡Aplicación enviada exitosamente! La empresa podrá contactarte pronto.', 'success')
        this.$emit('aplicar-exitosa', aplicacionData)
      } catch (error) {
        this.showMessage('Error al enviar la aplicación', 'error')
      } finally {
        this.aplicandoModal = false
      }
    },
    
    guardarOferta(oferta) {
      this.showMessage('Funcionalidad próximamente disponible', 'info')
    },
    
    yaAplicado(idOferta) {
      return this.misAplicaciones.some(app => app.idOferta === idOferta)
    },
    
    cambiarPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina
        document.querySelector('.lista-ofertas').scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    
    getOfertaDetails(oferta) {
      return [
        { key: 'ubicacion', icon: 'fas fa-map-marker-alt', text: oferta.ubicacion },
        { key: 'modalidad', icon: 'fas fa-briefcase', text: oferta.modalidadEmpleo },
        { key: 'salario', icon: 'fas fa-dollar-sign', class: 'fw-bold text-success',
          text: `${this.formatearSalario(oferta.salarioMinimo)}${oferta.salarioMaximo !== oferta.salarioMinimo ? ` - ${this.formatearSalario(oferta.salarioMaximo)}` : ''}` },
        { key: 'perfil', icon: 'fas fa-graduation-cap', text: oferta.perfilAcademico },
        { key: 'fecha', icon: 'fas fa-calendar', text: this.formatearFecha(oferta.fechaPublicacion) }
      ]
    },
    
    formatearSalario(salario) {
      return new Intl.NumberFormat('es-ES').format(salario)
    },
    
    formatearFecha(fecha) {
      if (!fecha) return 'N/A'
      return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
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
.lista-ofertas { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh; }

.stat-card { border-radius: 15px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: transform 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15); }
.stat-icon { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.2); font-size: 1.5rem; flex-shrink: 0; }
.stat-content { flex-grow: 1; }
.stat-content h3 { font-size: 2rem; font-weight: 700; margin: 0; line-height: 1; }
.stat-content p { margin: 0; opacity: 0.9; font-weight: 500; }

.card { border: none; border-radius: 15px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12); }

.oferta-card { transition: all 0.3s ease; border-left: 4px solid transparent; }
.oferta-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); border-left-color: #3b82f6; }
.oferta-details { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
.detail-item { display: flex; align-items: center; font-size: 0.9rem; }
.detail-item i { width: 16px; }

.table { margin-bottom: 0; }
.table th { border-top: none; font-weight: 600; color: #374151; background-color: #f8fafc; }
.table td { vertical-align: middle; border-color: #e5e7eb; }
.table-hover tbody tr:hover { background-color: rgba(59, 130, 246, 0.05); cursor: pointer; }

.badge { font-size: 0.75rem; padding: 0.4em 0.8em; font-weight: 500; }

.btn { border-radius: 8px; font-weight: 500; transition: all 0.2s ease; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); border: none; }
.btn-success { background: linear-gradient(135deg, #10b981, #059669); border: none; }
.btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; }
.btn-info { background: linear-gradient(135deg, #06b6d4, #0891b2); border: none; }

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
.cursor-pointer { cursor: pointer; }

@media (max-width: 768px) {
  .stat-card { flex-direction: column; text-align: center; gap: 0.5rem; }
  .stat-icon { width: 50px; height: 50px; font-size: 1.2rem; }
  .stat-content h3 { font-size: 1.5rem; }
  .table-responsive { font-size: 0.9rem; }
  .oferta-card { margin-bottom: 1rem; }
  .detail-item { font-size: 0.8rem; }
}

@media (max-width: 576px) {
  .lista-ofertas .container { padding-left: 1rem; padding-right: 1rem; }
  .btn-group-sm .btn { padding: 0.25rem 0.5rem; }
  .stat-content h3 { font-size: 1.2rem; }
  .stat-content p { font-size: 0.8rem; }
}
</style>