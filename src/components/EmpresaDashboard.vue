<template>
  <div class="empresa-dashboard">
    <div class="container py-4">
      <!-- Header empresarial -->
      <div class="welcome-card mb-4">
        <div class="enterprise-bg"></div>
        <div class="row align-items-center p-4 text-white position-relative">
          <div class="col-md-8">
            <div class="company-badge mb-3">
              <i class="fas fa-building"></i>
              <span>Panel Empresarial</span>
            </div>
            <h2 class="enterprise-title">{{ empresaInfo.nombre }}</h2>
            <p class="enterprise-subtitle">Gestiona tu talento y oportunidades laborales</p>
            <div class="company-meta">
              <span class="meta-item">
                <i class="fas fa-envelope"></i>{{ user?.correo }}
              </span>
            </div>
          </div>
          <div class="col-md-4 text-end d-none d-md-block">
            <div class="floating-icons">
              <i class="fas fa-chart-line floating-icon"></i>
              <i class="fas fa-users floating-icon delay-1"></i>
              <i class="fas fa-briefcase floating-icon delay-2"></i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Métricas -->
      <div class="metrics-grid mb-4">
        <div v-for="(metric, key) in metricas" :key="key" 
             class="metric-card" :class="metric.variant"
             @click="navigateTo(metric.route)">
          <div class="metric-header">
            <div class="metric-icon">
              <i :class="metric.icon"></i>
            </div>
            <div class="metric-trend" v-if="metric.trend">{{ metric.trend }}</div>
          </div>
          <div class="metric-body">
            <h3>{{ metric.value }}</h3>
            <p>{{ metric.label }}</p>
            <small>{{ metric.description }}</small>
          </div>
          <div class="metric-action">{{ metric.action }} <i class="fas fa-arrow-right"></i></div>
        </div>
      </div>
      
      <div class="row">
        <!-- Panel de gestión -->
        <div class="col-lg-8 mb-4">
          <div class="panel">
            <div class="panel-header">
              <h5><i class="fas fa-tools"></i>Centro de Gestión</h5>
              <span class="panel-badge">Herramientas Empresariales</span>
            </div>
            <div class="panel-body">
              <div class="management-grid">
                <button v-for="action in acciones" :key="action.key"
                        class="management-btn" :class="action.variant"
                        @click="navigateTo(action.route)">
                  <div class="btn-icon">
                    <i :class="action.icon"></i>
                  </div>
                  <div class="btn-content">
                    <h6>{{ action.title }}</h6>
                    <small>{{ action.subtitle }}</small>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Panel de consejos -->
        <div class="col-lg-4 mb-4">
          <div class="panel">
            <div class="panel-header">
              <h6><i class="fas fa-lightbulb"></i>Consejos de Reclutamiento</h6>
            </div>
            <div class="panel-body">
              <div v-for="tip in tips" :key="tip.title" class="insight-item">
                <div class="insight-icon" :class="tip.variant">
                  <i :class="tip.icon"></i>
                </div>
                <div class="insight-content">
                  <h6>{{ tip.title }}</h6>
                  <p>{{ tip.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Ofertas recientes -->
        <div class="col-12">
          <div class="panel">
            <div class="panel-header">
              <h5><i class="fas fa-briefcase"></i>Ofertas Recientes</h5>
              <button class="btn btn-primary btn-sm" @click="navigateTo('crear-oferta')">
                <i class="fas fa-plus me-1"></i>Nueva Oferta
              </button>
            </div>
            <div class="panel-body">
              <!-- Loading -->
              <div v-if="loadingOfertas" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 text-muted">Cargando ofertas...</p>
              </div>
              
              <!-- Empty state -->
              <div v-else-if="!ofertasRecientes.length" class="text-center py-5">
                <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <h6>No hay ofertas publicadas</h6>
                <p class="text-muted mb-3">Comience publicando su primera oferta laboral</p>
                <button class="btn btn-primary" @click="navigateTo('crear-oferta')">
                  <i class="fas fa-plus me-2"></i>Crear Primera Oferta
                </button>
              </div>
              
              <!-- Ofertas grid -->
              <div v-else>
                <div class="offers-grid">
                  <div v-for="oferta in ofertasRecientes" :key="oferta.idOferta" class="offer-card">
                    <div class="offer-header">
                      <h6>{{ oferta.tituloPuesto }}</h6>
                      <span class="offer-status" :class="getEstadoBadgeClass(oferta.estadoOferta)">
                        {{ oferta.estadoOferta }}
                      </span>
                    </div>
                    <p class="offer-description">{{ truncateText(oferta.descripcionPuesto, 120) }}</p>
                    <div class="offer-meta">
                      <span><i class="fas fa-calendar"></i>{{ formatearFecha(oferta.fechaPublicacion) }}</span>
                      <span><i class="fas fa-users"></i>{{ oferta.aplicaciones || 0 }} candidatos</span>
                    </div>
                    <div class="offer-actions">
                      <button class="btn btn-outline-primary btn-sm">
                        <i class="fas fa-eye me-1"></i>Ver
                      </button>
                      <button class="btn btn-outline-success btn-sm">
                        <i class="fas fa-edit me-1"></i>Editar
                      </button>
                    </div>
                  </div>
                </div>
                <div class="text-center mt-4">
                  <button class="btn btn-outline-primary" @click="navigateTo('ofertas')">
                    <i class="fas fa-list me-2"></i>Ver Todas las Ofertas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../services/api'

export default {
  name: 'EmpresaDashboard',
  data() {
    return {
      loadingOfertas: false,
      estadisticas: { totalOfertas: 0, ofertasActivas: 0, totalAplicaciones: 0, aplicacionesPendientes: 0 },
      empresaInfo: { id: null, nombre: 'Tu Empresa', descripcion: '', completado: 0 },
      ofertasRecientes: []
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    perfilCompletado() { return this.empresaInfo.completado || 0 },
    
    metricas() {
      return {
        ofertas: {
          value: this.estadisticas.totalOfertas, label: 'Ofertas Publicadas', description: 'Total de vacantes activas',
          icon: 'fas fa-briefcase', variant: 'primary', route: 'ofertas', action: 'Gestionar'
        },
        activas: {
          value: this.estadisticas.ofertasActivas, label: 'Ofertas Activas', description: 'Vacantes disponibles',
          icon: 'fas fa-eye', variant: 'success', route: 'ofertas-activas', action: 'Ver Activas', trend: '+2'
        },
        candidatos: {
          value: this.estadisticas.totalAplicaciones, label: 'Candidatos', description: 'Aplicaciones recibidas',
          icon: 'fas fa-users', variant: 'warning', route: 'aplicaciones', action: 'Ver Candidatos', trend: `+${this.estadisticas.aplicacionesPendientes}`
        },
        empresa: {
          value: 'Mi Empresa', label: 'Perfil Empresarial', description: 'Información completa',
          icon: 'fas fa-building', variant: 'info', route: 'perfil', action: 'Editar Perfil', trend: `${this.perfilCompletado}%`
        }
      }
    },
    
    acciones() {
      return [
        { key: 'nueva', title: 'Nueva Oferta', subtitle: 'Publicar vacante', icon: 'fas fa-plus-circle', variant: 'primary', route: 'crear-oferta' },
        { key: 'empresa', title: 'Mi Empresa', subtitle: 'Actualizar información', icon: 'fas fa-edit', variant: 'success', route: 'perfil' },
        { key: 'candidatos', title: 'Candidatos', subtitle: `${this.estadisticas.aplicacionesPendientes} pendientes`, icon: 'fas fa-eye', variant: 'info', route: 'aplicaciones' },
        { key: 'buscar', title: 'Buscar Talentos', subtitle: 'Encontrar candidatos', icon: 'fas fa-search', variant: 'warning', route: 'buscar-candidatos' }
      ]
    },
    
    tips() {
      return [
        { title: 'Perfil Atractivo', text: 'Complete toda la información de su empresa para generar más confianza en los candidatos.', icon: 'fas fa-check-circle', variant: 'success' },
        { title: 'Ofertas Claras', text: 'Describa claramente los beneficios y oportunidades de crecimiento profesional.', icon: 'fas fa-star', variant: 'primary' },
        { title: 'Respuesta Ágil', text: 'Responda a las aplicaciones dentro de 48 horas para mejores resultados.', icon: 'fas fa-clock', variant: 'warning' }
      ]
    }
  },
  
  async mounted() {
    await this.cargarDatosIniciales()
  },
  
  methods: {
    async cargarDatosIniciales() {
      try {
        await Promise.all([this.cargarInfoEmpresa(), this.cargarEstadisticas(), this.cargarOfertasRecientes()])
      } catch (error) {
        console.error('❌ Error cargando datos del dashboard:', error)
      }
    },
    
    async cargarInfoEmpresa() {
      try {
        const response = await api.get('/Empresa/todas')
        const empresaActual = response.data.find(emp => emp.idUsuario === this.user.idUsuario)
        if (empresaActual) {
          this.empresaInfo = {
            id: empresaActual.idEmpresa,
            nombre: empresaActual.nombreEmpresa || 'Tu Empresa',
            descripcion: empresaActual.descripcionEmpresa || '',
            completado: this.calcularCompletitud(empresaActual)
          }
        }
      } catch (error) {
        console.error('❌ Error cargando info empresa:', error)
      }
    },
    
    async cargarEstadisticas() {
      this.estadisticas = { totalOfertas: 5, ofertasActivas: 3, totalAplicaciones: 24, aplicacionesPendientes: 8 }
    },
    
    async cargarOfertasRecientes() {
      try {
        this.loadingOfertas = true
        this.ofertasRecientes = [
          {
            idOferta: 1, tituloPuesto: 'Desarrollador Frontend',
            descripcionPuesto: 'Buscamos un desarrollador frontend con experiencia en Vue.js y React para unirse a nuestro equipo de tecnología.',
            estadoOferta: 'Activa', fechaPublicacion: new Date().toISOString(), aplicaciones: 12
          },
          {
            idOferta: 2, tituloPuesto: 'Contador Público',
            descripcionPuesto: 'Contador con experiencia en NIIF y manejo de sistemas contables para empresa en crecimiento.',
            estadoOferta: 'Activa', fechaPublicacion: new Date(Date.now() - 86400000).toISOString(), aplicaciones: 8
          }
        ]
      } finally {
        this.loadingOfertas = false
      }
    },
    
    calcularCompletitud(empresa) {
      const campos = [empresa.nombreEmpresa, empresa.nombreRepresentante, empresa.descripcionEmpresa]
      const camposCompletos = campos.filter(campo => campo && campo.trim().length > 0).length
      return Math.round((camposCompletos / campos.length) * 100)
    },
    
    navigateTo(seccion) {
      this.$emit('navigate-to', seccion)
    },
    
    formatearFecha(fecha) {
      return fecha ? new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'
    },
    
    truncateText(text, maxLength) {
      return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text || ''
    },
    
    getEstadoBadgeClass(estado) {
      const clases = { 'Activa': 'status-active', 'Pausada': 'status-paused', 'Cerrada': 'status-closed', 'Borrador': 'status-draft' }
      return clases[estado] || 'status-closed'
    }
  }
}
</script>

<style scoped>
/* === BASE === */
.empresa-dashboard { min-height: 100vh; background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); position: relative; }
.empresa-dashboard::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 40%, rgba(72, 187, 120, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(56, 178, 172, 0.15) 0%, transparent 50%); pointer-events: none; }

/* === WELCOME CARD === */
.welcome-card { background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); border-radius: 20px; overflow: hidden; position: relative; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.enterprise-bg { position: absolute; top: 0; right: 0; width: 50%; height: 100%; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>'); opacity: 0.3; }
.company-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.2); padding: 0.5rem 1rem; border-radius: 25px; font-size: 0.9rem; font-weight: 500; }
.enterprise-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); }
.enterprise-subtitle { font-size: 1.2rem; opacity: 0.9; margin-bottom: 1rem; }
.company-meta { display: flex; gap: 2rem; flex-wrap: wrap; }
.meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; opacity: 0.8; }
.floating-icons { position: relative; height: 150px; }
.floating-icon { position: absolute; width: 60px; height: 60px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; animation: float 3s ease-in-out infinite; }
.floating-icon:nth-child(1) { top: 20px; right: 20px; }
.floating-icon:nth-child(2) { top: 60px; right: 80px; animation-delay: -1s; }
.floating-icon:nth-child(3) { top: 100px; right: 40px; animation-delay: -2s; }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }

