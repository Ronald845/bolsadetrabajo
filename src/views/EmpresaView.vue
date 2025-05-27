<template>
  <div class="container-fluid">
    <!-- Pestañas de navegación -->
    <div class="row">
      <div class="col-12">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'dashboard' }" href="#" @click.prevent="currentTab = 'dashboard'">
              <i class="fas fa-home me-2"></i>Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'perfil' }" href="#" @click.prevent="currentTab = 'perfil'">
              <i class="fas fa-building me-2"></i>Mi Empresa
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'ofertas' }" href="#" @click.prevent="currentTab = 'ofertas'">
              <i class="fas fa-briefcase me-2"></i>Mis Ofertas
              <span v-if="contadorOfertas > 0" class="badge bg-primary ms-1">{{ contadorOfertas }}</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'crear-oferta' }" href="#" @click.prevent="currentTab = 'crear-oferta'">
              <i class="fas fa-plus me-2"></i>Nueva Oferta
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link search-candidates-tab" :class="{ active: currentTab === 'buscar-candidatos' }" href="#" @click.prevent="currentTab = 'buscar-candidatos'">
              <i class="fas fa-search me-2"></i>Buscar Candidatos
              <span class="badge bg-success ms-1">¡Nuevo!</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: currentTab === 'aplicaciones' }" href="#" @click.prevent="currentTab = 'aplicaciones'">
              <i class="fas fa-users me-2"></i>Candidatos
              <span v-if="contadorAplicaciones > 0" class="badge bg-warning ms-1">{{ contadorAplicaciones }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
   
    <!-- Contenido dinámico -->
    <div class="row">
      <div class="col-12">
        <!-- Dashboard -->
        <EmpresaDashboard 
          v-if="currentTab === 'dashboard'" 
          @navigate-to="handleNavigation"
          @actualizar-contadores="actualizarContadores"
        />
       
        <!-- Perfil de Empresa -->
        <PerfilEmpresa 
          v-else-if="currentTab === 'perfil'" 
          @volver-dashboard="volverDashboard"
        />
       
        <!-- Gestión de Ofertas -->
        <GestionOfertas 
          v-else-if="currentTab === 'ofertas'"
          @volver-dashboard="volverDashboard"
          @crear-oferta="handleGestionEventos('crear-oferta')"
          @editar-oferta="handleGestionEventos('editar-oferta', $event)"
          @ver-aplicaciones="handleGestionEventos('ver-aplicaciones', $event)"
          @actualizar-contadores="actualizarContadores"
        />
       
        <!-- Crear Nueva Oferta -->
        <CrearOferta 
          v-else-if="currentTab === 'crear-oferta'"
          :oferta-a-editar="ofertaParaEditar"
          @volver-dashboard="volverDashboard"
          @volver-ofertas="volverOfertas"
          @oferta-guardada="handleOfertaGuardada"
        />

        <!-- Buscar Candidatos -->
        <BusquedaCandidatos 
          v-else-if="currentTab === 'buscar-candidatos'"
          @volver-dashboard="volverDashboard"
          @contactar-candidato="handleContactoCandidato"
          @invitar-candidato="handleInvitacionCandidato"
        />
       
        <!-- Aplicaciones Recibidas -->
        <AplicacionesRecibidas 
          v-else-if="currentTab === 'aplicaciones'"
          :oferta-seleccionada="ofertaSeleccionada"
          @volver-dashboard="volverDashboard"
          @volver-ofertas="volverOfertas"
          @actualizar-contadores="actualizarContadores"
        />
        
        <!-- Componente por defecto en caso de error -->
        <div v-else class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Sección no encontrada. Regresando al dashboard...
        </div>
      </div>
    </div>

    <!-- Sistema de notificaciones principales -->
    <div v-if="showToast" class="toast-container position-fixed bottom-0 end-0 p-3">
      <div class="toast show" :class="toastClass" role="alert">
        <div class="toast-header">
          <i :class="toastIcon" class="me-2"></i>
          <strong class="me-auto">{{ toastTitle }}</strong>
          <button type="button" class="btn-close" @click="hideToast"></button>
        </div>
        <div class="toast-body">
          {{ toastMessage }}
        </div>
      </div>
    </div>

    <!-- Toast específico para búsqueda de candidatos -->
    <div v-if="showCandidateToast" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100;">
      <div class="toast show bg-success text-white" role="alert">
        <div class="toast-header bg-success text-white">
          <i class="fas fa-search me-2"></i>
          <strong class="me-auto">Búsqueda de Candidatos</strong>
          <button type="button" class="btn-close btn-close-white" @click="showCandidateToast = false"></button>
        </div>
        <div class="toast-body">
          {{ candidateToastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ✅ IMPORTACIONES EXISTENTES
import EmpresaDashboard from '../components/EmpresaDashboard.vue'
import PerfilEmpresa from '../components/PerfilEmpresa.vue'
import GestionOfertas from '../components/GestionOfertas.vue'
import CrearOferta from '../components/CrearOferta.vue'
import AplicacionesRecibidas from '../components/AplicacionesRecibidas.vue'
import BusquedaCandidatos from '../components/BusquedaCandidatos.vue'

export default {
  name: 'EmpresaView',
  components: {
    EmpresaDashboard,
    PerfilEmpresa,
    GestionOfertas,
    CrearOferta,
    AplicacionesRecibidas,
    BusquedaCandidatos
  },
  data() {
    return {
      // Navegación
      currentTab: 'dashboard',
      
      // Estados para comunicación entre componentes
      ofertaParaEditar: null,
      ofertaSeleccionada: null,
      
      // Contadores para badges en pestañas
      contadorOfertas: 0,
      contadorAplicaciones: 0,
      
      // Sistema de notificaciones optimizado
      showToast: false,
      toastMessage: '',
      toastTitle: 'Notificación',
      toastType: 'success',
      toastTimeout: null,

      // Sistema de notificaciones para candidatos
      showCandidateToast: false,
      candidateToastMessage: '',
      candidateToastTimeout: null
    }
  },
  
  computed: {
    toastClass() {
      const classes = {
        success: 'bg-success text-white',
        error: 'bg-danger text-white',
        warning: 'bg-warning text-dark',
        info: 'bg-info text-white'
      }
      return classes[this.toastType] || 'bg-primary text-white'
    },
    
    toastIcon() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[this.toastType] || 'fas fa-bell'
    }
  },
  
  methods: {
    handleNavigation(seccion, data = null) {
      console.log('🧭 Navegación recibida desde dashboard:', seccion, data)
      
      const mapeoSecciones = {
        'perfil': 'perfil',
        'mi-empresa': 'perfil',
        'ofertas': 'ofertas',
        'mis-ofertas': 'ofertas',
        'ofertas-activas': 'ofertas',
        'crear-oferta': 'crear-oferta',
        'nueva-oferta': 'crear-oferta',
        'aplicaciones': 'aplicaciones',
        'candidatos': 'aplicaciones',
        'ver-candidatos': 'aplicaciones',
        'buscar-candidatos': 'buscar-candidatos',
        'buscar-talento': 'buscar-candidatos'
      }
      
      const nuevaSeccion = mapeoSecciones[seccion] || seccion
      
      if (nuevaSeccion) {
        if (data) {
          if (seccion === 'ver-candidatos' && data.oferta) {
            this.ofertaSeleccionada = data.oferta
          }
        }
        
        this.currentTab = nuevaSeccion
        console.log('✅ Navegando a pestaña:', nuevaSeccion)

        if (nuevaSeccion === 'buscar-candidatos') {
          this.showCandidateToastMessage('¡Nueva funcionalidad! Ahora puedes buscar candidatos ideales para tu empresa')
        }
      }
    },
    
    handleGestionEventos(evento, data = null) {
      console.log('📋 Evento de gestión recibido:', evento, data)
      
      switch(evento) {
        case 'crear-oferta':
          this.ofertaParaEditar = null
          this.currentTab = 'crear-oferta'
          console.log('➕ Navegando a crear nueva oferta')
          this.showSuccessToast('Formulario de nueva oferta cargado')
          break
          
        case 'editar-oferta':
          if (data && data.idOferta) {
            this.ofertaParaEditar = data
            this.currentTab = 'crear-oferta'
            console.log('✏️ Navegando a editar oferta:', data.tituloPuesto)
            this.showInfoToast(`Editando oferta: ${data.tituloPuesto}`)
          } else {
            console.error('❌ No se recibieron datos de la oferta a editar')
            this.showErrorToast('Error: No se pudieron cargar los datos de la oferta')
          }
          break
          
        case 'ver-aplicaciones':
          if (data && data.idOferta) {
            this.ofertaSeleccionada = data
            this.currentTab = 'aplicaciones'
            console.log('👥 Navegando a ver aplicaciones para:', data.tituloPuesto)
            this.showInfoToast(`Viendo candidatos para: ${data.tituloPuesto}`)
          } else {
            console.error('❌ No se recibieron datos de la oferta para ver aplicaciones')
            this.showErrorToast('Error: No se pudieron cargar las aplicaciones')
          }
          break
          
        default:
          console.warn('⚠️ Evento no reconocido:', evento)
          this.showWarningToast(`Acción no reconocida: ${evento}`)
      }
    },

    handleContactoCandidato(candidato) {
      console.log('📧 Manejando contacto con candidato:', candidato.nombreCompleto)
      this.showCandidateToastMessage(`Preparando contacto con ${candidato.nombreCompleto}...`)
      
      setTimeout(() => {
        this.showSuccessToast(`Mensaje enviado a ${candidato.nombreCompleto}`)
      }, 2000)
    },

    handleInvitacionCandidato(candidato) {
      console.log('📨 Manejando invitación a candidato:', candidato.nombreCompleto)
      this.showCandidateToastMessage(`Invitando a ${candidato.nombreCompleto} a una de tus ofertas...`)
      
      setTimeout(() => {
        this.showSuccessToast(`Invitación enviada a ${candidato.nombreCompleto}`)
      }, 2000)
    },
    
    handleOfertaGuardada(oferta, esEdicion = false) {
      console.log('💾 Oferta guardada:', oferta, esEdicion ? '(editada)' : '(nueva)')
      
      this.ofertaParaEditar = null
      this.currentTab = 'ofertas'
      
      const mensaje = esEdicion 
        ? `Oferta "${oferta.tituloPuesto}" actualizada exitosamente`
        : `Nueva oferta "${oferta.tituloPuesto}" creada exitosamente`
      
      this.showSuccessToast(mensaje)
      
      if (!esEdicion) {
        this.contadorOfertas++
      }
    },
    
    volverDashboard() {
      console.log('🏠 Volviendo al dashboard...')
      this.currentTab = 'dashboard'
      this.limpiarEstados()
      this.showInfoToast('Regresando al dashboard principal')
    },
    
    volverOfertas() {
      console.log('📋 Volviendo a mis ofertas...')
      this.currentTab = 'ofertas'
      this.limpiarEstadosNavegacion()
      this.showInfoToast('Regresando a la gestión de ofertas')
    },
    
    limpiarEstados() {
      this.ofertaParaEditar = null
      this.ofertaSeleccionada = null
      console.log('🧹 Estados de navegación limpiados')
    },
    
    limpiarEstadosNavegacion() {
      this.ofertaParaEditar = null
      this.ofertaSeleccionada = null
    },
    
    // Sistema de notificaciones principales optimizado
    showSuccessToast(mensaje, titulo = 'Éxito') {
      this.showToastMessage(mensaje, 'success', titulo)
    },
    
    showErrorToast(mensaje, titulo = 'Error') {
      this.showToastMessage(mensaje, 'error', titulo)
    },
    
    showWarningToast(mensaje, titulo = 'Advertencia') {
      this.showToastMessage(mensaje, 'warning', titulo)
    },
    
    showInfoToast(mensaje, titulo = 'Información') {
      this.showToastMessage(mensaje, 'info', titulo)
    },
    
    showToastMessage(mensaje, tipo = 'success', titulo = 'Notificación') {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout)
      }
      
      this.toastMessage = mensaje
      this.toastType = tipo
      this.toastTitle = titulo
      this.showToast = true
      
      console.log(`🔔 Toast ${tipo.toUpperCase()}: ${mensaje}`)
      
      this.toastTimeout = setTimeout(() => {
        this.hideToast()
      }, 5000)
    },

    showCandidateToastMessage(mensaje) {
      if (this.candidateToastTimeout) {
        clearTimeout(this.candidateToastTimeout)
      }
      
      this.candidateToastMessage = mensaje
      this.showCandidateToast = true
      
      console.log(`🔔 Candidate Toast: ${mensaje}`)
      
      this.candidateToastTimeout = setTimeout(() => {
        this.showCandidateToast = false
      }, 6000)
    },
    
    hideToast() {
      this.showToast = false
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout)
        this.toastTimeout = null
      }
    },
    
    actualizarContadores(datos = {}) {
      const { ofertas = this.contadorOfertas, aplicaciones = this.contadorAplicaciones } = datos
      
      console.log('📊 Actualizando contadores:', { ofertas, aplicaciones })
      
      this.contadorOfertas = ofertas
      this.contadorAplicaciones = aplicaciones
    }
  },
  
  watch: {
    currentTab(nuevaTab, tabAnterior) {
      console.log(`🔄 Cambio de pestaña: ${tabAnterior} → ${nuevaTab}`)
      
      if (nuevaTab === 'buscar-candidatos' && tabAnterior !== 'buscar-candidatos') {
        console.log('🔍 Entrando por primera vez a búsqueda de candidatos')
        
        setTimeout(() => {
          this.showCandidateToastMessage('💡 Tip: Usa los filtros avanzados para encontrar candidatos más específicos')
        }, 3000)
      }
    }
  },
  
  mounted() {
    console.log('🏢 EmpresaView montado exitosamente')
    
    setTimeout(() => {
      this.actualizarContadores({ ofertas: 5, aplicaciones: 12 })
    }, 1000)

    setTimeout(() => {
      this.showCandidateToastMessage('🎉 ¡Nueva funcionalidad disponible! Ahora puedes buscar candidatos ideales')
    }, 2000)
  },
  
  beforeUnmount() {
    console.log('🏢 EmpresaView desmontándose...')
    
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout)
    }

    if (this.candidateToastTimeout) {
      clearTimeout(this.candidateToastTimeout)
    }
    
    this.limpiarEstados()
  }
}
</script>

