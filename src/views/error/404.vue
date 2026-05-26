<template>
  <div class="error-page">
    <div class="error-content">
      <h1>404</h1>
      <p>页面未找到</p>
      <n-button type="primary" @click="router.push('/')">返回首页</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.error-content {
  text-align: center;
  
  h1 {
    font-size: 120px;
    font-weight: 700;
    color: #18a058;
    line-height: 1;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 24px;
    color: #666;
    margin-bottom: 32px;
  }
}
</style>
