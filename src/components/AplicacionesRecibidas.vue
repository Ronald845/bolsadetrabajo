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
                <i class="fas fa-file-excel me-2"></i>
                Exportar
              </button>
              <button @click="$emit('volver-ofertas')" class="btn btn-outline-primary">
                <i class="fas fa-arrow-left me-2"></i>
                Mis Ofertas
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <FormField
                v-model="filtros.oferta"
                type="select"
                label="Filtrar por Oferta"
                icon="fas fa-briefcase"
                :options="ofertasOptions"
                placeholder="Todas las ofertas"
              />
            </div>
            <div class="col-md-3">
              <FormField
                v-model="filtros.estado"
                type="select"
                label="Estado"
                icon="fas fa-filter"
                :options="estadosOptions"
                placeholder="Todos los estados"
              />
            </div>
            <div class="col-md-3">
              <FormField
                v-model="filtros.fechaDesde"
                type="date"
                label="Fecha Desde"
                icon="fas fa-calendar"
                :max="fechaHoy"
              />
            </div>
            <div class="col-md-3">
              <FormField
                v-model="filtros.fechaHasta"
                type="date"
                label="Fecha Hasta"
                icon="fas fa-calendar"
                :max="fechaHoy"
                :min="filtros.fechaDesde"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-6">
              <FormField
                v-model="filtros.busqueda"
                label="Buscar Candidato"
                icon="fas fa-search"
                placeholder="Nombre, email, puesto..."
              />
            </div>
            <div class="col-md-6 d-flex align-items-end">
              <button @click="limpiarFiltros" class="btn btn-outline-secondary me-2">
                <i class="fas fa-times me-2"></i>
                Limpiar
              </button>
              <button @click="aplicarFiltros" class="btn btn-primary">
                <i class="fas fa-filter me-2"></i>
                Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <i class="fas fa-envelope fa-2x mb-2"></i>
              <h4>{{ estadisticas.total }}</h4>
              <small>Total Aplicaciones</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <i class="fas fa-clock fa-2x mb-2"></i>
              <h4>{{ estadisticas.pendientes }}</h4>
              <small>Pendientes</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body text-center">
              <i class="fas fa-eye fa-2x mb-2"></i>
              <h4>{{ estadisticas.revisadas }}</h4>
              <small>En Revisión</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <i class="fas fa-check fa-2x mb-2"></i>
              <h4>{{ estadisticas.aceptadas }}</h4>
              <small>Aceptadas</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de aplicaciones -->
      <div class="card shadow-sm">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-list me-2"></i>
              Aplicaciones ({{ aplicacionesFiltradas.length }})
            </h5>
            <div class="d-flex gap-2">
              <select v-model="vista" class="form-select form-select-sm" style="width: auto;">
                <option value="tarjetas">Vista Tarjetas</option>
                <option value="tabla">Vista Tabla</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando aplicaciones...</p>
          </div>

          <!-- Sin datos -->
          <div v-else-if="aplicacionesFiltradas.length === 0" class="text-center py-5">
            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5>No hay aplicaciones</h5>
            <p class="text-muted">
              {{ aplicaciones.length === 0 
                ? 'Aún no has recibido aplicaciones para tus ofertas.' 
                : 'No hay aplicaciones que coincidan con los filtros aplicados.' 
              }}
            </p>
          </div>

          <!-- Vista Tarjetas -->
          <div v-else-if="vista === 'tarjetas'" class="row">
            <div 
              v-for="aplicacion in aplicacionesFiltradas" 
              :key="aplicacion.idAplicacion"
              class="col-lg-6 col-xl-4 mb-4"
            >
              <div class="card aplicacion-card h-100">
                <div class="card-body">
                  <!-- Header de la tarjeta -->
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle me-3">
                        {{ getIniciales(aplicacion.aspirante?.primerNombre, aplicacion.aspirante?.primerApellido) }}
                      </div>
                      <div>
                        <h6 class="mb-1">
                          {{ aplicacion.aspirante?.primerNombre }} 
                          {{ aplicacion.aspirante?.primerApellido }}
                        </h6>
                        <small class="text-muted">
                          {{ aplicacion.aspirante?.puestoBusca || 'Profesional' }}
                        </small>
                      </div>
                    </div>
                    <div class="dropdown">
                      <button 
                        class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                        type="button" 
                        :id="`dropdown${aplicacion.idAplicacion}`"
                        data-bs-toggle="dropdown"
                      >
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="verPerfil(aplicacion.aspirante)">
                            <i class="fas fa-user me-2"></i>Ver Perfil
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="contactarCandidato(aplicacion)">
                            <i class="fas fa-envelope me-2"></i>Contactar
                          </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <a class="dropdown-item text-danger" href="#" @click.prevent="rechazarAplicacion(aplicacion)">
                            <i class="fas fa-times me-2"></i>Rechazar
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Información de la oferta -->
                  <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-briefcase text-primary me-2"></i>
                      <small class="text-primary fw-medium">
                        {{ aplicacion.oferta?.tituloPuesto }}
                      </small>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-calendar text-muted me-2"></i>
                      <small class="text-muted">
                        Aplicó {{ formatFecha(aplicacion.fechaAplicacion) }}
                      </small>
                    </div>
                  </div>

                  <!-- Estado -->
                  <div class="mb-3">
                    <span class="badge" :class="getEstadoClass(aplicacion.estado)">
                      <i :class="getEstadoIcon(aplicacion.estado)" class="me-1"></i>
                      {{ aplicacion.estado }}
                    </span>
                  </div>

                  <!-- Acciones -->
                  <div class="d-flex gap-2">
                    <button 
                      v-if="aplicacion.estado === 'Pendiente'"
                      @click="cambiarEstado(aplicacion, 'En Revisión')"
                      class="btn btn-sm btn-warning flex-fill"
                    >
                      <i class="fas fa-eye me-1"></i>
                      Revisar
                    </button>
                    <button 
                      v-if="['Pendiente', 'En Revisión'].includes(aplicacion.estado)"
                      @click="cambiarEstado(aplicacion, 'Aceptada')"
                      class="btn btn-sm btn-success flex-fill"
                    >
                      <i class="fas fa-check me-1"></i>
                      Aceptar
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
                  <th>Candidato</th>
                  <th>Oferta</th>
                  <th>Fecha Aplicación</th>
                  <th>Estado</th>
                  <th width="150">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aplicacion in aplicacionesFiltradas" :key="aplicacion.idAplicacion">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle-sm me-2">
                        {{ getIniciales(aplicacion.aspirante?.primerNombre, aplicacion.aspirante?.primerApellido) }}
                      </div>
                      <div>
                        <div class="fw-medium">
                          {{ aplicacion.aspirante?.primerNombre }} 
                          {{ aplicacion.aspirante?.primerApellido }}
                        </div>
                        <small class="text-muted">
                          {{ aplicacion.aspirante?.puestoBusca || 'Profesional' }}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="fw-medium">{{ aplicacion.oferta?.tituloPuesto }}</div>
                    <small class="text-muted">{{ aplicacion.oferta?.modalidadEmpleo }}</small>
                  </td>
                  <td>
                    <div>{{ formatFecha(aplicacion.fechaAplicacion) }}</div>
                    <small class="text-muted">{{ formatTiempoTranscurrido(aplicacion.fechaAplicacion) }}</small>
                  </td>
                  <td>
                    <span class="badge" :class="getEstadoClass(aplicacion.estado)">
                      <i :class="getEstadoIcon(aplicacion.estado)" class="me-1"></i>
                      {{ aplicacion.estado }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button 
                        @click="verPerfil(aplicacion.aspirante)"
                        class="btn btn-outline-primary"
                        title="Ver perfil"
                      >
                        <i class="fas fa-user"></i>
                      </button>
                      <button 
                        v-if="aplicacion.estado === 'Pendiente'"
                        @click="cambiarEstado(aplicacion, 'En Revisión')"
                        class="btn btn-outline-warning"
                        title="Marcar en revisión"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        v-if="['Pendiente', 'En Revisión'].includes(aplicacion.estado)"
                        @click="cambiarEstado(aplicacion, 'Aceptada')"
                        class="btn btn-outline-success"
                        title="Aceptar candidato"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                      <div class="btn-group">
                        <button 
                          class="btn btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          data-bs-toggle="dropdown"
                        >
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item" href="#" @click.prevent="contactarCandidato(aplicacion)">
                              <i class="fas fa-envelope me-2"></i>Contactar
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item text-danger" href="#" @click.prevent="rechazarAplicacion(aplicacion)">
                              <i class="fas fa-times me-2"></i>Rechazar
                            </a>
                          </li>
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
      <div class="modal fade" :class="{ show: mostrarPerfilModal }" :style="{ display: mostrarPerfilModal ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-user me-2"></i>
                Perfil de {{ candidatoSeleccionado?.primerNombre }} {{ candidatoSeleccionado?.primerApellido }}
              </h5>
              <button type="button" class="btn-close" @click="cerrarPerfilModal"></button>
            </div>
            <div class="modal-body">
              <!-- Contenido del perfil del candidato -->
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
                    <strong>Próximamente:</strong> Vista completa del perfil del candidato con formación, experiencia y habilidades.
                  </div>
                  
                  <!-- Información básica por ahora -->
                  <div class="card">
                    <div class="card-header">
                      <h6 class="mb-0">Información Básica</h6>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-sm-6">
                          <strong>Nombre Completo:</strong><br>
                          {{ candidatoSeleccionado.primerNombre }} 
                          {{ candidatoSeleccionado.segundoNombre || '' }}
                          {{ candidatoSeleccionado.primerApellido }}
                          {{ candidatoSeleccionado.segundoApellido || '' }}
                        </div>
                        <div class="col-sm-6">
                          <strong>Puesto que Busca:</strong><br>
                          {{ candidatoSeleccionado.puestoBusca || 'No especificado' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarPerfilModal">
                Cerrar
              </button>
              <button type="button" class="btn btn-primary" @click="contactarCandidato(aplicacionSeleccionada)">
                <i class="fas fa-envelope me-2"></i>
                Contactar Candidato
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop del modal -->
      <div v-if="mostrarPerfilModal" class="modal-backdrop fade show" @click="cerrarPerfilModal"></div>

      <!-- Mensaje -->
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
      vista: 'tarjetas', // 'tarjetas' o 'tabla'
      
      aplicaciones: [],
      ofertas: [],
      empresaId: null,
      
      // Filtros
      filtros: {
        oferta: '',
        estado: '',
        fechaDesde: '',
        fechaHasta: '',
        busqueda: ''
      },
      
      // Modal
      mostrarPerfilModal: false,
      candidatoSeleccionado: null,
      aplicacionSeleccionada: null,
      
      // Estados posibles de aplicaciones
      estadosDisponibles: [
        'Pendiente',
        'En Revisión', 
        'Aceptada',
        'Rechazada',
        'Retirada'
      ]
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    fechaHoy() {
      return new Date().toISOString().split('T')[0]
    },
    
    ofertasOptions() {
      return this.ofertas.map(oferta => ({
        value: oferta.idOferta,
        label: oferta.tituloPuesto
      }))
    },
    
    estadosOptions() {
      return this.estadosDisponibles.map(estado => ({
        value: estado,
        label: estado
      }))
    },
    
    aplicacionesFiltradas() {
      return this.aplicaciones.filter(aplicacion => {
        // Filtro por oferta
        if (this.filtros.oferta && aplicacion.idOferta !== parseInt(this.filtros.oferta)) {
          return false
        }
        
        // Filtro por estado
        if (this.filtros.estado && aplicacion.estado !== this.filtros.estado) {
          return false
        }
        
        // Filtro por fecha desde
        if (this.filtros.fechaDesde) {
          const fechaAplicacion = new Date(aplicacion.fechaAplicacion)
          const fechaDesde = new Date(this.filtros.fechaDesde)
          if (fechaAplicacion < fechaDesde) return false
        }
        
        // Filtro por fecha hasta
        if (this.filtros.fechaHasta) {
          const fechaAplicacion = new Date(aplicacion.fechaAplicacion)
          const fechaHasta = new Date(this.filtros.fechaHasta)
          if (fechaAplicacion > fechaHasta) return false
        }
        
        // Filtro por búsqueda
        if (this.filtros.busqueda) {
          const busqueda = this.filtros.busqueda.toLowerCase()
          const nombreCompleto = `${aplicacion.aspirante?.primerNombre} ${aplicacion.aspirante?.primerApellido}`.toLowerCase()
          const puesto = (aplicacion.aspirante?.puestoBusca || '').toLowerCase()
          const tituloOferta = (aplicacion.oferta?.tituloPuesto || '').toLowerCase()
          
          return nombreCompleto.includes(busqueda) || 
                 puesto.includes(busqueda) || 
                 tituloOferta.includes(busqueda)
        }
        
        return true
      })
    },
    
    estadisticas() {
      const stats = {
        total: this.aplicaciones.length,
        pendientes: 0,
        revisadas: 0,
        aceptadas: 0,
        rechazadas: 0
      }
      
      this.aplicaciones.forEach(app => {
        switch(app.estado) {
          case 'Pendiente':
            stats.pendientes++
            break
          case 'En Revisión':
            stats.revisadas++
            break
          case 'Aceptada':
            stats.aceptadas++
            break
          case 'Rechazada':
            stats.rechazadas++
            break
        }
      })
      
      return stats
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
    console.log('👥 AplicacionesRecibidas montado')
    await this.cargarEmpresaId()
    if (this.empresaId) {
      await this.cargarDatos()
    }
  },
  
  methods: {
    async cargarEmpresaId() {
      try {
        console.log('🔍 Buscando empresa para usuario:', this.user?.idUsuario)
        
        const response = await api.get('/Empresa/todas')
        console.log('🏢 Empresas encontradas:', response.data)
        
        const empresaActual = response.data.find(emp => emp.idUsuario === this.user.idUsuario)
        
        if (empresaActual) {
          this.empresaId = empresaActual.idEmpresa
          console.log('✅ Empresa ID encontrado:', this.empresaId)
        } else {
          console.log('❌ No se encontró empresa para el usuario:', this.user?.idUsuario)
          this.showMessage('No se encontró tu perfil de empresa. Contacta al administrador.', 'error')
        }
        
      } catch (error) {
        console.error('❌ Error obteniendo ID de empresa:', error)
        this.showMessage('Error al cargar tu perfil de empresa', 'error')
      }
    },
    
    async cargarDatos() {
      try {
        this.loading = true
        console.log('📋 Cargando datos para empresa:', this.empresaId)
        
        await Promise.all([
          this.cargarOfertas(),
          this.cargarAplicaciones()
        ])
        
      } catch (error) {
        console.error('❌ Error cargando datos:', error)
        this.showMessage('Error al cargar los datos', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async cargarOfertas() {
      try {
        const response = await api.get('/Ofertas/todas')
        // Filtrar solo las ofertas de la empresa actual
        this.ofertas = response.data.filter(oferta => oferta.idEmpresa === this.empresaId)
        console.log('💼 Ofertas de la empresa:', this.ofertas)
        
      } catch (error) {
        console.error('❌ Error cargando ofertas:', error)
      }
    },
    
    async cargarAplicaciones() {
      try {
        const response = await api.get('/Aplicaciones/todos')
        console.log('📨 Todas las aplicaciones:', response.data)
        
        // Filtrar aplicaciones para las ofertas de esta empresa
        const ofertasIds = this.ofertas.map(o => o.idOferta)
        let aplicacionesEmpresa = response.data.filter(app => ofertasIds.includes(app.idOferta))
        
        // Enriquecer aplicaciones con datos de ofertas y aspirantes
        for (let aplicacion of aplicacionesEmpresa) {
          // Agregar datos de la oferta
          aplicacion.oferta = this.ofertas.find(o => o.idOferta === aplicacion.idOferta)
          
          // Agregar datos del aspirante
          try {
            const aspiranteResponse = await api.get(`/Aspirante/${aplicacion.idAspirante}`)
            aplicacion.aspirante = aspiranteResponse.data
          } catch (error) {
            console.warn(`⚠️ No se pudo cargar aspirante ${aplicacion.idAspirante}:`, error)
            aplicacion.aspirante = {
              primerNombre: 'Usuario',
              primerApellido: 'Desconocido',
              puestoBusca: 'No especificado'
            }
          }
        }
        
        this.aplicaciones = aplicacionesEmpresa
        console.log('✅ Aplicaciones procesadas:', this.aplicaciones)
        
      } catch (error) {
        console.error('❌ Error cargando aplicaciones:', error)
      }
    },
    
    async cambiarEstado(aplicacion, nuevoEstado) {
      try {
        console.log(`📝 Cambiando estado de aplicación ${aplicacion.idAplicacion} a ${nuevoEstado}`)
        
        const aplicacionData = {
          idAplicacion: aplicacion.idAplicacion,
          idOferta: aplicacion.idOferta,
          idAspirante: aplicacion.idAspirante,
          fechaAplicacion: aplicacion.fechaAplicacion,
          estado: nuevoEstado
        }
        
        await api.put('/Aplicaciones/editar', aplicacionData)
        
        // Actualizar localmente
        aplicacion.estado = nuevoEstado
        
        this.showMessage(`Aplicación marcada como ${nuevoEstado}`, 'success')
        
      } catch (error) {
        console.error('❌ Error cambiando estado:', error)
        this.showMessage('Error al cambiar el estado de la aplicación', 'error')
      }
    },
    
    verPerfil(aspirante) {
      console.log('👤 Viendo perfil de:', aspirante)
      this.candidatoSeleccionado = aspirante
      this.mostrarPerfilModal = true
    },
    
    cerrarPerfilModal() {
      this.mostrarPerfilModal = false
      this.candidatoSeleccionado = null
      this.aplicacionSeleccionada = null
    },
    
    contactarCandidato(aplicacion) {
      console.log('📧 Contactando candidato:', aplicacion.aspirante)
      // TODO: Implementar sistema de mensajería o abrir cliente de email
      this.showMessage('Función de contacto será implementada próximamente', 'warning')
    },
    
    async rechazarAplicacion(aplicacion) {
      if (confirm(`¿Estás seguro de rechazar la aplicación de ${aplicacion.aspirante?.primerNombre} ${aplicacion.aspirante?.primerApellido}?`)) {
        await this.cambiarEstado(aplicacion, 'Rechazada')
      }
    },
    
    aplicarFiltros() {
      console.log('🔍 Aplicando filtros:', this.filtros)
      // Los filtros se aplican automáticamente via computed property
    },
    
    limpiarFiltros() {
      this.filtros = {
        oferta: '',
        estado: '',
        fechaDesde: '',
        fechaHasta: '',
        busqueda: ''
      }
      console.log('🧹 Filtros limpiados')
    },
    
    exportarDatos() {
      console.log('📊 Exportando datos...')
      // TODO: Implementar exportación a Excel
      this.showMessage('Función de exportación será implementada próximamente', 'warning')
    },
    
    // Utilidades
    getIniciales(nombre, apellido) {
      const n = (nombre || '').charAt(0).toUpperCase()
      const a = (apellido || '').charAt(0).toUpperCase()
      return n + a || 'NN'
    },
    
    formatFecha(fecha) {
      if (!fecha) return ''
      const date = new Date(fecha)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    formatTiempoTranscurrido(fecha) {
      if (!fecha) return ''
      
      const ahora = new Date()
      const fechaAplicacion = new Date(fecha)
      const diffTime = Math.abs(ahora - fechaAplicacion)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        return 'Hace 1 día'
      } else if (diffDays < 7) {
        return `Hace ${diffDays} días`
      } else if (diffDays < 30) {
        const semanas = Math.floor(diffDays / 7)
        return `Hace ${semanas} semana${semanas > 1 ? 's' : ''}`
      } else if (diffDays < 365) {
        const meses = Math.floor(diffDays / 30)
        return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`
      } else {
        const años = Math.floor(diffDays / 365)
        return `Hace ${años} año${años > 1 ? 's' : ''}`
      }
    },
    
    getEstadoClass(estado) {
      const clases = {
        'Pendiente': 'bg-warning text-dark',
        'En Revisión': 'bg-info text-white',
        'Aceptada': 'bg-success text-white',
        'Rechazada': 'bg-danger text-white',
        'Retirada': 'bg-secondary text-white'
      }
      return clases[estado] || 'bg-secondary text-white'
    },
    
    getEstadoIcon(estado) {
      const iconos = {
        'Pendiente': 'fas fa-clock',
        'En Revisión': 'fas fa-eye',
        'Aceptada': 'fas fa-check',
        'Rechazada': 'fas fa-times',
        'Retirada': 'fas fa-arrow-left'
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
.aplicaciones-recibidas {
  background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Cards y Tarjetas */
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

.aplicacion-card {
  border-left: 4px solid #007bff;
  transition: all 0.3s ease;
}

.aplicacion-card:hover {
  border-left-color: #0056b3;
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 123, 255, 0.15);
}

/* Avatares */
.avatar-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.avatar-circle-sm {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.avatar-circle-lg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.8rem;
}

/* Estadísticas */
.card.bg-primary,
.card.bg-warning,
.card.bg-info,
.card.bg-success {
  transition: all 0.3s ease;
}

.card.bg-primary:hover,
.card.bg-warning:hover,
.card.bg-info:hover,
.card.bg-success:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Badges */
.badge {
  font-size: 0.75rem;
  padding: 0.4em 0.65em;
  font-weight: 500;
  border-radius: 8px;
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

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-radius: 8px 0 0 8px;
}

.btn-group .btn:last-child {
  border-radius: 0 8px 8px 0;
}

/* Tabla */
.table {
  border-radius: 12px;
  overflow: hidden;
}

.table th {
  background-color: #f8f9fa;
  border: none;
  font-weight: 600;
  color: #495057;
  padding: 1rem 0.75rem;
}

.table td {
  border: none;
  padding: 1rem 0.75rem;
  vertical-align: middle;
}

.table tbody tr {
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fc;
}

/* Modal */
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
  background: linear-gradient(135deg, #f8f9fc, #e9ecef);
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 15px 15px;
}

/* Filtros */
.card-body {
  padding: 1.5rem;
}

/* Dropdowns */
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

/* Responsive */
@media (max-width: 768px) {
  .aplicacion-card {
    margin-bottom: 1rem;
  }
  
  .avatar-circle {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  
  .btn-group .btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .avatar-circle-sm {
    width: 30px;
    height: 30px;
    font-size: 0.7rem;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    border-radius: 8px !important;
    margin-bottom: 0.25rem;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.aplicacion-card {
  animation: fadeIn 0.3s ease-in-out;
}

/* Estados específicos */
.badge.bg-warning {
  background-color: #ffc107 !important;
  color: #000 !important;
}

.badge.bg-info {
  background-color: #17a2b8 !important;
}

.badge.bg-success {
  background-color: #28a745 !important;
}

.badge.bg-danger {
  background-color: #dc3545 !important;
}

.badge.bg-secondary {
  background-color: #6c757d !important;
}

/* Efectos hover para las tarjetas de estadísticas */
.card.bg-primary { background: linear-gradient(135deg, #007bff, #0056b3) !important; }
.card.bg-warning { background: linear-gradient(135deg, #ffc107, #e0a800) !important; }
.card.bg-info { background: linear-gradient(135deg, #17a2b8, #138496) !important; }
.card.bg-success { background: linear-gradient(135deg, #28a745, #1e7e34) !important; }

/* Gap utility para espaciado */
.gap-2 {
  gap: 0.5rem;
}

/* Form select personalizado */
.form-select {
  border-radius: 8px;
  border: 1px solid #ced4da;
  transition: all 0.2s ease;
}

.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Loader */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>