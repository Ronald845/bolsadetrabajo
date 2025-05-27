<template>
  <div class="admin-dashboard">
    <div class="container-fluid py-4">
      <!-- Estadísticas Principales -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-4" v-for="(stat, key) in estadisticas" :key="key">
          <div class="card stat-card h-100" :class="`border-${stat.color}`">
            <div class="card-body text-center">
              <div class="stat-icon" :class="`bg-${stat.color}`">
                <i :class="stat.icon" class="text-white"></i>
              </div>
              <h3 class="mt-3 mb-1">{{ stat.value }}</h3>
              <p class="text-muted small mb-0">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen del Sistema -->
      <div class="row">
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-chart-bar me-2"></i>Actividad Reciente
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6 class="text-muted">Usuarios por Rol</h6>
                  <div v-for="(cantidad, rol) in stats.usuariosPorRol" :key="rol" class="d-flex justify-content-between mb-2">
                    <span>{{ getRolLabel(rol) }}</span>
                    <span class="badge" :class="`bg-${getRolColor(rol)}`">{{ cantidad }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <h6 class="text-muted">Estadísticas Generales</h6>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Usuarios Activos</span>
                    <span class="badge bg-success">{{ stats.usuariosActivos }}/{{ stats.totalUsuarios }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Nuevos (30 días)</span>
                    <span class="badge bg-info">{{ stats.usuariosNuevos }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Total Aspirantes</span>
                    <span class="badge bg-primary">{{ stats.totalAspirantes }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Total Empresas</span>
                    <span class="badge bg-warning">{{ stats.totalEmpresas }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado del Sistema -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-server me-2"></i>Estado del Sistema
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="d-flex align-items-center mb-3">
                    <div class="status-indicator bg-success me-3"></div>
                    <div>
                      <div class="fw-medium">Base de Datos</div>
                      <small class="text-muted">Conectada y funcionando</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-flex align-items-center mb-3">
                    <div class="status-indicator bg-success me-3"></div>
                    <div>
                      <div class="fw-medium">API Backend</div>
                      <small class="text-muted">Operativa</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-flex align-items-center mb-3">
                    <div class="status-indicator bg-success me-3"></div>
                    <div>
                      <div class="fw-medium">Panel Admin</div>
                      <small class="text-muted">Totalmente funcional</small>
                    </div>
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
import { adminService } from '../services/api'
import { ROLES } from '../utils/adminConstants'

export default {
  name: 'AdminDashboard',
  emits: ['cambiar-tab'],
  
  data() {
    return {
      loading: false,
      stats: {
        totalUsuarios: 0,
        usuariosActivos: 0,
        usuariosNuevos: 0,
        totalAspirantes: 0,
        totalEmpresas: 0,
        usuariosPorRol: { Admin: 0, Empresa: 0, Aspirante: 0 }
      }
    }
  },
  
  computed: {
    estadisticas() {
      return {
        usuarios: {
          value: this.stats.totalUsuarios,
          label: 'Total Usuarios',
          icon: 'fas fa-users',
          color: 'primary'
        },
        activos: {
          value: this.stats.usuariosActivos,
          label: 'Usuarios Activos',
          icon: 'fas fa-user-check',
          color: 'success'
        },
        aspirantes: {
          value: this.stats.totalAspirantes,
          label: 'Total Aspirantes',
          icon: 'fas fa-user-tie',
          color: 'info'
        },
        empresas: {
          value: this.stats.totalEmpresas,
          label: 'Total Empresas',
          icon: 'fas fa-building',
          color: 'warning'
        }
      }
    }
  },
  
  async mounted() {
    await this.cargarEstadisticas()
  },
  
  methods: {
    async cargarEstadisticas() {
      try {
        this.loading = true
        this.stats = await adminService.obtenerEstadisticas()
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
      } finally {
        this.loading = false
      }
    },
    
    getRolLabel(rol) {
      const rolData = ROLES.find(r => r.value === rol)
      return rolData ? rolData.label : rol
    },
    
    getRolColor(rol) {
      const rolData = ROLES.find(r => r.value === rol)
      return rolData ? rolData.color : 'secondary'
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  background: #f8f9fa;
  min-height: 100vh;
}

.stat-card {
  transition: all 0.3s ease;
  border-left: 4px solid;
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

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  border-radius: 10px;
}

.card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>