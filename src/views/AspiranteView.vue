<template>
  <div class="container-fluid">
    <!-- Pestañas -->
    <div class="row">
      <div class="col-12">
        <ul class="nav nav-tabs mb-4">
          <li v-for="tab in tabsConfig" :key="tab.id" class="nav-item">
            <a class="nav-link" :class="[{ active: currentTab === tab.id }, tab.class, { 'has-notification': tab.hasNotification && tab.hasNotification() }]"
              href="#" @click.prevent="cambiarTab(tab.id)">
              <i :class="`${tab.icon} me-2`"></i>{{ tab.label }}
              <span v-if="tab.badge && tab.badge()" class="badge bg-danger ms-1">{{ tab.badge() }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Contenido dinámico -->
    <div class="row">
      <div class="col-12">
        <component :is="currentComponent" v-bind="currentComponentProps"
          @cambiar-tab="cambiarTab" @ver-detalle="verDetalleOferta" @aplicar-exitosa="onAplicacionExitosa"
          @ir-ofertas="currentTab = 'ofertas'" @ver-oferta="verDetalleOferta" />
      </div>
    </div>

    <!-- Modal de Detalle -->
    <DetalleOferta v-if="mostrarDetalleOferta && ofertaSeleccionada" :oferta="ofertaSeleccionada"
      :ya-aplicado="yaAplicado(ofertaSeleccionada?.idOferta)" :aspirante-id="aspiranteId"
      @cerrar="cerrarDetalleOferta" @aplicar-exitosa="onAplicacionExitosa" />

    <!-- Notificaciones -->
    <div v-for="(notif, index) in notificacionesActivas" :key="index"
      class="position-fixed top-0 end-0 p-3" :style="{ zIndex: 1100, marginTop: `${index * 80}px` }">
      <div class="toast show">
        <div class="toast-header" :class="notif.headerClass">
          <i :class="notif.icon" class="me-2"></i>
          <strong class="me-auto">{{ notif.titulo }}</strong>
          <button type="button" :class="notif.closeClass" @click="cerrarNotificacion(index)"></button>
        </div>
        <div class="toast-body">{{ notif.mensaje }}</div>
      </div>
    </div>

    <!-- Indicador de sistema -->
    <div class="system-status" v-if="sistemaActivo">
      <div class="status-indicator" :class="{ 'online': conectadoAPI, 'offline': !conectadoAPI }"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AspiranteDashboard from '../components/AspiranteDashboard.vue'
import PerfilAspirante from '../components/PerfilAspirante.vue'
import FormacionAcademica from '../components/FormacionAcademica.vue'
import ExperienciaLaboral from '../components/ExperienciaLaboral.vue'
import Habilidades from '../components/Habilidades.vue'
import Certificaciones from '../components/Certificaciones.vue'
import Logros from '../components/Logros.vue'
import EstadisticasAspirante from '../components/EstadisticasAspirante.vue'
import ListaOfertas from '../components/ListaOfertas.vue'
import MisAplicaciones from '../components/MisAplicaciones.vue'
import DetalleOferta from '../components/DetalleOferta.vue'
import api from '../services/api'

export default {
  name: 'AspiranteView',
  components: {
    AspiranteDashboard, PerfilAspirante, FormacionAcademica, ExperienciaLaboral,
    Habilidades, Certificaciones, Logros, EstadisticasAspirante,
    ListaOfertas, MisAplicaciones, DetalleOferta
  },
  
  data() {
    return {
      currentTab: 'dashboard',
      
      // Control principal
      mostrarDetalleOferta: false, ofertaSeleccionada: null, aspiranteId: null, misAplicaciones: [],
      
      // Notificaciones
      notificaciones: { aplicacion: false, estado: null, estadisticas: false },
      
      // Estadísticas
      estadisticasAplicaciones: { total: 0, nuevas: 0, enRevision: 0, aceptadas: 0 },
      metricas: { tiempoSesion: 0, cambiosPerfil: 0, vistasOfertas: 0, aplicacionesEnviadas: 0 },
      
      // Sistema
      sistemaActivo: true, conectadoAPI: true, intervalId: null, intervalEstadisticasId: null,
      configuracion: { notificacionesActivas: true, actualizacionAutomatica: true, intervalorFrecuencia: 5 },
      
      // Configuración de pestañas
      tabsConfig: [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', component: 'AspiranteDashboard' },
        { id: 'perfil', label: 'Mi Perfil', icon: 'fas fa-user', component: 'PerfilAspirante' },
        { id: 'formacion', label: 'Formación', icon: 'fas fa-graduation-cap', component: 'FormacionAcademica' },
        { id: 'experiencia', label: 'Experiencia', icon: 'fas fa-briefcase', component: 'ExperienciaLaboral' },
        { id: 'habilidades', label: 'Habilidades', icon: 'fas fa-tools', component: 'Habilidades' },
        { id: 'certificaciones', label: 'Certificaciones', icon: 'fas fa-certificate', component: 'Certificaciones' },
        { id: 'logros', label: 'Logros', icon: 'fas fa-trophy', component: 'Logros' },
        { id: 'estadisticas', label: 'Estadísticas', icon: 'fas fa-chart-line', component: 'EstadisticasAspirante', class: 'analytics-tab' },
        { id: 'ofertas', label: 'Buscar Ofertas', icon: 'fas fa-search', component: 'ListaOfertas', class: 'offers-tab' },
        { 
          id: 'aplicaciones', label: 'Mis Aplicaciones', icon: 'fas fa-paper-plane', component: 'MisAplicaciones', class: 'offers-tab',
          hasNotification: () => this.estadisticasAplicaciones.nuevas > 0,
          badge: () => this.estadisticasAplicaciones.nuevas > 0 ? this.estadisticasAplicaciones.nuevas : null
        }
      ],
      
      // Tipos de notificación
      tiposNotificacion: {
        aplicacion: {
          titulo: '¡Aplicación Enviada!', mensaje: 'Tu aplicación ha sido enviada exitosamente.',
          icon: 'fas fa-check-circle text-white', headerClass: 'bg-success text-white', 
          closeClass: 'btn-close btn-close-white', duracion: 5000
        },
        estadisticas: {
          titulo: '¡Estadísticas Actualizadas!', mensaje: 'Revisa tu progreso y nuevas recomendaciones.',
          icon: 'fas fa-chart-line text-white', headerClass: 'bg-info text-white',
          closeClass: 'btn-close btn-close-white', duracion: 6000
        }
      },
      
      estadosNotificacion: {
        'En Revisión': {
          titulo: 'Aplicación en Revisión', 
          mensaje: (oferta) => `Tu aplicación para "${oferta?.tituloPuesto || 'una oferta'}" está siendo revisada.`,
          icon: 'fas fa-eye text-white', headerClass: 'bg-info text-white'
        },
        'Entrevista': {
          titulo: '¡Entrevista Programada!',
          mensaje: (oferta) => `Has sido seleccionado para entrevista en "${oferta?.tituloPuesto || 'una oferta'}".`,
          icon: 'fas fa-calendar text-white', headerClass: 'bg-warning text-white'
        },
        'Aceptada': {
          titulo: '¡Felicitaciones!',
          mensaje: (oferta) => `Tu aplicación para "${oferta?.tituloPuesto || 'una oferta'}" ha sido aceptada.`,
          icon: 'fas fa-check-circle text-white', headerClass: 'bg-success text-white'
        },
        'Rechazada': {
          titulo: 'Aplicación No Seleccionada',
          mensaje: (oferta) => `Tu aplicación para "${oferta?.tituloPuesto || 'una oferta'}" no fue seleccionada.`,
          icon: 'fas fa-info-circle text-white', headerClass: 'bg-secondary text-white'
        }
      }
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    currentComponent() {
      const tab = this.tabsConfig.find(t => t.id === this.currentTab)
      return tab?.component || 'AspiranteDashboard'
    },
    
    currentComponentProps() { return {} },
    
    notificacionesActivas() {
      const activas = []
      
      if (this.notificaciones.aplicacion) {
        activas.push({ ...this.tiposNotificacion.aplicacion, closeClass: 'btn-close btn-close-white' })
      }
      
      if (this.notificaciones.estadisticas) {
        activas.push({ ...this.tiposNotificacion.estadisticas, closeClass: 'btn-close btn-close-white' })
      }
      
      if (this.notificaciones.estado) {
        activas.push({ ...this.notificaciones.estado, closeClass: 'btn-close' })
      }
      
      return activas
    }
  },
  
  async mounted() {
    await this.inicializarSistemaCompleto()
    this.configurarActualizacionesAutomaticas()
    this.iniciarSeguimientoSesion()
  },
  
  beforeUnmount() {
    this.limpiarIntervalos()
    this.guardarMetricasSesion()
  },
  
  methods: {
    async inicializarSistemaCompleto() {
      try {
        const operaciones = [
          this.cargarAspiranteId(),
          this.cargarMisAplicaciones(),
          this.cargarConfiguracionUsuario(),
          this.verificarEstadoSistema()
        ]
        await Promise.all(operaciones)
        setTimeout(() => this.mostrarRecomendacionInicial(), 2000)
      } catch (error) {
        console.error('Error inicializando:', error)
        this.conectadoAPI = false
      }
    },
    
    async cargarAspiranteId() {
      try {
        const response = await api.get('/Aspirante/todos')
        const aspirante = response.data.find(asp => asp.idUsuario === this.user.idUsuario)
        if (aspirante) this.aspiranteId = aspirante.idAspirante
      } catch (error) {
        console.error('Error obteniendo aspirante:', error)
        this.conectadoAPI = false
      }
    },
    
    async cargarMisAplicaciones() {
      if (!this.aspiranteId) return
      
      try {
        const response = await api.get(`/Aplicaciones/aspirante/${this.aspiranteId}`)
        const aplicacionesAnteriores = [...this.misAplicaciones]
        this.misAplicaciones = response.data || []
        
        this.calcularEstadisticasAplicaciones()
        this.detectarCambiosEstado(aplicacionesAnteriores, this.misAplicaciones)
        this.conectadoAPI = true
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error cargando aplicaciones:', error)
          this.conectadoAPI = false
        }
      }
    },
    
    calcularEstadisticasAplicaciones() {
      const ahora = new Date()
      const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000)
      
      this.estadisticasAplicaciones = {
        total: this.misAplicaciones.length,
        nuevas: this.misAplicaciones.filter(app => new Date(app.fechaAplicacion) >= hace24h).length,
        enRevision: this.misAplicaciones.filter(app => ['En Revisión', 'Entrevista'].includes(app.estado)).length,
        aceptadas: this.misAplicaciones.filter(app => app.estado === 'Aceptada').length
      }
    },
    
    detectarCambiosEstado(anterior, actual) {
      if (!anterior.length) return
      
      actual.forEach(appActual => {
        const appAnterior = anterior.find(a => a.idAplicacion === appActual.idAplicacion)
        if (appAnterior && appAnterior.estado !== appActual.estado) {
          this.mostrarNotificacionEstado(appActual)
          if (['Aceptada', 'Entrevista'].includes(appActual.estado)) {
            setTimeout(() => this.mostrarNotificacion('estadisticas'), 3000)
          }
        }
      })
    },
    
    mostrarNotificacionEstado(aplicacion) {
      const config = this.estadosNotificacion[aplicacion.estado]
      if (config) {
        this.notificaciones.estado = {
          titulo: config.titulo,
          mensaje: config.mensaje(aplicacion.oferta),
          icon: config.icon,
          headerClass: config.headerClass
        }
        setTimeout(() => { this.notificaciones.estado = null }, 8000)
      }
    },
    
    mostrarNotificacion(tipo, duracion) {
      this.notificaciones[tipo] = true
      const tiempo = duracion || this.tiposNotificacion[tipo]?.duracion || 5000
      setTimeout(() => { this.notificaciones[tipo] = false }, tiempo)
    },
    
    cerrarNotificacion(index) {
      const keys = Object.keys(this.notificaciones)
      let currentIndex = 0
      
      for (const key of keys) {
        if (this.notificaciones[key]) {
          if (currentIndex === index) {
            this.notificaciones[key] = false
            break
          }
          currentIndex++
        }
      }
    },
    
    configurarActualizacionesAutomaticas() {
      this.intervalId = setInterval(async () => {
        if (this.aspiranteId && this.configuracion.actualizacionAutomatica) {
          await this.cargarMisAplicaciones()
        }
      }, this.configuracion.intervalorFrecuencia * 60 * 1000)
      
      this.intervalEstadisticasId = setInterval(() => {
        if (this.currentTab === 'estadisticas' && this.aspiranteId) {
          console.log('Actualizando estadísticas...')
        }
      }, 2 * 60 * 1000)
    },
    
    iniciarSeguimientoSesion() {
      setInterval(() => { this.metricas.tiempoSesion += 1 }, 60000)
      
      this.$watch('currentTab', (newTab) => {
        if (newTab === 'ofertas') this.metricas.vistasOfertas += 1
        if (['perfil', 'formacion', 'experiencia', 'habilidades', 'certificaciones'].includes(newTab)) {
          this.metricas.cambiosPerfil += 0.1
        }
      })
    },
    
    async cargarConfiguracionUsuario() {
      try {
        const configGuardada = localStorage.getItem(`config_${this.user.idUsuario}`)
        if (configGuardada) {
          this.configuracion = { ...this.configuracion, ...JSON.parse(configGuardada) }
        }
      } catch (error) {
        console.log('Usando configuración por defecto')
      }
    },
    
    async verificarEstadoSistema() {
      try {
        await api.get('/Usuario/todos')
        this.conectadoAPI = true
        this.sistemaActivo = true
      } catch (error) {
        this.conectadoAPI = false
      }
    },
    
    mostrarRecomendacionInicial() {
      if (this.misAplicaciones.length === 0) {
        console.log('Recomendación: ver ofertas')
      } else if (this.estadisticasAplicaciones.total >= 3 && this.currentTab === 'dashboard') {
        setTimeout(() => this.mostrarNotificacion('estadisticas', 8000), 1000)
      }
    },
    
    cambiarTab(tab) {
      const tabAnterior = this.currentTab
      this.currentTab = tab
      
      const accionesPorTab = {
        aplicaciones: () => setTimeout(() => this.cargarMisAplicaciones(), 300),
        ofertas: () => { this.metricas.vistasOfertas += 1 }
      }
      
      if (tabAnterior !== tab) {
        accionesPorTab[tab]?.()
      }
    },
    
    yaAplicado(idOferta) {
      return idOferta ? this.misAplicaciones.some(app => app.idOferta === idOferta) : false
    },
    
    verDetalleOferta(oferta) {
      this.ofertaSeleccionada = oferta
      this.mostrarDetalleOferta = true
      this.metricas.vistasOfertas += 1
    },
    
    cerrarDetalleOferta() {
      this.mostrarDetalleOferta = false
      this.ofertaSeleccionada = null
    },
    
    async onAplicacionExitosa(aplicacion) {
      try {
        this.misAplicaciones.push(aplicacion)
        this.calcularEstadisticasAplicaciones()
        this.metricas.aplicacionesEnviadas += 1
        
        this.mostrarNotificacion('aplicacion')
        
        if (this.mostrarDetalleOferta) {
          this.cerrarDetalleOferta()
        }
        
        setTimeout(async () => await this.cargarMisAplicaciones(), 1000)
        
        if (this.metricas.aplicacionesEnviadas >= 3) {
          setTimeout(() => this.mostrarNotificacion('estadisticas'), 3000)
        }
      } catch (error) {
        console.error('Error procesando aplicación:', error)
      }
    },
    
    limpiarIntervalos() {
      [this.intervalId, this.intervalEstadisticasId].forEach(id => {
        if (id) clearInterval(id)
      })
    },
    
    guardarMetricasSesion() {
      try {
        const metricas = {
          ...this.metricas,
          ultimaSesion: Date.now(),
          tabMasVisitada: this.currentTab
        }
        localStorage.setItem(`metricas_${this.user.idUsuario}`, JSON.stringify(metricas))
      } catch (error) {
        console.error('Error guardando métricas:', error)
      }
    }
  }
}
</script>

