<template>
  <div>
    <h1 style="color: red; font-size: 50px;">ADMIN VIEW FUNCIONA!</h1>
    <p>Si ves este mensaje, el problema no es la ruta</p>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  created() {
    console.log('❗❗❗ ADMIN VIEW CREADO ❗❗❗')
  },
  mounted() {
    console.log('❗❗❗ ADMIN VIEW MONTADO ❗❗❗')
    alert('Admin View se cargó correctamente!')
  }
}
</script>