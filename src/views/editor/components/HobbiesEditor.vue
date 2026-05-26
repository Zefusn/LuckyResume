<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>兴趣爱好</h3>
    </div>
    <n-dynamic-tags :value="data || []" @update:value="(v: string[]) => emit('update', v)" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ data: string[] }>()
const emit = defineEmits<{ update: [data: string[]] }>()
</script>

<style lang="scss" scoped>
.section-editor { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.section-header { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #eee; h3 { font-size: 16px; } }
</style>
