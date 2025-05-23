<template>
  <div id="app">
    <!-- Navbar solo para usuarios autenticados -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow" v-if="isAuthenticated">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" :to="dashboardRoute">
          <i class="fas fa-briefcase me-2"></i>
          Bolsa de Trabajo
        </router-link>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link 
                class="nav-link" 
                :to="dashboardRoute"
                :class="{ active: $route.path === dashboardRoute }"
              >
                <i class="fas fa-home me-1"></i>
                Dashboard
              </router-link>
            </li>
          </ul>
          
          <div class="navbar-nav">
            <span class="navbar-text me-3 d-none d-md-block">
              <i class="fas fa-user me-1"></i>
              {{ user?.correo }} 
              <span class="badge bg-light text-dark ms-1">{{ user?.rol }}</span>
            </span>
            <button 
              class="btn btn-outline-light btn-sm logout-btn" 
              @click="logout"
              :disabled="logoutLoading"
            >
              <span v-if="logoutLoading" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="fas fa-sign-out-alt me-1"></i>
              {{ logoutLoading ? 'Cerrando...' : 'Cerrar Sesión' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Panel de Debug para Admin -->
    <div v-if="isAuthenticated && userRole === 'Admin'" class="bg-danger text-white p-2 text-center">
      <strong>DEBUG ADMIN:</strong> Usuario detectado como Admin
      <button @click="testAdminNavigation" class="btn btn-warning btn-sm ms-2">
        Forzar navegación a /admin
      </button>
    </div>

    <!-- Contenido principal -->
    <main :class="{ 'with-navbar': isAuthenticated }">
      <router-view />
    </main>
    
    <!-- Debug info -->
    <div v-if="debugMode" style="position: fixed; bottom: 10px; right: 10px; background: black; color: white; padding: 10px; font-size: 12px; z-index: 9999;">
      <div>Ruta actual: {{ $route.path }}</div>
      <div>Autenticado: {{ isAuthenticated }}</div>
      <div>Rol: {{ userRole }}</div>
      <div>Usuario: {{ user?.correo }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      logoutLoading: false,
      debugMode: true // Activar para ver info de debug
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'user', 'userRole']),
    
    dashboardRoute() {
      switch (this.userRole) {
        case 'Aspirante': return '/aspirante'
        case 'Empresa': return '/empresa'  
        case 'Admin': return '/admin'
        default: return '/'
      }
    }
  },
  watch: {
    $route(to) {
      console.log('📍 Ruta cambiada a:', to.path)
    }
  },
  methods: {
    async logout() {
      try {
        this.logoutLoading = true
        
        // Limpiar el storage primero
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Luego limpiar el store
        this.$store.dispatch('logout')
        
        // Finalmente redirigir
        this.$router.push('/login')
        
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        this.logoutLoading = false
      }
    },
    
    testAdminNavigation() {
      console.log('🔴 Forzando navegación a /admin')
      this.$router.push('/admin').then(() => {
        console.log('✅ Navegación completada')
      }).catch(error => {
        console.error('❌ Error al navegar:', error)
        // Intentar con window.location
        window.location.href = '#/admin'
      })
    }
  }
}
</script>

<style>
/* Reset y estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Contenido principal */
main {
  min-height: 100vh;
}

main.with-navbar {
  min-height: calc(100vh - 56px);
  padding-top: 0;
}

/* Navbar estilos */
.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand {
  font-weight: 600;
  font-size: 1.25rem;
  text-decoration: none;
}

.navbar-brand:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.nav-link {
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.nav-link.active {
  background-color: rgba(255,255,255,0.1) !important;
  border-radius: 5px;
}

.navbar-text {
  font-size: 0.9rem;
}

.badge {
  font-size: 0.7rem;
}

/* Botones */
.btn {
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.logout-btn:hover:not(:disabled) {
  box-shadow: 0 2px 8px rgba(255,255,255,0.2);
}

.logout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Cards generales */
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.1rem;
  }
  
  .navbar-text {
    font-size: 0.8rem;
  }
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

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>