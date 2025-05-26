<template>
  <div class="aplicaciones-recibidas">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-users me-2 text-primary"></i>
                Candidatos y Aplicaciones
              </h2>
              <p class="text-muted mb-0">Gestiona las aplicaciones recibidas para tus ofertas laborales</p>
            </div>
            <div class="d-flex gap-2">
              <button @click="exportarDatos" class="btn btn-outline-success btn-sm">
                <i class="fas fa-file-excel me-2"></i>Exportar
              </button>
              <button @click="$emit('volver-ofertas')" class="btn btn-outline-primary">
                <i class="fas fa-arrow-left me-2"></i>Mis Ofertas
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3" v-for="filtro in filtrosConfig" :key="filtro.key">
              <FormField v-model="filtros[filtro.key]" v-bind="filtro" />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-6">
              <FormField v-model="filtros.busqueda" label="Buscar Candidato" icon="fas fa-search" placeholder="Nombre, email, puesto..." />
            </div>
            <div class="col-md-6 d-flex align-items-end">
              <button @click="limpiarFiltros" class="btn btn-outline-secondary me-2">
                <i class="fas fa-times me-2"></i>Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-3" v-for="(stat, key) in statsConfig" :key="key">
          <div class="card text-white" :class="stat.class">
            <div class="card-body text-center">
              <i :class="stat.icon" class="fa-2x mb-2"></i>
              <h4>{{ estadisticas[key] }}</h4>
              <small>{{ stat.label }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de aplicaciones -->
      <div class="card shadow-sm">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-list me-2"></i>Aplicaciones ({{ aplicacionesFiltradas.length }})
            </h5>
            <select v-model="vista" class="form-select form-select-sm" style="width: auto;">
              <option value="tarjetas">Vista Tarjetas</option>
              <option value="tabla">Vista Tabla</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Cargando aplicaciones...</p>
          </div>

          <!-- Sin datos -->
          <div v-else-if="aplicacionesFiltradas.length === 0" class="text-center py-5">
            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5>No hay aplicaciones</h5>
            <p class="text-muted">
              {{ aplicaciones.length === 0 ? 'Aún no has recibido aplicaciones.' : 'No hay aplicaciones que coincidan con los filtros.' }}
            </p>
          </div>

          <!-- Vista Tarjetas -->
          <div v-else-if="vista === 'tarjetas'" class="row">
            <div v-for="app in aplicacionesFiltradas" :key="app.idAplicacion" class="col-lg-6 col-xl-4 mb-4">
              <div class="card aplicacion-card h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle me-3">
                        {{ getIniciales(app.aspirante?.primerNombre, app.aspirante?.primerApellido) }}
                      </div>
                      <div>
                        <h6 class="mb-1">{{ app.aspirante?.primerNombre }} {{ app.aspirante?.primerApellido }}</h6>
                        <small class="text-muted">{{ app.aspirante?.puestoBusca || 'Profesional' }}</small>
                      </div>
                    </div>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" @click.prevent="verPerfil(app.aspirante)">
                          <i class="fas fa-user me-2"></i>Ver Perfil</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="contactarCandidato(app)">
                          <i class="fas fa-envelope me-2"></i>Contactar</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" @click.prevent="rechazarAplicacion(app)">
                          <i class="fas fa-times me-2"></i>Rechazar</a></li>
                      </ul>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-briefcase text-primary me-2"></i>
                      <small class="text-primary fw-medium">{{ app.oferta?.tituloPuesto }}</small>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-calendar text-muted me-2"></i>
                      <small class="text-muted">Aplicó {{ formatFecha(app.fechaAplicacion) }}</small>
                    </div>
                  </div>

                  <div class="mb-3">
                    <span class="badge" :class="getEstadoClass(app.estado)">
                      <i :class="getEstadoIcon(app.estado)" class="me-1"></i>{{ app.estado }}
                    </span>
                  </div>

                  <div class="d-flex gap-2">
                    <button v-if="app.estado === 'Pendiente'" @click="cambiarEstado(app, 'En Revisión')" class="btn btn-sm btn-warning flex-fill">
                      <i class="fas fa-eye me-1"></i>Revisar
                    </button>
                    <button v-if="['Pendiente', 'En Revisión'].includes(app.estado)" @click="cambiarEstado(app, 'Aceptada')" class="btn btn-sm btn-success flex-fill">
                      <i class="fas fa-check me-1"></i>Aceptar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vista Tabla -->
          <div v-else class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th v-for="col in tableCols" :key="col.key" :width="col.width">{{ col.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="app in aplicacionesFiltradas" :key="app.idAplicacion">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle-sm me-2">
                        {{ getIniciales(app.aspirante?.primerNombre, app.aspirante?.primerApellido) }}
                      </div>
                      <div>
                        <div class="fw-medium">{{ app.aspirante?.primerNombre }} {{ app.aspirante?.primerApellido }}</div>
                        <small class="text-muted">{{ app.aspirante?.puestoBusca || 'Profesional' }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="fw-medium">{{ app.oferta?.tituloPuesto }}</div>
                    <small class="text-muted">{{ app.oferta?.modalidadEmpleo }}</small>
                  </td>
                  <td>
                    <div>{{ formatFecha(app.fechaAplicacion) }}</div>
                    <small class="text-muted">{{ formatTiempoTranscurrido(app.fechaAplicacion) }}</small>
                  </td>
                  <td>
                    <span class="badge" :class="getEstadoClass(app.estado)">
                      <i :class="getEstadoIcon(app.estado)" class="me-1"></i>{{ app.estado }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button @click="verPerfil(app.aspirante)" class="btn btn-outline-primary" title="Ver perfil">
                        <i class="fas fa-user"></i>
                      </button>
                      <button v-if="app.estado === 'Pendiente'" @click="cambiarEstado(app, 'En Revisión')" class="btn btn-outline-warning">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button v-if="['Pendiente', 'En Revisión'].includes(app.estado)" @click="cambiarEstado(app, 'Aceptada')" class="btn btn-outline-success">
                        <i class="fas fa-check"></i>
                      </button>
                      <div class="btn-group">
                        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click.prevent="contactarCandidato(app)">
                            <i class="fas fa-envelope me-2"></i>Contactar</a></li>
                          <li><a class="dropdown-item text-danger" href="#" @click.prevent="rechazarAplicacion(app)">
                            <i class="fas fa-times me-2"></i>Rechazar</a></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Ver Perfil -->
      <div class="modal fade" :class="{ show: mostrarPerfilModal }" :style="{ display: mostrarPerfilModal ? 'block' : 'none' }">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-user me-2"></i>Perfil de {{ candidatoSeleccionado?.primerNombre }} {{ candidatoSeleccionado?.primerApellido }}
              </h5>
              <button type="button" class="btn-close" @click="cerrarPerfilModal"></button>
            </div>
            <div class="modal-body">
              <div v-if="candidatoSeleccionado" class="row">
                <div class="col-md-4">
                  <div class="text-center mb-4">
                    <div class="avatar-circle-lg mx-auto mb-3">
                      {{ getIniciales(candidatoSeleccionado.primerNombre, candidatoSeleccionado.primerApellido) }}
                    </div>
                    <h5>{{ candidatoSeleccionado.primerNombre }} {{ candidatoSeleccionado.primerApellido }}</h5>
                    <p class="text-muted">{{ candidatoSeleccionado.puestoBusca || 'Profesional' }}</p>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Próximamente:</strong> Vista completa del perfil del candidato.
                  </div>
                  <div class="card">
                    <div class="card-header"><h6 class="mb-0">Información Básica</h6></div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-sm-6">
                          <strong>Nombre:</strong><br>
                          {{ candidatoSeleccionado.primerNombre }} {{ candidatoSeleccionado.segundoNombre || '' }}
                          {{ candidatoSeleccionado.primerApellido }} {{ candidatoSeleccionado.segundoApellido || '' }}
                        </div>
                        <div class="col-sm-6">
                          <strong>Puesto:</strong><br>
                          {{ candidatoSeleccionado.puestoBusca || 'No especificado' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarPerfilModal">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="contactarCandidato(aplicacionSeleccionada)">
                <i class="fas fa-envelope me-2"></i>Contactar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop del modal -->
      <div v-if="mostrarPerfilModal" class="modal-backdrop fade show" @click="cerrarPerfilModal"></div>

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
  name: 'AplicacionesRecibidas',
  components: { FormField },
  emits: ['volver-dashboard', 'volver-ofertas'],
  
  data() {
    return {
      loading: false,
      message: '',
      messageType: 'success',
      vista: 'tarjetas',
      aplicaciones: [],
      ofertas: [],
      empresaId: null,
      mostrarPerfilModal: false,
      candidatoSeleccionado: null,
      aplicacionSeleccionada: null,
      
      filtros: {
        oferta: '', estado: '', fechaDesde: '', fechaHasta: '', busqueda: ''
      },
      
      // Configuraciones estáticas
      filtrosConfig: [
        { key: 'oferta', type: 'select', label: 'Filtrar por Oferta', icon: 'fas fa-briefcase', options: [], placeholder: 'Todas las ofertas' },
        { key: 'estado', type: 'select', label: 'Estado', icon: 'fas fa-filter', options: [], placeholder: 'Todos los estados' },
        { key: 'fechaDesde', type: 'date', label: 'Fecha Desde', icon: 'fas fa-calendar', max: new Date().toISOString().split('T')[0] },
        { key: 'fechaHasta', type: 'date', label: 'Fecha Hasta', icon: 'fas fa-calendar', max: new Date().toISOString().split('T')[0] }
      ],
      
      statsConfig: {
        total: { class: 'bg-primary', icon: 'fas fa-envelope', label: 'Total Aplicaciones' },
        pendientes: { class: 'bg-warning', icon: 'fas fa-clock', label: 'Pendientes' },
        revisadas: { class: 'bg-info', icon: 'fas fa-eye', label: 'En Revisión' },
        aceptadas: { class: 'bg-success', icon: 'fas fa-check', label: 'Aceptadas' }
      },
      
      tableCols: [
        { key: 'candidato', label: 'Candidato' },
        { key: 'oferta', label: 'Oferta' },
        { key: 'fecha', label: 'Fecha Aplicación' },
        { key: 'estado', label: 'Estado' },
        { key: 'acciones', label: 'Acciones', width: '150' }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    aplicacionesFiltradas() {
      return this.aplicaciones.filter(app => {
        if (this.filtros.oferta && app.idOferta !== parseInt(this.filtros.oferta)) return false
        if (this.filtros.estado && app.estado !== this.filtros.estado) return false
        if (this.filtros.fechaDesde && new Date(app.fechaAplicacion) < new Date(this.filtros.fechaDesde)) return false
        if (this.filtros.fechaHasta && new Date(app.fechaAplicacion) > new Date(this.filtros.fechaHasta)) return false
        if (this.filtros.busqueda) {
          const busqueda = this.filtros.busqueda.toLowerCase()
          const texto = `${app.aspirante?.primerNombre} ${app.aspirante?.primerApellido} ${app.aspirante?.puestoBusca} ${app.oferta?.tituloPuesto}`.toLowerCase()
          return texto.includes(busqueda)
        }
        return true
      })
    },
    
    estadisticas() {
      return this.aplicaciones.reduce((acc, app) => {
        acc.total++
        if (app.estado === 'Pendiente') acc.pendientes++
        else if (app.estado === 'En Revisión') acc.revisadas++
        else if (app.estado === 'Aceptada') acc.aceptadas++
        return acc
      }, { total: 0, pendientes: 0, revisadas: 0, aceptadas: 0 })
    },
    
    messageIcon() {
      const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }
      return icons[this.messageType] || 'fas fa-info-circle'
    }
  },
  
  async mounted() {
    await this.cargarEmpresaId()
    if (this.empresaId) await this.cargarDatos()
    this.configurarOpciones()
  },
  
  methods: {
    async cargarEmpresaId() {
      try {
        const response = await api.get('/Empresa/todas')
        const empresa = response.data.find(emp => emp.idUsuario === this.user.idUsuario)
        this.empresaId = empresa?.idEmpresa
        if (!this.empresaId) this.showMessage('No se encontró tu perfil de empresa', 'error')
      } catch (error) {
        this.showMessage('Error al cargar tu perfil de empresa', 'error')
      }
    },
    
    async cargarDatos() {
      try {
        this.loading = true
        await Promise.all([this.cargarOfertas(), this.cargarAplicaciones()])
      } catch (error) {
        this.showMessage('Error al cargar los datos', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async cargarOfertas() {
      const response = await api.get('/Ofertas/todas')
      this.ofertas = response.data.filter(oferta => oferta.idEmpresa === this.empresaId)
    },
    
    async cargarAplicaciones() {
      const response = await api.get('/Aplicaciones/todos')
      const ofertasIds = this.ofertas.map(o => o.idOferta)
      let aplicacionesEmpresa = response.data.filter(app => ofertasIds.includes(app.idOferta))
      
      for (let app of aplicacionesEmpresa) {
        app.oferta = this.ofertas.find(o => o.idOferta === app.idOferta)
        try {
          const aspiranteResponse = await api.get(`/Aspirante/${app.idAspirante}`)
          app.aspirante = aspiranteResponse.data
        } catch {
          app.aspirante = { primerNombre: 'Usuario', primerApellido: 'Desconocido', puestoBusca: 'No especificado' }
        }
      }
      this.aplicaciones = aplicacionesEmpresa
    },
    
    configurarOpciones() {
      this.filtrosConfig[0].options = this.ofertas.map(o => ({ value: o.idOferta, label: o.tituloPuesto }))
      this.filtrosConfig[1].options = ['Pendiente', 'En Revisión', 'Aceptada', 'Rechazada', 'Retirada'].map(e => ({ value: e, label: e }))
    },
    
    async cambiarEstado(app, nuevoEstado) {
      try {
        await api.put('/Aplicaciones/editar', {
          idAplicacion: app.idAplicacion, idOferta: app.idOferta, idAspirante: app.idAspirante,
          fechaAplicacion: app.fechaAplicacion, estado: nuevoEstado
        })
        app.estado = nuevoEstado
        this.showMessage(`Aplicación marcada como ${nuevoEstado}`, 'success')
      } catch {
        this.showMessage('Error al cambiar el estado', 'error')
      }
    },
    
    verPerfil(aspirante) {
      this.candidatoSeleccionado = aspirante
      this.mostrarPerfilModal = true
    },
    
    cerrarPerfilModal() {
      this.mostrarPerfilModal = false
      this.candidatoSeleccionado = null
    },
    
    contactarCandidato() {
      this.showMessage('Función de contacto será implementada próximamente', 'warning')
    },
    
    async rechazarAplicacion(app) {
      if (confirm(`¿Rechazar aplicación de ${app.aspirante?.primerNombre}?`)) {
        await this.cambiarEstado(app, 'Rechazada')
      }
    },
    
    limpiarFiltros() {
      this.filtros = { oferta: '', estado: '', fechaDesde: '', fechaHasta: '', busqueda: '' }
    },
    
    exportarDatos() {
      this.showMessage('Función de exportación será implementada próximamente', 'warning')
    },
    
    // Utilidades
    getIniciales(nombre, apellido) {
      return ((nombre || '').charAt(0) + (apellido || '').charAt(0)).toUpperCase() || 'NN'
    },
    
    formatFecha(fecha) {
      return fecha ? new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
    },
    
    formatTiempoTranscurrido(fecha) {
      if (!fecha) return ''
      const dias = Math.ceil((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
      if (dias === 1) return 'Hace 1 día'
      if (dias < 7) return `Hace ${dias} días`
      if (dias < 30) return `Hace ${Math.floor(dias / 7)} semana${Math.floor(dias / 7) > 1 ? 's' : ''}`
      return `Hace ${Math.floor(dias / 30)} mes${Math.floor(dias / 30) > 1 ? 'es' : ''}`
    },
    
    getEstadoClass(estado) {
      const clases = {
        'Pendiente': 'bg-warning text-dark', 'En Revisión': 'bg-info text-white',
        'Aceptada': 'bg-success text-white', 'Rechazada': 'bg-danger text-white', 'Retirada': 'bg-secondary text-white'
      }
      return clases[estado] || 'bg-secondary text-white'
    },
    
    getEstadoIcon(estado) {
      const iconos = {
        'Pendiente': 'fas fa-clock', 'En Revisión': 'fas fa-eye', 'Aceptada': 'fas fa-check',
        'Rechazada': 'fas fa-times', 'Retirada': 'fas fa-arrow-left'
      }
      return iconos[estado] || 'fas fa-question'
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
.aplicaciones-recibidas { background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%); min-height: 100vh; }
.card { border: none; border-radius: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: all 0.2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15); }
.aplicacion-card { border-left: 4px solid #007bff; }
.aplicacion-card:hover { border-left-color: #0056b3; transform: translateY(-4px); box-shadow: 0 12px 20px rgba(0, 123, 255, 0.15); }

.avatar-circle, .avatar-circle-sm, .avatar-circle-lg {
  border-radius: 50%; background: linear-gradient(135deg, #007bff, #0056b3); color: white;
  display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;
}
.avatar-circle { width: 50px; height: 50px; font-size: 1.1rem; }
.avatar-circle-sm { width: 35px; height: 35px; font-size: 0.8rem; }
.avatar-circle-lg { width: 80px; height: 80px; font-size: 1.8rem; }

.card.bg-primary, .card.bg-warning, .card.bg-info, .card.bg-success { transition: all 0.3s ease; }
.card.bg-primary:hover, .card.bg-warning:hover, .card.bg-info:hover, .card.bg-success:hover {
  transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.badge { font-size: 0.75rem; padding: 0.4em 0.65em; font-weight: 500; border-radius: 8px; }
.btn { border-radius: 8px; font-weight: 500; transition: all 0.2s ease; }
.btn:hover { transform: translateY(-1px); }

.table th { background-color: #f8f9fa; border: none; font-weight: 600; color: #495057; padding: 1rem 0.75rem; }
.table td { border: none; padding: 1rem 0.75rem; vertical-align: middle; }
.table tbody tr { border-bottom: 1px solid #e9ecef; transition: background-color 0.2s ease; }
.table tbody tr:hover { background-color: #f8f9fc; }

.modal-content { border-radius: 15px; border: none; }
.modal-header { border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #f8f9fc, #e9ecef); }
.dropdown-menu { border-radius: 10px; border: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.dropdown-item { border-radius: 5px; margin: 0.125rem; transition: all 0.2s ease; }
.dropdown-item:hover { background-color: #f3f4f6; transform: translateX(2px); }

@media (max-width: 768px) {
  .avatar-circle { width: 40px; height: 40px; font-size: 0.9rem; }
  .btn-group .btn { padding: 0.375rem 0.5rem; font-size: 0.8rem; }
}
</style>