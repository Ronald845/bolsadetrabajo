<template>
  <div class="crear-oferta">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="h4 mb-1">
                <i class="fas fa-plus-circle me-2 text-primary"></i>
                {{ esEdicion ? 'Editar Oferta Laboral' : 'Crear Nueva Oferta' }}
              </h2>
              <p class="text-muted mb-0">
                {{ esEdicion ? 'Actualiza los datos de tu oferta laboral' : 'Completa la información para publicar tu nueva vacante' }}
              </p>
            </div>
            <div class="d-flex gap-2">
              <button
                @click="volverOfertas"
                class="btn btn-outline-secondary"
              >
                <i class="fas fa-arrow-left me-2"></i>
                Mis Ofertas
              </button>
              <button
                @click="volverDashboard"
                class="btn btn-outline-primary"
              >
                <i class="fas fa-home me-2"></i>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario Simple -->
      <form @submit.prevent="guardarOferta">
        <!-- Información Básica -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              Información de la Oferta
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <FormField
                  v-model="form.tituloPuesto"
                  label="Título del Puesto"
                  icon="fas fa-briefcase"
                  placeholder="Ej: Desarrollador Frontend, Contador, Diseñador..."
                  :required="true"
                  :error="errors.tituloPuesto"
                  help-text="Máximo 50 caracteres - Sé específico y claro"
                />
              </div>
              <div class="col-md-4">
                <FormField
                  v-model="form.modalidadEmpleo"
                  type="select"
                  label="Modalidad de Empleo"
                  icon="fas fa-building"
                  :options="modalidadesOptions"
                  :required="true"
                  :error="errors.modalidadEmpleo"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.ubicacion"
                  label="Ubicación"
                  icon="fas fa-map-marker-alt"
                  placeholder="Ciudad, Departamento"
                  :required="true"
                  :error="errors.ubicacion"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.estadoOferta"
                  type="select"
                  label="Estado de la Oferta"
                  icon="fas fa-flag"
                  :options="estadosOptions"
                  :required="true"
                />
              </div>
              <div class="col-12">
                <FormField
                  v-model="form.descripcionPuesto"
                  type="textarea"
                  label="Descripción del Puesto"
                  icon="fas fa-file-alt"
                  placeholder="Describe las responsabilidades, funciones principales..."
                  :required="true"
                  :rows="4"
                  :error="errors.descripcionPuesto"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Salario -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="fas fa-dollar-sign me-2 text-success"></i>
              Salario
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <FormField
                  v-model="form.salarioMinimo"
                  type="number"
                  label="Salario Mínimo (USD)"
                  icon="fas fa-dollar-sign"
                  placeholder="800"
                  :required="true"
                  :error="errors.salarioMinimo"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.salarioMaximo"
                  type="number"
                  label="Salario Máximo (USD)"
                  icon="fas fa-dollar-sign"
                  placeholder="1200"
                  :required="true"
                  :error="errors.salarioMaximo"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Requisitos -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="fas fa-user-graduate me-2 text-info"></i>
              Requisitos
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <FormField
                  v-model="form.perfilAcademico"
                  type="select"
                  label="Perfil Académico"
                  icon="fas fa-graduation-cap"
                  :options="nivelesEducativosOptions"
                  :required="true"
                  :error="errors.perfilAcademico"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.experienciaRequerida"
                  label="Experiencia Requerida"
                  icon="fas fa-clock"
                  placeholder="Ej: 2 años en desarrollo web..."
                  :required="true"
                  :error="errors.experienciaRequerida"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.fechaCierre"
                  type="date"
                  label="Fecha de Cierre"
                  icon="fas fa-calendar-times"
                  :required="true"
                  :min="fechaMinima"
                  :error="errors.fechaCierre"
                />
              </div>
              <div class="col-md-6">
                <FormField
                  v-model="form.conocimientosNecesarios"
                  label="Conocimientos (Opcional)"
                  icon="fas fa-brain"
                  placeholder="Tecnologías, idiomas, certificaciones..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <button
                type="button"
                @click="volverOfertas"
                class="btn btn-outline-secondary"
              >
                <i class="fas fa-times me-2"></i>
                Cancelar
              </button>

              <button
                type="submit"
                class="btn btn-success"
                :disabled="guardando"
              >
                <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar Oferta' : 'Publicar Oferta') }}
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- Mensaje -->
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
import { validators } from '../utils/validators'
import api from '../services/api'

