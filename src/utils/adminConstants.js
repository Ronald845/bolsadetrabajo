// 🎭 ROLES DEL SISTEMA
export const ROLES = [
  { value: 'Admin', label: 'Administrador', color: 'danger', icon: 'fas fa-shield-alt' },
  { value: 'Empresa', label: 'Empresa', color: 'primary', icon: 'fas fa-building' },
  { value: 'Aspirante', label: 'Aspirante', color: 'success', icon: 'fas fa-user' }
]

// 🔄 ESTADOS DE USUARIO
export const ESTADOS_USUARIO = [
  { value: 'Activado', label: 'Activo', color: 'success' },
  { value: 'Desactivado', label: 'Inactivo', color: 'danger' },
  { value: 'Bloqueado', label: 'Bloqueado', color: 'warning' }
]

// 🎨 UTILIDADES
export const getColorByRole = (rol) => ROLES.find(r => r.value === rol)?.color || 'secondary'
export const getLabelByRole = (rol) => ROLES.find(r => r.value === rol)?.label || rol
export const getIconByRole = (rol) => ROLES.find(r => r.value === rol)?.icon || 'fas fa-user'