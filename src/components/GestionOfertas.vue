<template>
  <div class="gestion-ofertas">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-briefcase me-2 text-primary"></i>
                Mis Ofertas Laborales
              </h2>
              <p class="text-muted mb-0">Gestiona todas tus vacantes publicadas</p>
            </div>
            <button
              @click="crearNuevaOferta"
              class="btn btn-primary"
            >
              <i class="fas fa-plus me-2"></i>
              Nueva Oferta
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <h6 class="mb-0">
            <i class="fas fa-filter me-2"></i>
            Filtros y Búsqueda
          </h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <FormField
                v-model="filtros.busqueda"
                type="text"
                label="Buscar Ofertas"
                icon="fas fa-search"
                placeholder="Título, descripción, ubicación..."
                @input="filtrarOfertas"
              />
            </div>
            <div class="col-md-3">
              <FormField
                v-model="filtros.estado"
                type="select"
                label="Estado"
                icon="fas fa-flag"
                :options="estadosOptions"
                @change="filtrarOfertas"
              />
            </div>
            <div class="col-md-3">
              <FormField
                v-model="filtros.modalidad"
                type="select"
                label="Modalidad"
                icon="fas fa-building"
                :options="modalidadesOptions"
                @change="filtrarOfertas"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">&nbsp;</label>
              <div class="d-grid">
                <button
                  @click="limpiarFiltros"
                  class="btn btn-outline-secondary"
                >
                  <i class="fas fa-times me-1"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon">
              <i class="fas fa-briefcase"></i>
            </div>
            <div class="stat-content">
              <h3>{{ estadisticas.total }}</h3>
              <p>Total Ofertas</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon">
              <i class="fas fa-eye"></i>
            </div>
            <div class="stat-content">
              <h3>{{ estadisticas.activas }}</h3>
              <p>Activas</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon">
              <i class="fas fa-pause"></i>
            </div>
            <div class="stat-content">
              <h3>{{ estadisticas.pausadas }}</h3>
              <p>Pausadas</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ estadisticas.aplicaciones }}</h3>
              <p>Aplicaciones</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de ofertas -->
      <div class="card shadow-sm">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="fas fa-list me-2"></i>
            Lista de Ofertas ({{ ofertasFiltradas.length }})
          </h6>
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm"
              :class="vistaLista ? 'btn-primary' : 'btn-outline-primary'"
              @click="vistaLista = true"
            >
              <i class="fas fa-list"></i>
            </button>
            <button
              class="btn btn-sm"
              :class="!vistaLista ? 'btn-primary' : 'btn-outline-primary'"
              @click="vistaLista = false"
            >
              <i class="fas fa-th"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading state -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Cargando ofertas...</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="ofertas.length === 0" class="text-center py-5">
            <i class="fas fa-briefcase fa-4x text-muted mb-3"></i>
            <h5>No tienes ofertas publicadas</h5>
            <p class="text-muted mb-4">Comienza creando tu primera oferta laboral para atraer talento</p>
            <button @click="crearNuevaOferta" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>
              Crear Primera Oferta
            </button>
          </div>

          <!-- Vista Lista -->
          <div v-else-if="vistaLista">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Puesto</th>
                    <th>Modalidad</th>
                    <th>Salario</th>
                    <th>Estado</th>
                    <th>Aplicaciones</th>
                    <th>Publicada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="oferta in ofertasFiltradas" :key="oferta.idOferta">
                    <td>
                      <div>
                        <h6 class="mb-1">{{ oferta.tituloPuesto }}</h6>
                        <small class="text-muted">
                          <i class="fas fa-map-marker-alt me-1"></i>
                          {{ oferta.ubicacion }}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span class="badge bg-secondary">{{ oferta.modalidadEmpleo }}</span>
                    </td>
                    <td>
                      <span class="fw-bold">${{ formatearSalario(oferta.salarioMinimo) }}</span>
                      <span v-if="oferta.salarioMaximo !== oferta.salarioMinimo">
                        - ${{ formatearSalario(oferta.salarioMaximo) }}
                      </span>
                    </td>
                    <td>
                      <span 
                        class="badge"
                        :class="getEstadoBadgeClass(oferta.estadoOferta)"
                      >
                        {{ oferta.estadoOferta }}
                      </span>
                    </td>
                    <td>
                      <span class="badge bg-info">{{ oferta.aplicaciones || 0 }}</span>
                    </td>
                    <td>
                      <small class="text-muted">{{ formatearFecha(oferta.fechaPublicacion) }}</small>
                    </td>
                    <td>
                      <div class="dropdown">
                        <button
                          class="btn btn-sm btn-outline-secondary dropdown-toggle"
                          type="button"
                          :id="`dropdown${oferta.idOferta}`"
                          data-bs-toggle="dropdown"
                        >
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item" href="#" @click.prevent="verOferta(oferta)">
                              <i class="fas fa-eye me-2"></i>Ver Detalles
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="#" @click.prevent="editarOferta(oferta)">
                              <i class="fas fa-edit me-2"></i>Editar
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="#" @click.prevent="verAplicaciones(oferta)">
                              <i class="fas fa-users me-2"></i>Ver Aplicaciones
                            </a>
                          </li>
                          <li><hr class="dropdown-divider"></li>
                          <li>
                            <a 
                              class="dropdown-item"
                              :class="{ 'text-success': oferta.estadoOferta !== 'Activa', 'text-warning': oferta.estadoOferta === 'Activa' }"
                              href="#" 
                              @click.prevent="toggleEstadoOferta(oferta)"
                            >
                              <i :class="oferta.estadoOferta === 'Activa' ? 'fas fa-pause me-2' : 'fas fa-play me-2'"></i>
                              {{ oferta.estadoOferta === 'Activa' ? 'Pausar' : 'Activar' }}
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item text-danger" href="#" @click.prevent="confirmarEliminar(oferta)">
                              <i class="fas fa-trash me-2"></i>Eliminar
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Vista Cards -->
          <div v-else>
            <div class="row">
              <div 
                v-for="oferta in ofertasFiltradas" 
                :key="oferta.idOferta"
                class="col-lg-6 col-xl-4 mb-4"
              >
                <div class="card oferta-card h-100">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <span 
                      class="badge"
                      :class="getEstadoBadgeClass(oferta.estadoOferta)"
                    >
                      {{ oferta.estadoOferta }}
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="verOferta(oferta)">
                            <i class="fas fa-eye me-2"></i>Ver Detalles
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="editarOferta(oferta)">
                            <i class="fas fa-edit me-2"></i>Editar
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" @click.prevent="verAplicaciones(oferta)">
                            <i class="fas fa-users me-2"></i>Aplicaciones ({{ oferta.aplicaciones || 0 }})
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-body">
                    <h6 class="card-title">{{ oferta.tituloPuesto }}</h6>
                    <p class="card-text small text-muted">
                      {{ truncateText(oferta.descripcionPuesto, 120) }}
                    </p>
                    <div class="oferta-details">
                      <div class="detail-item">
                        <i class="fas fa-map-marker-alt text-muted me-2"></i>
                        <span>{{ oferta.ubicacion }}</span>
                      </div>
                      <div class="detail-item">
                        <i class="fas fa-briefcase text-muted me-2"></i>
                        <span>{{ oferta.modalidadEmpleo }}</span>
                      </div>
                      <div class="detail-item">
                        <i class="fas fa-dollar-sign text-muted me-2"></i>
                        <span>${{ formatearSalario(oferta.salarioMinimo) }}
                          <span v-if="oferta.salarioMaximo !== oferta.salarioMinimo">
                            - ${{ formatearSalario(oferta.salarioMaximo) }}
                          </span>
                        </span>
                      </div>
                      <div class="detail-item">
                        <i class="fas fa-calendar text-muted me-2"></i>
                        <span>{{ formatearFecha(oferta.fechaPublicacion) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">
                        <i class="fas fa-users me-1"></i>
                        {{ oferta.aplicaciones || 0 }} aplicaciones
                      </small>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="verOferta(oferta)">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-success" @click="editarOferta(oferta)">
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <p>¿Estás seguro de que deseas eliminar esta oferta laboral?</p>
              <div class="alert alert-warning">
                <strong>{{ ofertaAEliminar?.tituloPuesto }}</strong><br>
                <small>{{ ofertaAEliminar?.ubicacion }}</small>
              </div>
              <p class="text-muted small">Esta acción no se puede deshacer y se perderán todas las aplicaciones asociadas.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacion = false" :disabled="eliminando">
                Cancelar
              </button>
              <button type="button" @click="eliminarOferta" class="btn btn-danger" :disabled="eliminando">
                <span v-if="eliminando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-trash me-2"></i>
                {{ eliminando ? 'Eliminando...' : 'Eliminar Oferta' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop del modal -->
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
import api from '../services/api'

export default {
  name: 'GestionOfertas',
  components: { FormField },
  emits: ['volver-dashboard', 'crear-oferta', 'editar-oferta', 'ver-aplicaciones'],
  data() {
    return {
      loading: false,
      eliminando: false,
      mostrarConfirmacion: false,
      vistaLista: true,
      message: '',
      messageType: 'success',
      
      ofertas: [],
      ofertasFiltradas: [],
      ofertaAEliminar: null,
      empresaId: null,
      
      filtros: {
        busqueda: '',
        estado: '',
        modalidad: ''
      },
      
      estadisticas: {
        total: 0,
        activas: 0,
        pausadas: 0,
        aplicaciones: 0
      },
      
      estadosOptions: [
        { value: '', label: 'Todos los estados' },
        { value: 'Activa', label: 'Activa' },
        { value: 'Pausada', label: 'Pausada' },
        { value: 'Cerrada', label: 'Cerrada' },
        { value: 'Borrador', label: 'Borrador' }
      ],
      
      modalidadesOptions: [
        { value: '', label: 'Todas las modalidades' },
        { value: 'Presencial', label: 'Presencial' },
        { value: 'Remoto', label: 'Remoto' },
        { value: 'Híbrido', label: 'Híbrido' },
        { value: 'Medio Tiempo', label: 'Medio Tiempo' },
        { value: 'Tiempo Completo', label: 'Tiempo Completo' }
      ]
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
    console.log('💼 GestionOfertas montado - cargando datos...')
    await this.cargarEmpresaId()
    if (this.empresaId) {
      await this.cargarOfertas()
    }
  },
  
  methods: {
    async cargarEmpresaId() {
      try {
        const response = await api.get('/Empresa/todas')
        const empresas = response.data
        const empresaActual = empresas.find(emp => emp.idUsuario === this.user.idUsuario)
        
        if (empresaActual) {
          this.empresaId = empresaActual.idEmpresa
          console.log('✅ Empresa ID encontrado:', this.empresaId)
        } else {
          console.log('❌ No se encontró empresa para el usuario:', this.user?.idUsuario)
          this.showMessage('No se encontró información de tu empresa. Completa tu perfil primero.', 'warning')
        }
      } catch (error) {
        console.error('❌ Error obteniendo ID de empresa:', error)
        this.showMessage('Error al cargar información de la empresa', 'error')
      }
    },
    
    async cargarOfertas() {
  if (!this.empresaId) return;

  try {
    this.loading = true;
    console.log('📋 Cargando todas las ofertas para filtrar por empresa:', this.empresaId);

    // Petición real al backend
    const response = await api.get('/Ofertas/todas');

    // Filtramos solo las ofertas que pertenecen a la empresa actual
    this.ofertas = response.data.filter(oferta => oferta.idEmpresa === this.empresaId);

    this.ofertasFiltradas = [...this.ofertas];
    this.calcularEstadisticas();
    console.log('✅ Ofertas cargadas y filtradas:', this.ofertas.length);
  } catch (error) {
    console.error('❌ Error cargando ofertas:', error);
    this.showMessage('Error al cargar las ofertas desde el servidor', 'error');
  } finally {
    this.loading = false;
  }
}

,
    
    calcularEstadisticas() {
      this.estadisticas = {
        total: this.ofertas.length,
        activas: this.ofertas.filter(o => o.estadoOferta === 'Activa').length,
        pausadas: this.ofertas.filter(o => o.estadoOferta === 'Pausada').length,
        aplicaciones: this.ofertas.reduce((total, oferta) => total + (oferta.aplicaciones || 0), 0)
      }
    },
    
    filtrarOfertas() {
      let filtradas = [...this.ofertas]
      
      // Filtro por búsqueda
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase()
        filtradas = filtradas.filter(oferta =>
          oferta.tituloPuesto.toLowerCase().includes(busqueda) ||
          oferta.descripcionPuesto.toLowerCase().includes(busqueda) ||
          oferta.ubicacion.toLowerCase().includes(busqueda)
        )
      }
      
      // Filtro por estado
      if (this.filtros.estado) {
        filtradas = filtradas.filter(oferta => oferta.estadoOferta === this.filtros.estado)
      }
      
      // Filtro por modalidad
      if (this.filtros.modalidad) {
        filtradas = filtradas.filter(oferta => oferta.modalidadEmpleo === this.filtros.modalidad)
      }
      
      this.ofertasFiltradas = filtradas
    },
    
    limpiarFiltros() {
      this.filtros = {
        busqueda: '',
        estado: '',
        modalidad: ''
      }
      this.filtrarOfertas()
    },
    
    crearNuevaOferta() {
      console.log('➕ Creando nueva oferta...')
      this.$emit('crear-oferta')
    },
    
    verOferta(oferta) {
      console.log('👁️ Viendo oferta:', oferta.tituloPuesto)
      // TODO: Implementar modal de detalles o navegación
      this.showMessage(`Viendo detalles de: ${oferta.tituloPuesto}`, 'info')
    },
    
    editarOferta(oferta) {
      console.log('✏️ Editando oferta:', oferta.tituloPuesto)
      this.$emit('editar-oferta', oferta)
    },
    
    verAplicaciones(oferta) {
      console.log('👥 Viendo aplicaciones para:', oferta.tituloPuesto)
      this.$emit('ver-aplicaciones', oferta)
    },
    
    async toggleEstadoOferta(oferta) {
      try {
        const nuevoEstado = oferta.estadoOferta === 'Activa' ? 'Pausada' : 'Activa'
        console.log(`🔄 Cambiando estado de "${oferta.tituloPuesto}" a: ${nuevoEstado}`)
        
        // TODO: Implementar endpoint real
        // await api.put(`/Ofertas/${oferta.idOferta}/estado`, { estado: nuevoEstado })
        
        // Simulación local
        oferta.estadoOferta = nuevoEstado
        this.calcularEstadisticas()
        this.filtrarOfertas()
        
        this.showMessage(`Oferta ${nuevoEstado.toLowerCase()} exitosamente`, 'success')
        
      } catch (error) {
        console.error('❌ Error cambiando estado:', error)
        this.showMessage('Error al cambiar el estado de la oferta', 'error')
      }
    },
    
    confirmarEliminar(oferta) {
      this.ofertaAEliminar = oferta
      this.mostrarConfirmacion = true
    },
    
    async eliminarOferta() {
      if (!this.ofertaAEliminar) return
      
      try {
        this.eliminando = true
        console.log('🗑️ Eliminando oferta:', this.ofertaAEliminar.tituloPuesto)
        
        // TODO: Implementar endpoint real
        // await api.delete(`/Ofertas/${this.ofertaAEliminar.idOferta}`)
        
        // Simulación local
        const index = this.ofertas.findIndex(o => o.idOferta === this.ofertaAEliminar.idOferta)
        if (index > -1) {
          this.ofertas.splice(index, 1)
          this.calcularEstadisticas()
          this.filtrarOfertas()
        }
        
        this.mostrarConfirmacion = false
        this.ofertaAEliminar = null
        this.showMessage('Oferta eliminada exitosamente', 'success')
        
      } catch (error) {
        console.error('❌ Error eliminando oferta:', error)
        this.showMessage('Error al eliminar la oferta', 'error')
      } finally {
        this.eliminando = false
      }
    },
    
    formatearSalario(salario) {
      return new Intl.NumberFormat('es-ES').format(salario)
    },
    
    formatearFecha(fecha) {
      if (!fecha) return 'N/A'
      const date = new Date(fecha)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    
    getEstadoBadgeClass(estado) {
      const clases = {
        'Activa': 'bg-success',
        'Pausada': 'bg-warning',
        'Cerrada': 'bg-secondary',
        'Borrador': 'bg-info'
      }
      return clases[estado] || 'bg-secondary'
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
.gestion-ofertas {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

/* Stat Cards */
.stat-card {
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-content {
  flex-grow: 1;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.stat-content p {
  margin: 0;
  opacity: 0.9;
  font-weight: 500;
}

/* Cards */
.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Oferta Cards */
.oferta-card {
  transition: all 0.3s ease;
}

.oferta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.oferta-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.detail-item i {
  width: 16px;
}

/* Table */
.table {
  margin-bottom: 0;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #374151;
  background-color: #f8fafc;
}

.table td {
  vertical-align: middle;
  border-color: #e5e7eb;
}

.table-hover tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Badges */
.badge {
  font-size: 0.75rem;
  padding: 0.4em 0.8em;
  font-weight: 500;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
}

.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
}

.btn-info {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border: none;
}

/* Dropdown */
.dropdown-menu {
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
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
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 15px 15px;
}

/* Form Fields */
.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .stat-content h3 {
    font-size: 1.5rem;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .oferta-card {
    margin-bottom: 1rem;
  }
  
  .detail-item {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .gestion-ofertas .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
  }
  
  .stat-content h3 {
    font-size: 1.2rem;
  }
  
  .stat-content p {
    font-size: 0.8rem;
  }
}

/* Loading y Empty States */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Vista switcher */
.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-radius: 8px 0 0 8px;
}

.btn-group .btn:last-child {
  border-radius: 0 8px 8px 0;
}
</style>