<template>
  <div class="dashboard fade-in">
    <div class="container py-4">
      <div class="row">
        <!-- Panel de bienvenida -->
        <div class="col-12 mb-4">
          <div class="card bg-gradient-success text-white">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-2">¡Bienvenida, {{ empresaInfo.nombre }}! 🏢</h3>
                  <p class="mb-0 opacity-75">Gestiona tus ofertas laborales y encuentra el mejor talento para tu organización</p>
                  <small class="opacity-50">
                    <i class="fas fa-user me-1"></i>
                    {{ user?.correo }} | 
                    <i class="fas fa-calendar-alt me-1 ms-2"></i>
                    Miembro desde {{ formatearFecha(user?.fechaRegistro) }}
                  </small>
                </div>
                <div class="col-auto d-none d-md-block">
                  <i class="fas fa-building fa-3x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Estadísticas principales -->
        <div class="col-12 mb-4">
          <div class="row">
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stat-card h-100" @click="navigateTo('ofertas')">
                <div class="card-body text-center">
                  <div class="stat-icon bg-primary">
                    <i class="fas fa-briefcase text-white"></i>
                  </div>
                  <div class="stat-content mt-3">
                    <h4 class="stat-number">{{ estadisticas.totalOfertas }}</h4>
                    <h6 class="stat-label">Ofertas Publicadas</h6>
                    <p class="text-muted small mb-0">Total de vacantes creadas</p>
                  </div>
                </div>
                <div class="card-footer bg-transparent text-center">
                  <small class="text-primary">
                    <i class="fas fa-arrow-right me-1"></i>
                    Gestionar Ofertas
                  </small>
                </div>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stat-card h-100" @click="navigateTo('ofertas-activas')">
                <div class="card-body text-center">
                  <div class="stat-icon bg-success">
                    <i class="fas fa-eye text-white"></i>
                  </div>
                  <div class="stat-content mt-3">
                    <h4 class="stat-number">{{ estadisticas.ofertasActivas }}</h4>
                    <h6 class="stat-label">Ofertas Activas</h6>
                    <p class="text-muted small mb-0">Vacantes disponibles</p>
                  </div>
                </div>
                <div class="card-footer bg-transparent text-center">
                  <small class="text-success">
                    <i class="fas fa-arrow-right me-1"></i>
                    Ver Activas
                  </small>
                </div>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stat-card h-100" @click="navigateTo('aplicaciones')">
                <div class="card-body text-center">
                  <div class="stat-icon bg-warning">
                    <i class="fas fa-users text-white"></i>
                  </div>
                  <div class="stat-content mt-3">
                    <h4 class="stat-number">{{ estadisticas.totalAplicaciones }}</h4>
                    <h6 class="stat-label">Aplicaciones</h6>
                    <p class="text-muted small mb-0">Candidatos interesados</p>
                  </div>
                </div>
                <div class="card-footer bg-transparent text-center">
                  <small class="text-warning">
                    <i class="fas fa-arrow-right me-1"></i>
                    Ver Candidatos
                  </small>
                </div>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stat-card h-100" @click="navigateTo('perfil')">
                <div class="card-body text-center">
                  <div class="stat-icon bg-info">
                    <i class="fas fa-building text-white"></i>
                  </div>
                  <div class="stat-content mt-3">
                    <h4 class="stat-number">{{ perfilCompletado }}%</h4>
                    <h6 class="stat-label">Perfil Completo</h6>
                    <p class="text-muted small mb-0">Información de empresa</p>
                  </div>
                </div>
                <div class="card-footer bg-transparent text-center">
                  <small class="text-info">
                    <i class="fas fa-arrow-right me-1"></i>
                    Editar Perfil
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Acciones rápidas -->
        <div class="col-lg-8 mb-4">
          <div class="card">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 d-flex align-items-center">
                <i class="fas fa-rocket me-2 text-success"></i>
                Acciones Rápidas
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-lg-6 col-md-6">
                  <button 
                    class="btn btn-outline-primary w-100 action-btn"
                    @click="navigateTo('crear-oferta')"
                  >
                    <i class="fas fa-plus mb-2 d-block"></i>
                    <span>Publicar Nueva Oferta</span>
                    <small class="text-muted d-block mt-1">Crear vacante</small>
                  </button>
                </div>
                <div class="col-lg-6 col-md-6">
                  <button 
                    class="btn btn-outline-success w-100 action-btn"
                    @click="navigateTo('perfil')"
                  >
                    <i class="fas fa-edit mb-2 d-block"></i>
                    <span>Actualizar Perfil</span>
                    <small class="text-muted d-block mt-1">Información empresa</small>
                  </button>
                </div>
                <div class="col-lg-6 col-md-6">
                  <button 
                    class="btn btn-outline-info w-100 action-btn"
                    @click="navigateTo('aplicaciones')"
                  >
                    <i class="fas fa-eye mb-2 d-block"></i>
                    <span>Ver Aplicaciones</span>
                    <small class="text-muted d-block mt-1">{{ estadisticas.aplicacionesPendientes }} pendientes</small>
                  </button>
                </div>
                <div class="col-lg-6 col-md-6">
                  <button 
                    class="btn btn-outline-warning w-100 action-btn"
                    @click="navigateTo('estadisticas')"
                  >
                    <i class="fas fa-chart-bar mb-2 d-block"></i>
                    <span>Ver Reportes</span>
                    <small class="text-muted d-block mt-1">Analytics</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Panel de información y tips -->
        <div class="col-lg-4 mb-4">
          <div class="card h-100">
            <div class="card-header bg-white border-bottom">
              <h6 class="mb-0 d-flex align-items-center">
                <i class="fas fa-lightbulb me-2 text-warning"></i>
                Tips para Reclutar Mejor
              </h6>
            </div>
            <div class="card-body">
              <div class="tip-item mb-3">
                <div class="d-flex align-items-start">
                  <div class="tip-icon bg-success me-3">
                    <i class="fas fa-check text-white"></i>
                  </div>
                  <div>
                    <h6 class="mb-1">Perfil Completo</h6>
                    <p class="small text-muted mb-0">Complete toda la información de su empresa para generar más confianza.</p>
                  </div>
                </div>
              </div>
              
              <div class="tip-item mb-3">
                <div class="d-flex align-items-start">
                  <div class="tip-icon bg-primary me-3">
                    <i class="fas fa-star text-white"></i>
                  </div>
                  <div>
                    <h6 class="mb-1">Ofertas Atractivas</h6>
                    <p class="small text-muted mb-0">Describa claramente los beneficios y oportunidades de crecimiento.</p>
                  </div>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="d-flex align-items-start">
                  <div class="tip-icon bg-info me-3">
                    <i class="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <h6 class="mb-1">Respuesta Rápida</h6>
                    <p class="small text-muted mb-0">Responda a las aplicaciones dentro de 48 horas para mejores resultados.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Ofertas recientes -->
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 class="mb-0 d-flex align-items-center">
                <i class="fas fa-briefcase me-2 text-primary"></i>
                Ofertas Recientes
              </h5>
              <button 
                class="btn btn-primary btn-sm"
                @click="navigateTo('crear-oferta')"
              >
                <i class="fas fa-plus me-1"></i>
                Nueva Oferta
              </button>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div v-if="loadingOfertas" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Cargando ofertas...</p>
              </div>
              
              <!-- Empty state -->
              <div v-else-if="ofertasRecientes.length === 0" class="text-center py-5">
                <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <h6>No hay ofertas publicadas</h6>
                <p class="text-muted mb-3">Comienza publicando tu primera oferta laboral</p>
                <button 
                  class="btn btn-primary"
                  @click="navigateTo('crear-oferta')"
                >
                  <i class="fas fa-plus me-2"></i>
                  Crear Primera Oferta
                </button>
              </div>
              
              <!-- Ofertas list -->
              <div v-else>
                <div class="row">
                  <div 
                    v-for="oferta in ofertasRecientes" 
                    :key="oferta.idOferta"
                    class="col-lg-6 mb-3"
                  >
                    <div class="card oferta-card h-100">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                          <h6 class="card-title mb-1">{{ oferta.tituloPuesto }}</h6>
                          <span 
                            class="badge"
                            :class="getEstadoBadgeClass(oferta.estadoOferta)"
                          >
                            {{ oferta.estadoOferta }}
                          </span>
                        </div>
                        <p class="card-text small text-muted">
                          {{ truncateText(oferta.descripcionPuesto, 100) }}
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                          <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>
                            {{ formatearFecha(oferta.fechaPublicacion) }}
                          </small>
                          <small class="text-muted">
                            <i class="fas fa-users me-1"></i>
                            {{ oferta.aplicaciones || 0 }} aplicaciones
                          </small>
                        </div>
                      </div>
                      <div class="card-footer bg-transparent">
                        <div class="d-flex justify-content-between">
                          <button class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-eye me-1"></i>
                            Ver
                          </button>
                          <button class="btn btn-outline-success btn-sm">
                            <i class="fas fa-edit me-1"></i>
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="text-center mt-3">
                  <button 
                    class="btn btn-outline-primary"
                    @click="navigateTo('ofertas')"
                  >
                    <i class="fas fa-list me-2"></i>
                    Ver Todas las Ofertas
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
      loadingEstadisticas: false,
      
      estadisticas: {
        totalOfertas: 0,
        ofertasActivas: 0,
        totalAplicaciones: 0,
        aplicacionesPendientes: 0
      },
      
      empresaInfo: {
        id: null,
        nombre: 'Tu Empresa',
        descripcion: '',
        completado: 0
      },
      
      ofertasRecientes: []
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    perfilCompletado() {
      return this.empresaInfo.completado || 0
    }
  },
  
  async mounted() {
    console.log('🏢 EmpresaDashboard montado - cargando datos...')
    await this.cargarDatosIniciales()
  },
  
  methods: {
    async cargarDatosIniciales() {
      try {
        await Promise.all([
          this.cargarInfoEmpresa(),
          this.cargarEstadisticas(),
          this.cargarOfertasRecientes()
        ])
      } catch (error) {
        console.error('❌ Error cargando datos del dashboard:', error)
      }
    },
    
    async cargarInfoEmpresa() {
      try {
        const response = await api.get('/Empresa/todas')
        const empresas = response.data
        const empresaActual = empresas.find(emp => emp.idUsuario === this.user.idUsuario)
        
        if (empresaActual) {
          this.empresaInfo = {
            id: empresaActual.idEmpresa,
            nombre: empresaActual.nombreEmpresa || 'Tu Empresa',
            descripcion: empresaActual.descripcionEmpresa || '',
            completado: this.calcularCompletitud(empresaActual)
          }
          console.log('✅ Info empresa cargada:', this.empresaInfo)
        }
      } catch (error) {
        console.error('❌ Error cargando info empresa:', error)
      }
    },
    
    async cargarEstadisticas() {
      try {
        this.loadingEstadisticas = true
        
        // TODO: Implementar endpoints de estadísticas cuando estén disponibles
        // Por ahora simulamos datos
        this.estadisticas = {
          totalOfertas: 5,
          ofertasActivas: 3,
          totalAplicaciones: 24,
          aplicacionesPendientes: 8
        }
        
        console.log('📊 Estadísticas cargadas:', this.estadisticas)
      } catch (error) {
        console.error('❌ Error cargando estadísticas:', error)
      } finally {
        this.loadingEstadisticas = false
      }
    },
    
    async cargarOfertasRecientes() {
      try {
        this.loadingOfertas = true
        
        // TODO: Implementar endpoint de ofertas cuando esté disponible
        // Por ahora simulamos datos
        this.ofertasRecientes = [
          {
            idOferta: 1,
            tituloPuesto: 'Desarrollador Frontend',
            descripcionPuesto: 'Buscamos un desarrollador frontend con experiencia en Vue.js y React para unirse a nuestro equipo de tecnología.',
            estadoOferta: 'Activa',
            fechaPublicacion: new Date().toISOString(),
            aplicaciones: 12
          },
          {
            idOferta: 2,
            tituloPuesto: 'Contador Público',
            descripcionPuesto: 'Contador con experiencia en NIIF y manejo de sistemas contables para empresa en crecimiento.',
            estadoOferta: 'Activa',
            fechaPublicacion: new Date(Date.now() - 86400000).toISOString(),
            aplicaciones: 8
          }
        ]
        
        console.log('📋 Ofertas recientes cargadas:', this.ofertasRecientes)
      } catch (error) {
        console.error('❌ Error cargando ofertas:', error)
      } finally {
        this.loadingOfertas = false
      }
    },
    
    calcularCompletitud(empresa) {
      let completitud = 0
      const campos = [
        empresa.nombreEmpresa,
        empresa.nombreRepresentante,
        empresa.descripcionEmpresa
      ]
      
      const camposCompletos = campos.filter(campo => campo && campo.trim().length > 0).length
      completitud = Math.round((camposCompletos / campos.length) * 100)
      
      return completitud
    },
    
    navigateTo(seccion) {
      console.log(`🧭 Navegando a: ${seccion}`)
      
      // Emitir evento para que el componente padre maneje la navegación
      this.$emit('navigate-to', seccion)
      
      // Opcional: mostrar mensaje temporal mientras se implementan las secciones
      if (['ofertas', 'aplicaciones', 'estadisticas', 'crear-oferta'].includes(seccion)) {
        this.showTemporaryMessage(`Navegando a ${seccion}... (En desarrollo)`)
      }
    },
    
    formatearFecha(fecha) {
      if (!fecha) return 'N/A'
      
      const date = new Date(fecha)
      const opciones = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }
      
      return date.toLocaleDateString('es-ES', opciones)
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
    
    showTemporaryMessage(mensaje) {
      // TODO: Implementar sistema de notificaciones
      console.log('💬 Mensaje temporal:', mensaje)
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
}

/* Stat Cards */
.stat-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

/* Action Buttons */
.action-btn {
  padding: 1.5rem 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.action-btn i {
  font-size: 1.5rem;
}

/* Tips Section */
.tip-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.tip-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.tip-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

/* Ofertas Cards */
.oferta-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.oferta-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.12);
}

/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

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

/* Responsive */
@media (max-width: 768px) {
  .action-btn {
    min-height: 100px;
    padding: 1rem 0.5rem;
  }
  
  .action-btn i {
    font-size: 1.2rem;
  }
  
  .action-btn span {
    font-size: 0.9rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .card-body h5, .card-body h6 {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .dashboard .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .action-btn span {
    font-size: 0.8rem;
    text-align: center;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .tip-icon {
    width: 28px;
    height: 28px;
  }
}
</style>