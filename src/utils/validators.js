// 🔐 VALIDACIONES ROBUSTAS DE CONTRASEÑAS - SOLO FRONTEND
import CryptoJS from 'crypto-js' // npm install crypto-js

export const validators = {
  // ✅ VALIDACIONES EXISTENTES (conservadas)
  required: (value) => value !== null && value !== undefined && value !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max,
  telefono: (value) => /^[\d\-\+\(\)\s]+$/.test(value) && value.length >= 8,
  
  // 🆕 VALIDACIONES DE CONTRASEÑA ROBUSTAS
  password: {
    // ✅ Mínimo 8 caracteres
    minLength: (value) => value && value.length >= 8,
    
    // ✅ Debe llevar mayúscula
    hasUppercase: (value) => value && /[A-Z]/.test(value),
    
    // ✅ Debe llevar minúscula
    hasLowercase: (value) => value && /[a-z]/.test(value),
    
    // ✅ Debe llevar número
    hasNumber: (value) => value && /\d/.test(value),
    
    // ✅ Debe llevar símbolo especial
    hasSpecialChar: (value) => value && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value),
    
    // ✅ Debe iniciar con letra
    startsWithLetter: (value) => value && /^[a-zA-Z]/.test(value),
    
    // ✅ No debe contener espacios
    noSpaces: (value) => value && !/\s/.test(value),
    
    // ✅ Validación completa
    isValid: (value) => {
      if (!value) return false
      
      return validators.password.minLength(value) &&
             validators.password.hasUppercase(value) &&
             validators.password.hasLowercase(value) &&
             validators.password.hasNumber(value) &&
             validators.password.hasSpecialChar(value) &&
             validators.password.startsWithLetter(value) &&
             validators.password.noSpaces(value) &&
             !securityConfig.isCommonPassword(value)
    },
    
    // 🎯 Calcular fuerza de la contraseña (0-100)
    getStrength: (value) => {
      if (!value) return 0
      
      let strength = 0
      const checks = [
        { test: validators.password.minLength(value), points: 20 },
        { test: validators.password.hasUppercase(value), points: 15 },
        { test: validators.password.hasLowercase(value), points: 15 },
        { test: validators.password.hasNumber(value), points: 15 },
        { test: validators.password.hasSpecialChar(value), points: 20 },
        { test: validators.password.startsWithLetter(value), points: 10 },
        { test: validators.password.noSpaces(value), points: 5 }
      ]
      
      checks.forEach(check => {
        if (check.test) strength += check.points
      })
      
      // Penalizar contraseñas comunes
      if (securityConfig.isCommonPassword(value)) {
        strength -= 30
      }
      
      return Math.max(0, Math.min(strength, 100))
    },
    
    // 📊 Obtener nivel de fuerza
    getStrengthLevel: (value) => {
      const strength = validators.password.getStrength(value)
      
      if (strength < 40) return { level: 'weak', label: 'Muy Débil', color: 'danger' }
      if (strength < 60) return { level: 'medium', label: 'Débil', color: 'warning' }
      if (strength < 80) return { level: 'good', label: 'Buena', color: 'info' }
      if (strength < 95) return { level: 'strong', label: 'Fuerte', color: 'success' }
      return { level: 'excellent', label: 'Excelente', color: 'primary' }
    },
    
    // 🔐 HASH SHA256 EN EL FRONTEND (para envío seguro)
    hashSHA256: (password) => {
      if (!password) return ''
      
      // Generar salt aleatorio
      const salt = CryptoJS.lib.WordArray.random(256/8).toString()
      
      // Combinar password + salt
      const passwordWithSalt = password + salt
      
      // Hash SHA256
      const hash = CryptoJS.SHA256(passwordWithSalt).toString()
      
      // Retornar salt$hash para verificación posterior
      return `${salt}$${hash}`
    },
    
    // 🔍 Verificar hash SHA256
    verifyHash: (password, hashedPassword) => {
      if (!password || !hashedPassword) return false
      
      try {
        const parts = hashedPassword.split('$')
        if (parts.length !== 2) return false
        
        const [salt, originalHash] = parts
        const passwordWithSalt = password + salt
        const newHash = CryptoJS.SHA256(passwordWithSalt).toString()
        
        return originalHash === newHash
      } catch {
        return false
      }
    }
  },
  
  // 🔒 Validar confirmación de contraseña
  passwordConfirmation: (password, confirmation) => password === confirmation
}

