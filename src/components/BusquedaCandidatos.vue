<template>
  <div class="busqueda-candidatos">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-search me-2 text-primary"></i>Buscar Candidatos
              </h2>
              <p class="text-muted mb-0">Encuentra el talento perfecto para tu empresa</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary" @click="mostrarFiltrosAvanzados = !mostrarFiltrosAvanzados">
                <i class="fas fa-sliders-h me-2"></i>{{ mostrarFiltrosAvanzados ? 'Ocultar' : 'Filtros Avanzados' }}
              </button>
              <button class="btn btn-primary" @click="buscarCandidatos" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-search me-2"></i>{{ loading ? 'Buscando...' : 'Buscar' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros Principales -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <h6 class="mb-0"><i class="fas fa-filter me-2"></i>Criterios de Búsqueda</h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4" v-for="filtro in filtrosPrincipales" :key="filtro.key">
              <FormField v-model="filtros[filtro.key]" v-bind="filtro" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros Avanzados -->
      <div v-if="mostrarFiltrosAvanzados" class="card shadow-sm mb-4">
        <div class="card-header bg-light">
          <h6 class="mb-0"><i class="fas fa-cogs me-2"></i>Filtros Avanzados</h6>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6" v-for="seccion in seccionesFiltros" :key="seccion.titulo">
              <h6 class="text-secondary mb-3">
                <i :class="seccion.icon" class="me-2"></i>{{ seccion.titulo }}
              </h6>
              <div class="row g-3">
                <div v-for="filtro in seccion.filtros" :key="filtro.key" :class="filtro.colClass || 'col-12'">
                  <FormField v-model="filtros[filtro.key]" v-bind="filtro" />
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <div class="d-flex gap-2 justify-content-end">
                <button @click="limpiarFiltros" class="btn btn-outline-secondary">
                  <i class="fas fa-eraser me-2"></i>Limpiar Todo
                </button>
                <button @click="guardarBusqueda" class="btn btn-outline-info">
                  <i class="fas fa-save me-2"></i>Guardar Búsqueda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div v-if="estadisticasBusqueda.total > 0" class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3" v-for="(stat, key) in statsConfig" :key="key">
          <div class="stat-card text-white" :class="stat.class">
            <div class="stat-icon"><i :class="stat.icon"></i></div>
            <div class="stat-content">
              <h3>{{ estadisticasBusqueda[key] }}</h3>
              <p>{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div class="card shadow-sm">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="fas fa-list me-2"></i>Candidatos Encontrados ({{ candidatosFiltrados.length }})
          </h6>
          <div class="d-flex gap-2">
            <select v-model="ordenamiento" @change="ordenarResultados" class="form-select form-select-sm">
              <option v-for="opcion in opcionesOrden" :key="opcion.value" :value="opcion.value">{{ opcion.label }}</option>
            </select>
            <button v-for="vista in vistas" :key="vista.key" class="btn btn-sm" 
              :class="vistaDetallada === vista.detallada ? 'btn-primary' : 'btn-outline-primary'"
              @click="vistaDetallada = vista.detallada">
              <i :class="vista.icon"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Buscando candidatos perfectos para tu empresa...</p>
          </div>

          <!-- Estado inicial -->
          <div v-else-if="!busquedaRealizada" class="text-center py-5">
            <i class="fas fa-search-plus fa-4x text-muted mb-3"></i>
            <h5>Busca tu Candidato Ideal</h5>
            <p class="text-muted mb-4">Utiliza los filtros arriba para encontrar el talento perfecto</p>
            <button @click="buscarCandidatos" class="btn btn-primary">
              <i class="fas fa-search me-2"></i>Comenzar Búsqueda
            </button>
          </div>

          <!-- Sin resultados -->
          <div v-else-if="candidatosFiltrados.length === 0" class="text-center py-5">
            <i class="fas fa-user-slash fa-4x text-muted mb-3"></i>
            <h5>No se encontraron candidatos</h5>
            <p class="text-muted mb-4">Intenta ajustar tus criterios de búsqueda</p>
            <button @click="limpiarFiltros" class="btn btn-outline-primary">
              <i class="fas fa-redo me-2"></i>Limpiar Filtros y Buscar de Nuevo
            </button>
          </div>

          <!-- Vista Detallada (Cards) -->
          <div v-else-if="vistaDetallada">
            <div class="row">
              <div v-for="candidato in candidatosPaginados" :key="candidato.idAspirante" class="col-lg-6 col-xl-4 mb-4">
                <div class="card candidato-card h-100" :class="getCandidatoCardClass(candidato)">
                  <div class="card-header d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                      <h6 class="card-title mb-1">
                        {{ candidato.nombreCompleto }}
                        <span v-if="candidato.puntuacion >= 80" class="badge bg-success ms-2">
                          <i class="fas fa-star"></i> Top
                        </span>
                      </h6>
                      <p class="text-muted small mb-2">
                        <i class="fas fa-briefcase me-1"></i>{{ candidato.puestoBusca || 'Buscando oportunidades' }}
                      </p>
                      <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-primary">{{ candidato.experienciaAnios || 0 }} años exp.</span>
                        <span class="badge bg-info">{{ candidato.nivelFormacion || 'N/A' }}</span>
                      </div>
                    </div>
                    <div class="dropdown">
                      <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li v-for="accion in accionesCandidato" :key="accion.key">
                          <a class="dropdown-item" href="#" @click.prevent="accion.metodo(candidato)" :class="accion.class">
                            <i :class="accion.icon" class="me-2"></i>{{ accion.getLabel ? accion.getLabel(candidato) : accion.label }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-body">
                    <!-- Info contacto -->
                    <div class="candidato-info mb-3">
                      <div class="info-item" v-for="info in getInfoContacto(candidato)" :key="info.icon">
                        <i :class="info.icon" class="text-muted me-2"></i>
                        <span>{{ info.texto }}</span>
                      </div>
                    </div>

                    <!-- Habilidades -->
                    <div v-if="candidato.habilidadesDestacadas?.length" class="mb-3">
                      <h6 class="small text-muted mb-2">Habilidades Principales:</h6>
                      <div class="habilidades-tags">
                        <span v-for="habilidad in candidato.habilidadesDestacadas.slice(0, 4)" :key="habilidad" 
                          class="badge bg-light text-dark me-1 mb-1">{{ habilidad }}</span>
                        <span v-if="candidato.habilidadesDestacadas.length > 4" class="badge bg-secondary">
                          +{{ candidato.habilidadesDestacadas.length - 4 }} más
                        </span>
                      </div>
                    </div>

                    <!-- Experiencia -->
                    <div v-if="candidato.experienciaDestacada" class="mb-3">
                      <h6 class="small text-muted mb-1">Experiencia Reciente:</h6>
                      <p class="small mb-1"><strong>{{ candidato.experienciaDestacada.puesto }}</strong></p>
                      <p class="small text-muted mb-0">
                        {{ candidato.experienciaDestacada.empresa }} | {{ candidato.experienciaDestacada.duracion }}
                      </p>
                    </div>

                    <!-- Compatibilidad -->
                    <div class="compatibilidad-score">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="fw-bold">Compatibilidad</small>
                        <small class="text-muted">{{ candidato.puntuacion || 0 }}%</small>
                      </div>
                      <div class="progress" style="height: 6px;">
                        <div class="progress-bar" :class="getCompatibilidadClass(candidato.puntuacion || 0)"
                          :style="{ width: (candidato.puntuacion || 0) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">
                        <i class="fas fa-calendar me-1"></i>Registro: {{ formatearFecha(candidato.fechaRegistro) }}
                      </small>
                      <div class="btn-group btn-group-sm">
                        <button v-for="btn in botonesCard" :key="btn.key" :class="btn.class" @click="btn.metodo(candidato)">
                          <i :class="btn.icon"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vista Lista (Tabla) -->
          <div v-else>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th v-for="col in columnasTabla" :key="col.key">{{ col.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="candidato in candidatosPaginados" :key="candidato.idAspirante">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="candidato-avatar me-3">
                          <i class="fas fa-user-circle fa-2x text-muted"></i>
                        </div>
                        <div>
                          <h6 class="mb-1">
                            {{ candidato.nombreCompleto }}
                            <span v-if="candidato.puntuacion >= 80" class="badge bg-success ms-1">Top</span>
                          </h6>
                          <small class="text-muted">{{ candidato.correo }}</small>
                        </div>
                      </div>
                    </td>
                    <td><span class="fw-bold">{{ candidato.puestoBusca || 'No especificado' }}</span></td>
                    <td><span class="badge bg-primary">{{ candidato.experienciaAnios || 0 }} años</span></td>
                    <td><span class="badge bg-info">{{ candidato.nivelFormacion || 'N/A' }}</span></td>
                    <td><small>{{ candidato.ubicacion || 'No especificada' }}</small></td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="progress me-2" style="width: 60px; height: 8px;">
                          <div class="progress-bar" :class="getCompatibilidadClass(candidato.puntuacion || 0)"
                            :style="{ width: (candidato.puntuacion || 0) + '%' }"></div>
                        </div>
                        <small>{{ candidato.puntuacion || 0 }}%</small>
                      </div>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button v-for="btn in botonesCard" :key="btn.key" :class="btn.class" @click="btn.metodo(candidato)">
                          <i :class="btn.icon"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="d-flex justify-content-center mt-4">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                  <button class="page-link" @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                <li v-for="pagina in paginasVisibles" :key="pagina" class="page-item" 
                  :class="{ active: pagina === paginaActual }">
                  <button class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</button>
                </li>
                <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                  <button class="page-link" @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Mensaje -->
      <div v-if="message" class="alert mt-4" :class="`alert-${messageType}`">
        <i :class="messageIcon" class="me-2"></i>{{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormField from './FormField.vue'
import api from '../services/api'
import { DEPARTAMENTOS_EL_SALVADOR } from '../utils/constants'

export default {
  name: 'BusquedaCandidatos',
  components: { FormField },
  emits: ['volver-dashboard'],
  
  data() {
    return {
      loading: false,
      busquedaRealizada: false,
      mostrarFiltrosAvanzados: false,
      vistaDetallada: true,
      message: '',
      messageType: 'success',
      ordenamiento: 'relevancia',
      paginaActual: 1,
      elementosPorPagina: 12,
      candidatos: [],
      candidatosFiltrados: [],
      empresaId: null,
      
      filtros: {
        busquedaGeneral: '', puestoBuscado: '', ubicacion: '', nivelFormacion: '', institucion: '',
        experienciaMinima: '', experienciaMaxima: '', empresaAnterior: '', habilidades: '',
        nivelHabilidad: '', idioma: '', nivelIdioma: '', certificaciones: ''
      },
      
      estadisticasBusqueda: { total: 0, destacados: 0, universitarios: 0, mismaUbicacion: 0 },
      
      // Configuraciones estáticas
      filtrosPrincipales: [
        { key: 'busquedaGeneral', type: 'text', label: 'Búsqueda General', icon: 'fas fa-search', placeholder: 'Nombre, habilidades, puesto...', 'help-text': 'Busca por nombre, habilidades o experiencia' },
        { key: 'puestoBuscado', type: 'text', label: 'Puesto que Busca', icon: 'fas fa-briefcase', placeholder: 'Desarrollador, Contador...', 'help-text': 'Filtrar por el puesto deseado del candidato' },
        { key: 'ubicacion', type: 'select', label: 'Ubicación', icon: 'fas fa-map-marker-alt', options: [], 'help-text': 'Departamento donde reside el candidato' }
      ],
      
      statsConfig: {
        total: { class: 'bg-primary', icon: 'fas fa-users', label: 'Total Candidatos' },
        destacados: { class: 'bg-success', icon: 'fas fa-star', label: 'Perfiles Destacados' },
        universitarios: { class: 'bg-info', icon: 'fas fa-graduation-cap', label: 'Universitarios' },
        mismaUbicacion: { class: 'bg-warning', icon: 'fas fa-map-marker-alt', label: 'Misma Ubicación' }
      },
      
      opcionesOrden: [
        { value: 'relevancia', label: 'Ordenar por Relevancia' },
        { value: 'experiencia', label: 'Ordenar por Experiencia' },
        { value: 'formacion', label: 'Ordenar por Formación' },
        { value: 'reciente', label: 'Ordenar por Más Reciente' }
      ],
      
      vistas: [
        { key: 'cards', detallada: true, icon: 'fas fa-th-large' },
        { key: 'lista', detallada: false, icon: 'fas fa-list' }
      ],
      
      columnasTabla: [
        { key: 'candidato', label: 'Candidato' },
        { key: 'puesto', label: 'Puesto Deseado' },
        { key: 'experiencia', label: 'Experiencia' },
        { key: 'formacion', label: 'Formación' },
        { key: 'ubicacion', label: 'Ubicación' },
        { key: 'compatibilidad', label: 'Compatibilidad' },
        { key: 'acciones', label: 'Acciones' }
      ],
      
      botonesCard: [
        { key: 'ver', class: 'btn btn-outline-primary', icon: 'fas fa-eye', metodo: this.verPerfilCompleto },
        { key: 'contactar', class: 'btn btn-outline-success', icon: 'fas fa-envelope', metodo: this.contactarCandidato },
        { key: 'invitar', class: 'btn btn-outline-warning', icon: 'fas fa-paper-plane', metodo: this.invitarAOferta }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    messageIcon() {
      const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' }
      return icons[this.messageType] || 'fas fa-info-circle'
    },
    
    async cargarTodosLosAspirantes() {
      try {
        const [aspirantesRes, usuariosRes, contactosRes, direccionesRes] = await Promise.all([
          api.get('/Aspirante/todos'),
          api.get('/Usuario/todos'),
          api.get('/Contacto/todos'),
          api.get('/Direccion/todos')
        ])
        
        const [formacionRes, experienciaRes, habilidadesRes] = await Promise.all([
          api.get('/Formacion/todos').catch(() => ({ data: [] })),
          api.get('/Experiencia/todos').catch(() => ({ data: [] })),
          api.get('/Habilidad/todos').catch(() => ({ data: [] }))
        ])
        
        this.candidatos = aspirantesRes.data.map(aspirante => {
          const usuario = usuariosRes.data.find(u => u.idUsuario === aspirante.idUsuario)
          const contacto = contactosRes.data.find(c => c.idUsuario === aspirante.idUsuario)
          const direccion = direccionesRes.data.find(d => d.idUsuario === aspirante.idUsuario)
          const formaciones = formacionRes.data.filter(f => f.idAspirante === aspirante.idAspirante)
          const experiencias = experienciaRes.data.filter(e => e.idAspirante === aspirante.idAspirante)
          const habilidades = habilidadesRes.data.filter(h => h.idAspirante === aspirante.idAspirante)
          
          return {
            idAspirante: aspirante.idAspirante,
            nombreCompleto: `${aspirante.primerNombre} ${aspirante.segundoNombre || ''} ${aspirante.primerApellido} ${aspirante.segundoApellido || ''}`.trim(),
            puestoBusca: aspirante.puestoBusca,
            correo: usuario?.correo || 'No disponible',
            telefono: contacto?.telefonoPersonal || contacto?.telefonoFijo,
            ubicacion: direccion ? `${direccion.municipio}, ${direccion.departamento}` : null,
            fechaRegistro: usuario?.fechaRegistro,
            nivelFormacion: this.determinarNivelFormacion(formaciones),
            institucion: formaciones.map(f => f.institucion).join(', '),
            experienciaAnios: this.calcularExperienciaTotal(experiencias),
            experienciaDestacada: this.obtenerExperienciaDestacada(experiencias),
            habilidadesDestacadas: habilidades.map(h => h.nombreHabilidad).slice(0, 8),
            puntuacion: 0,
            esFavorito: false,
            _formaciones: formaciones,
            _experiencias: experiencias,
            _habilidades: habilidades,
            _direccion: direccion
          }
        })
      } catch (error) {
        throw error
      }
    },
    
    aplicarFiltros() {
      let filtrados = [...this.candidatos]
      
      // Aplicar cada filtro
      const filtrosAplicar = [
        { key: 'busquedaGeneral', fn: (c, val) => {
          const busqueda = val.toLowerCase()
          return c.nombreCompleto.toLowerCase().includes(busqueda) ||
                 (c.puestoBusca && c.puestoBusca.toLowerCase().includes(busqueda)) ||
                 c.habilidadesDestacadas.some(h => h.toLowerCase().includes(busqueda)) ||
                 c.correo.toLowerCase().includes(busqueda)
        }},
        { key: 'puestoBuscado', fn: (c, val) => c.puestoBusca && c.puestoBusca.toLowerCase().includes(val.toLowerCase()) },
        { key: 'ubicacion', fn: (c, val) => c.ubicacion && c.ubicacion.includes(val) },
        { key: 'nivelFormacion', fn: (c, val) => c.nivelFormacion === val },
        { key: 'institucion', fn: (c, val) => c.institucion.toLowerCase().includes(val.toLowerCase()) },
        { key: 'experienciaMinima', fn: (c, val) => (c.experienciaAnios || 0) >= parseInt(val) },
        { key: 'experienciaMaxima', fn: (c, val) => (c.experienciaAnios || 0) <= parseInt(val) },
        { key: 'empresaAnterior', fn: (c, val) => c._experiencias.some(exp => exp.nombreEmpresa.toLowerCase().includes(val.toLowerCase())) },
        { key: 'habilidades', fn: (c, val) => {
          const habilidadesReq = val.toLowerCase().split(',').map(h => h.trim())
          return habilidadesReq.some(hr => c.habilidadesDestacadas.some(hc => hc.toLowerCase().includes(hr)))
        }}
      ]
      
      filtrosAplicar.forEach(filtro => {
        if (this.filtros[filtro.key]) {
          filtrados = filtrados.filter(c => filtro.fn(c, this.filtros[filtro.key]))
        }
      })
      
      this.candidatosFiltrados = filtrados
      this.paginaActual = 1
    },
    
    calcularCompatibilidad() {
      this.candidatosFiltrados.forEach(candidato => {
        let puntuacion = 50
        if (candidato.experienciaAnios >= 5) puntuacion += 20
        else if (candidato.experienciaAnios >= 2) puntuacion += 10
        if (candidato.nivelFormacion === 'Universitario') puntuacion += 15
        else if (candidato.nivelFormacion === 'Técnico') puntuacion += 10
        if (candidato.habilidadesDestacadas.length >= 5) puntuacion += 15
        if (candidato.puestoBusca) puntuacion += 10
        candidato.puntuacion = Math.min(100, Math.max(0, puntuacion))
      })
    },
    
    ordenarResultados() {
      const criterios = {
        relevancia: (a, b) => (b.puntuacion || 0) - (a.puntuacion || 0),
        experiencia: (a, b) => (b.experienciaAnios || 0) - (a.experienciaAnios || 0),
        formacion: (a, b) => {
          const niveles = { 'Doctorado': 8, 'Maestría': 7, 'Postgrado': 6, 'Universitario': 5, 'Tecnólogo': 4, 'Técnico': 3, 'Secundaria': 2, 'Primaria': 1 }
          return (niveles[b.nivelFormacion] || 0) - (niveles[a.nivelFormacion] || 0)
        },
        reciente: (a, b) => new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0)
      }
      this.candidatosFiltrados.sort(criterios[this.ordenamiento] || criterios.relevancia)
    },
    
    calcularEstadisticas() {
      this.estadisticasBusqueda = {
        total: this.candidatosFiltrados.length,
        destacados: this.candidatosFiltrados.filter(c => (c.puntuacion || 0) >= 80).length,
        universitarios: this.candidatosFiltrados.filter(c => c.nivelFormacion === 'Universitario').length,
        mismaUbicacion: this.candidatosFiltrados.filter(c => 
          this.filtros.ubicacion && c.ubicacion && c.ubicacion.includes(this.filtros.ubicacion)
        ).length
      }
    },
    
    // Métodos auxiliares
    determinarNivelFormacion(formaciones) {
      if (!formaciones.length) return 'No especificado'
      const niveles = { 'Doctorado': 8, 'Maestría': 7, 'Postgrado': 6, 'Universitario': 5, 'Tecnólogo': 4, 'Técnico': 3, 'Secundaria': 2, 'Primaria': 1 }
      let maxNivel = 0, nivelMaximo = 'No especificado'
      formaciones.forEach(f => {
        const nivel = niveles[f.tipoFormacion] || 0
        if (nivel > maxNivel) { maxNivel = nivel; nivelMaximo = f.tipoFormacion }
      })
      return nivelMaximo
    },
    
    calcularExperienciaTotal(experiencias) {
      if (!experiencias.length) return 0
      let totalMeses = 0
      experiencias.forEach(exp => {
        const inicio = new Date(exp.fechaInicio)
        const fin = exp.fechaFin ? new Date(exp.fechaFin) : new Date()
        totalMeses += Math.max(0, (fin - inicio) / (1000 * 60 * 60 * 24 * 30))
      })
      return Math.round(totalMeses / 12 * 10) / 10
    },
    
    obtenerExperienciaDestacada(experiencias) {
      if (!experiencias.length) return null
      const masReciente = experiencias.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))[0]
      const inicio = new Date(masReciente.fechaInicio)
      const fin = masReciente.fechaFin ? new Date(masReciente.fechaFin) : new Date()
      const meses = Math.round((fin - inicio) / (1000 * 60 * 60 * 24 * 30))
      return {
        puesto: masReciente.puestoTrabajo,
        empresa: masReciente.nombreEmpresa,
        duracion: meses >= 12 ? `${Math.round(meses/12)} años` : `${meses} meses`
      }
    },
    
    // Acciones con candidatos
    verPerfilCompleto(candidato) {
      this.showMessage(`Funcionalidad de perfil completo para ${candidato.nombreCompleto} próximamente`, 'info')
    },
    
    contactarCandidato(candidato) {
      this.showMessage(`Enviando mensaje a ${candidato.nombreCompleto}...`, 'info')
    },
    
    invitarAOferta(candidato) {
      this.showMessage(`Invitando a ${candidato.nombreCompleto} a una oferta...`, 'info')
    },
    
    marcarFavorito(candidato) {
      candidato.esFavorito = !candidato.esFavorito
      const accion = candidato.esFavorito ? 'agregado a' : 'removido de'
      this.showMessage(`${candidato.nombreCompleto} ${accion} favoritos`, 'success')
    },
    
    // Utilidades
    limpiarFiltros() {
      Object.keys(this.filtros).forEach(key => { this.filtros[key] = '' })
      this.candidatosFiltrados = [...this.candidatos]
      this.busquedaRealizada = false
    },
    
    guardarBusqueda() {
      this.showMessage('Búsqueda guardada (funcionalidad próximamente)', 'info')
    },
    
    cambiarPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina
        document.querySelector('.busqueda-candidatos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    
    // Métodos de utilidad para template
    getCandidatoCardClass(candidato) {
      if (candidato.puntuacion >= 90) return 'border-success'
      if (candidato.puntuacion >= 80) return 'border-warning'
      if (candidato.esFavorito) return 'border-info'
      return ''
    },
    
    getCompatibilidadClass(puntuacion) {
      if (puntuacion >= 80) return 'bg-success'
      if (puntuacion >= 60) return 'bg-warning'
      if (puntuacion >= 40) return 'bg-info'
      return 'bg-secondary'
    },
    
    getInfoContacto(candidato) {
      return [
        { icon: 'fas fa-map-marker-alt', texto: candidato.ubicacion || 'No especificada' },
        { icon: 'fas fa-envelope', texto: candidato.correo },
        ...(candidato.telefono ? [{ icon: 'fas fa-phone', texto: candidato.telefono }] : [])
      ]
    },
    
    formatearFecha(fecha) {
      return fecha ? new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }) : 'N/A'
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
.busqueda-candidatos { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh; }

.stat-card { border-radius: 15px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: transform 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15); }
.stat-icon { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.2); font-size: 1.5rem; flex-shrink: 0; }
.stat-content { flex-grow: 1; }
.stat-content h3 { font-size: 2rem; font-weight: 700; margin: 0; line-height: 1; }
.stat-content p { margin: 0; opacity: 0.9; font-weight: 500; }

.card { border: none; border-radius: 15px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12); }

.candidato-card { transition: all 0.3s ease; border-left: 4px solid transparent; }
.candidato-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); }
.candidato-card.border-success { border-left-color: #10b981; }
.candidato-card.border-warning { border-left-color: #f59e0b; }
.candidato-card.border-info { border-left-color: #06b6d4; }

.candidato-info { display: flex; flex-direction: column; gap: 0.5rem; }
.info-item { display: flex; align-items: center; font-size: 0.9rem; }
.info-item i { width: 16px; flex-shrink: 0; }
.habilidades-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.compatibilidad-score .progress { border-radius: 10px; background-color: #e5e7eb; }
.compatibilidad-score .progress-bar { border-radius: 10px; transition: width 0.6s ease; }

.table { margin-bottom: 0; }
.table th { border-top: none; font-weight: 600; color: #374151; background-color: #f8fafc; }
.table td { vertical-align: middle; border-color: #e5e7eb; }
.table-hover tbody tr:hover { background-color: rgba(59, 130, 246, 0.05); }
.candidato-avatar { flex-shrink: 0; }

.badge { font-size: 0.75rem; padding: 0.4em 0.8em; font-weight: 500; }
.btn { border-radius: 8px; font-weight: 500; transition: all 0.2s ease; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); border: none; }
.btn-success { background: linear-gradient(135deg, #10b981, #059669); border: none; }
.btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); border: none; }
.btn-info { background: linear-gradient(135deg, #06b6d4, #0891b2); border: none; }

.form-control:focus, .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25); }
.dropdown-menu { border: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 10px; }
.dropdown-item { border-radius: 5px; margin: 0.125rem; transition: all 0.2s ease; }
.dropdown-item:hover { background-color: #f3f4f6; transform: translateX(2px); }

.pagination { border-radius: 10px; overflow: hidden; }
.page-link { border: none; color: #6b7280; font-weight: 500; transition: all 0.2s ease; }
.page-link:hover { background-color: #f3f4f6; color: #3b82f6; }
.page-item.active .page-link { background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-color: #3b82f6; }

.spinner-border { width: 3rem; height: 3rem; }

@media (max-width: 768px) {
  .stat-card { flex-direction: column; text-align: center; gap: 0.5rem; }
  .stat-icon { width: 50px; height: 50px; font-size: 1.2rem; }
  .stat-content h3 { font-size: 1.5rem; }
  .table-responsive { font-size: 0.9rem; }
  .candidato-card { margin-bottom: 1rem; }
  .info-item { font-size: 0.8rem; }
}

@media (max-width: 576px) {
  .busqueda-candidatos .container { padding-left: 1rem; padding-right: 1rem; }
  .btn-group-sm .btn { padding: 0.25rem 0.5rem; }
  .stat-content h3 { font-size: 1.2rem; }
  .stat-content p { font-size: 0.8rem; }
}
</style>totalPaginas() {
      return Math.ceil(this.candidatosFiltrados.length / this.elementosPorPagina)
    },
    
    candidatosPaginados() {
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina
      return this.candidatosFiltrados.slice(inicio, inicio + this.elementosPorPagina)
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
    
    seccionesFiltros() {
      return [
        {
          titulo: 'Formación Académica',
          icon: 'fas fa-graduation-cap',
          filtros: [
            { key: 'nivelFormacion', type: 'select', label: 'Nivel Mínimo de Formación', icon: 'fas fa-diploma', options: this.nivelesFormacionOptions },
            { key: 'institucion', type: 'text', label: 'Institución Específica', icon: 'fas fa-university', placeholder: 'Universidad, instituto...' }
          ]
        },
        {
          titulo: 'Experiencia Laboral',
          icon: 'fas fa-briefcase',
          filtros: [
            { key: 'experienciaMinima', type: 'number', label: 'Años Mínimos', icon: 'fas fa-calendar', placeholder: '0', min: '0', max: '50', colClass: 'col-6' },
            { key: 'experienciaMaxima', type: 'number', label: 'Años Máximos', icon: 'fas fa-calendar-alt', placeholder: '50', min: '0', max: '50', colClass: 'col-6' },
            { key: 'empresaAnterior', type: 'text', label: 'Empresa Específica', icon: 'fas fa-building', placeholder: 'Nombre de empresa anterior...' }
          ]
        },
        {
          titulo: 'Habilidades y Competencias',
          icon: 'fas fa-tools',
          filtros: [
            { key: 'habilidades', type: 'textarea', label: 'Habilidades Requeridas', icon: 'fas fa-code', placeholder: 'JavaScript, Python, Gestión de proyectos...', rows: 3, 'help-text': 'Separa las habilidades con comas' },
            { key: 'nivelHabilidad', type: 'select', label: 'Nivel Mínimo de Habilidad', icon: 'fas fa-star', options: this.nivelesHabilidadOptions }
          ]
        },
        {
          titulo: 'Idiomas y Certificaciones',
          icon: 'fas fa-language',
          filtros: [
            { key: 'idioma', type: 'select', label: 'Idioma Requerido', icon: 'fas fa-globe', options: this.idiomasOptions, colClass: 'col-6' },
            { key: 'nivelIdioma', type: 'select', label: 'Nivel Mínimo', icon: 'fas fa-chart-line', options: this.nivelesIdiomaOptions, colClass: 'col-6' },
            { key: 'certificaciones', type: 'text', label: 'Certificaciones', icon: 'fas fa-certificate', placeholder: 'PMP, AWS, Scrum Master...' }
          ]
        }
      ]
    },
    
    accionesCandidato() {
      return [
        { key: 'ver', label: 'Ver Perfil Completo', icon: 'fas fa-eye', metodo: this.verPerfilCompleto },
        { key: 'contactar', label: 'Enviar Mensaje', icon: 'fas fa-envelope', metodo: this.contactarCandidato },
        { key: 'invitar', label: 'Invitar a Oferta', icon: 'fas fa-paper-plane', metodo: this.invitarAOferta },
        { key: 'separator', separator: true },
        { key: 'favorito', getLabel: (c) => c.esFavorito ? 'Quitar de Favoritos' : 'Agregar a Favoritos', icon: 'fas fa-heart', metodo: this.marcarFavorito }
      ]
    },
    
    // Opciones para selects - generadas dinámicamente
    nivelesFormacionOptions() {
      return [
        { value: '', label: 'Cualquier nivel' },
        ...['Primaria', 'Secundaria', 'Técnico', 'Tecnólogo', 'Universitario', 'Postgrado', 'Maestría', 'Doctorado']
          .map(nivel => ({ value: nivel, label: nivel === 'Primaria' ? 'Educación Primaria' : nivel === 'Secundaria' ? 'Educación Secundaria' : nivel === 'Técnico' ? 'Técnico Superior' : nivel }))
      ]
    },
    
    nivelesHabilidadOptions() {
      return [{ value: '', label: 'Cualquier nivel' }, ...['Básico', 'Intermedio', 'Avanzado', 'Experto'].map(n => ({ value: n, label: n }))]
    },
    
    idiomasOptions() {
      return [{ value: '', label: 'Cualquier idioma' }, ...['Inglés', 'Francés', 'Portugués', 'Italiano', 'Alemán', 'Chino Mandarín'].map(i => ({ value: i, label: i }))]
    },
    
    nivelesIdiomaOptions() {
      return [
        { value: '', label: 'Cualquier nivel' },
        { value: 'A1', label: 'A1 - Principiante' }, { value: 'A2', label: 'A2 - Básico' },
        { value: 'B1', label: 'B1 - Intermedio' }, { value: 'B2', label: 'B2 - Intermedio Alto' },
        { value: 'C1', label: 'C1 - Avanzado' }, { value: 'C2', label: 'C2 - Nativo/Bilingüe' }
      ]
    }
  },
  
  async mounted() {
    await this.cargarEmpresaId()
    this.configurarOpciones()
  },
  
  methods: {
    async cargarEmpresaId() {
      try {
        const response = await api.get('/Empresa/todas')
        const empresa = response.data.find(emp => emp.idUsuario === this.user.idUsuario)
        this.empresaId = empresa?.idEmpresa
      } catch (error) {
        console.error('Error obteniendo ID de empresa:', error)
      }
    },
    
    configurarOpciones() {
      this.filtrosPrincipales[2].options = [
        { value: '', label: 'Todas las ubicaciones' },
        ...DEPARTAMENTOS_EL_SALVADOR.map(dep => ({ value: dep, label: dep }))
      ]
    },
    
    async buscarCandidatos() {
      try {
        this.loading = true
        await this.cargarTodosLosAspirantes()
        this.aplicarFiltros()
        this.calcularCompatibilidad()
        this.ordenarResultados()
        this.calcularEstadisticas()
        this.busquedaRealizada = true
        
        const msg = this.candidatosFiltrados.length > 0 
          ? `Se encontraron ${this.candidatosFiltrados.length} candidatos que coinciden con tus criterios`
          : 'No se encontraron candidatos con los criterios especificados'
        const tipo = this.candidatosFiltrados.length > 0 ? 'success' : 'warning'
        this.showMessage(msg, tipo)
      } catch (error) {
        this.showMessage('Error al realizar la búsqueda', 'error')
      } finally {
        this.loading = false
      }
    },