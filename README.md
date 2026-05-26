# 幸运简历 - 智能简历制作平台

## 项目简介

幸运简历是一个专业的智能简历制作平台，支持海量模板、AI智能优化、多格式导出等功能。

## 技术栈

### 前端
- Vue 3 + TypeScript + Vite
- Pinia 状态管理
- Vue Router 4
- Naive UI + Element Plus
- SCSS 样式

### 后端
- Node.js + Express
- LowDB (JSON 文件存储)
- JWT 认证

## 快速开始

### 方式一：使用启动脚本（推荐）

双击运行 `start.bat`，自动启动前端和后端服务。

### 方式二：手动启动

**1. 启动后端服务**

```bash
cd server
npm install
npm run dev
```

后端服务运行在 http://localhost:3001

**2. 启动前端服务**

```bash
npm install
npm run dev
```

前端服务运行在 http://localhost:3000

### 测试登录

1. 打开 http://localhost:3000/login
2. 点击「测试登录（开发模式）」按钮
3. 自动创建测试账号并登录

## 项目结构

```
LuckyResume/
├── server/                 # 后端服务
│   ├── db/                # 数据库
│   ├── data/              # 模板数据
│   ├── middleware/         # 中间件
│   ├── routes/            # 路由
│   ├── public/            # 静态资源
│   └── index.js           # 入口文件
├── src/                   # 前端源码
│   ├── api/               # API 接口
│   ├── components/        # 公共组件
│   ├── layouts/           # 布局组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── views/             # 页面组件
│   └── main.ts            # 入口文件
├── start.bat              # 启动脚本
└── package.json
```

## 功能模块

### 已实现
- ✅ 用户登录（手机号验证码 + 测试登录）
- ✅ 模板中心（6个精美模板）
- ✅ 简历编辑器（12个功能模块）
- ✅ 简历 CRUD 操作
- ✅ 回收站功能
- ✅ 模板收藏功能

### 开发中
- 🔄 AI 简历生成
- 🔄 PDF/Word 导出
- 🔄 简历分享功能
- 🔄 微信登录

## API 接口

### 认证相关
- `POST /api/auth/sms-code` - 发送验证码
- `POST /api/auth/login/phone` - 手机号登录
- `POST /api/auth/login/test` - 测试登录
- `GET /api/auth/me` - 获取当前用户

### 简历相关
- `GET /api/resumes` - 获取简历列表
- `POST /api/resumes` - 创建简历
- `PUT /api/resumes/:id` - 更新简历
- `DELETE /api/resumes/:id` - 删除简历

### 模板相关
- `GET /api/templates` - 获取模板列表
- `GET /api/templates/:id` - 获取模板详情
- `POST /api/templates/:id/favorite` - 收藏模板
- `DELETE /api/templates/:id/favorite` - 取消收藏

## 开发说明

- 后端使用 LowDB 存储数据，数据文件位于 `server/data/db.json`
- 验证码在开发模式下会打印到控制台
- 默认模板数据在首次启动时自动初始化
