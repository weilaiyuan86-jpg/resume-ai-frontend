# AI Resume Builder - 智能简历生成器

一个面向美国求职市场的全栈AI简历生成工具网站。

## 在线演示

**网站地址**: https://7w4luye3gobpe.ok.kimi.link

**后台管理**: https://7w4luye3gobpe.ok.kimi.link/admin

## 功能特性

### 核心功能
- ✅ **ATS检测** - 检测简历与职位描述的匹配度
- ✅ **简历编辑器** - 多渠道导入（LinkedIn、PDF、Word）
- ✅ **AI润色** - 一键优化简历内容
- ✅ **投递追踪** - 多平台招聘渠道管理
- ✅ **AI面试** - 模拟面试练习，支持录音、视频、文字输入
- ✅ **求职信生成** - 一键生成专业求职信

### 内容管理
- ✅ **模板库** - 80+ ATS友好模板，按行业和风格分类
- ✅ **博客系统** - 20+ SEO优化文章，支持AI生成
- ✅ **页脚菜单** - 职业博客、面试题库、薪资指南、签证资讯等

### 技术特性
- ✅ **主题切换** - 支持浅色/深色/跟随系统
- ✅ **AI客服** - 7×24小时智能助手
- ✅ **后台管理** - 动态配置所有前端功能
- ✅ **支付集成** - 支持Stripe、PayPal等多种支付方式
- ✅ **SEO优化** - 符合Google SEO/GEO标准

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: GSAP + ScrollTrigger
- **路由**: React Router v6
- **状态管理**: React Context API
- **构建工具**: Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## Docker 部署

```bash
# 构建镜像
docker build -t ai-resume-builder .

# 运行容器
docker run -d -p 3000:80 --name resume-app ai-resume-builder

# 或使用 docker-compose
docker-compose up -d
```

## 项目结构

```
app/
├── src/
│   ├── components/     # 公共组件
│   ├── contexts/       # React Context
│   ├── pages/          # 页面组件
│   └── lib/           # 工具函数
├── public/            # 静态资源
├── dist/             # 构建输出
├── Dockerfile        # Docker配置
├── docker-compose.yml
├── nginx.conf        # Nginx配置
└── DEPLOY.md         # 部署指南
```

## 后台管理功能

后台管理地址: `/admin`

### 管理模块

1. **仪表盘** - 网站统计数据
2. **用户管理** - 注册用户管理
3. **模板管理** - 简历模板管理
4. **博客管理** - 文章管理和AI生成
5. **支付配置** - 支付方式配置
6. **AI配置** - 自定义AI提示词
7. **外观设置** - 主题颜色、首页配置
8. **页面管理** - 静态页面管理
9. **数据分析** - 详细数据报告
10. **系统设置** - 系统参数配置

## 环境变量

复制 `.env.example` 为 `.env` 并配置：

```env
VITE_API_URL=https://your-api.com
VITE_OPENAI_API_KEY=sk-your-key
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请通过以下方式联系我们：
- 邮箱: support@resumeai.com
- 网站: https://resumeai.com
