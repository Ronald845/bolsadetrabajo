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
                  <h3 class="mb-2">¡Bienvenida, Empresa! 🏢</h3>
                  <p class="mb-0 opacity-75">Gestiona tus ofertas laborales y encuentra el mejor talento para tu organización</p>
                </div>
                <div class="col-auto d-none d-md-block">
                  <i class="fas fa-building fa-3x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Estadísticas rápidas -->
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-success">
                <i class="fas fa-building text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Mi Empresa</h5>
              <p class="text-muted small mb-0">Perfil corporativo</p>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-primary">
                <i class="fas fa-plus-circle text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Crear Oferta</h5>
              <p class="text-muted small mb-0">Nueva vacante</p>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-warning">
                <i class="fas fa-list text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Mis Ofertas</h5>
              <p class="text-muted small mb-0">Gestionar vacantes</p>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card stat-card h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-info">
                <i class="fas fa-users text-white"></i>
              </div>
              <h5 class="mt-3 mb-1">Candidatos</h5>
              <p class="text-muted small mb-0">Aplicaciones recibidas</p>
            </div>
          </div>
        </div>
        
        <!-- Acciones rápidas -->
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0 d-flex align-items-center">
                <i class="fas fa-rocket me-2 text-success"></i>
                Acciones Rápidas
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-lg-3 col-md-6">
                  <button class="btn btn-outline-success w-100 action-btn" disabled>
                    <i class="fas fa-edit mb-2 d-block"></i>
                    <span>Editar Perfil Empresa</span>
                  </button>
                </div>
                <div class="col-lg-3 col-md-6">
                  <button class="btn btn-outline-primary w-100 action-btn" disabled>
                    <i class="fas fa-plus mb-2 d-block"></i>
                    <span>Publicar Nueva Oferta</span>
                  </button>
                </div>
                <div class="col-lg-3 col-md-6">
                  <button class="btn btn-outline-info w-100 action-btn" disabled>
                    <i class="fas fa-eye mb-2 d-block"></i>
                    <span>Ver Aplicaciones</span>
                  </button>
                </div>
                <div class="col-lg-3 col-md-6">
                  <button class="btn btn-outline-warning w-100 action-btn" disabled>
                    <i class="fas fa-chart-bar mb-2 d-block"></i>
                    <span>Reportes</span>
                  </button>
                </div>
              </div>
              
              <div class="alert alert-info mt-4 mb-0">
                <div class="d-flex align-items-center">
                  <i class="fas fa-info-circle me-2 text-info"></i>
                  <div>
                    <strong>Próximamente:</strong> Estas funcionalidades estarán disponibles en futuras versiones del sistema.
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
  name: 'EmpresaDashboard',
  computed: {
    ...mapGetters(['user']),
    empresaName() {
      // Extraer nombre de empresa del email si no hay nombre disponible
      return this.user?.nombreEmpresa || this.user?.correo?.split('@')[0] || 'Empresa'
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

.stat-card {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
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

.action-btn {
  padding: 1.5rem 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn i {
  font-size: 1.5rem;
}

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

@media (max-width: 768px) {
  .action-btn {
    height: 80px;
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
  
  .card-body h5 {
    font-size: 1rem;
  }
  
  .card-body .small {
    font-size: 0.8rem;
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
  
  .col-lg-3 {
    margin-bottom: 1rem;
  }
}
</style>