# AI Resume Builder - 部署指南

## 网站已部署

**前端地址**: https://7w4luye3gobpe.ok.kimi.link

**后台管理地址**: https://7w4luye3gobpe.ok.kimi.link/admin

---

## 功能清单

### 已实现功能

1. ✅ **全局主题切换** - 导航栏右上角可切换浅色/深色/跟随系统
2. ✅ **AI面试页面** - 支持录音、视频、文字输入，需要登录后使用
3. ✅ **ATS检测页面** - 优化后的完整功能
4. ✅ **模板库页面** - 根据图片重新设计，80+模板，支持搜索和筛选
5. ✅ **AI客服** - 所有页面右下角显示AI聊天窗口
6. ✅ **博客系统** - 支持文章详情页跳转
7. ✅ **后台管理** - 包含博客文章管理和SEO文章生成功能
8. ✅ **页脚菜单页面** - 所有页面已创建

---

## GitHub 上传教程

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 输入仓库名称，如 `ai-resume-builder`
3. 选择公开或私有
4. 点击 "Create repository"

### 2. 上传代码

```bash
# 进入项目目录
cd /mnt/okcomputer/output/app

# 初始化 Git 仓库
git init

# 添加远程仓库（替换 YOUR_USERNAME 和 YOUR_REPO）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Resume Builder"

# 推送到 GitHub
git push -u origin main
```

---

## Docker 配置

### Dockerfile

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 启用 gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 处理前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### 构建和运行 Docker

```bash
# 构建镜像
docker build -t ai-resume-builder .

# 运行容器
docker run -d -p 3000:80 --name resume-app ai-resume-builder

# 或使用 docker-compose
docker-compose up -d
```

---

## 服务器上传教程

### 使用 SCP 上传

```bash
# 本地构建后上传
cd /mnt/okcomputer/output/app
npm run build

# 上传到服务器（替换 your-server）
scp -r dist/* user@your-server:/var/www/html/
```

### 使用 rsync

```bash
rsync -avz --delete dist/ user@your-server:/var/www/html/
```

### 使用 Git 部署

```bash
# 在服务器上克隆仓库
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /var/www/app
cd /var/www/app
npm install
npm run build

# 使用 PM2 启动
npm install -g pm2
pm2 serve dist 3000 --name "resume-app"
```

---

## 后台管理功能

### 访问地址
- 后台: `/admin`

### 功能模块

1. **仪表盘** - 查看网站统计数据
2. **用户管理** - 管理注册用户
3. **模板管理** - 管理简历模板
4. **博客管理** - 管理博客文章，支持AI生成SEO文章
5. **支付配置** - 配置Stripe、PayPal等支付方式
6. **AI配置** - 自定义AI提示词
7. **外观设置** - 配置主题颜色、首页图片、导航菜单
8. **页面管理** - 管理静态页面
9. **数据分析** - 查看详细数据报告
10. **系统设置** - 配置系统参数

---

## 环境变量配置

创建 `.env` 文件：

```env
# API 配置
VITE_API_URL=https://your-api.com

# AI 配置
VITE_OPENAI_API_KEY=your-openai-key

# 支付配置
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# 分析配置
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 技术栈

- **前端**: React + TypeScript + Vite
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: GSAP
- **路由**: React Router
- **状态管理**: React Context API
- **构建**: Vite

---

## 许可证

MIT License
