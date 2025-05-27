<template>
  <div class="admin-container">
    <!-- Header Admin Rediseñado -->
    <div class="admin-header">
      <div class="container-fluid">
        <div class="row align-items-center py-4">
          <div class="col-md-8">
            <div class="header-content">
              <h1 class="admin-title mb-2">
                <i class="fas fa-shield-alt me-3"></i>Panel de Administración
              </h1>
              <p class="admin-subtitle mb-0">Sistema de gestión integral - Bolsa de Trabajo</p>
            </div>
          </div>
          <div class="col-md-4 text-end">
            <div class="admin-controls">
              <div class="system-status-card">
                <span class="status-indicator online"></span>
                <span class="status-text">Sistema Activo</span>
              </div>
              <button @click="cerrarSesion" class="btn btn-admin-logout">
                <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegación Mejorada -->
    <div class="admin-navigation">
      <div class="container-fluid">
        <div class="nav-wrapper">
          <div class="nav-card" 
               :class="{ active: activeTab === 'dashboard' }" 
               @click="activeTab = 'dashboard'">
            <div class="nav-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="nav-content">
              <h6 class="nav-title">Dashboard</h6>
              <small class="nav-description">Vista general del sistema</small>
            </div>
            <div class="nav-indicator"></div>
          </div>
          
          <div class="nav-card" 
               :class="{ active: activeTab === 'usuarios' }" 
               @click="activeTab = 'usuarios'">
            <div class="nav-icon">
              <i class="fas fa-users-cog"></i>
            </div>
            <div class="nav-content">
              <h6 class="nav-title">Gestión de Usuarios</h6>
              <small class="nav-description">Administrar usuarios</small>
            </div>
            <div class="nav-indicator"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="admin-content">
      <div class="content-wrapper">
        <AdminDashboard v-if="activeTab === 'dashboard'" />
        <GestionUsuarios v-if="activeTab === 'usuarios'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AdminDashboard from '../components/AdminDashboard.vue'
import GestionUsuarios from '../components/GestionUsuarios.vue'

export default {
  name: 'AdminView',
  components: { AdminDashboard, GestionUsuarios },
  
  data() {
    return {
      activeTab: 'dashboard'
    }
  },
  
  mounted() {
    console.log('🛡️ Admin Panel Rediseñado Cargado')
  },
  
  methods: {
    ...mapActions(['logout']),
    
    async cerrarSesion() {
      if (confirm('¿Cerrar sesión de administrador?')) {
        await this.logout()
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
/* === CONTAINER PRINCIPAL === */
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

/* === HEADER === */
.admin-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-content {
  color: white;
}

.admin-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  letter-spacing: -0.02em;
}

.admin-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.admin-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.system-status-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 0.75rem 1.25rem;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.system-status-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
}

.status-indicator.online {
  background: #10b981;
  animation: pulse-green 2s infinite;
}

.status-text {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-admin-logout {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-admin-logout:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@keyframes pulse-green {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.1);
  }
}

/* === NAVEGACIÓN === */
.admin-navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.nav-wrapper {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  min-width: 280px;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s;
}

.nav-card:hover::before {
  left: 100%;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.nav-card.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.nav-card.active .nav-title,
.nav-card.active .nav-description {
  color: white;
}

.nav-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
  transition: all 0.3s ease;
}

.nav-card.active .nav-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.nav-content {
  flex: 1;
}

.nav-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  transition: color 0.3s ease;
}

.nav-description {
  font-size: 0.85rem;
  color: #718096;
  margin: 0;
  transition: color 0.3s ease;
}

.nav-indicator {
  width: 4px;
  height: 30px;
  background: transparent;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nav-card.active .nav-indicator {
  background: rgba(255, 255, 255, 0.8);
}

/* === CONTENIDO === */
.admin-content {
  padding: 0;
  background: transparent;
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px 20px 0 0;
  margin: 2rem 1rem 0;
  min-height: calc(100vh - 240px);
  box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .admin-title {
    font-size: 1.8rem;
  }
  
  .admin-subtitle {
    font-size: 1rem;
  }
  
  .admin-controls {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
  
  .nav-wrapper {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-card {
    min-width: auto;
    padding: 1rem 1.5rem;
  }
  
  .nav-icon {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  
  .nav-title {
    font-size: 1rem;
  }
  
  .nav-description {
    font-size: 0.8rem;
  }
  
  .content-wrapper {
    margin: 1rem 0.5rem 0;
  }
}

@media (max-width: 576px) {
  .admin-header .row {
    text-align: center;
  }
  
  .admin-controls {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .nav-card {
    text-align: center;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .nav-content {
    text-align: center;
  }
  
  .nav-indicator {
    display: none;
  }
}

/* === ANIMACIONES === */
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

.admin-container {
  animation: fadeIn 0.6s ease-out;
}

.nav-card {
  animation: fadeIn 0.8s ease-out;
}

.nav-card:nth-child(2) {
  animation-delay: 0.1s;
}

/* === MEJORAS VISUALES === */
.admin-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

/* === ACCESIBILIDAD === */
.nav-card:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

.btn-admin-logout:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}
</style>