/* === MÉTRICAS === */
.metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
.metric-card { background: white; border-radius: 15px; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid; position: relative; overflow: hidden; }
.metric-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent); transition: left 0.5s; }
.metric-card:hover::before { left: 100%; }
.metric-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
.metric-card.primary { border-left-color: #3182ce; }
.metric-card.success { border-left-color: #38a169; }
.metric-card.warning { border-left-color: #d69e2e; }
.metric-card.info { border-left-color: #3182ce; }
.metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.metric-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: white; }
.metric-card.primary .metric-icon { background: linear-gradient(135deg, #3182ce, #2c5282); }
.metric-card.success .metric-icon { background: linear-gradient(135deg, #38a169, #2f855a); }
.metric-card.warning .metric-icon { background: linear-gradient(135deg, #d69e2e, #b7791f); }
.metric-card.info .metric-icon { background: linear-gradient(135deg, #3182ce, #2c5282); }
.metric-trend { font-size: 0.8rem; color: #68d391; font-weight: 600; }
.metric-body h3 { font-size: 2rem; font-weight: 700; color: #2d3748; margin: 0; }
.metric-body p { font-size: 1.1rem; font-weight: 600; color: #4a5568; margin: 0.25rem 0; }
.metric-body small { color: #718096; font-size: 0.9rem; }
.metric-action { margin-top: 1rem; color: #3182ce; font-weight: 500; font-size: 0.9rem; opacity: 0; transition: opacity 0.3s ease; }
.metric-card:hover .metric-action { opacity: 1; }

/* === PANELES === */
.panel { background: white; border-radius: 20px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden; }
.panel-header { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.panel-header h5, .panel-header h6 { font-size: 1.2rem; font-weight: 600; color: #2d3748; margin: 0; display: flex; align-items: center; gap: 0.75rem; }
.panel-badge { background: #bee3f8; color: #2c5282; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
.panel-body { padding: 1.5rem; }

/* === BOTONES DE GESTIÓN === */
.management-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.management-btn { background: white; border: 2px solid #e2e8f0; border-radius: 15px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: all 0.3s ease; cursor: pointer; }
.management-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
.management-btn.primary:hover { border-color: #3182ce; }
.management-btn.success:hover { border-color: #38a169; }
.management-btn.info:hover { border-color: #3182ce; }
.management-btn.warning:hover { border-color: #d69e2e; }
.btn-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: white; }
.management-btn.primary .btn-icon { background: linear-gradient(135deg, #3182ce, #2c5282); }
.management-btn.success .btn-icon { background: linear-gradient(135deg, #38a169, #2f855a); }
.management-btn.info .btn-icon { background: linear-gradient(135deg, #3182ce, #2c5282); }
.management-btn.warning .btn-icon { background: linear-gradient(135deg, #d69e2e, #b7791f); }
.btn-content h6 { margin: 0; font-weight: 600; color: #2d3748; }
.btn-content small { color: #718096; }

/* === INSIGHTS === */
.insight-item { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
.insight-item:last-child { margin-bottom: 0; }
.insight-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: white; flex-shrink: 0; }
.insight-icon.success { background: linear-gradient(135deg, #38a169, #2f855a); }
.insight-icon.primary { background: linear-gradient(135deg, #3182ce, #2c5282); }
.insight-icon.warning { background: linear-gradient(135deg, #d69e2e, #b7791f); }
.insight-content h6 { margin: 0 0 0.5rem 0; font-weight: 600; color: #2d3748; }
.insight-content p { margin: 0; color: #718096; font-size: 0.9rem; line-height: 1.4; }

/* === OFERTAS === */
.offers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.offer-card { background: #f8f9fa; border-radius: 15px; padding: 1.5rem; border: 1px solid #e2e8f0; transition: all 0.3s ease; }
.offer-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
.offer-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.offer-header h6 { margin: 0; font-weight: 600; color: #2d3748; }
.offer-status { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
.status-active { background: #c6f6d5; color: #2f855a; }
.status-paused { background: #fef5e7; color: #b7791f; }
.status-closed { background: #e2e8f0; color: #718096; }
.status-draft { background: #bee3f8; color: #2c5282; }
.offer-description { color: #718096; font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem; }
.offer-meta { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
.offer-meta span { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #718096; }
.offer-actions { display: flex; gap: 0.5rem; }

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .enterprise-title { font-size: 2rem; }
  .company-meta { flex-direction: column; gap: 0.5rem; }
  .metrics-grid { grid-template-columns: 1fr; }
  .management-grid { grid-template-columns: 1fr; }
  .offers-grid { grid-template-columns: 1fr; }
  .offer-meta { flex-direction: column; gap: 0.5rem; }
}
</style>