// 🆕 MENSAJES DE ERROR ROBUSTOS
export const errorMessages = {
  // ✅ MENSAJES EXISTENTES (conservados)
  required: 'Este campo es obligatorio',
  email: 'El formato del email no es válido',
  telefono: 'El formato del teléfono no es válido',
  
  // 🆕 MENSAJES DE CONTRASEÑA ESPECÍFICOS
  password: {
    minLength: '🔢 Mínimo 8 caracteres',
    hasUppercase: '🔠 Al menos una letra MAYÚSCULA (A-Z)',
    hasLowercase: '🔡 Al menos una letra minúscula (a-z)',
    hasNumber: '🔢 Al menos un número (0-9)',
    hasSpecialChar: '🔣 Al menos un símbolo especial (!@#$%^&*)',
    startsWithLetter: '🔤 Debe comenzar con una letra',
    noSpaces: '🚫 Sin espacios en blanco',
    invalid: '❌ La contraseña no cumple con los requisitos de seguridad',
    confirmation: '🔄 Las contraseñas no coinciden',
    tooCommon: '⚠️ Esta contraseña es muy común, elige una más única'
  }
}

// 🎯 UTILIDADES PARA CONTRASEÑAS
export const passwordUtils = {
  // 📋 Obtener lista de requisitos con estado
  getRequirements: (password) => [
    {
      id: 'minLength',
      label: 'Mínimo 8 caracteres',
      emoji: '🔢',
      satisfied: validators.password.minLength(password),
      message: errorMessages.password.minLength
    },
    {
      id: 'hasUppercase',
      label: 'Una letra MAYÚSCULA',
      emoji: '🔠',
      satisfied: validators.password.hasUppercase(password),
      message: errorMessages.password.hasUppercase
    },
    {
      id: 'hasLowercase',
      label: 'Una letra minúscula',
      emoji: '🔡',
      satisfied: validators.password.hasLowercase(password),
      message: errorMessages.password.hasLowercase
    },
    {
      id: 'hasNumber',
      label: 'Un número',
      emoji: '🔢',
      satisfied: validators.password.hasNumber(password),
      message: errorMessages.password.hasNumber
    },
    {
      id: 'hasSpecialChar',
      label: 'Un símbolo especial',
      emoji: '🔣',
      satisfied: validators.password.hasSpecialChar(password),
      message: errorMessages.password.hasSpecialChar
    },
    {
      id: 'startsWithLetter',
      label: 'Empezar con letra',
      emoji: '🔤',
      satisfied: validators.password.startsWithLetter(password),
      message: errorMessages.password.startsWithLetter
    },
    {
      id: 'noSpaces',
      label: 'Sin espacios',
      emoji: '🚫',
      satisfied: validators.password.noSpaces(password),
      message: errorMessages.password.noSpaces
    },
    {
      id: 'notCommon',
      label: 'No muy común',
      emoji: '⚠️',
      satisfied: !securityConfig.isCommonPassword(password),
      message: errorMessages.password.tooCommon
    }
  ],
  
  // 🎨 Generar contraseña segura
  generateSecurePassword: (length = 12) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    // ✅ Asegurar que tenga al menos uno de cada tipo
    let password = ''
    
    // Empezar con letra (requisito)
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    
    // Agregar al menos uno de cada tipo requerido
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += special[Math.floor(Math.random() * special.length)]
    
    // Completar el resto
    const allChars = lowercase + uppercase + numbers + special
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // ✅ Mezclar caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('')
  },
  
  // 🔍 Analizar contraseña completa
  analyzePassword: (password) => {
    const requirements = passwordUtils.getRequirements(password)
    const strength = validators.password.getStrength(password)
    const level = validators.password.getStrengthLevel(password)
    
    return {
      requirements,
      strength,
      level,
      isValid: validators.password.isValid(password),
      satisfiedCount: requirements.filter(req => req.satisfied).length,
      totalRequirements: requirements.length
    }
  }
}

