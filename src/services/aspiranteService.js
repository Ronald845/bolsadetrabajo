import api from './api'

export const aspiranteService = {
  // Gestión del perfil (ya existente)
  async obtenerPerfil(idAspirante) {
    const response = await api.get(`/Aspirante/${idAspirante}`)
    return response.data
  },

  async actualizarPerfil(aspiranteData) {
    const response = await api.put('/Aspirante/editar', aspiranteData)
    return response.data
  },

  // FORMACIÓN ACADÉMICA (ya existente)
  async crearFormacion(formacionData) {
    const response = await api.post('/Formacion/crear', formacionData)
    return response.data
  },

  async obtenerFormaciones() {
    const response = await api.get('/Formacion/todos')
    return response.data
  },

  async actualizarFormacion(formacionData) {
    const response = await api.put('/Formacion/editar', formacionData)
    return response.data
  },

  async eliminarFormacion(idFormacion) {
    const response = await api.delete(`/Formacion/eliminar/${idFormacion}`)
    return response.data
  },

  // EXPERIENCIA LABORAL (ya existente)
  async crearExperiencia(experienciaData) {
    const response = await api.post('/Experiencia/crear', experienciaData)
    return response.data
  },

  async obtenerExperiencias() {
    const response = await api.get('/Experiencia/todos')
    return response.data
  },

  async actualizarExperiencia(experienciaData) {
    const response = await api.put('/Experiencia/editar', experienciaData)
    return response.data
  },

  async eliminarExperiencia(idExperiencia) {
    const response = await api.delete(`/Experiencia/eliminar/${idExperiencia}`)
    return response.data
  },

  // 🆕 HABILIDADES
  async crearHabilidad(habilidadData) {
    const response = await api.post('/Habilidad/crear', habilidadData)
    return response.data
  },

  async obtenerHabilidades() {
    const response = await api.get('/Habilidad/todos')
    return response.data
  },

  async actualizarHabilidad(habilidadData) {
    const response = await api.put('/Habilidad/editar', habilidadData)
    return response.data
  },

  async eliminarHabilidad(idHabilidad) {
    const response = await api.delete(`/Habilidad/eliminar/${idHabilidad}`)
    return response.data
  },

  // 🆕 CERTIFICACIONES
  async crearCertificacion(certificacionData) {
    const response = await api.post('/Certificacion/crear', certificacionData)
    return response.data
  },

  async obtenerCertificaciones() {
    const response = await api.get('/Certificacion/todos')
    return response.data
  },

  async actualizarCertificacion(certificacionData) {
    const response = await api.put('/Certificacion/editar', certificacionData)
    return response.data
  },

  async eliminarCertificacion(idCertificacion) {
    const response = await api.delete(`/Certificacion/eliminar/${idCertificacion}`)
    return response.data
  },

  // 🆕 LOGROS
  async crearLogro(logroData) {
    const response = await api.post('/Logros/crear', logroData)
    return response.data
  },

  async obtenerLogros() {
    const response = await api.get('/Logros/todos')
    return response.data
  },

  async actualizarLogro(logroData) {
    const response = await api.put('/Logros/editar', logroData)
    return response.data
  },

  async eliminarLogro(idLogro) {
    const response = await api.delete(`/Logros/eliminar/${idLogro}`)
    return response.data
  }
}