<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-info">
        <div class="footer-logo">
          <n-icon size="24" color="#18a058">
            <DocumentTextOutline />
          </n-icon>
          <span>幸运简历</span>
        </div>
        <p class="footer-desc">专业的智能简历制作平台，助你轻松打造完美简历</p>
      </div>
      
      <div class="footer-links">
        <div class="link-group">
          <h4>产品功能</h4>
          <a href="/templates">模板中心</a>
          <a href="/editor">简历编辑</a>
          <a href="#">AI优化</a>
        </div>
        <div class="link-group">
          <h4>帮助支持</h4>
          <a href="#">使用教程</a>
          <a href="#">常见问题</a>
          <a href="#">联系客服</a>
        </div>
        <div class="link-group">
          <h4>关于我们</h4>
          <a href="#">公司介绍</a>
          <a href="#">用户协议</a>
          <a href="#">隐私政策</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© 2024 幸运简历 All Rights Reserved</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { DocumentTextOutline } from '@vicons/ionicons5'
</script>

<style lang="scss" scoped>
.app-footer {
  background: #1e1e1e;
  color: #fff;
  padding: 48px 0 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  gap: 48px;
}

.footer-info {
  max-width: 300px;
  
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .footer-desc {
    color: #999;
    font-size: 14px;
    line-height: 1.6;
  }
}

.footer-links {
  display: flex;
  gap: 64px;
  
  .link-group {
    h4 {
      font-size: 15px;
      margin-bottom: 16px;
    }
    
    a {
      display: block;
      color: #999;
      font-size: 14px;
      margin-bottom: 10px;
      
      &:hover {
        color: #18a058;
      }
    }
  }
}

.footer-bottom {
  margin-top: 48px;
  padding: 16px 24px;
  border-top: 1px solid #333;
  text-align: center;
  
  p {
    color: #666;
    font-size: 13px;
  }
}
</style>
