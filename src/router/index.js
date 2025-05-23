import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Importaciones de vistas
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AspiranteView from '../views/AspiranteView.vue'
import EmpresaView from '../views/EmpresaView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: () => {
      const isAuthenticated = store.getters.isAuthenticated
      const role = store.getters.userRole
      
      console.log('🏠 Redirect from / - Auth:', isAuthenticated, 'Role:', role)
      
      if (isAuthenticated && role) {
        switch (role) {
          case 'Aspirante': return '/aspirante'
          case 'Empresa': return '/empresa'
          case 'Admin': return '/admin'
          default: return '/login'
        }
      }
      return '/login'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/aspirante',
    name: 'Aspirante',
    component: AspiranteView,
    meta: { requiresAuth: true, role: 'Aspirante' },
    beforeEnter: (to, from, next) => {
      console.log('📘 Entrando a ruta ASPIRANTE')
      next()
    }
  },
  {
    path: '/empresa',
    name: 'Empresa',
    component: EmpresaView,
    meta: { requiresAuth: true, role: 'Empresa' },
    beforeEnter: (to, from, next) => {
      console.log('📗 Entrando a ruta EMPRESA')
      next()
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, role: 'Admin' },
    beforeEnter: (to, from, next) => {
      console.log('📕 Entrando a ruta ADMIN')
      console.log('Component:', AdminView)
      next()
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Router guard con más debugging
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const userRole = store.getters.userRole
  const user = store.getters.user
  
  console.log('🚦 Router Guard Detallado:', {
    to: to.path,
    from: from.path,
    isAuthenticated,
    userRole,
    user,
    requiresAuth: to.meta.requiresAuth,
    requiredRole: to.meta.role,
    timestamp: new Date().toISOString()
  })
  
  // Si va a una ruta que requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('❌ No autenticado, redirigiendo a login')
      next('/login')
      return
    }
    
    // Verificar rol específico
    if (to.meta.role && to.meta.role !== userRole) {
      console.log('❌ Rol incorrecto:', userRole, 'vs requerido:', to.meta.role)
      
      // Redirigir al dashboard correcto según el rol actual
      switch (userRole) {
        case 'Aspirante':
          console.log('➡️ Redirigiendo a dashboard Aspirante')
          next('/aspirante')
          break
        case 'Empresa':
          console.log('➡️ Redirigiendo a dashboard Empresa')
          next('/empresa')
          break
        case 'Admin':
          console.log('➡️ Redirigiendo a dashboard Admin')
          next('/admin')
          break
        default:
          console.log('➡️ Rol desconocido, redirigiendo a login')
          next('/login')
      }
      return
    }
  }
  
  // Si está autenticado y va a login/register, redirigir al dashboard
  if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    console.log('✅ Ya autenticado, redirigiendo al dashboard correspondiente')
    switch (userRole) {
      case 'Aspirante':
        next('/aspirante')
        break
      case 'Empresa':
        next('/empresa')
        break
      case 'Admin':
        next('/admin')
        break
      default:
        next()
    }
    return
  }
  
  console.log('✅ Permitiendo navegación a:', to.path)
  next()
})

// Agregar interceptor de errores de navegación
router.onError((error) => {
  console.error('❌ Error de navegación:', error)
})

// Debug de navegación
router.afterEach((to, from) => {
  console.log('✅ Navegación completada:', {
    from: from.path,
    to: to.path,
    timestamp: new Date().toISOString()
  })
})

export default router