<style scoped>
.nav-tabs .nav-link { color: #6c757d; border: none; border-bottom: 2px solid transparent; font-weight: 500; transition: all 0.3s ease; position: relative; }
.nav-tabs .nav-link:hover:not(.disabled) { color: #3b82f6; border-bottom-color: #3b82f6; transform: translateY(-2px); }
.nav-tabs .nav-link.active { color: #3b82f6; background: none; border-bottom-color: #3b82f6; font-weight: 600; }
.nav-tabs .nav-link.disabled { color: #adb5bd; cursor: not-allowed; opacity: 0.6; }
.nav-tabs { border-bottom: 1px solid #dee2e6; margin-bottom: 2rem; }
.nav-tabs .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 50%; width: 0; height: 2px; background: linear-gradient(90deg, #3b82f6, #1d4ed8); transition: all 0.3s ease; transform: translateX(-50%); }
.nav-tabs .nav-link.active::after { width: 100%; }
.analytics-tab:hover, .analytics-tab.active { color: #8b5cf6 !important; border-bottom-color: #8b5cf6 !important; }
.analytics-tab::after { background: linear-gradient(90deg, #8b5cf6, #7c3aed) !important; }
.offers-tab:hover, .offers-tab.active { color: #059669 !important; border-bottom-color: #059669 !important; }
.offers-tab::after { background: linear-gradient(90deg, #059669, #10b981) !important; }
.nav-link .badge { font-size: 0.6rem; padding: 0.2em 0.4em; position: relative; top: -2px; }
.nav-item.has-notification .nav-link::before { content: ''; position: absolute; top: 5px; right: 5px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
.container-fluid > .row:last-child { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.toast { border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); min-width: 300px; border: none; }
.toast-header { border-radius: 10px 10px 0 0; border-bottom: none; }
.toast-body { border-radius: 0 0 10px 10px; font-size: 0.9rem; line-height: 1.4; }
.toast-header.bg-info { background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important; }
.system-status { position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; align-items: center; gap: 0.5rem; }
.status-indicator { width: 12px; height: 12px; border-radius: 50%; transition: all 0.3s ease; }
.status-indicator.online { background: #10b981; animation: pulse-soft 2s infinite; }
.status-indicator.offline { background: #ef4444; animation: blink 1s infinite; }
@keyframes pulse-soft { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.3; } }
@media (max-width: 768px) {
  .nav-tabs { flex-wrap: wrap; justify-content: center; }
  .nav-item { margin-bottom: 0.25rem; }
  .nav-link { padding: 0.5rem 0.75rem; font-size: 0.9rem; margin-right: 0.1rem; }
  .nav-link .badge { font-size: 0.5rem; padding: 0.1em 0.3em; }
  .toast { min-width: 250px; margin: 0.5rem; }
}
@media (max-width: 576px) {
  .nav-tabs .nav-link { font-size: 0.8rem; padding: 0.4rem 0.6rem; }
  .nav-tabs .nav-link i { font-size: 0.8rem; }
  .position-fixed.top-0.end-0 { position: fixed !important; top: 10px !important; right: 10px !important; left: 10px !important; }
  .system-status { bottom: 10px; right: 10px; }
}
</style>