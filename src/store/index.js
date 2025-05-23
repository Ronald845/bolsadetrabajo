import { createStore } from 'vuex'
import { authService } from '../services/api'

export default createStore({
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    userRole: state => state.user?.rol || null,
    isAspirante: state => state.user?.rol === 'Aspirante',
    isEmpresa: state => state.user?.rol === 'Empresa',
    isAdmin: state => state.user?.rol === 'Admin',
    loading: state => state.loading,
    error: state => state.error
  },
  
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_ERROR(state, error) {
      state.error = error
      console.error('🔴 Error en store:', error)
    },
    
    CLEAR_ERROR(state) {
      state.error = null
    },
    
    SET_AUTH_DATA(state, { token, user }) {
      state.token = token
      state.user = user
      state.isAuthenticated = true
      state.error = null
      console.log('✅ Usuario autenticado:', user)
    },
    
    CLEAR_AUTH_DATA(state) {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.error = null
      console.log('🚪 Sesión cerrada')
    },
    
    SET_USER(state, user) {
      state.user = user
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        console.log('🔐 Iniciando proceso de login...')
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        
        const response = await authService.login(credentials)
        
        if (!response.token) {
          throw new Error('No se recibió token del servidor')
        }
        
        const token = response.token
        
        // Decodificar el token para obtener información del usuario
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          console.log('🔍 Token decodificado completo:', payload)
          
          // Los claims de .NET vienen con URLs largas
          // Buscar el userId - .NET usa este formato largo para nameidentifier
          const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] 
                      || payload.nameid 
                      || payload.sub
                      || payload.NameIdentifier
                      || payload.Id
                      
          // Buscar el rol - .NET usa este formato largo para role
          const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
                     || payload.role
                     || payload.Role
                     || payload.rol
          
          console.log('📋 Claims extraídos:', { userId, role })
          
          if (!userId || !role) {
            console.error('❌ Claims del token:', payload)
            console.error('❌ No se encontró userId o role en el token')
            throw new Error('Token inválido: faltan claims necesarios')
          }
          
          const user = {
            idUsuario: parseInt(userId),
            correo: credentials.correo,
            rol: role
          }
          
          console.log('👤 Usuario construido:', user)
          console.log('🎭 Rol detectado:', role)
          
          // Guardar en localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          
          // Actualizar estado
          commit('SET_AUTH_DATA', { token, user })
          
          return { success: true, user }
          
        } catch (tokenError) {
          console.error('❌ Error decodificando token:', tokenError)
          throw new Error('Token recibido no es válido')
        }
        
      } catch (error) {
        console.error('❌ Error en login action:', error)
        const errorMessage = error.message || 'Error desconocido al iniciar sesión'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async register({ commit }, userData) {
      try {
        console.log('📝 Iniciando proceso de registro...')
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        
        const response = await authService.register(userData)
        
        if (!response.id && !response.IdUsuario) {
          console.error('❌ Respuesta del registro:', response)
          throw new Error('No se recibió ID del usuario creado')
        }
        
        const userId = response.id || response.IdUsuario
        console.log('✅ Usuario creado con ID:', userId)
        
        return { success: true, data: { id: userId } }
        
      } catch (error) {
        console.error('❌ Error en register action:', error)
        const errorMessage = error.message || 'Error desconocido al registrar usuario'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createProfile({ commit }, { profileData, userType }) {
      try {
        console.log('👤 Creando perfil...')
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        
        const response = await authService.createProfile(profileData, userType)
        console.log('✅ Perfil creado:', response)
        
        return { success: true, data: response }
        
      } catch (error) {
        console.error('❌ Error en createProfile action:', error)
        const errorMessage = error.message || 'Error desconocido al crear perfil'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    logout({ commit }) {
      console.log('🚪 Cerrando sesión...')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      commit('CLEAR_AUTH_DATA')
    },
    
    initializeAuth({ commit }) {
      console.log('🔄 Inicializando autenticación...')
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        try {
          const userData = JSON.parse(user)
          console.log('✅ Sesión restaurada para:', userData)
          console.log('📋 Rol del usuario:', userData.rol)
          
          // Validar que el rol sea uno de los esperados
          if (!['Admin', 'Aspirante', 'Empresa'].includes(userData.rol)) {
            console.error('❌ Rol no válido:', userData.rol)
            throw new Error('Rol de usuario no válido')
          }
          
          commit('SET_AUTH_DATA', { token, user: userData })
        } catch (error) {
          console.error('❌ Error parseando datos de usuario:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } else {
        console.log('ℹ️ No hay sesión previa')
      }
    }
  }
})