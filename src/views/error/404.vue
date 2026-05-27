<template>
  <div class="error-page">
    <div class="error-content">
      <h1>404</h1>
      <p>页面未找到</p>
      <n-button type="primary" round @click="router.push('/')">返回首页</n-button>
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
  background: #F9FAFB;
}

.error-content {
  text-align: center;

  h1 {
    font-size: 96px;
    font-weight: 700;
    color: #3B82F6;
    line-height: 1;
    margin-bottom: 16px;
    letter-spacing: -2px;
  }

  p {
    font-size: 18px;
    color: #6B7280;
    margin-bottom: 32px;
  }
}
</style>
