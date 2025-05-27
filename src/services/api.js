  import axios from 'axios'

  // ⚠️ PROBAR PRIMERO CON HTTPS, SI FALLA USAR HTTP
  const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://localhost:7237/api'

  console.log('🔗 API Base URL:', API_BASE_URL)

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000,
    // ⭐ IGNORAR CERTIFICADOS SSL EN DESARROLLO
    httpsAgent: process.env.NODE_ENV === 'development' ? {
      rejectUnauthorized: false
    } : undefined
  })

  // Interceptor de request
  api.interceptors.request.use(
    (config) => {
      console.log('📤 REQUEST:', config.method?.toUpperCase(), config.url)
      console.log('📤 Full URL:', config.baseURL + config.url)
      console.log('📤 Data:', config.data)
      
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Interceptor de response
  api.interceptors.response.use(
    (response) => {
      console.log('✅ RESPONSE SUCCESS:', response.status, response.data)
      return response
    },
    (error) => {
      console.error('❌ RESPONSE ERROR DETAILS:')
      console.error('- Error Code:', error.code)
      console.error('- Error Message:', error.message)
      console.error('- Response Status:', error.response?.status)
      console.error('- Response Data:', error.response?.data)
      console.error('- Config URL:', error.config?.url)
      console.error('- Config Base URL:', error.config?.baseURL)
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      
      return Promise.reject(error)
    }
  )

  // Servicios de autenticación
  export const authService = {
    login: async (credentials) => {
      try {
        console.log('🔐 Intentando login con credenciales:', { correo: credentials.correo, clave: '***' })
        
        const response = await api.post('/Usuario/login', {
          correo: credentials.correo,
          clave: credentials.clave
        })
        
        console.log('✅ Login exitoso:', response.data)
        return response.data
        
      } catch (error) {
        console.error('❌ Error en login service:', error)
        
        // Mensajes específicos según el tipo de error
        if (error.code === 'ECONNREFUSED') {
          throw new Error('🔌 No se puede conectar al servidor. ¿Está tu backend ejecutándose en https://localhost:7237?')
        } else if (error.code === 'ENOTFOUND') {
          throw new Error('🌐 Host no encontrado. Verifica la URL del servidor.')
        } else if (error.code === 'CERT_HAS_EXPIRED' || error.message.includes('certificate')) {
          throw new Error('🔒 Error de certificado SSL. Intenta con HTTP en lugar de HTTPS.')
        } else if (error.response?.status === 401) {
          throw new Error('🔑 Email o contraseña incorrectos.')
        } else if (error.response?.status === 404) {
          throw new Error('❓ Endpoint /Usuario/login no encontrado. Verifica la URL.')
        } else if (error.response?.status === 0 || error.message.includes('Network Error')) {
          throw new Error('🌐 Error de red. Verifica CORS en tu backend.')
        } else {
          throw new Error(`❌ ${error.message}`)
        }
      }
    },

    register: async (userData) => {
      try {
        console.log('📝 Intentando registro para rol:', userData.rol)
        
        const response = await api.post('/Usuario/crear', {
          correo: userData.correo,
          clave: userData.clave,
          rol: userData.rol
        })
        
        console.log('✅ Registro exitoso:', response.data)
        return response.data
        
      } catch (error) {
        console.error('❌ Error en register service:', error)
        
        if (error.code === 'ECONNREFUSED') {
          throw new Error('🔌 No se puede conectar al servidor.')
        } else if (error.response?.status === 400) {
          throw new Error('📝 Datos inválidos o usuario ya existe.')
        } else {
          throw new Error(`❌ ${error.message}`)
        }
      }
    },

    createProfile: async (profileData, userType) => {
      try {
        console.log('👤 Creando perfil para tipo:', userType)
        
        // ⚠️ Admin no tiene endpoint de perfil
        if (userType === 'Admin') {
          console.log('🛡️ Admin no requiere perfil - saltando creación')
          return { message: 'Admin no requiere perfil adicional' }
        }
        
        let endpoint = ''
        if (userType === 'Aspirante') {
          endpoint = '/Aspirante/crear'
        } else if (userType === 'Empresa') {
          endpoint = '/Empresa/crear'
        } else {
          throw new Error(`Tipo de usuario no válido: ${userType}`)
        }
        
        console.log('📡 Enviando a endpoint:', endpoint)
        console.log('📡 Datos del perfil:', profileData)
        
        const response = await api.post(endpoint, profileData)
        console.log('✅ Perfil creado exitosamente:', response.data)
        
        return response.data
        
      } catch (error) {
        console.error('❌ Error creando perfil:', error)
        console.error('❌ Endpoint usado:', userType)
        console.error('❌ Datos enviados:', profileData)
        
        if (error.response?.status === 400) {
          throw new Error(`❌ Datos del perfil inválidos: ${error.response.data}`)
        } else if (error.response?.status === 404) {
          throw new Error(`❌ Endpoint no encontrado para ${userType}`)
        } else {
          throw new Error(`❌ Error al crear perfil de ${userType}: ${error.message}`)
        }
      }
    }
  }

  // Test de conectividad mejorado
  export const testConnection = async () => {
    const urls = [
      'https://localhost:7237/api',  // Tu URL HTTPS
      'http://localhost:7237/api',   // Fallback HTTP mismo puerto
      'http://localhost:5000/api',   // Puerto HTTP común
      'https://localhost:7000/api'   // Puerto HTTPS alternativo
    ]
    
    console.log('🔍 Probando conexión con múltiples URLs...')
    
    for (const url of urls) {
      try {
        console.log(`🔍 Probando: ${url}`)
        
        const testApi = axios.create({
          baseURL: url,
          timeout: 5000,
          httpsAgent: { rejectUnauthorized: false }
        })
        
        const response = await testApi.get('/Usuario/todos')
        console.log(`✅ ¡CONEXIÓN EXITOSA! URL: ${url}`)
        console.log(`✅ Status: ${response.status}`)
        
        return { success: true, url, data: response.data }
        
      } catch (error) {
        console.log(`❌ Falló: ${url} - ${error.code || error.message}`)
      }
    }
    
    console.error('❌ No se pudo conectar con ninguna URL')
    return { success: false, url: null }
  }

  export default api

// 🔌 SERVICIOS DE ADMINISTRACIÓN (Agregar al final de tu api.js existente)

// 👥 SERVICIOS ADMIN
export const adminService = {
  // Obtener todos los usuarios
  async obtenerTodosUsuarios() {
    try {
      const response = await api.get('/Usuario/todos')
      return response.data || []
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      return []
    }
  },

  // Crear nuevo usuario
  async crearUsuario(userData) {
    const response = await api.post('/Usuario/crear', userData)
    return response.data
  },

  // Editar usuario
  async editarUsuario(userData) {
    const response = await api.put('/Usuario/editar', userData)
    return response.data
  },

  // Eliminar usuario
  async eliminarUsuario(idUsuario) {
    const response = await api.delete(`/Usuario/eliminar/${idUsuario}`)
    return response.data
  },

  // Obtener estadísticas básicas
  async obtenerEstadisticas() {
    try {
      const [usuariosRes, aspirantesRes, empresasRes] = await Promise.all([
        api.get('/Usuario/todos').catch(() => ({ data: [] })),
        api.get('/Aspirante/todos').catch(() => ({ data: [] })),
        api.get('/Empresa/todas').catch(() => ({ data: [] }))
      ])

      const usuarios = usuariosRes.data || []
      const aspirantes = aspirantesRes.data || []
      const empresas = empresasRes.data || []
      
      const hoy = new Date()
      const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000)

      const usuariosActivos = usuarios.filter(u => u.estado === 'Activado' || !u.estado).length
      const usuariosNuevos = usuarios.filter(u => {
        if (!u.fechaRegistro) return false
        return new Date(u.fechaRegistro) >= hace30Dias
      }).length

      const usuariosPorRol = {
        Admin: usuarios.filter(u => u.rol === 'Admin').length,
        Empresa: usuarios.filter(u => u.rol === 'Empresa').length,
        Aspirante: usuarios.filter(u => u.rol === 'Aspirante').length
      }

      return {
        totalUsuarios: usuarios.length,
        usuariosActivos,
        usuariosNuevos,
        totalAspirantes: aspirantes.length,
        totalEmpresas: empresas.length,
        usuariosPorRol
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return {
        totalUsuarios: 0,
        usuariosActivos: 0,
        usuariosNuevos: 0,
        totalAspirantes: 0,
        totalEmpresas: 0,
        usuariosPorRol: { Admin: 0, Empresa: 0, Aspirante: 0 }
      }
    }
  }
}