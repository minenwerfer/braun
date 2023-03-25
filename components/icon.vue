<template>
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    data-component="icon"
    fill="blue"
  >
    <use :href="`/static/icons/${variant}/${name}.svg#root`"></use>
  </svg>
</template>

<script setup>
defineProps({
  name: String,
  variant: {
    type: String,
    default: 'line'
  }
})
</script>
