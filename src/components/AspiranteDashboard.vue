<template>
  <div class="dashboard fade-in">
    <div class="container py-4">
      <div class="row">
        <!-- Panel de bienvenida mejorado -->
        <div class="col-12 mb-4">
          <div class="card bg-gradient-primary text-white welcome-card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-2">¡Bienvenido, {{ userName }}! 👋</h3>
                  <p class="mb-0 opacity-75">Gestiona tu perfil profesional y encuentra las mejores oportunidades laborales</p>
                </div>
                <div class="col-auto d-none d-md-block">
                  <div class="welcome-illustration">
                    <i class="fas fa-user-tie fa-3x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cards principales reorganizadas - Dashboard integrado -->
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100" @click="$emit('cambiar-tab', 'perfil')">
            <div class="card-body text-center">
              <div class="stat-icon bg-primary">
                <i class="fas fa-user text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Mi Perfil</h5>
              <p class="text-muted small mb-0">Completa tu información</p>
              <div class="card-action mt-2">
                <small class="text-primary">
                  <i class="fas fa-arrow-right me-1"></i>Gestionar
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100" @click="$emit('cambiar-tab', 'ofertas')">
            <div class="card-body text-center">
              <div class="stat-icon bg-success">
                <i class="fas fa-briefcase text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Ofertas Disponibles</h5>
              <p class="text-muted small mb-0">Explora oportunidades</p>
              <div class="card-action mt-2">
                <small class="text-success">
                  <i class="fas fa-search me-1"></i>Buscar
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100" @click="$emit('cambiar-tab', 'aplicaciones')">
            <div class="card-body text-center">
              <div class="stat-icon bg-warning">
                <i class="fas fa-paper-plane text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Mis Aplicaciones</h5>
              <p class="text-muted small mb-0">Seguimiento de postulaciones</p>
              <div class="card-action mt-2">
                <small class="text-warning">
                  <i class="fas fa-eye me-1"></i>Ver Estado
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100" @click="$emit('cambiar-tab', 'estadisticas')">
            <div class="card-body text-center">
              <div class="stat-icon bg-info">
                <i class="fas fa-chart-line text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Mi Progreso</h5>
              <p class="text-muted small mb-0">Estadísticas personales</p>
              <div class="card-action mt-2">
                <small class="text-info">
                  <i class="fas fa-analytics me-1"></i>Analizar
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sección de navegación rápida funcional -->
        <div class="col-12">
          <div class="card modern-card">
            <div class="card-header bg-white border-bottom-0">
              <h5 class="mb-0 d-flex align-items-center">
                <i class="fas fa-bolt me-2 text-primary"></i>
                Navegación Rápida
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <!-- Navegación funcional a pestañas -->
                <div class="col-lg-2 col-md-4 col-6">
                  <button 
                    class="btn btn-outline-primary w-100 nav-btn" 
                    @click="$emit('cambiar-tab', 'formacion')"
                  >
                    <i class="fas fa-graduation-cap mb-2 d-block"></i>
                    <span>Formación</span>
                  </button>
                </div>
                
                <div class="col-lg-2 col-md-4 col-6">
                  <button 
                    class="btn btn-outline-success w-100 nav-btn" 
                    @click="$emit('cambiar-tab', 'experiencia')"
                  >
                    <i class="fas fa-briefcase mb-2 d-block"></i>
                    <span>Experiencia</span>
                  </button>
                </div>
                
                <div class="col-lg-2 col-md-4 col-6">
                  <button 
                    class="btn btn-outline-info w-100 nav-btn" 
                    @click="$emit('cambiar-tab', 'habilidades')"
                  >
                    <i class="fas fa-tools mb-2 d-block"></i>
                    <span>Habilidades</span>
                  </button>
                </div>
                
                <div class="col-lg-2 col-md-4 col-6">
                  <button 
                    class="btn btn-outline-warning w-100 nav-btn" 
                    @click="$emit('cambiar-tab', 'certificaciones')"
                  >
                    <i class="fas fa-certificate mb-2 d-block"></i>
                    <span>Certificaciones</span>
                  </button>
                </div>
                
                <div class="col-lg-2 col-md-4 col-6">
                  <button 
                    class="btn btn-outline-danger w-100 nav-btn" 
                    @click="$emit('cambiar-tab', 'logros')"
                  >
                    <i class="fas fa-trophy mb-2 d-block"></i>
                    <span>Logros</span>
                  </button>
                </div>
                
                <div class="col-lg-2 col-md-4 col-6">
                  <button 
                    class="btn btn-outline-secondary w-100 nav-btn" 
                    @click="mostrarConfiguracion"
                  >
                    <i class="fas fa-cog mb-2 d-block"></i>
                    <span>Configuración</span>
                  </button>
                </div>
              </div>
              
              <!-- Tips útiles -->
              <div class="mt-4 p-3 bg-light rounded-3 border-start border-primary border-4">
                <div class="d-flex align-items-center">
                  <i class="fas fa-lightbulb me-2 text-warning"></i>
                  <div>
                    <strong class="text-primary">Tip del día:</strong>
                    <span class="text-muted ms-2">Mantén tu perfil actualizado para aumentar tus oportunidades de encontrar trabajo.</span>
                  </div>
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

export default {
  name: 'AspiranteDashboard',
  emits: ['cambiar-tab'],
  computed: {
    ...mapGetters(['user']),
    userName() {
      // Extraer nombre del email si no hay nombre disponible
      return this.user?.nombre || this.user?.correo?.split('@')[0] || 'Aspirante'
    }
  },
  methods: {
    mostrarConfiguracion() {
      // Función placeholder para configuración
      alert('Configuración - Funcionalidad en desarrollo')
      // En el futuro esto podría abrir un modal o ir a una pestaña de configuración
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.welcome-card {
  border-radius: 20px;
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.welcome-illustration {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.stat-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  border-radius: 15px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.card-action {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover .card-action {
  opacity: 1;
}

.modern-card {
  border: none;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.nav-btn {
  padding: 1.2rem 0.8rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-width: 2px;
}

.nav-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.nav-btn i {
  font-size: 1.4rem;
  opacity: 0.8;
}

.nav-btn:hover i {
  opacity: 1;
  transform: scale(1.1);
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive optimizations */
@media (max-width: 768px) {
  .nav-btn {
    height: 80px;
    padding: 0.8rem 0.5rem;
    font-size: 0.85rem;
  }
  
  .nav-btn i {
    font-size: 1.1rem;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .welcome-card .card-body {
    text-align: center;
  }
  
  .welcome-illustration {
    display: none;
  }
}

@media (max-width: 576px) {
  .dashboard .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .nav-btn span {
    font-size: 0.75rem;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .bg-light {
    text-align: center;
  }
  
  .bg-light .d-flex {
    flex-direction: column;
    text-align: center;
  }
}

/* Mejoras de accesibilidad */
.nav-btn:focus,
.stat-card:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Animaciones suaves para interacciones */
.card-body h5,
.card-body p {
  transition: color 0.2s ease;
}

.stat-card:hover h5 {
  color: #495057;
}

/* Mejoras tipográficas */
.card-body h5 {
  font-weight: 600;
  letter-spacing: -0.025em;
}

.card-body p {
  line-height: 1.4;
}
</style>