<template>
  <div class="container py-4">
    <h2 class="mb-4">
      <i class="fas fa-clipboard-list me-2 text-primary"></i>
      Mis Ofertas Publicadas
    </h2>

    <div v-if="cargando" class="text-center">
      <span class="spinner-border text-primary"></span>
    </div>

    <div v-else-if="ofertas.length === 0" class="alert alert-warning">
      No has publicado ninguna oferta todavía.
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 g-4">
      <div class="col" v-for="oferta in ofertas" :key="oferta.idOferta">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ oferta.tituloPuesto }}</h5>
            <p class="card-text">{{ oferta.descripcionPuesto }}</p>
            <p class="card-text">
              <strong>Ubicación:</strong> {{ oferta.ubicacion }}<br>
              <strong>Salario:</strong> ${{ oferta.salarioMinimo }} - ${{ oferta.salarioMaximo }}<br>
              <strong>Modalidad:</strong> {{ oferta.modalidadEmpleo }}
            </p>
            <span class="badge bg-success" v-if="oferta.estadoOferta === 'Activa'">Activa</span>
            <span class="badge bg-secondary" v-else>{{ oferta.estadoOferta }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import { mapGetters } from 'vuex'

export default {
  name: 'MisOfertas',
  data() {
    return {
      ofertas: [],
      cargando: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.cargarOfertas()
  },
  methods: {
    async cargarOfertas() {
      this.cargando = true
      try {
        const response = await api.get('/Ofertas/todas')
        const todas = response.data

        // Filtrar solo las ofertas de la empresa autenticada
        this.ofertas = todas.filter(o => o.idEmpresa === this.user.idEmpresa)

      } catch (error) {
        console.error('Error al cargar ofertas:', error)
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

<style scoped>
.card-title {
  font-weight: bold;
}
</style>
