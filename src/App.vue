<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <router-view />
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#3B82F6',
    primaryColorHover: '#2563EB',
    primaryColorPressed: '#1D4ED8',
    primaryColorSuppl: '#3B82F6',
    borderRadius: '8px',
    borderRadiusSmall: '6px'
  },
  Button: {
    borderRadiusTiny: '999px',
    borderRadiusSmall: '999px',
    borderRadiusMedium: '999px',
    borderRadiusLarge: '999px',
    borderFocus: 'none',
    borderHover: 'none',
    boxShadowFocus: 'none',
    boxShadowHover: 'none'
  },
  Input: {
    borderFocus: '#3B82F6',
    boxShadowFocus: 'none',
    caretColor: '#3B82F6'
  },
  Tabs: {
    tabTextColorActiveLine: '#3B82F6',
    tabTextColorHoverLine: '#3B82F6',
    barColor: '#3B82F6'
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
  font-family: 'Microsoft YaHei', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
</style>
