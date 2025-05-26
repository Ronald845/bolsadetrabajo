<template>
  <div class="password-strength-mini">
    <!-- 🎯 Header Compacto -->
    <div class="strength-header">
      <div class="strength-info">
        <span class="strength-title">
          <i class="fas fa-shield-alt strength-icon" :style="{ color: strengthColor }"></i>
          Seguridad
        </span>
        <div class="strength-badges">
          <span class="strength-score" :style="{ color: strengthColor }">{{ analysis.strength }}%</span>
          <span class="strength-level" :class="`level-${analysis.level.level}`">
            {{ analysis.level.label }}
          </span>
        </div>
      </div>
      
      <!-- Barra Ultra Compacta -->
      <div class="progress-mini">
        <div 
          class="progress-fill"
          :style="{ 
            width: analysis.strength + '%',
            backgroundColor: strengthColor
          }"
        ></div>
      </div>
    </div>
    
    <!-- ✅ Requisitos Mini Grid -->
    <div class="requirements-mini">
      <div class="requirements-header">
        <span class="req-title">Requisitos</span>
        <span class="req-counter">{{ analysis.satisfiedCount }}/{{ analysis.totalRequirements }}</span>
      </div>
      
      <div class="req-grid">
        <div 
          v-for="requirement in analysis.requirements" 
          :key="requirement.id"
          class="req-item" 
          :class="{ 'req-ok': requirement.satisfied }"
        >
          <div class="req-check">
            <i :class="requirement.satisfied ? 'fas fa-check' : 'fas fa-times'"></i>
          </div>
          <span class="req-text">{{ getShortLabel(requirement.label) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 🎮 Controles Mini -->
    <div class="controls-mini">
      <button 
        type="button" 
        class="btn-mini btn-generate"
        @click="generatePassword"
        title="Generar contraseña segura"
      >
        <i class="fas fa-dice"></i>
        <span>Generar</span>
      </button>
      
      <button 
        type="button" 
        class="btn-mini btn-tips"
        @click="showTips = !showTips"
        :class="{ 'active': showTips }"
        title="Ver consejos de seguridad"
      >
        <i class="fas fa-info"></i>
        <span>Tips</span>
      </button>
      
      <div class="crack-time-mini">
        <i class="fas fa-clock"></i>
        <span>{{ getShortCrackTime() }}</span>
      </div>
    </div>
    
    <!-- ⚠️ Alerta Compacta -->
    <div v-if="isCommonPassword" class="alert-mini">
      <i class="fas fa-exclamation-triangle"></i>
      <span>Contraseña muy común</span>
      <button @click="generatePassword" class="fix-btn">
        <i class="fas fa-magic"></i>
      </button>
    </div>
    
    <!-- 💡 Tips Colapsables -->
    <div v-if="showTips" class="tips-mini">
      <div class="tips-content">
        <div class="tip" v-for="tip in getShortTips()" :key="tip.id">
          <i :class="tip.icon"></i>
          <span>{{ tip.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { passwordUtils, securityConfig, displayUtils } from '../utils/validators'

export default {
  name: 'PasswordStrengthMeter',
  emits: ['password-generated', 'validation-change'],
  props: {
    password: {
      type: String,
      default: ''
    },
    showGenerator: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      showTips: false
    }
  },
  
  computed: {
    analysis() {
      return passwordUtils.analyzePassword(this.password)
    },
    
    strengthColor() {
      const colors = {
        weak: '#e74c3c',
        medium: '#f39c12', 
        good: '#3498db',
        strong: '#27ae60',
        excellent: '#8e44ad'
      }
      return colors[this.analysis.level.level] || '#95a5a6'
    }
  },
  
  methods: {
    generatePassword() {
      const newPassword = passwordUtils.generateSecurePassword(12)
      this.$emit('password-generated', newPassword)
    },
    
    getShortLabel(label) {
      const shorts = {
        'Mínimo 8 caracteres': '8+ chars',
        'Una letra MAYÚSCULA': 'A-Z',
        'Una letra minúscula': 'a-z', 
        'Un número': '0-9',
        'Un símbolo especial': '!@#',
        'Empezar con letra': 'Letra',
        'Sin espacios': 'Sin espacios',
        'No muy común': 'Única'
      }
      return shorts[label] || label
    },
    
    getShortCrackTime() {
      const time = displayUtils.estimateCrackTime(this.password)
      if (time.includes('segundo')) return '< 1s'
      if (time.includes('minuto')) return '< 1m'
      if (time.includes('hora')) return '< 1h'
      if (time.includes('día')) return '< 1d'
      if (time.includes('año')) return '> 1y'
      return time
    },
    
    getShortTips() {
      return [
        { id: 1, icon: 'fas fa-key', text: 'Usa frases memorables' },
        { id: 2, icon: 'fas fa-sync', text: 'Cambia regularmente' },
        { id: 3, icon: 'fas fa-ban', text: 'No reutilices' },
        { id: 4, icon: 'fas fa-mobile', text: 'Usa 2FA si puedes' }
      ]
    },
    
    isCommonPassword() {
      return securityConfig.isCommonPassword(this.password)
    }
  },
  
  watch: {
    'analysis.isValid': {
      immediate: true,
      handler(isValid) {
        this.$emit('validation-change', isValid)
      }
    }
  }
}
</script>

<style scoped>
.password-strength-mini {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.8rem;
}

/* 🎯 Header Compacto */
.strength-header {
  margin-bottom: 0.75rem;
}

.strength-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.strength-title {
  font-weight: 600;
  font-size: 0.8rem;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.strength-icon {
  font-size: 0.8rem;
  margin-right: 0.4rem;
}

.strength-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.strength-score {
  font-weight: 700;
  font-size: 0.85rem;
}

.strength-level {
  padding: 0.1rem 0.4rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

/* Colores para niveles */
.level-weak { background: #fed7d7; color: #c53030; }
.level-medium { background: #feebc8; color: #d69e2e; }
.level-good { background: #bee3f8; color: #3182ce; }
.level-strong { background: #c6f6d5; color: #38a169; }
.level-excellent { background: #e9d8fd; color: #805ad5; }

/* 📊 Barra Ultra Fina */
.progress-mini {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

/* ✅ Requisitos Mini */
.requirements-mini {
  margin-bottom: 0.75rem;
}

.requirements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.req-title {
  font-weight: 600;
  font-size: 0.75rem;
  color: #4a5568;
}

.req-counter {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.1rem 0.3rem;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 600;
}

.req-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.3rem;
}

.req-item {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.4rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.req-item.req-ok {
  background: #f0fff4;
  border-color: #68d391;
  color: #22543d;
}

.req-check {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.4rem;
  flex-shrink: 0;
}

.req-check i {
  font-size: 0.6rem;
}

.req-ok .req-check { color: #38a169; }
.req-item:not(.req-ok) .req-check { color: #e53e3e; }

.req-text {
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.2;
}

/* 🎮 Controles Mini */
.controls-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-mini {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mini:hover {
  background: #f7fafc;
  border-color: #a0aec0;
}

.btn-generate:hover {
  background: #ebf4ff;
  border-color: #3182ce;
  color: #3182ce;
}

.btn-tips:hover,
.btn-tips.active {
  background: #f0fff4;
  border-color: #38a169;
  color: #38a169;
}

.crack-time-mini {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  color: #718096;
  font-size: 0.65rem;
}

/* ⚠️ Alerta Mini */
.alert-mini {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.5rem;
  background: #fef5e7;
  border: 1px solid #f6e05e;
  border-radius: 6px;
  color: #d69e2e;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
}

.fix-btn {
  padding: 0.15rem 0.3rem;
  background: #ed8936;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.6rem;
  cursor: pointer;
  margin-left: auto;
}

/* 💡 Tips Mini */
.tips-mini {
  border-top: 1px solid #e2e8f0;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.tips-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.3rem;
}

.tip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem;
  background: white;
  border-radius: 4px;
  font-size: 0.65rem;
  color: #4a5568;
}

.tip i {
  color: #718096;
  font-size: 0.6rem;
  width: 12px;
  flex-shrink: 0;
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .req-grid {
    grid-template-columns: 1fr;
  }
  
  .tips-content {
    grid-template-columns: 1fr;
  }
  
  .controls-mini {
    justify-content: space-between;
  }
  
  .crack-time-mini {
    margin-left: 0;
    font-size: 0.6rem;
  }
}

@media (max-width: 576px) {
  .password-strength-mini {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
  
  .strength-badges {
    gap: 0.3rem;
  }
  
  .btn-mini span {
    display: none;
  }
  
  .btn-mini {
    padding: 0.3rem;
    min-width: 28px;
    justify-content: center;
  }
}

/* ✨ Animaciones Suaves */
.req-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.req-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.progress-fill {
  background: linear-gradient(90deg, currentColor, currentColor 50%, rgba(255,255,255,0.3) 50%, currentColor);
  background-size: 20px 100%;
  animation: progress-shine 2s linear infinite;
}

@keyframes progress-shine {
  0% { background-position: -20px 0; }
  100% { background-position: 20px 0; }
}

/* Estados de hover mejorados */
.btn-mini:active {
  transform: scale(0.95);
}

.fix-btn:hover {
  background: #dd6b20;
  transform: scale(1.05);
}
</style>