<style scoped>
/* === ESTILOS DE PESTAÑAS OPTIMIZADOS === */
.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.75rem 1rem;
}

.nav-tabs .nav-link:hover:not(.disabled) {
  color: #007bff;
  border-bottom-color: #007bff;
  transform: translateY(-2px);
  background: rgba(0, 123, 255, 0.05);
}

.nav-tabs .nav-link.active {
  color: #007bff;
  background: none;
  border-bottom-color: #007bff;
  font-weight: 600;
}

.nav-tabs .nav-link.disabled {
  color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.6;
}

.nav-tabs .nav-link.disabled:hover {
  transform: none;
  border-bottom-color: transparent;
  background: none;
}

/* ESTILOS ESPECIALES PARA BÚSQUEDA DE CANDIDATOS */
.search-candidates-tab {
  position: relative;
  background: linear-gradient(135deg, transparent 0%, rgba(40, 167, 69, 0.05) 100%);
}

.search-candidates-tab:hover,
.search-candidates-tab.active {
  color: #28a745 !important;
  border-bottom-color: #28a745 !important;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%);
}

.search-candidates-tab::after {
  background: linear-gradient(90deg, #28a745, #20c997) !important;
}

.search-candidates-tab .badge.bg-success {
  background: linear-gradient(135deg, #28a745, #20c997) !important;
  animation: pulse-success 2s infinite;
}

@keyframes pulse-success {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.nav-tabs {
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

/* === BADGES EN PESTAÑAS === */
.nav-tabs .nav-link .badge {
  font-size: 0.6rem;
  padding: 0.2em 0.4em;
  font-weight: 600;
  border-radius: 12px;
  position: relative;
  top: -2px;
}

/* === INDICADOR DE PROGRESO EN PESTAÑAS === */
.nav-tabs .nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-tabs .nav-link.active::after {
  width: 100%;
}

/* === ANIMACIÓN ENTRE PESTAÑAS === */
.container-fluid > .row:last-child {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === SISTEMA DE TOASTS OPTIMIZADO === */
.toast-container { z-index: 1055; }

.toast {
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 350px;
}

.toast.bg-success { background: linear-gradient(135deg, #28a745, #20c997) !important; }
.toast.bg-danger { background: linear-gradient(135deg, #dc3545, #e74c3c) !important; }
.toast.bg-warning { background: linear-gradient(135deg, #ffc107, #f39c12) !important; }
.toast.bg-info { background: linear-gradient(135deg, #17a2b8, #3498db) !important; }

.toast-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.toast-body { font-weight: 500; }

.toast-container .toast.bg-success {
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .nav-tabs { flex-wrap: wrap; }
  .nav-item { margin-bottom: 0.25rem; }
  .nav-link { padding: 0.5rem 0.75rem; font-size: 0.9rem; }
  .nav-tabs .nav-link .badge { font-size: 0.55rem; padding: 0.15em 0.35em; }
}

@media (max-width: 576px) {
  .nav-tabs .nav-link { font-size: 0.8rem; padding: 0.4rem 0.6rem; }
  .nav-tabs .nav-link i { display: none; }
  .nav-tabs .nav-link .badge { font-size: 0.5rem; padding: 0.1em 0.3em; }
  .toast { max-width: 280px; font-size: 0.9rem; }
  .search-candidates-tab { font-weight: 600; }
}

/* === UTILIDADES === */
.container-fluid {
  background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%);
  min-height: 100vh;
  padding-bottom: 2rem;
}

.search-candidates-tab .badge {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 5px rgba(40, 167, 69, 0.5); }
  to { box-shadow: 0 0 10px rgba(40, 167, 69, 0.8); }
}

/* === ACCESIBILIDAD === */
.nav-link:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.search-candidates-tab:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* === PREVENT LAYOUT SHIFT === */
.nav-tabs .nav-link {
  min-height: 42px;
  display: flex;
  align-items: center;
}

/* === TRANSICIONES SUAVES === */
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

/* === OPTIMIZACIONES DE RENDIMIENTO === */
.container-fluid * { will-change: auto; }
.nav-tabs .nav-link { contain: layout style; }
</style>