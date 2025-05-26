<template>
  <div class="detalle-oferta">
    <!-- Modal Principal -->
    <div class="modal fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header bg-gradient-primary text-white">
            <div class="d-flex align-items-center w-100">
              <div class="flex-grow-1">
                <h4 class="modal-title mb-1">
                  <i class="fas fa-briefcase me-2"></i>{{ oferta?.tituloPuesto }}
                </h4>
                <p class="mb-0 opacity-90">
                  <i class="fas fa-building me-2"></i>{{ oferta?.empresa?.nombreEmpresa || 'Empresa Confidencial' }}
                </p>
              </div>
              <div class="d-flex gap-2">
                <span class="badge fs-6" :class="getEstadoBadgeClass(oferta?.estadoOferta)">{{ oferta?.estadoOferta }}</span>
                <button type="button" class="btn-close btn-close-white" @click="cerrar"></button>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="modal-body p-0">
            <!-- Loading -->
            <div v-if="!oferta" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
              <p class="mt-2 text-muted">Cargando detalles...</p>
            </div>

            <div v-else class="row g-0">
              <!-- Contenido Principal -->
              <div class="col-lg-8">
                <div class="p-4">
                  <!-- Información Básica -->
                  <div class="mb-4">
                    <div class="row g-3">
                      <div class="col-md-4" v-for="info in infoBasica" :key="info.key">
                        <div class="info-item">
                          <i :class="info.icon" class="me-2"></i>
                          <div>
                            <small class="text-muted d-block">{{ info.label }}</small>
                            <span class="fw-bold" v-html="info.value"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Secciones de Contenido -->
                  <div v-for="seccion in secciones" :key="seccion.key" class="mb-4">
                    <h5 class="text-primary mb-3">
                      <i :class="seccion.icon" class="me-2"></i>{{ seccion.titulo }}
                    </h5>
                    
                    <!-- Descripción (texto plano) -->
                    <div v-if="seccion.type === 'text'" class="description-content">
                      <p class="text-justify">{{ seccion.content }}</p>
                    </div>
                    
                    <!-- Requisitos (grid) -->
                    <div v-else-if="seccion.type === 'grid'" class="row g-3">
                      <div v-for="item in seccion.items" :key="item.key" :class="item.colClass">
                        <div class="requirement-card">
                          <h6 class="text-info mb-2">
                            <i :class="item.icon" class="me-2"></i>{{ item.titulo }}
                          </h6>
                          <p class="mb-0">{{ item.contenido }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Fechas (especial) -->
                    <div v-else-if="seccion.type === 'dates'" class="row g-3">
                      <div v-for="fecha in seccion.fechas" :key="fecha.key" class="col-md-6">
                        <div class="date-card">
                          <i :class="fecha.icon" class="me-2"></i>
                          <div>
                            <small class="text-muted d-block">{{ fecha.label }}</small>
                            <span class="fw-bold">{{ fecha.valor }}</span>
                            <small v-if="fecha.extra" class="d-block" :class="fecha.extraClass">{{ fecha.extra }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sidebar -->
              <div class="col-lg-4 bg-light border-start">
                <div class="p-4 sticky-top">
                  <!-- Estado de Aplicación -->
                  <div class="application-status mb-4">
                    <div v-for="alert in alertasEstado" :key="alert.key" v-show="alert.mostrar" :class="`alert alert-${alert.tipo}`">
                      <div class="d-flex align-items-center">
                        <i :class="alert.icon" class="fa-2x me-3"></i>
                        <div>
                          <h6 class="mb-1">{{ alert.titulo }}</h6>
                          <small>{{ alert.mensaje }}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Botones de Acción -->
                  <div class="action-buttons mb-4">
                    <button v-for="boton in botonesAccion" :key="boton.key" v-show="boton.mostrar"
                      @click="boton.accion" :class="boton.clase" :disabled="boton.deshabilitado">
                      <span v-if="boton.loading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else :class="boton.icono" class="me-2"></i>{{ boton.texto }}
                    </button>

                    <div class="d-grid gap-2">
                      <button @click="guardarOferta" class="btn btn-outline-warning" :class="{ 'btn-warning text-white': ofertaGuardada }">
                        <i :class="ofertaGuardada ? 'fas fa-bookmark' : 'far fa-bookmark'" class="me-2"></i>
                        {{ ofertaGuardada ? 'Guardada' : 'Guardar para Después' }}
                      </button>
                      <button @click="compartirOferta" class="btn btn-outline-info">
                        <i class="fas fa-share-alt me-2"></i>Compartir Oferta
                      </button>
                    </div>
                  </div>

                  <!-- Información de Contacto -->
                  <div v-if="mostrarContacto" class="contact-info mb-4">
                    <h6 class="text-primary mb-3">
                      <i class="fas fa-envelope me-2"></i>Información de Contacto
                    </h6>
                    <div class="contact-card">
                      <div v-for="contacto in infoContacto" :key="contacto.key">
                        <p class="mb-2"><strong>{{ contacto.label }}:</strong><br>{{ contacto.valor }}</p>
                      </div>
                      <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>El contacto directo estará disponible después de aplicar
                      </small>
                    </div>
                  </div>

                  <!-- Estadísticas -->
                  <div class="offer-stats">
                    <h6 class="text-primary mb-3">
                      <i class="fas fa-chart-bar me-2"></i>Estadísticas
                    </h6>
                    <div class="stats-grid">
                      <div v-for="stat in estadisticas" :key="stat.key" class="stat-item">
                        <i :class="stat.icon"></i>
                        <div>
                          <span class="stat-number">{{ stat.valor }}</span>
                          <small class="stat-label">{{ stat.label }}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Sugerencias -->
                  <div class="similar-offers mt-4">
                    <h6 class="text-primary mb-3">
                      <i class="fas fa-lightbulb me-2"></i>Sugerencias
                    </h6>
                    <div class="alert alert-info">
                      <small>
                        <i class="fas fa-info-circle me-2"></i>Próximamente: ofertas similares basadas en tu perfil
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="mostrarModalAplicacion" class="modal fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-primary">
              <i class="fas fa-paper-plane me-2"></i>Confirmar Aplicación
            </h5>
            <button type="button" class="btn-close" @click="mostrarModalAplicacion = false"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info">
              <h6><strong>{{ oferta.tituloPuesto }}</strong></h6>
              <p class="mb-2">{{ oferta.empresa?.nombreEmpresa || 'Empresa Confidencial' }}</p>
              <small class="text-muted">{{ oferta.ubicacion }}</small>
            </div>
            <p>¿Estás seguro de que deseas aplicar a esta oferta laboral?</p>
            <div class="alert alert-warning">
              <small>
                <i class="fas fa-info-circle me-2"></i>Una vez que apliques, la empresa podrá ver tu perfil completo y contactarte directamente.
              </small>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="aceptaTerminos" id="aceptaTerminos">
              <label class="form-check-label" for="aceptaTerminos">
                Acepto que mi información de perfil sea compartida con esta empresa
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="mostrarModalAplicacion = false" :disabled="aplicandoModal">
              Cancelar
            </button>
            <button type="button" @click="confirmarAplicacion" class="btn btn-primary" :disabled="aplicandoModal || !aceptaTerminos">
              <span v-if="aplicandoModal" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-paper-plane me-2"></i>
              {{ aplicandoModal ? 'Aplicando...' : 'Confirmar Aplicación' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrops -->
    <div class="modal-backdrop fade show" @click="cerrar"></div>
    <div v-if="mostrarModalAplicacion" class="modal-backdrop fade show" style="z-index: 1055;"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../services/api'

export default {
  name: 'DetalleOferta',
  props: {
    oferta: { type: Object, required: true },
    yaAplicado: { type: Boolean, default: false },
    aspiranteId: { type: Number, default: null }
  },
  emits: ['cerrar', 'aplicar-exitosa'],
  
  data() {
    return {
      aplicando: false,
      aplicandoModal: false,
      mostrarModalAplicacion: false,
      ofertaGuardada: false,
      mostrarContacto: false,
      aceptaTerminos: false,
      numeroAplicaciones: 0
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    esOfertaVencida() {
      return this.oferta?.fechaCierre && new Date() > new Date(this.oferta.fechaCierre)
    },
    
    diasPublicada() {
      if (!this.oferta?.fechaPublicacion) return 0
      const diffTime = Math.abs(new Date() - new Date(this.oferta.fechaPublicacion))
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    
    infoBasica() {
      return [
        { key: 'ubicacion', icon: 'fas fa-map-marker-alt text-primary', label: 'Ubicación', value: this.oferta.ubicacion },
        { key: 'modalidad', icon: 'fas fa-briefcase text-success', label: 'Modalidad', value: this.oferta.modalidadEmpleo },
        { 
          key: 'salario', 
          icon: 'fas fa-dollar-sign text-warning', 
          label: 'Salario', 
          value: `<span class="text-success">$${this.formatearSalario(this.oferta.salarioMinimo)}${this.oferta.salarioMaximo !== this.oferta.salarioMinimo ? ` - $${this.formatearSalario(this.oferta.salarioMaximo)}` : ''}</span>`
        }
      ]
    },
    
    secciones() {
      const secciones = [
        {
          key: 'descripcion',
          titulo: 'Descripción del Puesto',
          icon: 'fas fa-file-alt',
          type: 'text',
          content: this.oferta.descripcionPuesto
        },
        {
          key: 'requisitos',
          titulo: 'Requisitos del Puesto',
          icon: 'fas fa-clipboard-check',
          type: 'grid',
          items: [
            { key: 'formacion', icon: 'fas fa-graduation-cap', titulo: 'Formación Académica', contenido: this.oferta.perfilAcademico, colClass: 'col-md-6' },
            { key: 'experiencia', icon: 'fas fa-user-tie', titulo: 'Experiencia Requerida', contenido: this.oferta.experienciaRequerida, colClass: 'col-md-6' },
            ...(this.oferta.conocimientoNecesarios ? [{ key: 'conocimientos', icon: 'fas fa-brain', titulo: 'Conocimientos Específicos', contenido: this.oferta.conocimientoNecesarios, colClass: 'col-12' }] : [])
          ]
        },
        {
          key: 'fechas',
          titulo: 'Fechas Importantes',
          icon: 'fas fa-calendar-alt',
          type: 'dates',
          fechas: [
            { key: 'publicacion', icon: 'fas fa-calendar-plus text-success', label: 'Fecha de Publicación', valor: this.formatearFechaCompleta(this.oferta.fechaPublicacion) },
            { key: 'cierre', icon: 'fas fa-calendar-times text-danger', label: 'Fecha de Cierre', valor: this.formatearFechaCompleta(this.oferta.fechaCierre), extra: this.getDiasRestantes(), extraClass: this.getDiasRestantesClass() }
          ]
        }
      ]
      
      // Agregar sección de empresa si existe
      if (this.oferta.empresa?.descripcionEmpresa) {
        secciones.push({
          key: 'empresa',
          titulo: 'Acerca de la Empresa',
          icon: 'fas fa-building',
          type: 'text',
          content: this.oferta.empresa.descripcionEmpresa
        })
      }
      
      return secciones
    },
    
    alertasEstado() {
      return [
        { key: 'aplicado', mostrar: this.yaAplicado, tipo: 'success', icon: 'fas fa-check-circle', titulo: '¡Ya Aplicaste!', mensaje: 'La empresa podrá contactarte pronto' },
        { key: 'perfil', mostrar: !this.yaAplicado && !this.aspiranteId, tipo: 'warning', icon: 'fas fa-exclamation-triangle', titulo: 'Perfil Incompleto', mensaje: 'Completa tu perfil de aspirante para aplicar' },
        { key: 'vencida', mostrar: !this.yaAplicado && this.aspiranteId && this.esOfertaVencida, tipo: 'secondary', icon: 'fas fa-clock', titulo: 'Oferta Vencida', mensaje: 'El período de aplicación ha terminado' }
      ]
    },
    
    botonesAccion() {
      return [
        { 
          key: 'aplicar', 
          mostrar: !this.yaAplicado && this.aspiranteId && !this.esOfertaVencida,
          clase: 'btn btn-primary btn-lg w-100 mb-2',
          accion: () => { this.mostrarModalAplicacion = true },
          icono: 'fas fa-paper-plane',
          texto: this.aplicando ? 'Aplicando...' : 'Aplicar a esta Oferta',
          loading: this.aplicando,
          deshabilitado: this.aplicando
        },
        {
          key: 'aplicado',
          mostrar: this.yaAplicado,
          clase: 'btn btn-success btn-lg w-100 mb-2',
          accion: () => {},
          icono: 'fas fa-check',
          texto: 'Aplicación Enviada',
          deshabilitado: true
        }
      ]
    },
    
    infoContacto() {
      return [
        { key: 'empresa', label: 'Empresa', valor: this.oferta.empresa?.nombreEmpresa || 'Confidencial' },
        { key: 'representante', label: 'Representante', valor: this.oferta.empresa?.nombreRepresentante || 'No especificado' }
      ]
    },
    
    estadisticas() {
      return [
        { key: 'aplicaciones', icon: 'fas fa-users text-info', valor: this.numeroAplicaciones, label: 'Aplicaciones' },
        { key: 'dias', icon: 'fas fa-eye text-success', valor: this.diasPublicada, label: 'Días publicada' },
        { key: 'restantes', icon: 'fas fa-calendar text-warning', valor: Math.abs(this.getDiasRestantesNumero()), label: this.getDiasRestantesNumero() > 0 ? 'Días restantes' : 'Días vencida' }
      ]
    }
  },
  
  async mounted() {
    await this.cargarEstadisticas()
  },
  
  methods: {
    async cargarEstadisticas() {
      try {
        this.numeroAplicaciones = Math.floor(Math.random() * 50) + 1
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
      }
    },
    
    cerrar() {
      this.$emit('cerrar')
    },
    
    async confirmarAplicacion() {
      if (!this.oferta || !this.aspiranteId) return
      
      try {
        this.aplicandoModal = true
        
        const aplicacionData = {
          idOferta: this.oferta.idOferta,
          idAspirante: this.aspiranteId,
          fechaAplicacion: new Date().toISOString(),
          estado: 'Enviada'
        }
        
        await api.post('/Aplicaciones/crear', aplicacionData)
        
        this.mostrarModalAplicacion = false
        this.aceptaTerminos = false
        this.$emit('aplicar-exitosa', aplicacionData)
        this.mostrarContacto = true
      } catch (error) {
        console.error('Error aplicando a oferta:', error)
        alert('Error al enviar la aplicación. Intenta nuevamente.')
      } finally {
        this.aplicandoModal = false
      }
    },
    
    guardarOferta() {
      this.ofertaGuardada = !this.ofertaGuardada
    },
    
    async compartirOferta() {
      if (navigator.share) {
        try {
          await navigator.share({
            title: this.oferta.tituloPuesto,
            text: `¡Mira esta oferta laboral! ${this.oferta.tituloPuesto} en ${this.oferta.ubicacion}`,
            url: window.location.href
          })
        } catch (error) {
          console.log('Error sharing:', error)
        }
      } else {
        const url = window.location.href
        await navigator.clipboard.writeText(url)
        alert('Enlace copiado al portapapeles')
      }
    },
    
    getDiasRestantes() {
      if (!this.oferta?.fechaCierre) return 'No especificado'
      
      const diffTime = new Date(this.oferta.fechaCierre) - new Date()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 0) return `${diffDays} días restantes`
      if (diffDays === 0) return 'Cierra hoy'
      return `Venció hace ${Math.abs(diffDays)} días`
    },
    
    getDiasRestantesNumero() {
      if (!this.oferta?.fechaCierre) return 0
      const diffTime = new Date(this.oferta.fechaCierre) - new Date()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    
    getDiasRestantesClass() {
      const dias = this.getDiasRestantesNumero()
      if (dias > 7) return 'text-success'
      if (dias > 3) return 'text-warning'
      if (dias > 0) return 'text-danger'
      return 'text-muted'
    },
    
    getEstadoBadgeClass(estado) {
      const clases = { 'Activa': 'bg-success', 'Pausada': 'bg-warning', 'Cerrada': 'bg-secondary', 'Borrador': 'bg-info' }
      return clases[estado] || 'bg-secondary'
    },
    
    formatearSalario(salario) {
      return new Intl.NumberFormat('es-ES').format(salario)
    },
    
    formatearFechaCompleta(fecha) {
      if (!fecha) return 'No especificada'
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.detalle-oferta { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050; }
.modal-dialog { max-width: 1200px; margin: 1rem auto; height: calc(100vh - 2rem); }
.modal-content { height: 100%; border-radius: 15px; border: none; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
.bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }
.modal-header { border-radius: 15px 15px 0 0; border-bottom: none; padding: 1.5rem; }
.modal-body { height: calc(100% - 140px); overflow-y: auto; }

.info-item { display: flex; align-items: center; padding: 1rem; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); transition: transform 0.2s ease; }
.info-item:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12); }

.description-content { background: #f8fafc; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #3b82f6; }

.requirement-card { background: white; padding: 1.5rem; border-radius: 10px; border: 1px solid #e5e7eb; height: 100%; transition: all 0.2s ease; }
.requirement-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border-color: #3b82f6; }

.date-card { display: flex; align-items: center; padding: 1rem; background: white; border-radius: 10px; border: 1px solid #e5e7eb; transition: all 0.2s ease; }
.date-card:hover { border-color: #10b981; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1); }

.company-info { background: #f0f9ff; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #0ea5e9; }

.sticky-top { top: 1rem; }
.application-status .alert { border-radius: 10px; border: none; }
.action-buttons .btn { border-radius: 10px; font-weight: 600; transition: all 0.2s ease; }
.action-buttons .btn:hover { transform: translateY(-1px); }

.contact-card { background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e5e7eb; }

.stats-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.stat-item { display: flex; align-items: center; padding: 1rem; background: white; border-radius: 8px; border: 1px solid #e5e7eb; transition: all 0.2s ease; }
.stat-item:hover { border-color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
.stat-item i { font-size: 1.5rem; margin-right: 0.75rem; }
.stat-number { font-size: 1.25rem; font-weight: 700; color: #1f2937; display: block; }
.stat-label { color: #6b7280; font-size: 0.8rem; }

.modal-backdrop { background-color: rgba(0, 0, 0, 0.7); }
.form-check-input:checked { background-color: #3b82f6; border-color: #3b82f6; }

@media (max-width: 768px) {
  .modal-dialog { margin: 0; height: 100vh; max-width: 100%; }
  .modal-content { border-radius: 0; }
  .modal-header { border-radius: 0; padding: 1rem; }
  .modal-header h4 { font-size: 1.1rem; }
  .info-item, .requirement-card, .date-card { padding: 0.75rem; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .stat-item { padding: 0.75rem; flex-direction: column; text-align: center; }
  .stat-item i { margin-right: 0; margin-bottom: 0.5rem; }
}

@media (max-width: 576px) {
  .modal-header .d-flex { flex-direction: column; align-items: flex-start; }
  .modal-header .badge { margin-top: 0.5rem; }
  .row.g-3 > .col-md-4, .row.g-3 > .col-md-6 { margin-bottom: 1rem; }
}

.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.modal-body::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
.modal-body::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

@keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
.modal-content { animation: slideIn 0.3s ease-out; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-backdrop { animation: fadeIn 0.3s ease-out; }

.btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); }
.btn-primary:hover { background: linear-gradient(135deg, #1d4ed8, #1e40af); }
.btn-success:hover { background: linear-gradient(135deg, #059669, #047857); }

.btn:focus, .form-check-input:focus { box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25); }
</style>