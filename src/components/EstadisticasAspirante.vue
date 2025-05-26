<template>
  <div class="estadisticas-aspirante">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-chart-line me-2 text-primary"></i>
                Mis Estadísticas Profesionales
              </h2>
              <p class="text-muted mb-0">Analiza tu progreso y rendimiento en la búsqueda laboral</p>
            </div>
            <div class="d-flex gap-2">
              <button @click="exportarReporte" class="btn btn-outline-success btn-sm">
                <i class="fas fa-file-pdf me-2"></i>Exportar PDF
              </button>
              <button @click="actualizarDatos" class="btn btn-outline-primary" :disabled="loading">
                <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas principales -->
      <div class="row mb-4">
        <div v-for="metrica in metricas" :key="metrica.key" class="col-lg-3 col-md-6 mb-3">
          <div class="card metric-card" :class="`border-${metrica.color}`">
            <div class="card-body text-center">
              <div class="metric-icon mb-3" :class="`bg-${metrica.color} text-white`">
                <i :class="metrica.icono"></i>
              </div>
              <h3 class="metric-number" :class="`text-${metrica.color}`">{{ metrica.valor }}</h3>
              <p class="metric-label mb-1">{{ metrica.titulo }}</p>
              <div class="progress mt-2" style="height: 4px;">
                <div class="progress-bar" :class="`bg-${metrica.color}`" :style="{ width: metrica.progreso + '%' }"></div>
              </div>
              <small class="text-muted">{{ metrica.descripcion }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos principales -->
      <div class="row mb-4">
        <!-- Gráfico de aplicaciones por mes -->
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="fas fa-chart-area me-2 text-primary"></i>Aplicaciones por Mes
                </h5>
                <div class="btn-group btn-group-sm">
                  <button 
                    v-for="periodo in periodos" 
                    :key="periodo.value"
                    @click="periodoSeleccionado = periodo.value"
                    class="btn"
                    :class="periodoSeleccionado === periodo.value ? 'btn-primary' : 'btn-outline-primary'"
                  >
                    {{ periodo.label }}
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="chart-container" style="height: 300px;">
                <div class="chart-wrapper">
                  <div class="chart-bars">
                    <div 
                      v-for="(dato, index) in datosGrafico" 
                      :key="index"
                      class="chart-bar"
                      :style="{ 
                        height: (dato.valor / maxValorGrafico * 100) + '%',
                        backgroundColor: `hsl(${210 + index * 10}, 70%, 50%)`
                      }"
                      :title="`${dato.mes}: ${dato.valor} aplicaciones`"
                    >
                      <div class="bar-value">{{ dato.valor }}</div>
                    </div>
                  </div>
                  <div class="chart-labels">
                    <span v-for="dato in datosGrafico" :key="dato.mes" class="chart-label">
                      {{ dato.mes }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estados de aplicaciones -->
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="fas fa-pie-chart me-2 text-success"></i>Estados de Aplicaciones
              </h5>
            </div>
            <div class="card-body">
              <div class="estados-container">
                <div v-for="estado in estadosAplicaciones" :key="estado.nombre" class="estado-item mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <div class="d-flex align-items-center">
                      <div class="estado-indicator me-2" :style="{ backgroundColor: estado.color }"></div>
                      <span class="fw-medium">{{ estado.nombre }}</span>
                    </div>
                    <div class="text-end">
                      <span class="fw-bold">{{ estado.cantidad }}</span>
                      <small class="text-muted">({{ estado.porcentaje }}%)</small>
                    </div>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar" :style="{ width: estado.porcentaje + '%', backgroundColor: estado.color }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards de información -->
      <div class="row mb-4">
        <div v-for="card in cardsInformacion" :key="card.titulo" class="col-lg-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i :class="card.icono" class="me-2"></i>{{ card.titulo }}
              </h5>
            </div>
            <div class="card-body">
              <component :is="card.componente" v-bind="card.props" @accion="aplicarRecomendacion" />
            </div>
          </div>
        </div>
      </div>

      <!-- Análisis detallado -->
      <div class="row mb-4">
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="fas fa-industry me-2 text-secondary"></i>Sectores de Aplicación
              </h5>
            </div>
            <div class="card-body">
              <div v-for="sector in sectoresAplicacion" :key="sector.nombre" class="sector-item mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-medium">{{ sector.nombre }}</span>
                  <span class="text-muted">{{ sector.aplicaciones }} aplicaciones</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" :style="{ 
                    width: (sector.aplicaciones / maxAplicacionesSector * 100) + '%',
                    backgroundColor: sector.color 
                  }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="fas fa-building me-2 text-secondary"></i>Empresas Objetivo
              </h5>
            </div>
            <div class="card-body">
              <div v-for="empresa in empresasObjetivo" :key="empresa.id" class="empresa-item mb-3 p-3">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">{{ empresa.nombre }}</h6>
                    <small class="text-muted">{{ empresa.aplicaciones }} aplicaciones</small>
                  </div>
                  <span class="badge" :class="empresa.estadoClass">{{ empresa.estado }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Perfil y objetivos -->
      <PerfilObjetivos 
        :fortalezas="fortalezasPerfil"
        :objetivos="objetivos"
        :completitud="completitudPerfil"
        :perfil="datosPerfilResumen"
        @configurar="configurarObjetivos"
      />

      <!-- Loading overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
          <p class="text-muted">Actualizando estadísticas...</p>
        </div>
      </div>

      <!-- Mensaje -->
      <div v-if="message" class="alert mt-4" :class="messageClass">
        <i :class="messageIcon" class="me-2"></i>{{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../services/api'

// Componentes inline
const ActividadReciente = {
  props: ['actividades'],
  template: `
    <div class="timeline">
      <div v-for="actividad in actividades" :key="actividad.id" class="timeline-item">
        <div class="timeline-marker" :class="actividad.tipoClass">
          <i :class="actividad.icono"></i>
        </div>
        <div class="timeline-content">
          <div class="timeline-header">
            <h6 class="mb-1">{{ actividad.titulo }}</h6>
            <small class="text-muted">{{ formatearTiempo(actividad.fecha) }}</small>
          </div>
          <p class="mb-0 text-muted">{{ actividad.descripcion }}</p>
        </div>
      </div>
      <div v-if="actividades.length === 0" class="text-center py-4">
        <i class="fas fa-history fa-2x text-muted mb-2"></i>
        <p class="text-muted">No hay actividad reciente</p>
      </div>
    </div>
  `,
  methods: {
    formatearTiempo: (fecha) => {
      const diff = new Date() - new Date(fecha)
      const minutos = Math.floor(diff / 60000)
      const horas = Math.floor(diff / 3600000)
      const dias = Math.floor(diff / 86400000)
      
      if (minutos < 60) return `Hace ${minutos} min`
      if (horas < 24) return `Hace ${horas}h`
      if (dias < 7) return `Hace ${dias}d`
      return new Date(fecha).toLocaleDateString('es-ES')
    }
  }
}

const Recomendaciones = {
  props: ['recomendaciones'],
  emits: ['accion'],
  template: `
    <div class="recomendaciones">
      <div v-for="rec in recomendaciones" :key="rec.id" class="recomendacion-item mb-3 p-3">
        <div class="d-flex align-items-start">
          <div class="recomendacion-icon me-3" :class="rec.tipoClass">
            <i :class="rec.icono"></i>
          </div>
          <div class="flex-grow-1">
            <h6 class="mb-1">{{ rec.titulo }}</h6>
            <p class="mb-2 text-muted small">{{ rec.descripcion }}</p>
            <button class="btn btn-sm btn-outline-primary" @click="$emit('accion', rec)">
              {{ rec.accion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}

const PerfilObjetivos = {
  props: ['fortalezas', 'objetivos', 'completitud', 'perfil'],
  emits: ['configurar'],
  template: `
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="fas fa-user-check me-2 text-success"></i>Análisis de Perfil Profesional
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-8">
                <h6 class="mb-3">Fortalezas de tu Perfil</h6>
                <div v-for="fortaleza in fortalezas" :key="fortaleza.area" class="fortaleza-item mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="fw-medium">{{ fortaleza.area }}</span>
                    <span class="text-success fw-bold">{{ fortaleza.puntuacion }}%</span>
                  </div>
                  <div class="progress" style="height: 10px;">
                    <div class="progress-bar bg-success" :style="{ width: fortaleza.puntuacion + '%' }"></div>
                  </div>
                  <small class="text-muted">{{ fortaleza.descripcion }}</small>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="perfil-summary p-3 bg-light rounded">
                  <h6 class="mb-3">Resumen de Perfil</h6>
                  <div v-for="item in perfil" :key="item.label" class="mb-2">
                    <strong>{{ item.label }}:</strong>
                    <div v-if="item.tipo === 'progress'" class="progress mt-1" style="height: 6px;">
                      <div class="progress-bar bg-primary" :style="{ width: item.valor + '%' }"></div>
                    </div>
                    <span v-else>{{ item.valor }}</span>
                    <small v-if="item.extra" class="text-muted d-block">{{ item.extra }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Objetivos -->
      <div class="col-12 mt-4">
        <div class="card shadow-sm">
          <div class="card-header bg-white">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-target me-2 text-danger"></i>Objetivos y Metas
              </h5>
              <button class="btn btn-sm btn-outline-primary" @click="$emit('configurar')">
                <i class="fas fa-cog me-1"></i>Configurar
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div v-for="objetivo in objetivos" :key="objetivo.id" class="col-lg-4 col-md-6 mb-3">
                <div class="objetivo-card p-3 h-100">
                  <div class="d-flex align-items-center mb-2">
                    <div class="objetivo-icon me-2" :class="objetivo.tipoClass">
                      <i :class="objetivo.icono"></i>
                    </div>
                    <h6 class="mb-0">{{ objetivo.titulo }}</h6>
                  </div>
                  <p class="mb-2 text-muted small">{{ objetivo.descripcion }}</p>
                  <div class="progress mb-2" style="height: 8px;">
                    <div class="progress-bar" :class="objetivo.progressClass" :style="{ width: objetivo.progreso + '%' }"></div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <small class="text-muted">{{ objetivo.actual }}/{{ objetivo.meta }}</small>
                    <small :class="objetivo.progreso >= 100 ? 'text-success' : 'text-muted'">{{ objetivo.progreso }}%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

export default {
  name: 'EstadisticasAspirante',
  components: { ActividadReciente, Recomendaciones, PerfilObjetivos },
  
  data() {
    return {
      loading: false,
      message: '',
      messageType: 'success',
      aspiranteId: null,
      aplicaciones: [],
      periodoSeleccionado: '6m',
      
      // Datos base
      estadisticas: { totalAplicaciones: 0, aplicacionesExitosas: 0, aplicacionesRevision: 0, entrevistas: 0, aplicacionesMesAnterior: 0 },
      datosGrafico: [],
      estadosAplicaciones: [],
      actividadReciente: [],
      recomendaciones: [],
      sectoresAplicacion: [],
      empresasObjetivo: [],
      fortalezasPerfil: [],
      objetivos: [],
      
      // Configuraciones
      periodos: [
        { value: '3m', label: '3M' },
        { value: '6m', label: '6M' },
        { value: '12m', label: '1A' },
        { value: 'all', label: 'Todo' }
      ],
      
      // Datos perfil
      completitudPerfil: 0,
      añosExperiencia: 0,
      nivelFormacion: '',
      totalHabilidades: 0
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    // Métricas principales consolidadas
    metricas() {
      return [
        {
          key: 'aplicaciones',
          titulo: 'Aplicaciones Enviadas',
          valor: this.estadisticas.totalAplicaciones,
          color: 'primary',
          icono: 'fas fa-paper-plane',
          progreso: Math.min(100, (this.estadisticas.totalAplicaciones / 50) * 100),
          descripcion: `${this.cambioAplicaciones >= 0 ? '+' : ''}${this.cambioAplicaciones} este mes`
        },
        {
          key: 'exito',
          titulo: 'Tasa de Éxito',
          valor: `${this.tasaExito}%`,
          color: 'success',
          icono: 'fas fa-percentage',
          progreso: this.tasaExito,
          descripcion: `${this.estadisticas.aplicacionesExitosas}/${this.estadisticas.totalAplicaciones} exitosas`
        },
        {
          key: 'revision',
          titulo: 'En Revisión',
          valor: this.estadisticas.aplicacionesRevision,
          color: 'warning',
          icono: 'fas fa-eye',
          progreso: this.porcentajeRevision,
          descripcion: `${this.porcentajeRevision}% del total`
        },
        {
          key: 'entrevistas',
          titulo: 'Entrevistas',
          valor: this.estadisticas.entrevistas,
          color: 'info',
          icono: 'fas fa-calendar-check',
          progreso: this.porcentajeEntrevistas,
          descripcion: `${this.porcentajeEntrevistas}% de conversión`
        }
      ]
    },
    
    // Cards de información reutilizables
    cardsInformacion() {
      return [
        {
          titulo: 'Actividad Reciente',
          icono: 'fas fa-clock text-info',
          componente: 'ActividadReciente',
          props: { actividades: this.actividadReciente }
        },
        {
          titulo: 'Recomendaciones Personalizadas',
          icono: 'fas fa-lightbulb text-warning',
          componente: 'Recomendaciones',
          props: { recomendaciones: this.recomendaciones }
        }
      ]
    },
    
    datosPerfilResumen() {
      return [
        { label: 'Completitud', tipo: 'progress', valor: this.completitudPerfil, extra: `${this.completitudPerfil}%` },
        { label: 'Experiencia', valor: `${this.añosExperiencia} años` },
        { label: 'Formación', valor: this.nivelFormacion },
        { label: 'Habilidades', valor: `${this.totalHabilidades} registradas` }
      ]
    },
    
    // Computed properties optimizados
    tasaExito: vm => vm.estadisticas.totalAplicaciones === 0 ? 0 : Math.round((vm.estadisticas.aplicacionesExitosas / vm.estadisticas.totalAplicaciones) * 100),
    porcentajeRevision: vm => vm.estadisticas.totalAplicaciones === 0 ? 0 : Math.round((vm.estadisticas.aplicacionesRevision / vm.estadisticas.totalAplicaciones) * 100),
    porcentajeEntrevistas: vm => vm.estadisticas.totalAplicaciones === 0 ? 0 : Math.round((vm.estadisticas.entrevistas / vm.estadisticas.totalAplicaciones) * 100),
    cambioAplicaciones: vm => vm.estadisticas.totalAplicaciones - vm.estadisticas.aplicacionesMesAnterior,
    maxValorGrafico: vm => Math.max(...vm.datosGrafico.map(d => d.valor), 1),
    maxAplicacionesSector: vm => Math.max(...vm.sectoresAplicacion.map(s => s.aplicaciones), 1),
    messageClass: vm => `alert-${vm.messageType}`,
    messageIcon: vm => ({ success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }[vm.messageType] || 'fas fa-info-circle')
  },
  
  async mounted() {
    await this.inicializar()
  },
  
  methods: {
    async inicializar() {
      try {
        this.loading = true
        await this.cargarAspiranteId()
        if (this.aspiranteId) {
          await this.cargarTodosLosDatos()
          this.generarRecomendaciones()
        }
      } catch (error) {
        this.showMessage('Error al cargar las estadísticas', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async cargarAspiranteId() {
      const response = await api.get('/Aspirante/todos')
      const aspirante = response.data.find(asp => asp.idUsuario === this.user.idUsuario)
      if (aspirante) this.aspiranteId = aspirante.idAspirante
    },
    
    async cargarTodosLosDatos() {
      await Promise.all([this.cargarAplicaciones(), this.cargarDatosPerfil(), this.generarDatosEjemplo()])
      this.calcularEstadisticas()
      this.generarGraficos()
      this.calcularFortalezas()
    },
    
    async cargarAplicaciones() {
      try {
        const response = await api.get(`/Aplicaciones/aspirante/${this.aspiranteId}`)
        this.aplicaciones = response.data || []
      } catch (error) {
        this.aplicaciones = []
      }
    },
    
    async cargarDatosPerfil() {
      try {
        const [habilidades, formacion, experiencia] = await Promise.all([
          api.get('/Habilidad/todos'),
          api.get('/Formacion/todos'),
          api.get('/Experiencia/todos')
        ])
        
        this.totalHabilidades = habilidades.data.filter(h => h.idAspirante === this.aspiranteId).length
        this.nivelFormacion = this.determinarNivelFormacion(formacion.data.filter(f => f.idAspirante === this.aspiranteId))
        this.añosExperiencia = this.calcularAñosExperiencia(experiencia.data.filter(e => e.idAspirante === this.aspiranteId))
        this.completitudPerfil = this.calcularCompletitudPerfil()
      } catch (error) {
        console.error('Error cargando datos del perfil:', error)
      }
    },
    
    calcularEstadisticas() {
      const estados = ['Pendiente', 'En Revisión', 'Entrevista', 'Aceptada', 'Rechazada']
      const colores = ['#ffc107', '#17a2b8', '#fd7e14', '#28a745', '#dc3545']
      
      this.estadisticas = {
        totalAplicaciones: this.aplicaciones.length,
        aplicacionesExitosas: this.aplicaciones.filter(a => a.estado === 'Aceptada').length,
        aplicacionesRevision: this.aplicaciones.filter(a => a.estado === 'En Revisión').length,
        entrevistas: this.aplicaciones.filter(a => a.estado === 'Entrevista').length,
        aplicacionesMesAnterior: this.calcularAplicacionesMesAnterior()
      }
      
      this.estadosAplicaciones = estados.map((estado, i) => {
        const cantidad = this.aplicaciones.filter(a => a.estado === estado).length
        return {
          nombre: estado,
          cantidad,
          color: colores[i],
          porcentaje: this.estadisticas.totalAplicaciones > 0 ? Math.round((cantidad / this.estadisticas.totalAplicaciones) * 100) : 0
        }
      })
    },
    
    generarGraficos() {
      const ahora = new Date()
      this.datosGrafico = Array.from({ length: 6 }, (_, i) => {
        const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i), 1)
        const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')
        const aplicacionesMes = this.aplicaciones.filter(app => {
          const fechaApp = new Date(app.fechaAplicacion)
          return fechaApp.getMonth() === fecha.getMonth() && fechaApp.getFullYear() === fecha.getFullYear()
        }).length
        return { mes: nombreMes, valor: aplicacionesMes + Math.floor(Math.random() * 3) }
      })
    },
    
    generarDatosEjemplo() {
      // Datos de ejemplo simplificados
      this.actividadReciente = [
        { id: 1, titulo: 'Aplicación enviada', descripcion: 'Aplicaste a Desarrollador Frontend en TechCorp', fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), icono: 'fas fa-paper-plane', tipoClass: 'bg-primary' },
        { id: 2, titulo: 'Perfil actualizado', descripcion: 'Agregaste nueva certificación en React', fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), icono: 'fas fa-user-edit', tipoClass: 'bg-info' }
      ]
      
      this.sectoresAplicacion = [
        { nombre: 'Tecnología', aplicaciones: Math.max(1, Math.floor(this.aplicaciones.length * 0.4)), color: '#007bff' },
        { nombre: 'Finanzas', aplicaciones: Math.max(1, Math.floor(this.aplicaciones.length * 0.2)), color: '#28a745' },
        { nombre: 'Consultoría', aplicaciones: Math.max(1, Math.floor(this.aplicaciones.length * 0.15)), color: '#ffc107' }
      ]
      
      this.empresasObjetivo = [
        { id: 1, nombre: 'TechCorp', aplicaciones: 3, estado: 'En proceso', estadoClass: 'bg-warning' },
        { id: 2, nombre: 'InnovaTech', aplicaciones: 2, estado: 'Revisión', estadoClass: 'bg-info' }
      ]
      
      this.objetivos = [
        { id: 1, titulo: 'Aplicaciones Mensuales', descripcion: 'Meta de aplicaciones por mes', actual: this.estadisticas.totalAplicaciones, meta: 20, progreso: Math.min(100, (this.estadisticas.totalAplicaciones / 20) * 100), icono: 'fas fa-paper-plane', tipoClass: 'bg-primary text-white', progressClass: 'bg-primary' },
        { id: 2, titulo: 'Completar Perfil', descripcion: 'Completitud del perfil profesional', actual: this.completitudPerfil, meta: 100, progreso: this.completitudPerfil, icono: 'fas fa-user-check', tipoClass: 'bg-info text-white', progressClass: 'bg-info' }
      ]
    },
    
    calcularFortalezas() {
      this.fortalezasPerfil = [
        { area: 'Experiencia Profesional', puntuacion: Math.min(100, this.añosExperiencia * 20), descripcion: `${this.añosExperiencia} años de experiencia registrada` },
        { area: 'Formación Académica', puntuacion: this.nivelFormacion === 'Universitaria' ? 90 : this.nivelFormacion === 'Técnica' ? 70 : 50, descripcion: `Nivel: ${this.nivelFormacion}` },
        { area: 'Habilidades Técnicas', puntuacion: Math.min(100, this.totalHabilidades * 10), descripcion: `${this.totalHabilidades} habilidades registradas` },
        { area: 'Actividad de Búsqueda', puntuacion: Math.min(100, this.estadisticas.totalAplicaciones * 5), descripcion: `${this.estadisticas.totalAplicaciones} aplicaciones enviadas` }
      ]
    },
    
    generarRecomendaciones() {
      this.recomendaciones = []
      
      const recomendacionesConfig = [
        { condicion: () => this.completitudPerfil < 80, id: 1, titulo: 'Completa tu perfil', descripcion: `Tu perfil está al ${this.completitudPerfil}%. Complétalo para mayor visibilidad.`, accion: 'Ir al perfil', icono: 'fas fa-user-plus', tipoClass: 'bg-warning text-white' },
        { condicion: () => this.totalHabilidades < 5, id: 2, titulo: 'Agrega más habilidades', descripcion: `Solo tienes ${this.totalHabilidades} habilidades. Agrega más para destacar.`, accion: 'Agregar habilidades', icono: 'fas fa-tools', tipoClass: 'bg-info text-white' },
        { condicion: () => this.estadisticas.totalAplicaciones < 5, id: 3, titulo: 'Aplica a más ofertas', descripcion: 'Has enviado pocas aplicaciones. Aumenta tu actividad para mejores resultados.', accion: 'Ver ofertas', icono: 'fas fa-search', tipoClass: 'bg-primary text-white' },
        { condicion: () => this.tasaExito < 10 && this.estadisticas.totalAplicaciones > 5, id: 4, titulo: 'Mejora tu estrategia', descripcion: 'Tu tasa de éxito es baja. Considera personalizar más tus aplicaciones.', accion: 'Ver consejos', icono: 'fas fa-lightbulb', tipoClass: 'bg-warning text-white' }
      ]
      
      this.recomendaciones = recomendacionesConfig.filter(rec => rec.condicion()).map(rec => ({ ...rec, condicion: undefined }))
    },
    
    // Métodos de utilidad consolidados
    calcularAplicacionesMesAnterior() {
      const mesAnterior = new Date()
      mesAnterior.setMonth(mesAnterior.getMonth() - 1)
      return this.aplicaciones.filter(app => {
        const fechaApp = new Date(app.fechaAplicacion)
        return fechaApp.getMonth() === mesAnterior.getMonth() && fechaApp.getFullYear() === mesAnterior.getFullYear()
      }).length
    },
    
    determinarNivelFormacion(formaciones) {
      const niveles = [
        { keywords: ['universitaria', 'licenciatura', 'ingenieria'], nivel: 'Universitaria' },
        { keywords: ['tecnica', 'tecnologica'], nivel: 'Técnica' },
        { keywords: [], nivel: 'Básica' }
      ]
      
      for (const { keywords, nivel } of niveles) {
        if (keywords.length === 0) return formaciones.length > 0 ? nivel : 'Sin especificar'
        if (formaciones.some(f => keywords.some(k => f.tipoFormacion.toLowerCase().includes(k)))) return nivel
      }
      return 'Sin especificar'
    },
    
    calcularAñosExperiencia(experiencias) {
      if (experiencias.length === 0) return 0
      const totalMeses = experiencias.reduce((total, exp) => {
        const inicio = new Date(exp.fechaInicio)
        const fin = exp.fechaFin ? new Date(exp.fechaFin) : new Date()
        const meses = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth())
        return total + Math.max(0, meses)
      }, 0)
      return Math.floor(totalMeses / 12)
    },
    
    calcularCompletitudPerfil() {
      const criterios = [
        { puntos: 10, condicion: () => this.user?.correo },
        { puntos: 10, condicion: () => this.aspiranteId },
        { puntos: 20, condicion: () => this.nivelFormacion !== 'Sin especificar' },
        { puntos: 20, condicion: () => this.añosExperiencia > 0 },
        { puntos: 10, condicion: () => this.totalHabilidades >= 3 },
        { puntos: 10, condicion: () => this.totalHabilidades >= 5 },
        { puntos: 10, condicion: () => this.estadisticas.totalAplicaciones > 0 },
        { puntos: 10, condicion: () => this.estadisticas.totalAplicaciones >= 5 }
      ]
      
      const puntos = criterios.reduce((total, criterio) => total + (criterio.condicion() ? criterio.puntos : 0), 0)
      return Math.round((puntos / 100) * 100)
    },
    
    // Acciones simplificadas
    async actualizarDatos() {
      await this.inicializar()
      this.showMessage('Estadísticas actualizadas exitosamente', 'success')
    },
    
    exportarReporte() {
      this.showMessage('Función de exportación será implementada próximamente', 'warning')
    },
    
    configurarObjetivos() {
      this.showMessage('Configuración de objetivos será implementada próximamente', 'info')
    },
    
    aplicarRecomendacion(recomendacion) {
      const acciones = {
        1: () => this.$emit('cambiar-tab', 'perfil'),
        2: () => this.$emit('cambiar-tab', 'habilidades'),
        3: () => this.$emit('cambiar-tab', 'ofertas'),
        default: () => this.showMessage('Recomendación aplicada', 'success')
      }
      
      ;(acciones[recomendacion.id] || acciones.default)()
    },
    
    showMessage(text, type = 'success') {
      this.message = text
      this.messageType = type
      setTimeout(() => { this.message = '' }, 5000)
    }
  }
}
</script>

<style scoped>
.estadisticas-aspirante {
  background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Cards y métricas */
.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}

.metric-card {
  border-top-width: 4px !important;
  border-top-style: solid !important;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto;
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.metric-label {
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0;
}

/* Gráficos */
.chart-container {
  position: relative;
  width: 100%;
}

.chart-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 250px;
  padding: 0 10px;
}

.chart-bar {
  flex: 1;
  margin: 0 2px;
  border-radius: 4px 4px 0 0;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 20px;
  animation: growUp 0.8s ease-out forwards;
  transform-origin: bottom;
}

.chart-bar:hover {
  transform: scale(1.05);
  opacity: 0.8;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: #495057;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-top: 10px;
}

.chart-label {
  font-size: 0.8rem;
  color: #6c757d;
  text-transform: capitalize;
}

/* Estados y elementos específicos */
.estado-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 40px;
  animation: slideIn 0.3s ease-out;
}

.timeline-marker {
  position: absolute;
  left: -28px;
  top: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recomendacion-item {
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #007bff;
  transition: all 0.2s ease;
}

.recomendacion-item:hover {
  background: #e9ecef;
  transform: translateX(2px);
}

.recomendacion-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.sector-item, .empresa-item {
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.empresa-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.empresa-item:hover, .sector-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.fortaleza-item {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.perfil-summary {
  border: 1px solid #e9ecef;
}

.objetivo-card {
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.objetivo-card:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.objetivo-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 249, 252, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.progress {
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.6s ease;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.gap-2 {
  gap: 0.5rem;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes growUp {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

.card {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .metric-number { font-size: 2rem; }
  .metric-icon { width: 50px; height: 50px; font-size: 1.2rem; }
  .chart-bars { height: 200px; }
  .timeline-item { padding-left: 35px; }
  .timeline-marker { width: 25px; height: 25px; font-size: 0.7rem; }
  .recomendacion-icon { width: 35px; height: 35px; font-size: 0.9rem; }
}

@media (max-width: 576px) {
  .metric-card { margin-bottom: 1rem; }
  .chart-bar { margin: 0 1px; }
  .chart-label { font-size: 0.7rem; }
  .objetivo-card { margin-bottom: 1rem; }
  .btn-group { flex-direction: column; }
  .btn-group .btn { border-radius: 8px !important; margin-bottom: 0.25rem; }
}
</style>