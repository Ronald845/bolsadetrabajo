<template>
  <div class="detalle-oferta container py-5 fade-in">
    <div class="card shadow border-0 rounded-4">
      <!-- Encabezado -->
      <div class="card-header bg-white d-flex justify-content-between align-items-center rounded-top-4 px-4 py-3 border-bottom">
        <div class="d-flex align-items-center gap-3">
          <i class="fas fa-briefcase fa-lg text-primary"></i>
          <h4 class="mb-0 fw-bold text-dark">{{ oferta.tituloPuesto }}</h4>
        </div>
        <button class="btn btn-sm btn-outline-dark" @click="$emit('volver')">
          <i class="fas fa-arrow-left me-2"></i>Volver
        </button>
      </div>

      <!-- Cuerpo -->
      <div class="card-body px-4 py-5">
        <!-- Descripción -->
        <section class="mb-5">
          <h6 class="section-title">📝 Descripción del Puesto</h6>
          <p class="text-body">{{ oferta.descripcionPuesto }}</p>
        </section>

        <!-- Información agrupada -->
        <section class="row gy-4">
          <div class="col-md-6">
            <h6 class="section-title">📋 Información General</h6>
            <ul class="list-unstyled">
              <li><i class="fas fa-building me-2 text-muted"></i><strong>Modalidad:</strong> {{ oferta.modalidadEmpleo }}</li>
              <li><i class="fas fa-map-marker-alt me-2 text-muted"></i><strong>Ubicación:</strong> {{ oferta.ubicacion }}</li>
              <li>
                <i class="fas fa-dollar-sign me-2 text-muted"></i>
                <strong>Salario:</strong>
                <span class="text-success fw-semibold">${{ oferta.salarioMinimo }}</span>
                -
                <span class="text-success fw-semibold">${{ oferta.salarioMaximo }}</span>
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h6 class="section-title">🎓 Requisitos</h6>
            <ul class="list-unstyled">
              <li><i class="fas fa-graduation-cap me-2 text-muted"></i><strong>Perfil Académico:</strong> {{ oferta.perfilAcademico }}</li>
              <li><i class="fas fa-clock me-2 text-muted"></i><strong>Experiencia:</strong> {{ oferta.experienciaRequerida }}</li>
              <li><i class="fas fa-lightbulb me-2 text-muted"></i><strong>Conocimientos:</strong> {{ oferta.conocimientoNecesarios || 'No especificados' }}</li>
            </ul>
          </div>
        </section>

        <!-- Fechas y estado -->
        <hr class="my-5" />
        <section class="row align-items-center">
          <div class="col-md-4">
            <p><i class="fas fa-calendar-plus me-2 text-muted"></i><strong>Publicación:</strong> {{ formatearFecha(oferta.fechaPublicacion) }}</p>
          </div>
          <div class="col-md-4">
            <p><i class="fas fa-calendar-times me-2 text-muted"></i><strong>Cierre:</strong> {{ formatearFecha(oferta.fechaCierre) }}</p>
          </div>
          <div class="col-md-4 text-end">
            <span class="badge rounded-pill estado-oferta px-4 py-2"
                  :class="getEstadoClass(oferta.estadoOferta)">
              <i class="fas fa-flag me-2"></i> {{ oferta.estadoOferta }}
            </span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetalleOferta',
  props: {
    oferta: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatearFecha(fecha) {
      if (!fecha) return 'N/A'
      const date = new Date(fecha)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getEstadoClass(estado) {
      switch (estado) {
        case 'Activa':
          return 'bg-success bg-opacity-25 text-success'
        case 'Pausada':
          return 'bg-warning bg-opacity-25 text-warning'
        case 'Borrador':
          return 'bg-secondary bg-opacity-25 text-secondary'
        default:
          return 'bg-light text-muted'
      }
    }
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}

.badge.estado-oferta {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