export default {
  name: 'CrearOferta',
  components: { FormField },
  props: {
    ofertaAEditar: {
      type: Object,
      default: null
    }
  },
  emits: ['volver-dashboard', 'volver-ofertas', 'oferta-guardada'],
  data() {
    return {
      guardando: false,
      message: '',
      messageType: 'success',
      empresaId: null,
      datosInicializados: false,
      
      form: {
        idOferta: null,
        idEmpresa: null,
        tituloPuesto: '',
        descripcionPuesto: '',
        modalidadEmpleo: '',
        ubicacion: '',
        salarioMinimo: '',
        salarioMaximo: '',
        perfilAcademico: '',
        experienciaRequerida: '',
        conocimientosNecesarios: '',
        fechaCierre: '',
        estadoOferta: 'Activa'
      },
      
      errors: {},
      
      modalidadesOptions: [
        { value: '', label: 'Selecciona modalidad' },
        { value: 'Presencial', label: 'Presencial' },
        { value: 'Remoto', label: 'Remoto' },
        { value: 'Híbrido', label: 'Híbrido' },
        { value: 'Medio Tiempo', label: 'Medio Tiempo' },
        { value: 'Tiempo Completo', label: 'Tiempo Completo' }
      ],
      
      estadosOptions: [
        { value: 'Activa', label: 'Activa - Visible para candidatos' },
        { value: 'Borrador', label: 'Borrador - Solo visible para ti' },
        { value: 'Pausada', label: 'Pausada - No recibe aplicaciones' }
      ],
      
      nivelesEducativosOptions: [
        { value: '', label: 'Selecciona nivel educativo' },
        { value: 'Sin requisitos', label: 'Sin requisitos específicos' },
        { value: 'Primaria', label: 'Educación Primaria' },
        { value: 'Secundaria', label: 'Educación Secundaria' },
        { value: 'Técnico', label: 'Técnico Superior' },
        { value: 'Tecnólogo', label: 'Tecnólogo' },
        { value: 'Universitario', label: 'Universitario' },
        { value: 'Postgrado', label: 'Postgrado' },
        { value: 'Maestría', label: 'Maestría' },
        { value: 'Doctorado', label: 'Doctorado' }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['user']),
    
    esEdicion() {
      return this.ofertaAEditar !== null && this.ofertaAEditar !== undefined
    },
    
    fechaMinima() {
      const mañana = new Date()
      mañana.setDate(mañana.getDate() + 1)
      return mañana.toISOString().split('T')[0]
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
  
  created() {
    console.log('📝 CrearOferta created - Iniciando...')
    this.inicializarComponente()
  },
  
  methods: {
    async inicializarComponente() {
      if (this.datosInicializados) {
        console.log('⚠️ Ya inicializado, saltando...')
        return
      }
      
      try {
        console.log('🔄 Inicializando componente...')
        await this.cargarEmpresaId()
        
        if (this.esEdicion && this.ofertaAEditar) {
          console.log('📝 Modo edición detectado')
          this.cargarDatosOferta()
        } else {
          console.log('➕ Modo creación detectado')
          this.establecerFechaDefecto()
        }
        
        this.datosInicializados = true
        console.log('✅ Componente inicializado correctamente')
        
      } catch (error) {
        console.error('❌ Error inicializando:', error)
        this.showMessage('Error al inicializar el formulario', 'error')
      }
    },
    
    async cargarEmpresaId() {
      try {
        const response = await api.get('/Empresa/todas')
        const empresas = response.data
        const empresaActual = empresas.find(emp => emp.idUsuario === this.user.idUsuario)
        
        if (empresaActual) {
          this.empresaId = empresaActual.idEmpresa
          this.form.idEmpresa = this.empresaId
          console.log('✅ Empresa ID:', this.empresaId)
        } else {
          throw new Error('No se encontró empresa para el usuario')
        }
      } catch (error) {
        console.error('❌ Error cargando empresa:', error)
        this.showMessage('Error al cargar información de la empresa', 'error')
      }
    },
    
    cargarDatosOferta() {
      if (!this.ofertaAEditar) {
        console.log('⚠️ No hay oferta para cargar')
        return
      }
      
      console.log('📋 Cargando datos de oferta:', this.ofertaAEditar.tituloPuesto)
      
      // Asignación individual para evitar reactividad problemática
      this.form.idOferta = this.ofertaAEditar.idOferta || null
      this.form.idEmpresa = this.ofertaAEditar.idEmpresa || this.empresaId
      this.form.tituloPuesto = this.ofertaAEditar.tituloPuesto || ''
      this.form.descripcionPuesto = this.ofertaAEditar.descripcionPuesto || ''
      this.form.modalidadEmpleo = this.ofertaAEditar.modalidadEmpleo || ''
      this.form.ubicacion = this.ofertaAEditar.ubicacion || ''
      this.form.salarioMinimo = this.ofertaAEditar.salarioMinimo || ''
      this.form.salarioMaximo = this.ofertaAEditar.salarioMaximo || ''
      this.form.perfilAcademico = this.ofertaAEditar.perfilAcademico || ''
      this.form.experienciaRequerida = this.ofertaAEditar.experienciaRequerida || ''
      this.form.conocimientosNecesarios = this.ofertaAEditar.conocimientosNecesarios || ''
      this.form.estadoOferta = this.ofertaAEditar.estadoOferta || 'Activa'
      
      if (this.ofertaAEditar.fechaCierre) {
        this.form.fechaCierre = this.ofertaAEditar.fechaCierre.split('T')[0]
      }
      
      console.log('✅ Datos cargados en formulario')
    },
    
    establecerFechaDefecto() {
      const fechaDefecto = new Date()
      fechaDefecto.setDate(fechaDefecto.getDate() + 30)
      this.form.fechaCierre = fechaDefecto.toISOString().split('T')[0]
      console.log('📅 Fecha por defecto establecida:', this.form.fechaCierre)
    },
    
    validarFormulario() {
      this.errors = {}
      let valido = true
      
      if (!validators.required(this.form.tituloPuesto)) {
        this.errors.tituloPuesto = 'El título es requerido'
        valido = false
      }
      
      if (!validators.required(this.form.modalidadEmpleo)) {
        this.errors.modalidadEmpleo = 'Selecciona la modalidad'
        valido = false
      }
      
      if (!validators.required(this.form.ubicacion)) {
        this.errors.ubicacion = 'La ubicación es requerida'
        valido = false
      }
      
      if (!validators.required(this.form.descripcionPuesto)) {
        this.errors.descripcionPuesto = 'La descripción es requerida'
        valido = false
      }
      
      if (!validators.required(this.form.salarioMinimo) || this.form.salarioMinimo <= 0) {
        this.errors.salarioMinimo = 'El salario mínimo es requerido'
        valido = false
      }
      
      if (!validators.required(this.form.salarioMaximo) || this.form.salarioMaximo <= 0) {
        this.errors.salarioMaximo = 'El salario máximo es requerido'
        valido = false
      }
      
      if (parseFloat(this.form.salarioMaximo) < parseFloat(this.form.salarioMinimo)) {
        this.errors.salarioMaximo = 'El salario máximo debe ser mayor al mínimo'
        valido = false
      }
      
      if (!validators.required(this.form.perfilAcademico)) {
        this.errors.perfilAcademico = 'Selecciona el perfil académico'
        valido = false
      }
      
      if (!validators.required(this.form.experienciaRequerida)) {
        this.errors.experienciaRequerida = 'La experiencia es requerida'
        valido = false
      }
      
      if (!validators.required(this.form.fechaCierre)) {
        this.errors.fechaCierre = 'La fecha de cierre es requerida'
        valido = false
      }
      
      return valido
    },
    
    async guardarOferta() {
      if (!this.validarFormulario()) {
        this.showMessage('Por favor completa todos los campos requeridos', 'error')
        return
      }
      
      try {
        this.guardando = true
        console.log('💾 Guardando oferta...', this.esEdicion ? 'EDICIÓN' : 'NUEVA')
        
        const ofertaData = {
          idEmpresa: this.empresaId,
          tituloPuesto: this.form.tituloPuesto,
          descripcionPuesto: this.form.descripcionPuesto,
          perfilAcademico: this.form.perfilAcademico,
          experienciaRequerida: this.form.experienciaRequerida,
          salarioMinimo: parseFloat(this.form.salarioMinimo),
          salarioMaximo: parseFloat(this.form.salarioMaximo),
          modalidadEmpleo: this.form.modalidadEmpleo,
          ubicacion: this.form.ubicacion,
          fechaPublicacion: this.esEdicion ? this.ofertaAEditar.fechaPublicacion : new Date().toISOString(),
          fechaCierre: new Date(this.form.fechaCierre + 'T23:59:59').toISOString(),
          estadoOferta: this.form.estadoOferta,
          conocimientoNecesarios: this.form.conocimientosNecesarios || null
        }
        
        if (this.esEdicion) {
          ofertaData.idOferta = this.form.idOferta
        }
        
        // Simular guardado exitoso
        const ofertaGuardada = { ...ofertaData, idOferta: this.form.idOferta || Date.now() }
        
        this.showMessage(
          this.esEdicion 
            ? `Oferta "${this.form.tituloPuesto}" actualizada exitosamente`
            : `Nueva oferta "${this.form.tituloPuesto}" creada exitosamente`,
          'success'
        )
        
        // Emitir evento y navegar
        this.$emit('oferta-guardada', ofertaGuardada, this.esEdicion)
        
        setTimeout(() => {
          this.volverOfertas()
        }, 1500)
        
      } catch (error) {
        console.error('❌ Error guardando:', error)
        this.showMessage('Error al guardar la oferta', 'error')
      } finally {
        this.guardando = false
      }
    },
    
    volverDashboard() {
      console.log('🏠 Volviendo al dashboard')
      this.$emit('volver-dashboard')
    },
    
    volverOfertas() {
      console.log('📋 Volviendo a ofertas')
      this.$emit('volver-ofertas')
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
.crear-oferta {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  background: white !important;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
}

.btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

@media (max-width: 768px) {
  .crear-oferta .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>