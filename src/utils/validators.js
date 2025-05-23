// Validaciones simples para no complicar
export const validators = {
  required: (value) => value !== null && value !== undefined && value !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max,
  telefono: (value) => /^[\d\-\+\(\)\s]+$/.test(value) && value.length >= 8
}

export const errorMessages = {
  required: 'Este campo es obligatorio',
  email: 'El formato del email no es válido',
  telefono: 'El formato del teléfono no es válido'
}