<template>
  <div class="habilidades">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-tools me-2 text-warning"></i>
                Habilidades y Competencias
              </h2>
              <p class="text-muted mb-0">Gestiona tus habilidades técnicas y profesionales</p>
            </div>
            <button 
              @click="mostrarModal = true" 
              class="btn btn-warning"
            >
              <i class="fas fa-plus me-2"></i>
              Agregar Habilidad
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar habilidades..."
              v-model="filtroTexto"
            >
          </div>
        </div>
        <div class="col-md-6">
          <select class="form-select" v-model="filtroNivel">
            <option value="">Todos los niveles</option>
            <option v-for="nivel in nivelesOptions" :key="nivel.value" :value="nivel.value">
              {{ nivel.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Lista de habilidades -->
      <div class="row">
        <div class="col-12">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="mt-2">Cargando habilidades...</p>
          </div>
          
          <div v-else-if="habilidades.length === 0" class="text-center py-5">
            <i class="fas fa-tools fa-3x text-muted mb-3"></i>
            <h5>No hay habilidades registradas</h5>
            <p class="text-muted">Agrega tus habilidades técnicas y profesionales para destacar tu perfil</p>
            <button @click="mostrarModal = true" class="btn btn-warning">
              <i class="fas fa-plus me-2"></i>
              Agregar Primera Habilidad
            </button>
          </div>
          
          <div v-else>
            <!-- Habilidades agrupadas por nivel -->
            <div v-for="nivel in nivelesConHabilidades" :key="nivel.nombre" class="nivel-grupo mb-4">
              <div class="nivel-header">
                <h5 class="mb-0">
                  <span class="badge" :class="`bg-${nivel.color}`">
                    {{ nivel.nombre }} ({{ nivel.habilidades.length }})
                  </span>
                </h5>
              </div>
              
              <div class="habilidades-grid mt-3">
                <div 
                  v-for="habilidad in nivel.habilidades" 
                  :key="habilidad.idHabilidad"
                  class="habilidad-card"
                >
                  <div class="card h-100">
                    <div class="card-body p-3">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title mb-1">{{ habilidad.nombreHabilidad }}</h6>
                        <div class="dropdown">
                          <button 
                            class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            type="button" 
                            :id="`dropdown${habilidad.idHabilidad}`"
                            data-bs-toggle="dropdown"
                          >
                            <i class="fas fa-ellipsis-v"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li>
                              <a class="dropdown-item" href="#" @click.prevent="editarHabilidad(habilidad)">
                                <i class="fas fa-edit me-2"></i>Editar
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item text-danger" href="#" @click.prevent="confirmarEliminar(habilidad)">
                                <i class="fas fa-trash me-2"></i>Eliminar
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="nivel-indicator mb-2">
                        <div class="progress" style="height: 8px;">
                          <div 
                            class="progress-bar" 
                            :class="`bg-${getNivelColor(habilidad.nivelDominio)}`"
                            :style="{ width: getNivelPorcentaje(habilidad.nivelDominio) + '%' }"
                          ></div>
                        </div>
                        <small class="text-muted">{{ habilidad.nivelDominio }}</small>
                      </div>
                      
                      <div v-if="habilidad.comentario" class="comentario">
                        <small class="text-muted">
                          <i class="fas fa-comment me-1"></i>
                          {{ habilidad.comentario }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Resumen de habilidades -->
            <div class="row mt-4">
              <div class="col-12">
                <div class="card bg-light">
                  <div class="card-body">
                    <h6 class="card-title mb-3">
                      <i class="fas fa-chart-pie me-2"></i>
                      Resumen de Habilidades
                    </h6>
                    <div class="row text-center">
                      <div class="col-6 col-md-3" v-for="nivel in nivelesOptions" :key="nivel.value">
                        <div class="resumen-item">
                          <div class="resumen-numero" :class="`text-${getNivelColor(nivel.value)}`">
                            {{ contarHabilidadesPorNivel(nivel.value) }}
                          </div>
                          <div class="resumen-label">{{ nivel.label }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para agregar/editar habilidad -->
      <div class="modal fade" :class="{ show: mostrarModal }" :style="{ display: mostrarModal ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-tools me-2"></i>
                {{ editando ? 'Editar' : 'Agregar' }} Habilidad
              </h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="guardarHabilidad">
                <!-- Nombre de la Habilidad -->
                <FormField
                  v-model="form.nombreHabilidad"
                  label="Nombre de la Habilidad"
                  icon="fas fa-cog"
                  placeholder="JavaScript, Excel, Liderazgo, Photoshop..."
                  :required="true"
                  :error="errors.nombreHabilidad"
                  help-text="Máximo 20 caracteres"
                />
                
                <!-- Nivel de Dominio -->
                <FormField
                  v-model="form.nivelDominio"
                  type="select"
                  label="Nivel de Dominio"
                  icon="fas fa-signal"
                  placeholder="Selecciona tu nivel"
                  :options="nivelesOptions"
                  :required="true"
                  :error="errors.nivelDominio"
                />
                
                <!-- Preview del nivel -->
                <div v-if="form.nivelDominio" class="mb-3">
                  <label class="form-label">Vista Previa del Nivel</label>
                  <div class="nivel-preview">
                    <div class="progress mb-2" style="height: 12px;">
                      <div 
                        class="progress-bar" 
                        :class="`bg-${getNivelColor(form.nivelDominio)}`"
                        :style="{ width: getNivelPorcentaje(form.nivelDominio) + '%' }"
                      ></div>
                    </div>
                    <small class="text-muted">
                      {{ getNivelDescripcion(form.nivelDominio) }}
                    </small>
                  </div>
                </div>
                
                <!-- Comentario -->
                <FormField
                  v-model="form.comentario"
                  type="textarea"
                  label="Comentario (Opcional)"
                  icon="fas fa-comment"
                  placeholder="Descripción adicional, años de experiencia, proyectos relevantes..."
                  :rows="3"
                  help-text="Proporciona contexto adicional sobre tu experiencia con esta habilidad"
                />
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal" :disabled="guardando">
                Cancelar
              </button>
              <button type="button" @click="guardarHabilidad" class="btn btn-warning" :disabled="guardando || !isFormValid">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Backdrop del modal -->
      <div v-if="mostrarModal" class="modal-backdrop fade show" @click="cerrarModal"></div>

      <!-- Modal de confirmación de eliminación -->
      <div class="modal fade" :class="{ show: mostrarConfirmacion }" :style="{ display: mostrarConfirmacion ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Confirmar Eliminación
              </h5>
              <button type="button" class="btn-close" @click="mostrarConfirmacion = false"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta habilidad?</p>
              <div class="alert alert-warning">
                <strong>{{ habilidadAEliminar?.nombreHabilidad }}</strong><br>
                <small>Nivel: {{ habilidadAEliminar?.nivelDominio }}</small>
              </div>
              <p class="text-muted small">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="mostrarConfirmacion = false" :disabled="eliminando">
                Cancelar
              </button>
              <button type="button" @click="eliminarHabilidad" class="btn btn-danger" :disabled="eliminando">
                <span v-if="eliminando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-trash me-2"></i>
                {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Backdrop del modal de confirmación -->
      <div v-if="mostrarConfirmacion" class="modal-backdrop fade show" @click="mostrarConfirmacion = false"></div>

      <!-- Mensaje de éxito/error -->
      <div v-if="message" class="alert mt-4" :class="messageClass">
        <i :class="messageIcon" class="me-2"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormField from './FormField.vue'
import { aspiranteService } from '../services/aspiranteService'
import { validators } from '../utils/validators'
import { NIVELES_DOMINIO } from '../utils/constants'

export default {
  name: 'Habilidades',
  components: { FormField },
  data() {
    return {
      loading: false,
      guardando: false,
      eliminando: false,
      mostrarModal: false,
      mostrarConfirmacion: false,
      editando: false,
      message: '',
      messageType: 'success',
      
      // Filtros
      filtroTexto: '',
      filtroNivel: '',
      
      habilidades: [],
      habilidadAEliminar: null,
      aspiranteId: null,
      
      form: {
        idHabilidad: null,
        idAspirante: null,
        nombreHabilidad: '',
        nivelDominio: '',
        comentario: ''
      },
      
      errors: {},
      nivelesOptions: NIVELES_DOMINIO
    }
  },
  computed: {
    ...mapGetters(['user']),
    
    habilidadesFiltradas() {
      let resultado = [...this.habilidades]
      
      // Filtro por texto
      if (this.filtroTexto) {
        resultado = resultado.filter(h => 
          h.nombreHabilidad.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
          (h.comentario && h.comentario.toLowerCase().includes(this.filtroTexto.toLowerCase()))
        )
      }
      
      // Filtro por nivel
      if (this.filtroNivel) {
        resultado = resultado.filter(h => h.nivelDominio === this.filtroNivel)
      }
      
      return resultado
    },
    
    nivelesConHabilidades() {
      const niveles = ['Experto', 'Avanzado', 'Intermedio', 'Básico']
      
      return niveles.map(nivel => ({
        nombre: nivel,
        color: this.getNivelColor(nivel),
        habilidades: this.habilidadesFiltradas.filter(h => h.nivelDominio === nivel)
      })).filter(nivel => nivel.habilidades.length > 0)
    },
    
    isFormValid() {
      return !this.errors.nombreHabilidad && 
             !this.errors.nivelDominio && 
             this.form.nombreHabilidad && 
             this.form.nivelDominio
    },
    
    messageClass() {
      return `alert-${this.messageType}`
    },
    
    messageIcon() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
      }
      return icons[this.messageType] || 'fas fa-info-circle'
    }
  },
  
  async mounted() {
    await this.cargarAspiranteId()
    if (this.aspiranteId) {
      await this.cargarHabilidades()
    }
  },
  
  methods: {
    async cargarAspiranteId() {
      try {
        // Temporal: obtener ID del aspirante
        this.aspiranteId = 1 // En producción, obtener del store o API
      } catch (error) {
        console.error('Error obteniendo ID de aspirante:', error)
        this.aspiranteId = 1
      }
    },
    
    async cargarHabilidades() {
      try {
        this.loading = true
        const response = await aspiranteService.obtenerHabilidades()
        // Filtrar solo las habilidades del aspirante actual
        this.habilidades = response.filter(h => h.idAspirante === this.aspiranteId)
      } catch (error) {
        console.error('Error cargando habilidades:', error)
        this.showMessage('Error al cargar las habilidades', 'error')
      } finally {
        this.loading = false
      }
    },
    
    editarHabilidad(habilidad) {
      this.editando = true
      this.form = {
        idHabilidad: habilidad.idHabilidad,
        idAspirante: habilidad.idAspirante,
        nombreHabilidad: habilidad.nombreHabilidad,
        nivelDominio: habilidad.nivelDominio,
        comentario: habilidad.comentario || ''
      }
      this.errors = {}
      this.mostrarModal = true
    },
    
    confirmarEliminar(habilidad) {
      this.habilidadAEliminar = habilidad
      this.mostrarConfirmacion = true
    },
    
    async eliminarHabilidad() {
      try {
        this.eliminando = true
        await aspiranteService.eliminarHabilidad(this.habilidadAEliminar.idHabilidad)
        
        await this.cargarHabilidades()
        this.mostrarConfirmacion = false
        this.habilidadAEliminar = null
        this.showMessage('Habilidad eliminada exitosamente', 'success')
        
      } catch (error) {
        console.error('Error eliminando habilidad:', error)
        this.showMessage('Error al eliminar la habilidad', 'error')
      } finally {
        this.eliminando = false
      }
    },
    
    cerrarModal() {
      this.mostrarModal = false
      this.editando = false
      this.form = {
        idHabilidad: null,
        idAspirante: null,
        nombreHabilidad: '',
        nivelDominio: '',
        comentario: ''
      }
      this.errors = {}
    },
    
    validateForm() {
      this.errors = {}
      
      if (!validators.required(this.form.nombreHabilidad) || !validators.maxLength(this.form.nombreHabilidad, 20)) {
        this.errors.nombreHabilidad = 'El nombre de la habilidad es requerido (máximo 20 caracteres)'
      }
      
      if (!validators.required(this.form.nivelDominio)) {
        this.errors.nivelDominio = 'Selecciona el nivel de dominio'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async guardarHabilidad() {
      if (!this.validateForm()) return
      
      try {
        this.guardando = true
        
        const habilidadData = {
          idAspirante: this.aspiranteId,
          nombreHabilidad: this.form.nombreHabilidad,
          nivelDominio: this.form.nivelDominio,
          comentario: this.form.comentario || null
        }
        
        if (this.editando) {
          habilidadData.idHabilidad = this.form.idHabilidad
          await aspiranteService.actualizarHabilidad(habilidadData)
          this.showMessage('Habilidad actualizada exitosamente', 'success')
        } else {
          await aspiranteService.crearHabilidad(habilidadData)
          this.showMessage('Habilidad agregada exitosamente', 'success')
        }
        
        await this.cargarHabilidades()
        this.cerrarModal()
        
      } catch (error) {
        console.error('Error guardando habilidad:', error)
        this.showMessage('Error al guardar la habilidad', 'error')
      } finally {
        this.guardando = false
      }
    },
    
    getNivelColor(nivel) {
      const colores = {
        'Básico': 'secondary',
        'Intermedio': 'info',
        'Avanzado': 'warning',
        'Experto': 'success'
      }
      return colores[nivel] || 'secondary'
    },
    
    getNivelPorcentaje(nivel) {
      const porcentajes = {
        'Básico': 25,
        'Intermedio': 50,
        'Avanzado': 75,
        'Experto': 100
      }
      return porcentajes[nivel] || 0
    },
    
    getNivelDescripcion(nivel) {
      const descripciones = {
        'Básico': 'Conocimientos fundamentales, requiere supervisión',
        'Intermedio': 'Puede trabajar de forma independiente en tareas comunes',
        'Avanzado': 'Dominio sólido, puede enseñar a otros',
        'Experto': 'Maestría completa, referente en el área'
      }
      return descripciones[nivel] || ''
    },
    
    contarHabilidadesPorNivel(nivel) {
      return this.habilidades.filter(h => h.nivelDominio === nivel).length
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
.habilidades {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  min-height: 100vh;
}

/* Nivel Groups */
.nivel-grupo {
  margin-bottom: 2rem;
}

.nivel-header {
  border-bottom: 2px solid #f59e0b;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

/* Habilidades Grid */
.habilidades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.habilidad-card .card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.habilidad-card .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Progress Bars */
.nivel-indicator .progress {
  border-radius: 10px;
  background-color: #f3f4f6;
}

.nivel-indicator .progress-bar {
  border-radius: 10px;
  transition: width 0.3s ease;
}

.nivel-preview {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid #f59e0b;
}

/* Comentario */
.comentario {
  background: #f8fafc;
  padding: 0.5rem;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
}

/* Resumen */
.resumen-item {
  padding: 1rem 0;
}

.resumen-numero {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.resumen-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Modal Styles */
.modal.show {
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 15px;
  border: none;
}

.modal-header {
  border-bottom: 1px solid #e5e7eb;
  border-radius: 15px 15px 0 0;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 15px 15px;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  color: white;
}

.btn-warning:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
}

/* Badges */
.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

/* Input Group */
.input-group-text {
  background: white;
  border-color: #d1d5db;
}

/* Dropdown */
.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  border-radius: 10px;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  border-radius: 5px;
  margin: 0.125rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  transform: translateX(2px);
}

/* Responsive */
@media (max-width: 768px) {
  .habilidades-grid {
    grid-template-columns: 1fr;
  }
  
  .resumen-numero {
    font-size: 1.5rem;
  }
  
  .nivel-header h5 {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .habilidad-card .card-body {
    padding: 1rem;
  }
}
</style>