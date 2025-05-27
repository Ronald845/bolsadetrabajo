<template>
  <div class="gestion-usuarios">
    <div class="container-fluid py-4">
      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3" v-for="(stat, key) in estadisticas" :key="key">
          <div class="card stat-card" :class="`border-${stat.color}`">
            <div class="card-body text-center">
                              <i :class="[stat.icon, 'fa-2x', 'mb-2', `text-${stat.color}`]"></i>
              <h4 class="mb-1">{{ stat.value }}</h4>
              <small class="text-muted">{{ stat.label }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Controles -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input v-model="busqueda" type="text" class="form-control" 
                       placeholder="Buscar por email...">
              </div>
            </div>
            <div class="col-md-3">
              <select v-model="filtroRol" class="form-select">
                <option value="">Todos los roles</option>
                <option v-for="rol in roles" :key="rol.value" :value="rol.value">
                  {{ rol.label }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <button @click="abrirModalCrear" class="btn btn-primary w-100">
                <i class="fas fa-plus me-2"></i>Nuevo Usuario
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla Usuarios -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-users me-2"></i>Usuarios del Sistema ({{ usuariosFiltrados.length }})
          </h5>
        </div>
        <div class="card-body p-0">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Cargando usuarios...</p>
          </div>

          <!-- Tabla -->
          <div v-else class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th width="200">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="usuario in usuariosPaginados" :key="usuario.idUsuario">
                  <!-- Email -->
                  <td>
                    <div class="d-flex align-items-center">
                                              <i :class="[getIconByRole(usuario.rol), 'me-2', `text-${getColorByRole(usuario.rol)}`]"></i>
                      <div>
                        <div class="fw-medium">{{ usuario.correo }}</div>
                        <small class="text-muted">ID: {{ usuario.idUsuario }}</small>
                      </div>
                    </div>
                  </td>

                  <!-- Rol (Editable) -->
                  <td>
                    <select v-model="usuario.rol" @change="cambiarRol(usuario)" 
                            class="form-select form-select-sm" :class="`text-${getColorByRole(usuario.rol)}`">
                      <option v-for="rol in roles" :key="rol.value" :value="rol.value">
                        {{ rol.label }}
                      </option>
                    </select>
                  </td>

                  <!-- Estado (Toggle) -->
                  <td>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" 
                             :checked="usuario.estado === 'Activado'" 
                             @change="cambiarEstado(usuario)">
                      <label class="form-check-label">
                        <span class="badge" :class="`bg-${usuario.estado === 'Activado' ? 'success' : 'danger'}`">
                          {{ usuario.estado === 'Activado' ? 'Activo' : 'Inactivo' }}
                        </span>
                      </label>
                    </div>
                  </td>

                  <!-- Fecha -->
                  <td>
                    <small>{{ formatFecha(usuario.fechaRegistro) }}</small>
                  </td>

                  <!-- Acciones -->
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button @click="abrirModalEditar(usuario)" class="btn btn-outline-primary" title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="eliminarUsuario(usuario)" class="btn btn-outline-danger" 
                              title="Eliminar" :disabled="usuario.rol === 'Admin' && usuario.idUsuario === currentUser?.idUsuario">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="d-flex justify-content-center p-3">
            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                  <button class="page-link" @click="paginaActual--" :disabled="paginaActual === 1">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                <li v-for="pagina in paginasVisibles" :key="pagina" class="page-item" :class="{ active: pagina === paginaActual }">
                  <button class="page-link" @click="paginaActual = pagina">{{ pagina }}</button>
                </li>
                <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                  <button class="page-link" @click="paginaActual++" :disabled="paginaActual === totalPaginas">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Modal Crear/Editar -->
      <div class="modal fade" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i :class="modoEdicion ? 'fas fa-edit' : 'fas fa-plus'" class="me-2"></i>
                {{ modoEdicion ? 'Editar Usuario' : 'Crear Usuario' }}
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarUsuario">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="formUsuario.correo" type="email" class="form-control" required>
                </div>
                <div class="mb-3" v-if="!modoEdicion">
                  <label class="form-label">Contraseña</label>
                  <input v-model="formUsuario.clave" type="password" class="form-control" 
                         minlength="6" required placeholder="Mínimo 6 caracteres">
                </div>
                <div class="mb-3">
                  <label class="form-label">Rol</label>
                  <select v-model="formUsuario.rol" class="form-select" required>
                    <option value="">Seleccionar rol</option>
                    <option v-for="rol in roles" :key="rol.value" :value="rol.value">
                      {{ rol.label }}
                    </option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="guardarUsuario" :disabled="guardando">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
                {{ modoEdicion ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop -->
      <div v-if="mostrarModal" class="modal-backdrop fade show" @click="cerrarModal"></div>

      <!-- Mensajes -->
      <div v-if="mensaje" class="position-fixed top-0 end-0 p-3" style="z-index: 1100;">
        <div class="toast show">
          <div class="toast-header" :class="tipoMensaje === 'success' ? 'bg-success text-white' : 'bg-danger text-white'">
            <i :class="tipoMensaje === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="me-2"></i>
            <strong class="me-auto">{{ tipoMensaje === 'success' ? 'Éxito' : 'Error' }}</strong>
            <button type="button" class="btn-close btn-close-white" @click="mensaje = ''"></button>
          </div>
          <div class="toast-body">{{ mensaje }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { adminService } from '../services/api'
import { ROLES, getColorByRole, getLabelByRole, getIconByRole } from '../utils/adminConstants'

export default {
  name: 'GestionUsuarios',
  
  data() {
    return {
      loading: false,
      usuarios: [],
      busqueda: '',
      filtroRol: '',
      paginaActual: 1,
      elementosPorPagina: 10,
      
      // Modal
      mostrarModal: false,
      modoEdicion: false,
      guardando: false,
      formUsuario: { correo: '', clave: '', rol: '', estado: 'Activado' },
      
      // Mensajes
      mensaje: '',
      tipoMensaje: 'success',
      
      // Configuración
      roles: ROLES,
      
      // Estadísticas
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
    ...mapGetters(['user']),
    
    currentUser() { return this.user },
    
    usuariosFiltrados() {
      if (!this.usuarios || !Array.isArray(this.usuarios)) return []
      
      return this.usuarios.filter(usuario => {
        if (!usuario) return false
        
        const correo = usuario.correo || ''
        const rol = usuario.rol || ''
        
        const matchBusqueda = correo.toLowerCase().includes(this.busqueda.toLowerCase())
        const matchRol = !this.filtroRol || rol === this.filtroRol
        return matchBusqueda && matchRol
      })
    },
    
    totalPaginas() {
      return Math.ceil(this.usuariosFiltrados.length / this.elementosPorPagina)
    },
    
    usuariosPaginados() {
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina
      return this.usuariosFiltrados.slice(inicio, inicio + this.elementosPorPagina)
    },
    
    paginasVisibles() {
      const total = this.totalPaginas
      const actual = this.paginaActual
      const rango = 2
      const inicio = Math.max(1, actual - rango)
      const fin = Math.min(total, actual + rango)
      const paginas = []
      for (let i = inicio; i <= fin; i++) paginas.push(i)
      return paginas
    },
    
    estadisticas() {
      // Validar que stats existe y tiene las propiedades necesarias
      const safeStats = this.stats || {}
      
      return {
        total: { 
          value: safeStats.totalUsuarios || 0, 
          label: 'Total Usuarios', 
          icon: 'fas fa-users', 
          color: 'primary' 
        },
        activos: { 
          value: safeStats.usuariosActivos || 0, 
          label: 'Usuarios Activos', 
          icon: 'fas fa-check-circle', 
          color: 'success' 
        },
        nuevos: { 
          value: safeStats.usuariosNuevos || 0, 
          label: 'Nuevos (30 días)', 
          icon: 'fas fa-user-plus', 
          color: 'info' 
        },
        admin: { 
          value: (safeStats.usuariosPorRol && safeStats.usuariosPorRol.Admin) || 0, 
          label: 'Administradores', 
          icon: 'fas fa-shield-alt', 
          color: 'danger' 
        }
      }
    }
  },
  
  async mounted() {
    console.log('🔧 GestionUsuarios montado')
    await this.cargarUsuarios()
  },
  
  methods: {
    // API
    async cargarUsuarios() {
      try {
        this.loading = true
        console.log('📡 Cargando usuarios...')
        
        const [usuarios, estadisticas] = await Promise.all([
          adminService.obtenerTodosUsuarios(),
          adminService.obtenerEstadisticas()
        ])
        
        this.usuarios = usuarios || []
        this.stats = estadisticas || {
          totalUsuarios: 0,
          usuariosActivos: 0,
          usuariosNuevos: 0,
          totalAspirantes: 0,
          totalEmpresas: 0,
          usuariosPorRol: { Admin: 0, Empresa: 0, Aspirante: 0 }
        }
        
        console.log('✅ Usuarios cargados:', this.usuarios.length)
        console.log('📊 Estadísticas:', this.stats)
        
      } catch (error) {
        console.error('❌ Error cargando usuarios:', error)
        this.mostrarMensaje('Error al cargar usuarios: ' + error.message, 'error')
        this.usuarios = []
        this.stats = {
          totalUsuarios: 0,
          usuariosActivos: 0,
          usuariosNuevos: 0,
          totalAspirantes: 0,
          totalEmpresas: 0,
          usuariosPorRol: { Admin: 0, Empresa: 0, Aspirante: 0 }
        }
      } finally {
        this.loading = false
      }
    },
    
    async guardarUsuario() {
      try {
        this.guardando = true
        
        if (this.modoEdicion) {
          await adminService.editarUsuario(this.formUsuario)
          this.mostrarMensaje('Usuario actualizado exitosamente')
        } else {
          await adminService.crearUsuario(this.formUsuario)
          this.mostrarMensaje('Usuario creado exitosamente')
        }
        
        this.cerrarModal()
        await this.cargarUsuarios()
        
      } catch (error) {
        console.error('Error guardando usuario:', error)
        this.mostrarMensaje('Error al guardar usuario', 'error')
      } finally {
        this.guardando = false
      }
    },
    
    async cambiarRol(usuario) {
      if (!usuario || !usuario.idUsuario) {
        this.mostrarMensaje('Usuario inválido', 'error')
        return
      }
      
      if (usuario.rol === 'Admin' && usuario.idUsuario === this.currentUser?.idUsuario) {
        this.mostrarMensaje('No puedes cambiar tu propio rol de administrador', 'error')
        await this.cargarUsuarios()
        return
      }
      
      try {
        // Solo enviar los campos que existen en el backend
        await adminService.editarUsuario({
          idUsuario: usuario.idUsuario,
          correo: usuario.correo || '',
          clave: usuario.clave || '', // Campo requerido por el backend
          rol: usuario.rol || 'Aspirante'
        })
        this.mostrarMensaje(`Rol cambiado a ${getLabelByRole(usuario.rol)}`)
      } catch (error) {
        console.error('Error cambiar rol:', error)
        this.mostrarMensaje('Error al cambiar rol: ' + (error.response?.data || error.message), 'error')
        await this.cargarUsuarios()
      }
    },
    
    async cambiarEstado(usuario) {
      // Por ahora, solo mostrar que la funcionalidad no está disponible
      this.mostrarMensaje('Funcionalidad de activar/desactivar será implementada próximamente', 'warning')
      
      // Recargar para resetear el toggle
      await this.cargarUsuarios()
    },
    
    async eliminarUsuario(usuario) {
      if (usuario.rol === 'Admin' && usuario.idUsuario === this.currentUser?.idUsuario) {
        this.mostrarMensaje('No puedes eliminar tu propia cuenta', 'error')
        return
      }
      
      if (!confirm(`¿Eliminar usuario ${usuario.correo}?\n\nEsta acción no se puede deshacer.`)) return
      
      try {
        await adminService.eliminarUsuario(usuario.idUsuario)
        this.mostrarMensaje('Usuario eliminado')
        await this.cargarUsuarios()
      } catch (error) {
        this.mostrarMensaje('Error al eliminar usuario', 'error')
      }
    },
    
    // Modal
    abrirModalCrear() {
      this.modoEdicion = false
      this.formUsuario = { correo: '', clave: '', rol: '', estado: 'Activado' }
      this.mostrarModal = true
    },
    
    abrirModalEditar(usuario) {
      this.modoEdicion = true
      this.formUsuario = { ...usuario }
      this.mostrarModal = true
    },
    
    cerrarModal() {
      this.mostrarModal = false
      this.formUsuario = { correo: '', clave: '', rol: '', estado: 'Activado' }
    },
    
    // Utilidades
    formatFecha(fecha) {
      return fecha ? new Date(fecha).toLocaleDateString('es-ES') : ''
    },
    
    mostrarMensaje(texto, tipo = 'success') {
      this.mensaje = texto
      this.tipoMensaje = tipo
      setTimeout(() => { this.mensaje = '' }, 5000)
    },
    
    getColorByRole,
    getLabelByRole,
    getIconByRole
  }
}
</script>

<style scoped>
.gestion-usuarios { background: #f8f9fa; min-height: 100vh; }

.stat-card { transition: transform 0.2s ease; border-left: 4px solid; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

.table th { background: #f8f9fa; font-weight: 600; border-top: none; }
.table td { vertical-align: middle; }

.form-select-sm { font-size: 0.8rem; }
.form-check-input:checked { background-color: #28a745; border-color: #28a745; }

.modal.show { display: block !important; }
.modal-backdrop { background: rgba(0,0,0,0.5); }

.toast { min-width: 300px; }
.btn-group-sm .btn { padding: 0.25rem 0.5rem; }

@media (max-width: 768px) {
  .table-responsive { font-size: 0.9rem; }
  .btn-group-sm .btn { padding: 0.2rem 0.4rem; }
  .stat-card { margin-bottom: 1rem; }
}
</style>