// 🔐 CONFIGURACIÓN DE SEGURIDAD
export const securityConfig = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    mustStartWithLetter: true,
    noSpaces: true
  },
  
  // 🚫 Contraseñas comunes prohibidas (Top 50)
  forbiddenPasswords: [
    'password', 'password123', '12345678', 'qwerty123', 'abc123456',
    'admin123', 'letmein123', 'welcome123', 'Password1', 'password1',
    'Password123', '123456789', 'qwerty', 'letmein', 'welcome',
    'admin', 'login', 'passw0rd', 'master', 'hello',
    'freedom', 'whatever', 'qazwsx', 'trustno1', '654321',
    'jordan23', 'harley', '1234', 'robert', 'matthew',
    'jordan', 'michelle', 'mindy', 'patrick', '123abc',
    'andrew', 'joshua', '1qaz2wsx', 'password12', 'welcome123',
    'monkey', 'dragon', 'football', 'baseball', 'superman',
    'iloveyou', 'starwars', 'chocolate', 'princess', 'computer',
    'sunshine', 'butterfly', 'purple', 'rainbow', 'cookie'
  ],
  
  // ✅ Validar contra contraseñas comunes
  isCommonPassword: (password) => {
    if (!password) return false
    const lowerPassword = password.toLowerCase()
    return securityConfig.forbiddenPasswords.some(forbidden => 
      lowerPassword.includes(forbidden.toLowerCase()) ||
      forbidden.toLowerCase().includes(lowerPassword)
    )
  },
  
  // 🎯 Obtener recomendaciones de seguridad
  getSecurityTips: () => [
    '💡 Usa una frase memorable con números y símbolos',
    '🔄 Cambia tus contraseñas regularmente',
    '🚫 No reutilices contraseñas importantes',
    '📱 Considera usar un gestor de contraseñas',
    '🔐 Activa autenticación de dos factores cuando sea posible'
  ]
}

// 🎨 UTILIDADES DE PRESENTACIÓN
export const displayUtils = {
  // 🎨 Obtener color por nivel de seguridad
  getStrengthColor: (strength) => {
    if (strength < 40) return '#dc3545' // Rojo
    if (strength < 60) return '#fd7e14' // Naranja  
    if (strength < 80) return '#ffc107' // Amarillo
    if (strength < 95) return '#28a745' // Verde
    return '#007bff' // Azul
  },
  
  // 📊 Obtener mensaje motivacional
  getMotivationalMessage: (strength) => {
    if (strength < 40) return '💪 ¡Puedes hacerlo mejor!'
    if (strength < 60) return '👍 Vas por buen camino'
    if (strength < 80) return '😊 ¡Muy bien!'
    if (strength < 95) return '🔥 ¡Excelente seguridad!'
    return '🏆 ¡Contraseña perfecta!'
  },
  
  // ⏱️ Estimar tiempo de crack
  estimateCrackTime: (password) => {
    if (!password) return 'Instantáneo'
    
    const length = password.length
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)
    
    let complexity = 0
    if (hasLower) complexity += 26
    if (hasUpper) complexity += 26  
    if (hasNumber) complexity += 10
    if (hasSpecial) complexity += 32
    
    const combinations = Math.pow(complexity, length)
    const secondsToGuess = combinations / (2 * 1000000000) // 1B guesses/sec
    
    if (secondsToGuess < 1) return 'Menos de 1 segundo'
    if (secondsToGuess < 60) return `${Math.round(secondsToGuess)} segundos`
    if (secondsToGuess < 3600) return `${Math.round(secondsToGuess/60)} minutos`
    if (secondsToGuess < 86400) return `${Math.round(secondsToGuess/3600)} horas`
    if (secondsToGuess < 31536000) return `${Math.round(secondsToGuess/86400)} días`
    return 'Más de 1 año'
  }
}


// Agregar al final del archivo validators.js existente

