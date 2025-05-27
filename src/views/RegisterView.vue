<template>
  <div class="register-container">
    <div class="register-background">
      <div v-for="i in 3" :key="i" class="background-shape" :class="`shape-${i}`"></div>
    </div>
    
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100 py-4">
        <div class="col-12 col-md-10 col-lg-12 col-xl-10">
          <div class="row g-0 register-card">
            <!-- Panel izquierdo -->
            <div class="col-lg-5 register-info">
              <div class="info-content">
                <div class="brand-section">
                  <div class="brand-icon">
                    <i class="fas fa-user-plus"></i>
                  </div>
                  <h1 class="brand-title">Únete a Nosotros</h1>
                  <p class="brand-subtitle">Crea tu cuenta y comienza tu búsqueda</p>
                </div>
                
                <div class="features-list">
                  <div v-for="feature in features" :key="feature.id" class="feature-item">
                    <i :class="feature.icon" class="feature-icon"></i>
                    <div>
                      <h6>{{ feature.title }}</h6>
                      <p>{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Panel derecho -->
            <div class="col-lg-7 register-form-section">
              <div class="form-container">
                <RegisterForm @register-success="handleRegisterSuccess" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '../components/RegisterForm.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'RegisterView',
  components: { RegisterForm },
  
  data() {
    return {
      features: [
        { id: 1, icon: 'fas fa-rocket', title: 'Proceso Rápido', description: 'Registro en menos de 2 minutos' },
        { id: 2, icon: 'fas fa-shield-alt', title: 'Datos Seguros', description: 'Tu información está protegida' },
        { id: 3, icon: 'fas fa-star', title: 'Perfil Completo', description: 'Destaca entre los demás' }
      ]
    }
  },
  
  computed: {
    ...mapGetters(['isAuthenticated', 'userRole'])
  },
  
  watch: {
    isAuthenticated: {
      immediate: true,
      handler(isAuth) {
        if (isAuth) this.redirectToDashboard()
      }
    }
  },
  
  created() {
    if (this.isAuthenticated) this.redirectToDashboard()
  },
  
  methods: {
    handleRegisterSuccess() {
      this.$router.push('/login')
    },
    
    redirectToDashboard() {
      const routes = { 'Aspirante': '/aspirante', 'Empresa': '/empresa', 'Admin': '/admin' }
      const route = routes[this.userRole] || '/'
      setTimeout(() => this.$router.push(route), 100)
    }
  }
}
</script>

<style scoped>
.register-container { min-height: 100vh; position: relative; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); overflow: hidden; }
.register-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
.background-shape { position: absolute; border-radius: 50%; background: rgba(34, 197, 94, 0.05); animation: float 6s ease-in-out infinite; }
.shape-1 { width: 300px; height: 300px; top: -150px; right: -150px; animation-delay: 0s; }
.shape-2 { width: 200px; height: 200px; bottom: -100px; left: -100px; animation-delay: 2s; }
.shape-3 { width: 150px; height: 150px; top: 50%; left: 10%; animation-delay: 4s; }
@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
.container { position: relative; z-index: 1; }
.register-card { background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); overflow: hidden; min-height: 650px; border: 1px solid rgba(226, 232, 240, 0.8); transition: transform 0.3s ease; animation: slideUp 0.6s ease-out; }
.register-card:hover { transform: translateY(-5px); }
.register-info { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; display: flex; align-items: center; padding: 3rem 2rem; }
.info-content { width: 100%; }
.brand-section { text-align: center; margin-bottom: 3rem; }
.brand-icon { width: 80px; height: 80px; background: rgba(34, 197, 94, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; backdrop-filter: blur(10px); border: 1px solid rgba(34, 197, 94, 0.2); }
.brand-icon i { font-size: 2rem; color: #22c55e; }
.brand-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #f1f5f9; }
.brand-subtitle { font-size: 1.1rem; opacity: 0.8; margin-bottom: 0; color: #cbd5e1; }
.features-list { space-y: 1.5rem; }
.feature-item { display: flex; align-items: center; margin-bottom: 1.5rem; padding: 1rem; background: rgba(34, 197, 94, 0.08); border-radius: 16px; backdrop-filter: blur(10px); transition: transform 0.3s ease, background 0.3s ease; border: 1px solid rgba(34, 197, 94, 0.1); }
.feature-item:hover { transform: translateX(10px); background: rgba(34, 197, 94, 0.12); }
.feature-icon { width: 50px; height: 50px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; font-size: 1.2rem; color: white; flex-shrink: 0; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
.feature-item h6 { margin-bottom: 0.25rem; font-weight: 600; font-size: 1rem; color: #f1f5f9; }
.feature-item p { margin-bottom: 0; opacity: 0.8; font-size: 0.9rem; color: #cbd5e1; }
.register-form-section { background: white; display: flex; align-items: center; padding: 2rem; }
.form-container { width: 100%; max-width: 500px; margin: 0 auto; }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 992px) {
  .register-info { display: none; }
  .register-card { margin: 1rem; min-height: auto; border-radius: 16px; }
  .register-form-section { padding: 2rem 1.5rem; }
}
@media (max-width: 576px) {
  .register-form-section { padding: 1.5rem 1rem; }
  .form-container { max-width: 100%; }
}
</style>