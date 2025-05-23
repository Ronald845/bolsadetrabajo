<template>
  <div class="container-fluid">
    <!-- Pestañas de navegación -->
    <div class="row">
      <div class="col-12">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: currentTab === 'dashboard' }"
              href="#" 
              @click.prevent="currentTab = 'dashboard'"
            >
              <i class="fas fa-home me-2"></i>Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: currentTab === 'perfil' }"
              href="#" 
              @click.prevent="currentTab = 'perfil'"
            >
              <i class="fas fa-user me-2"></i>Mi Perfil
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: currentTab === 'formacion' }"
              href="#" 
              @click.prevent="currentTab = 'formacion'"
            >
              <i class="fas fa-graduation-cap me-2"></i>Formación
            </a>
          </li>
         <li class="nav-item">
           <a 
             class="nav-link" 
             :class="{ active: currentTab === 'experiencia' }"
             href="#" 
             @click.prevent="currentTab = 'experiencia'"
           >
             <i class="fas fa-briefcase me-2"></i>Experiencia
           </a>
         </li>
         <li class="nav-item">
           <a 
             class="nav-link" 
             :class="{ active: currentTab === 'habilidades' }"
             href="#" 
             @click.prevent="currentTab = 'habilidades'"
           >
             <i class="fas fa-tools me-2"></i>Habilidades
           </a>
         </li>
         <li class="nav-item">
           <a 
             class="nav-link" 
             :class="{ active: currentTab === 'certificaciones' }"
             href="#" 
             @click.prevent="currentTab = 'certificaciones'"
           >
             <i class="fas fa-certificate me-2"></i>Certificaciones
           </a>
         </li>
         <!-- 🆕 Nueva pestaña de Logros -->
         <li class="nav-item">
           <a 
             class="nav-link" 
             :class="{ active: currentTab === 'logros' }"
             href="#" 
             @click.prevent="currentTab = 'logros'"
           >
             <i class="fas fa-trophy me-2"></i>Logros
           </a>
         </li>
        </ul>
      </div>
    </div>
    
    <!-- Contenido dinámico -->
    <div class="row">
      <div class="col-12">
        <!-- Dashboard original -->
        <AspiranteDashboard v-if="currentTab === 'dashboard'" />
        
        <!-- Perfil -->
        <PerfilAspirante v-else-if="currentTab === 'perfil'" />
        
        <!-- Formación Académica -->
        <FormacionAcademica v-else-if="currentTab === 'formacion'" />
        
        <!-- Experiencia Laboral -->
        <ExperienciaLaboral v-else-if="currentTab === 'experiencia'" />
        
        <!-- Habilidades -->
        <Habilidades v-else-if="currentTab === 'habilidades'" />
        
        <!-- Certificaciones -->
        <Certificaciones v-else-if="currentTab === 'certificaciones'" />
        
        <!-- 🆕 Logros -->
        <Logros v-else-if="currentTab === 'logros'" />
      </div>
    </div>
  </div>
</template>

<script>
import AspiranteDashboard from '../components/AspiranteDashboard.vue'
import PerfilAspirante from '../components/PerfilAspirante.vue'
import FormacionAcademica from '../components/FormacionAcademica.vue'
import ExperienciaLaboral from '../components/ExperienciaLaboral.vue'
import Habilidades from '../components/Habilidades.vue'
import Certificaciones from '../components/Certificaciones.vue'
import Logros from '../components/Logros.vue'  // 🆕 Nuevo import

export default {
  name: 'AspiranteView',
  components: {
    AspiranteDashboard,
    PerfilAspirante,
    FormacionAcademica,
    ExperienciaLaboral,
    Habilidades,
    Certificaciones,
    Logros  // 🆕 Nuevo componente
  },
  data() {
    return {
      currentTab: 'dashboard'
    }
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-tabs .nav-link:hover:not(.disabled) {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  transform: translateY(-2px);
}

.nav-tabs .nav-link.active {
  color: #3b82f6;
  background: none;
  border-bottom-color: #3b82f6;
  font-weight: 600;
}

.nav-tabs .nav-link.disabled {
  color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.6;
}

.nav-tabs .nav-link.disabled:hover {
  transform: none;
  border-bottom-color: transparent;
}

.nav-tabs {
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

/* Indicador de progreso en las pestañas */
.nav-tabs .nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-tabs .nav-link.active::after {
  width: 100%;
}

/* Animación suave entre pestañas */
.container-fluid > .row:last-child {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .nav-tabs {
    flex-wrap: wrap;
  }
  
  .nav-item {
    margin-bottom: 0.25rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .nav-tabs .nav-link {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
  
  .nav-tabs .nav-link i {
    display: none;
  }
}
</style>