// 🆕 VALIDACIONES ESPECÍFICAS PARA EL SALVADOR
export const validadoresSalvador = {
  // Validar DUI salvadoreño
  dui: (value) => {
    if (!value) return true // Opcional
    const duiPattern = /^\d{8}-\d$/
    return duiPattern.test(value)
  },
  
  // Validar NIT salvadoreño
  nit: (value) => {
    if (!value) return true // Opcional
    const nitPattern = /^\d{4}-\d{6}-\d{3}-\d$/
    return nitPattern.test(value)
  },
  
  // Validar NUP (Número Único Provisional)
  nup: (value) => {
    if (!value) return true // Opcional
    const nupPattern = /^[A-Z]{2}\d{6,10}$/
    return nupPattern.test(value)
  },
  
  // Validar fecha de nacimiento
  fechaNacimiento: (value) => {
    if (!value) return true // Opcional
    
    const fecha = new Date(value)
    const hoy = new Date()
    const hace120Anos = new Date()
    hace120Anos.setFullYear(hoy.getFullYear() - 120)
    
    return fecha <= hoy && fecha >= hace120Anos
  },
  
  // Validar edad mínima
  edadMinima: (fechaNacimiento, edadMinima = 16) => {
    if (!fechaNacimiento) return true
    
    const fecha = new Date(fechaNacimiento)
    const hoy = new Date()
    const edad = hoy.getFullYear() - fecha.getFullYear()
    const cumplioEsteAno = hoy >= new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())
    
    return cumplioEsteAno ? edad >= edadMinima : (edad - 1) >= edadMinima
  },
  
  // Validar URLs de redes sociales
  redesSociales: (value) => {
    if (!value) return true // Opcional
    
    // Permitir URLs, handles (con @) o texto libre
    const urlPattern = /^https?:\/\/.+/
    const handlePattern = /^@.+/
    
    return urlPattern.test(value) || handlePattern.test(value) || value.length <= 500
  }
}

// 🆕 MENSAJES DE ERROR ESPECÍFICOS
export const erroresSalvador = {
  dui: 'El DUI debe tener el formato: 12345678-9',
  nit: 'El NIT debe tener el formato: 1234-567890-123-4',
  nup: 'El NUP debe tener el formato: AB123456 (2 letras seguidas de números)',
  fechaNacimiento: 'La fecha de nacimiento no es válida',
  edadMinima: 'Debe ser mayor de 16 años',
  redesSociales: 'Las redes sociales pueden ser URLs, handles (@usuario) o texto libre (máx. 500 caracteres)'
}

// 🆕 HELPER PARA FORMATEAR DOCUMENTOS MIENTRAS SE ESCRIBE
export const formatearDocumento = {
  dui: (value) => {
    // Remover todo excepto números
    const numeros = value.replace(/\D/g, '')
    
    // Aplicar formato 12345678-9
    if (numeros.length >= 8) {
      return `${numeros.slice(0, 8)}-${numeros.slice(8, 9)}`
    }
    return numeros
  },
  
  nit: (value) => {
    // Remover todo excepto números
    const numeros = value.replace(/\D/g, '')
    
    // Aplicar formato 1234-567890-123-4
    if (numeros.length >= 14) {
      return `${numeros.slice(0, 4)}-${numeros.slice(4, 10)}-${numeros.slice(10, 13)}-${numeros.slice(13, 14)}`
    } else if (numeros.length >= 10) {
      return `${numeros.slice(0, 4)}-${numeros.slice(4, 10)}-${numeros.slice(10)}`
    } else if (numeros.length >= 4) {
      return `${numeros.slice(0, 4)}-${numeros.slice(4)}`
    }
    return numeros
  },
  
  nup: (value) => {
    // Mantener letras en mayúscula y números
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  }
}

// 🆕 CALCULADORA DE EDAD
export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null
  
  const fecha = new Date(fechaNacimiento)
  const hoy = new Date()
  let edad = hoy.getFullYear() - fecha.getFullYear()
  const cumplioEsteAno = hoy >= new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())
  
  if (!cumplioEsteAno) edad--
  
  return edad
}