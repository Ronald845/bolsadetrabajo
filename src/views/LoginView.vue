<template>
  <div class="login-container">
    <div class="login-background">
      <div class="background-shape shape-1"></div>
      <div class="background-shape shape-2"></div>
      <div class="background-shape shape-3"></div>
    </div>
    
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-md-8 col-lg-10 col-xl-8">
          <div class="row g-0 login-card">
            <!-- Panel izquierdo - Información -->
            <div class="col-md-6 login-info">
              <div class="info-content">
                <div class="brand-section">
                  <div class="brand-icon">
                    <i class="fas fa-briefcase"></i>
                  </div>
                  <h1 class="brand-title">Bolsa de Trabajo</h1>
                  <p class="brand-subtitle">Conectando talento con oportunidades</p>
                </div>
                
                <div class="features-list">
                  <div class="feature-item">
                    <i class="fas fa-users feature-icon"></i>
                    <div>
                      <h6>Para Aspirantes</h6>
                      <p>Encuentra tu trabajo ideal</p>
                    </div>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-building feature-icon"></i>
                    <div>
                      <h6>Para Empresas</h6>
                      <p>Encuentra el mejor talento</p>
                    </div>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-handshake feature-icon"></i>
                    <div>
                      <h6>Conexiones Efectivas</h6>
                      <p>Facilitamos el encuentro perfecto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Panel derecho - Formulario -->
            <div class="col-md-6 login-form-section">
              <div class="form-container">
                <LoginForm @login-success="handleLoginSuccess" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'LoginView',
  components: {
    LoginForm
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userRole'])
  },
  created() {
    console.log('🔍 LoginView created - isAuthenticated:', this.isAuthenticated)
    // Solo redirigir si ya está autenticado al cargar la página
    if (this.isAuthenticated) {
      this.redirectToDashboard()
    }
  },
  mounted() {
    console.log('🔍 LoginView mounted - isAuthenticated:', this.isAuthenticated)
  },
  methods: {
    handleLoginSuccess(user) {
      console.log('🎉 Login exitoso recibido en LoginView:', user)
      // Dejar que LoginForm maneje la redirección, esto es solo para debug
    },
    
    redirectToDashboard() {
      const role = this.userRole
      console.log('🔄 Redirigiendo usuario con rol:', role)
      
      setTimeout(() => {
        switch (role) {
          case 'Aspirante':
            console.log('➡️ Redirigiendo a /aspirante')
            this.$router.push('/aspirante')
            break
          case 'Empresa':
            console.log('➡️ Redirigiendo a /empresa')
            this.$router.push('/empresa')
            break
          case 'Admin':
            console.log('➡️ Redirigiendo a /admin')
            this.$router.push('/admin')
            break
          default:
            console.log('⚠️ Rol no reconocido:', role)
            this.$store.dispatch('logout')
        }
      }, 100)
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.background-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.05);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.container {
  position: relative;
  z-index: 1;
}

.login-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-height: 600px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.login-info {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  display: flex;
  align-items: center;
  padding: 3rem 2rem;
}

.info-content {
  width: 100%;
}

.brand-section {
  text-align: center;
  margin-bottom: 3rem;
}

.brand-icon {
  width: 80px;
  height: 80px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.brand-icon i {
  font-size: 2rem;
  color: #3b82f6;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #f1f5f9;
}

.brand-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 0;
  color: #cbd5e1;
}

.features-list {
  space-y: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, background 0.3s ease;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.feature-item:hover {
  transform: translateX(10px);
  background: rgba(59, 130, 246, 0.12);
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.feature-item h6 {
  margin-bottom: 0.25rem;
  font-weight: 600;
  font-size: 1rem;
  color: #f1f5f9;
}

.feature-item p {
  margin-bottom: 0;
  opacity: 0.8;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.login-form-section {
  background: white;
  display: flex;
  align-items: center;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .login-info {
    display: none;
  }
  
  .login-card {
    margin: 1rem;
    min-height: auto;
    border-radius: 16px;
  }
  
  .login-form-section {
    padding: 2rem 1.5rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .background-shape {
    display: none;
  }
}

@media (max-width: 576px) {
  .login-form-section {
    padding: 1.5rem 1rem;
  }
  
  .form-container {
    max-width: 100%;
  }
}

/* Mejoras adicionales */
.login-card {
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

/* Animación de entrada */
.login-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>