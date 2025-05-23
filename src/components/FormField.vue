<template>
  <div class="mb-3">
    <label v-if="label" class="form-label">
      <i v-if="icon" :class="icon" class="me-2"></i>
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <input
      v-if="type !== 'select' && type !== 'textarea'"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="inputClass"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
    >
    
    <select
      v-else-if="type === 'select'"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :class="inputClass"
      :disabled="disabled"
    >
      <option value="" v-if="placeholder">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    
    <textarea
      v-else-if="type === 'textarea'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="inputClass"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows || 3"
    ></textarea>
    
    <div v-if="error" class="text-danger small mt-1">
      <i class="fas fa-exclamation-circle me-1"></i>
      {{ error }}
    </div>
    
    <div v-if="helpText" class="form-text">{{ helpText }}</div>
  </div>
</template>

<script>
export default {
  name: 'FormField',
  emits: ['update:modelValue'],
  props: {
    modelValue: { 
      type: [String, Number], 
      default: '' 
    },
    type: { 
      type: String, 
      default: 'text' 
    },
    label: { 
      type: String, 
      default: '' 
    },
    icon: { 
      type: String, 
      default: '' 
    },
    placeholder: { 
      type: String, 
      default: '' 
    },
    required: { 
      type: Boolean, 
      default: false 
    },
    disabled: { 
      type: Boolean, 
      default: false 
    },
    readonly: { 
      type: Boolean, 
      default: false 
    },
    error: { 
      type: String, 
      default: '' 
    },
    helpText: { 
      type: String, 
      default: '' 
    },
    options: { 
      type: Array, 
      default: () => [] 
    },
    rows: { 
      type: Number, 
      default: 3 
    }
  },
  computed: {
    inputClass() {
      return [
        'form-control',
        { 'is-invalid': this.error }
      ]
    }
  }
}
</script>

<style scoped>
.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

.form-control.is-invalid {
  border-color: #ef4444;
}

.text-danger {
  color: #ef4444 !important;
}

.form-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>