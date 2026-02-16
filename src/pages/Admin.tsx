import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FileText, Settings, BarChart3, 
  Bell, Plus, Edit3, Trash2, CreditCard,
  ChevronLeft, ChevronRight,
  Sparkles, Globe, Palette, Menu, X, Save, Chrome,
  ExternalLink, Copy, Image, Paintbrush,
  BookOpen, Code, Upload, Search, Type,
  Wand2, Eye, FileEdit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import gsap from 'gsap';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useLocation } from 'react-router-dom';

const sidebarItems = [
  { id: 'dashboard', name: '仪表盘', icon: LayoutDashboard },
  { id: 'users', name: '用户管理', icon: Users },
  { id: 'templates', name: '模板管理', icon: FileText },
  { id: 'blog', name: '博客管理', icon: BookOpen },
  { id: 'payments', name: '支付配置', icon: CreditCard },
  { id: 'ai', name: 'AI 配置', icon: Sparkles },
  { id: 'appearance', name: '外观设置', icon: Palette },
  { id: 'pages', name: '页面管理', icon: Globe },
  { id: 'analytics', name: '数据分析', icon: BarChart3 },
  { id: 'settings', name: '系统设置', icon: Settings },
  { id: 'shortcuts', name: '快捷键', icon: Type },
];

// Payment providers configuration
const paymentProviders = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: '全球领先的支付处理平台',
    icon: '💳',
    status: 'active',
    configFields: ['publishable_key', 'secret_key', 'webhook_secret'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: '全球知名的在线支付服务',
    icon: '🅿️',
    status: 'inactive',
    configFields: ['client_id', 'client_secret', 'sandbox_mode'],
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '中国领先的第三方支付平台',
    icon: '🔵',
    status: 'inactive',
    configFields: ['app_id', 'private_key', 'public_key'],
  },
  {
    id: 'wechat_pay',
    name: '微信支付',
    description: '腾讯旗下的移动支付解决方案',
    icon: '💚',
    status: 'inactive',
    configFields: ['mch_id', 'app_id', 'api_key'],
  },
];

type AdminPricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: 'sparkles' | 'zap' | 'building';
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
};

const defaultPricingPlans: AdminPricingPlan[] = [
  {
    name: '基础版',
    price: '$0',
    period: '/月',
    description: '适合偶尔求职',
    icon: 'sparkles',
    features: ['3份简历', '基础模板', 'PDF下载', '邮件支持'],
    cta: '免费开始',
    href: '/register',
    popular: false,
  },
  {
    name: '专业版',
    price: '$12',
    period: '/月',
    description: '适合积极求职者',
    icon: 'zap',
    features: ['无限简历', '所有模板', 'AI内容建议', 'ATS优化', '优先支持'],
    cta: '立即升级',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: '企业版',
    price: '$29',
    period: '/月',
    description: '适合职业专业人士',
    icon: 'building',
    features: ['专业版所有功能', '自定义品牌', '团队协作', 'API访问', '专属客户经理'],
    cta: '联系销售',
    href: '/contact',
    popular: false,
  },
];

// AI Prompts configuration
const defaultPrompts = {
  resume_polish: `你是一名资深中文简历顾问，熟悉互联网及各行业的招聘标准，擅长编写符合 ATS（Applicant Tracking System）要求、并符合 Google 对高质量内容要求的中英文简历要点。

请根据以下原始内容进行「优化改写」，要求：
- 保留事实不造假，只调整表达方式
- 尽量使用量化结果（数字、百分比、规模等）
- 使用有力度的动词开头（负责→主导 / 参与→协同 / 做→搭建、设计等）
- 语言简洁，不堆砌形容词
- 适合投递 {{position}} 相关岗位

原始内容：
{{original_text}}

请输出 3 条可以直接放进简历的优化后要点（每条独立成行）：`,

  cover_letter: `你是一名擅长撰写中文求职信 / 求职邮件的职业顾问，帮助候选人更自然地向 HR / 面试官介绍自己，内容需体现真实价值而非堆砌夸张语句。

请根据以下信息生成一封适合中国职场习惯的求职信，整体风格：真诚、专业、不过度夸张，可直接作为邮件正文发送。

- 候选人背景概述：{{resume_summary}}
- 目标职位：{{company_name}} 的 {{job_title}}
- 岗位要求摘要：{{job_requirements}}
- 候选人期待的语气：{{tone}}（如：真诚稳重 / 积极进取 / 谦逊务实）

写作要求：
1. 以简短开场说明投递职位和获知渠道（如「在某平台看到贵公司招聘……」）
2. 用 1～2 段结合简历，说明候选人与岗位最匹配的三点经验或能力
3. 可以适度点到与公司业务、产品或行业的理解，但不要空洞吹捧
4. 结尾表达期待面试机会，并附上简洁礼貌的致谢
5. 全文控制在约 400～600 字以内，使用标准书面中文`,

  interview_prep: `你是一名一线互联网公司的资深面试官，熟悉中国候选人在技术、业务与沟通方面的常见优劣势，擅长设计系统化的面试练习计划，回答需具体、有可执行性。

请基于以下信息，为候选人生成一套「面试准备」内容：
- 目标岗位：{{position}}
- 职级 / 经验水平：{{experience_level}}（例如：校招 / 1-3 年 / 高级 / 专家）
- 公司类型：{{company_type}}（例如：大厂 / 成长型创业公司 / ToB SaaS / 金融科技 等）

需要输出的内容：
1. 3～4 道行为面试题（中文），每题给出要点式 STAR 回答框架（而不是完整长文）
2. 2～3 道与岗位高度相关的技术或业务理解题，说明面试官在意的「答案要点」
3. 1 道系统设计 / 架构类问题（如适用于中高级岗位），点明需要覆盖：架构拆解、扩展性、可靠性 / 故障预案
4. 一份「一周面试准备计划」，按天列出建议练习的内容（题型 + 时长），方便候选人照着执行`,

  ats_analysis: `你是一名 ATS（Applicant Tracking System）与招聘流程专家，熟悉国内外主流 ATS 对简历解析和筛选的规则，同时理解搜索引擎对高质量内容的要求。

请对下面的简历和目标 JD 进行「匹配度分析」，用中文给出清晰可执行的改进建议。

简历内容：
{{resume_text}}

职位描述（JD）：
{{job_description}}

请按以下结构输出结果：
1. 总体匹配度评分（0-100）及一句话评价
2. 关键信息匹配情况（例如：岗位名称、年限、核心技能、行业经验等）
3. 需要补充或加强的关键词列表（用项目符号列出，并说明出现场景建议）
4. 可能影响 ATS 解析的格式问题（例如：复杂表格、图标、过多列排版、花哨字体等）
5. 建议修改的具体段落或要点示例（可以给出 2～3 条优化前后对比）
6. 一份简短的整体优化建议，帮助候选人提高被筛选通过的概率`,

  chatbot_welcome: `您好！我是 ResumeAI 的智能助手，可以帮你：

- 评估简历通过 ATS 的概率
- 给出针对职位的优化建议
- 推荐合适的模板和功能入口

请告诉我你现在最关心的问题（例如：如何优化简历、ATS 检测、套餐区别等）。`,

  chatbot_quick_questions: `如何优化简历?|免费版有什么限制?|H1B签证注意事项?|ATS检查是什么?`,

  job_description: `你是一名资深 HRBP / 招聘负责人，擅长撰写既方便候选人理解、又符合 Google 等搜索引擎内容规范的中文职位描述（JD）。

请根据以下信息生成一份结构清晰的 JD：
- 职位名称：{{job_title}}
- 所属部门 / 团队：{{department}}
- 工作地点：{{location}}
- 汇报对象：{{report_to}}
- 主要职责要点（如有）：{{responsibilities}}
- 任职要求要点（如有）：{{requirements}}
- 目标候选人画像（经验年限、背景偏好等）：{{ideal_profile}}

写作要求：
1. 先用 2～3 句话概括这个岗位的核心使命，以及候选人能获得的成长/影响力。
2. 使用 H2/H3 小标题分块：例如「岗位概述」「工作职责」「任职要求」「加分项」「你将获得」。
3. 每一部分使用项目符号列出 5～8 条具体要点，避免空泛形容词和内部黑话。
4. 在职责与要求中自然体现与 {{job_title}} 相关的关键技能和领域词，但不要机械堆砌关键词。
5. 语气专业但友好，适合发布在招聘官网 / 职位页上，长度控制在 800～1500 字之间。
6. 不承诺不现实的福利或结果，不出现违反求职平台和搜索引擎政策的表述。`,

  cold_email: `你是一名擅长 B2B 与职场沟通的写作教练，负责帮候选人或销售/合作方撰写高回复率的冷邮件文案，需自然、真诚且符合 Google / 邮箱服务商的反垃圾策略（避免标题党和过度营销词汇）。

请基于以下信息生成一封中文冷邮件正文（不包含 HTML，仅纯文本）：
- 发件人身份：{{sender_role}}（例如：在美中国工程师 / 初创公司联合创始人）
- 收件人身份：{{recipient_role}}（例如：招聘经理 / 技术负责人 / 潜在合作伙伴）
- 目标公司 / 团队：{{company_name}}
- 目标职位或合作方向：{{goal}}
- 发件人与对方的关联点：{{common_ground}}（如校友、相同行业、对产品的具体认可）
- 希望对方采取的行动：{{call_to_action}}（例如：15 分钟电话沟通 / 转交简历给招聘团队）

写作要求：
1. 邮件主题需简洁清晰，点明目的和关联点，避免使用「震惊」「必看」等低质量词。
2. 开头 1～2 句快速建立关系：说明你是谁、为什么写信给对方。
3. 中间部分用 2～3 段说明：
   - 你与 {{goal}} 相关的最关键经历或价值（用事实和结果说话）
   - 对 {{company_name}} / 对方工作的具体认可点（引用公开信息或产品细节）
4. 结尾给出明确且礼貌的下一步请求（例如约时间、回信一种简短反馈），并表示尊重对方时间。
5. 全文控制在 150～300 字，无表情符号和口水化语句，适合作为 Gmail / Outlook 中的首封冷邮件。
6. 请直接输出完整邮件内容：第一行是邮件主题「主题：...」，之后空一行再写正文。`,
};

// Blog article type
interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  publishDate: string;
  views: number;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

interface SeoArticleApiResponse {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  author?: string;
}

// Sample blog articles
const sampleArticles: BlogArticle[] = [
  {
    id: '1',
    title: '如何写出ATS友好的技术简历',
    slug: 'ats-friendly-tech-resume',
    excerpt: '学习如何优化你的简历，确保通过申请人追踪系统的筛选',
    content: '',
    category: '简历技巧',
    tags: ['ATS', '技术简历', '求职技巧'],
    author: 'ResumeAI Team',
    status: 'published',
    publishDate: '2024-01-15',
    views: 3240,
    featured: true,
    seoTitle: 'ATS友好的技术简历写作指南 | ResumeAI',
    seoDescription: '学习如何写出通过ATS筛选的技术简历，提高面试机会',
    keywords: ['ATS简历', '技术简历', '简历优化', '求职'],
  },
  {
    id: '2',
    title: '2024年美国H1B签证申请全攻略',
    slug: 'h1b-visa-guide-2024',
    excerpt: '最新H1B签证申请流程、时间线和注意事项',
    content: '',
    category: '签证资讯',
    tags: ['H1B', '工作签证', '美国求职'],
    author: 'ResumeAI Team',
    status: 'published',
    publishDate: '2024-01-10',
    views: 5120,
    featured: true,
    seoTitle: '2024 H1B签证申请指南 | 完整流程和时间线',
    seoDescription: '2024年最新H1B签证申请攻略，包含时间线、材料清单和注意事项',
    keywords: ['H1B签证', '美国工作签证', 'H1B申请', '美国求职'],
  },
  {
    id: '3',
    title: '硅谷软件工程师面试准备清单',
    slug: 'silicon-valley-interview-prep',
    excerpt: '从算法到系统设计，全面准备硅谷技术面试',
    content: '',
    category: '面试准备',
    tags: ['面试', '硅谷', '软件工程师'],
    author: 'ResumeAI Team',
    status: 'published',
    publishDate: '2024-01-08',
    views: 2890,
    featured: false,
    seoTitle: '硅谷软件工程师面试准备指南',
    seoDescription: '全面准备硅谷技术面试，包含算法、系统设计和行为面试',
    keywords: ['硅谷面试', '软件工程师面试', '技术面试', '面试准备'],
  },
];

type ManagedPageStatus = 'draft' | 'published';

interface ManagedPage {
  name: string;
  slug: string;
  status: ManagedPageStatus;
  lastEdited: string;
}

const defaultPages: ManagedPage[] = [
  { name: '关于我们', slug: 'about', status: 'published', lastEdited: '2024-01-15' },
  { name: '隐私政策', slug: 'privacy', status: 'published', lastEdited: '2024-01-10' },
  { name: '服务条款', slug: 'terms', status: 'published', lastEdited: '2024-01-10' },
  { name: '联系我们', slug: 'contact', status: 'published', lastEdited: '2024-01-08' },
  { name: '帮助中心', slug: 'help', status: 'draft', lastEdited: '2024-01-05' },
  { name: '合作伙伴', slug: 'partners', status: 'published', lastEdited: '2023-12-20' },
];

// Blog categories
const blogCategories = [
  '全部',
  '简历技巧',
  '面试准备',
  '签证资讯',
  '薪资指南',
  '职场发展',
  '行业洞察',
];

export default function Admin() {
  const { config, setConfig, setFeatures } = useSiteConfig();
  const location = useLocation();
  const locationState = location.state as { section?: string } | null;
  const [activeSection, setActiveSection] = useState(locationState?.section || 'dashboard');
  const [isBuildingExt, setIsBuildingExt] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('adminSidebarOpen');
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const raw = localStorage.getItem('adminSidebarSearchHistory');
    const parsed = (() => { try { return JSON.parse(raw || '[]') } catch { return [] } })();
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  });
  const sidebarGroups = [
    { title: '概览', ids: ['dashboard', 'analytics'] },
    { title: '内容', ids: ['blog', 'pages', 'templates'] },
    { title: '业务', ids: ['users', 'payments'] },
    { title: '设置', ids: ['ai', 'appearance', 'settings', 'shortcuts'] },
  ] as const;
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    const raw = localStorage.getItem('adminSidebarCollapsedGroups');
    const parsed = (() => { try { return JSON.parse(raw || '{}') } catch { return {} } })();
    return parsed && typeof parsed === 'object' ? parsed : {};
  });
  const [sidebarOrder, setSidebarOrder] = useState<Record<string, string[]>>(() => {
    const raw = localStorage.getItem('adminSidebarOrder');
    const parsed = (() => { try { return JSON.parse(raw || '{}') } catch { return {} } })();
    const defaultOrder: Record<string, string[]> = {};
    sidebarGroups.forEach(g => { defaultOrder[g.title] = [...g.ids]; });
    return { ...defaultOrder, ...(parsed || {}) };
  });
  const aliasMap: Record<string, string[]> = {
    dashboard: ['ybp', '仪表盘'],
    analytics: ['sfx', '分析'],
    blog: ['bg', '博客'],
    pages: ['ym', '页面'],
    templates: ['mb', '模板'],
    users: ['yh', '用户'],
    payments: ['zf', '支付'],
    ai: ['ai', '配置'],
    appearance: ['wg', '外观'],
    settings: ['xt', '系统'],
    shortcuts: ['kj', '快捷'],
  };
  const matchesQuery = (item: { id: string; name: string }, q: string) => {
    const text = q.trim().toLowerCase();
    if (!text) return true;
    const aliases = aliasMap[item.id] || [];
    return (
      item.name.toLowerCase().includes(text) ||
      item.id.toLowerCase().includes(text) ||
      aliases.some(a => a.toLowerCase().includes(text))
    );
  };
  const saveSearchHistory = (q: string) => {
    if (!q.trim()) return;
    const next = [q.trim(), ...searchHistory.filter(s => s !== q.trim())].slice(0, 5);
    setSearchHistory(next);
    localStorage.setItem('adminSidebarSearchHistory', JSON.stringify(next));
  };
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, groupTitle: string, id: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ groupTitle, id }));
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, groupTitle: string, targetId: string) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    const payload = (() => { try { return JSON.parse(raw) } catch { return null } })();
    if (!payload || payload.groupTitle !== groupTitle) return;
    const order = sidebarOrder[groupTitle] || [];
    const fromIdx = order.indexOf(payload.id);
    const toIdx = order.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const next = [...order];
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, payload.id);
    const merged = { ...sidebarOrder, [groupTitle]: next };
    setSidebarOrder(merged);
    localStorage.setItem('adminSidebarOrder', JSON.stringify(merged));
  };
  const toggleGroup = (title: string) => {
    const next = { ...collapsedGroups, [title]: !collapsedGroups[title] };
    setCollapsedGroups(next);
    localStorage.setItem('adminSidebarCollapsedGroups', JSON.stringify(next));
  };
  const [shortcuts, setShortcuts] = useState<{ toggleSidebar: string; focusSearch: string }>(() => {
    const raw = localStorage.getItem('adminShortcuts');
    const parsed = (() => { try { return JSON.parse(raw || '{}') } catch { return {} } })();
    return {
      toggleSidebar: parsed.toggleSidebar || 'mod+b',
      focusSearch: parsed.focusSearch || 'mod+k',
    };
  });
  const matchesShortcut = (e: KeyboardEvent, combo: string) => {
    const key = combo.toLowerCase();
    const parts = key.split('+');
    const main = parts.pop() || '';
    const mod = parts.includes('mod') ? (navigator.platform.includes('Mac') ? e.metaKey : e.ctrlKey) : true;
    const shift = parts.includes('shift') ? e.shiftKey : true;
    const alt = parts.includes('alt') ? e.altKey : true;
    return mod && shift && alt && e.key.toLowerCase() === main.toLowerCase();
  };
  const [, ] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<{ activeProviderId: string | null }>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('paymentConfig');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { activeProviderId: string | null };
          if (parsed && typeof parsed === 'object') {
            return { activeProviderId: parsed.activeProviderId ?? null };
          }
        } catch (e) {
          console.error('Failed to parse paymentConfig from localStorage', e);
        }
      }
    }
    return { activeProviderId: null };
  });
  const [pricingPlans, setPricingPlans] = useState<AdminPricingPlan[]>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('pricingPlans');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as AdminPricingPlan[];
          if (Array.isArray(parsed) && parsed.length) {
            return parsed;
          }
        } catch (e) {
          console.error('Failed to parse pricingPlans from localStorage', e);
        }
      }
    }
    return defaultPricingPlans;
  });
  const [prompts, setPrompts] = useState(defaultPrompts);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Blog management states
  const [articles, setArticles] = useState<BlogArticle[]>(sampleArticles);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [generatedArticle, setGeneratedArticle] = useState<Partial<BlogArticle>>({});
  const [generationPrompt, setGenerationPrompt] = useState('');
  
  const [headerConfig, setHeaderConfig] = useState(config.header);
  const [footerConfig, setFooterConfig] = useState(config.footer);
  const [pages, setPages] = useState<ManagedPage[]>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('adminPages');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as ManagedPage[];
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error('Failed to parse adminPages from localStorage', e);
        }
      }
    }
    return defaultPages;
  });
  useEffect(() => {
    localStorage.setItem('paymentConfig', JSON.stringify(paymentConfig));
  }, [paymentConfig]);
  useEffect(() => {
    localStorage.setItem('pricingPlans', JSON.stringify(pricingPlans));
  }, [pricingPlans]);
  
  const [homepageConfig, setHomepageConfig] = useState(() => ({
    heroImage:
      config.homepage?.heroImage ||
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
    heroTitle: config.homepage?.heroTitle || '用AI在几分钟内打造完美简历',
    heroSubtitle:
      config.homepage?.heroSubtitle ||
      '我们的智能简历生成器会分析您的经历，创建针对您目标职位优化的专业简历。通过ATS检测，提高面试机会。',
    ctaText: config.homepage?.ctaText || '免费创建简历',
    features:
      config.homepage?.features || [
        { title: 'AI智能优化', description: '一键优化简历内容' },
        { title: 'ATS检测', description: '确保通过筛选系统' },
        { title: '面试准备', description: '模拟面试练习' },
      ],
  }));
  
  const [themeConfig, setThemeConfig] = useState({
    primaryColor: '#ff6a00',
    secondaryColor: '#000000',
    fontFamily: 'Inter',
    borderRadius: '0.625rem',
  });
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }
      );
    });

    return () => ctx.revert();
  }, [activeSection]);
  useEffect(() => {
    localStorage.setItem('adminPages', JSON.stringify(pages));
  }, [pages]);
  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', String(isSidebarOpen));
  }, [isSidebarOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (matchesShortcut(e, shortcuts.toggleSidebar)) {
        e.preventDefault();
        setIsSidebarOpen(s => !s);
      }
      if (matchesShortcut(e, shortcuts.focusSearch)) {
        e.preventDefault();
        const el = document.getElementById('admin-sidebar-search');
        if (el) (el as HTMLInputElement).focus();
      }
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        const list = sidebarItems
          .filter(i => matchesQuery(i, sidebarSearch))
          .map(i => i.id);
        const idx = list.indexOf(activeSection);
        if (e.key === 'ArrowUp') {
          const prev = idx > 0 ? list[idx - 1] : list[list.length - 1];
          setActiveSection(prev);
        } else if (e.key === 'ArrowDown') {
          const next = idx < list.length - 1 ? list[idx + 1] : list[0];
          setActiveSection(next);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSection, sidebarSearch, shortcuts]);

  const handleSavePrompts = () => {
    localStorage.setItem('aiPrompts', JSON.stringify(prompts));
    setHasChanges(false);
  };

  useEffect(() => {
    const raw = localStorage.getItem('aiPrompts');
    if (!raw) return;
    const parsed = (() => { try { return JSON.parse(raw) } catch { return null } })();
    if (parsed && typeof parsed === 'object') {
      setPrompts(parsed);
    }
  }, []);

  const updatePrompt = (key: string, value: string) => {
    setPrompts((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const renderDashboard = () => {
    const usersCount = (() => {
      if (typeof window === 'undefined') return 0;
      const raw = localStorage.getItem('users') || '[]';
      const parsed = (() => { try { return JSON.parse(raw) } catch { return [] } })();
      return Array.isArray(parsed) ? parsed.length : 0;
    })();
    const proUsersCount = (() => {
      if (typeof window === 'undefined') return 0;
      const raw = localStorage.getItem('users') || '[]';
      const parsed = (() => { try { return JSON.parse(raw) } catch { return [] } })();
      if (!Array.isArray(parsed)) return 0;
      return parsed.filter((u: { plan?: string }) => u && u.plan === 'pro').length;
    })();
    const templatesCount = (() => {
      if (typeof window === 'undefined') return 0;
      const raw = localStorage.getItem('customTemplates') || '[]';
      const parsed = (() => { try { return JSON.parse(raw) } catch { return [] } })();
      return Array.isArray(parsed) ? parsed.length : 0;
    })();
    const publishedPages = pages.filter(p => p.status === 'published').length;
    const draftPages = pages.filter(p => p.status === 'draft').length;
    const articlesCount = articles.length;
    const activeProviderId = paymentConfig.activeProviderId;
    const providerLabelMap: Record<string, string> = {
      stripe: 'Stripe',
      paypal: 'PayPal',
      alipay: '支付宝',
      wechat_pay: '微信支付',
    };
    const activeProviderLabel = activeProviderId
      ? (providerLabelMap[activeProviderId] || activeProviderId)
      : '未配置';
    const enabledFeaturesCount = (() => {
      const feats = config.features || {};
      return Object.values(feats).filter(Boolean).length;
    })();

    const stats = [
      {
        label: '本地用户数',
        value: String(usersCount),
        change:
          usersCount === 0
            ? '还没有添加任何用户'
            : `其中专业版 ${proUsersCount} 个`,
        icon: Users,
        positive: usersCount > 0,
      },
      {
        label: '自定义模板',
        value: String(templatesCount),
        change: templatesCount === 0
          ? '建议创建 1～2 个示例模板'
          : '模板库已可用于前台',
        icon: FileText,
        positive: templatesCount > 0,
      },
      {
        label: '已发布页面',
        value: String(publishedPages),
        change: draftPages > 0
          ? `草稿 ${draftPages} 个待上线`
          : '所有页面均已发布',
        icon: Globe,
        positive: publishedPages > 0,
      },
      {
        label: 'AI / 支付配置',
        value: activeProviderLabel,
        change: enabledFeaturesCount > 0
          ? `已启用 ${enabledFeaturesCount} 项 AI 功能`
          : 'AI 功能尚未启用',
        icon: Sparkles,
        positive: !!activeProviderId || enabledFeaturesCount > 0,
      },
    ];

    const activities = [
      {
        title: '内容概览',
        detail: `当前共有 ${articlesCount} 篇博客文章，${publishedPages} 个已发布页面，${draftPages} 个草稿页面。`,
      },
      {
        title: '用户与套餐',
        detail:
          usersCount === 0
            ? '尚未在「用户管理」中添加任何用户，可以先录入内部测试账号。'
            : `用户模块已维护 ${usersCount} 个用户，其中专业版 ${proUsersCount} 个，可用于模拟订阅收入。`,
      },
      {
        title: '模板使用情况',
        detail:
          templatesCount === 0
            ? '还没有自定义模板，建议创建 1～2 个示例模板用于前台展示。'
            : '自定义模板已可在前台模板库中被用户选择和应用。',
      },
      {
        title: 'AI / 支付接入',
        detail:
          activeProviderId
            ? `当前支付渠道为 ${activeProviderLabel}，并已配置 ${enabledFeaturesCount} 项 AI 相关功能。`
            : '尚未配置支付渠道，部分升级入口会引导到注册页或提示稍后开通。',
      },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    stat.positive ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">当前站点概况</h3>
          <div className="space-y-4">
            {activities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">支付接口配置</h2>
          <p className="text-sm text-gray-500">配置多种支付方式，支持全球用户</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          添加支付方式
        </Button>
      </div>

      <div className="grid gap-4">
        {paymentProviders.map((provider) => {
          const isActive = paymentConfig.activeProviderId === provider.id;
          return (
            <div
              key={provider.id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                    {provider.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      <Badge
                        className={
                          isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }
                      >
                        {isActive ? '已启用' : '未启用'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{provider.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    配置
                  </Button>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) =>
                      setPaymentConfig({
                        activeProviderId: checked ? provider.id : null,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">价格方案配置</h3>
            <p className="text-sm text-gray-500">
              管理首页展示的价格、文案与功能列表
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-3 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {index === 0 ? '基础版' : index === 1 ? '专业版' : '企业版'}
                </span>
                <Badge
                  className={
                    plan.popular
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-100 text-gray-600'
                  }
                >
                  {plan.popular ? '高转化推荐' : '普通方案'}
                </Badge>
              </div>
              <div className="grid gap-2">
                <div>
                  <Label>名称</Label>
                  <Input
                    value={plan.name}
                    onChange={(e) => {
                      const next = [...pricingPlans];
                      next[index] = { ...plan, name: e.target.value };
                      setPricingPlans(next);
                    }}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>价格</Label>
                    <Input
                      value={plan.price}
                      onChange={(e) => {
                        const next = [...pricingPlans];
                        next[index] = { ...plan, price: e.target.value };
                        setPricingPlans(next);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>周期</Label>
                    <Input
                      value={plan.period}
                      onChange={(e) => {
                        const next = [...pricingPlans];
                        next[index] = { ...plan, period: e.target.value };
                        setPricingPlans(next);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>描述</Label>
                  <Input
                    value={plan.description}
                    onChange={(e) => {
                      const next = [...pricingPlans];
                      next[index] = {
                        ...plan,
                        description: e.target.value,
                      };
                      setPricingPlans(next);
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>功能列表（每行一条）</Label>
                  <Textarea
                    value={plan.features.join('\n')}
                    onChange={(e) => {
                      const features = e.target.value
                        .split('\n')
                        .map((t) => t.trim())
                        .filter(Boolean);
                      const next = [...pricingPlans];
                      next[index] = { ...plan, features };
                      setPricingPlans(next);
                    }}
                    rows={3}
                    className="mt-1 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>按钮文案</Label>
                    <Input
                      value={plan.cta}
                      onChange={(e) => {
                        const next = [...pricingPlans];
                        next[index] = { ...plan, cta: e.target.value };
                        setPricingPlans(next);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>跳转链接</Label>
                    <Input
                      value={plan.href}
                      onChange={(e) => {
                        const next = [...pricingPlans];
                        next[index] = { ...plan, href: e.target.value };
                        setPricingPlans(next);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Switch
                      checked={plan.popular}
                      onCheckedChange={(checked) => {
                        const next = pricingPlans.map((p, i) => {
                          if (checked) {
                            return { ...p, popular: i === index };
                          }
                          if (!checked && i === index) {
                            return { ...p, popular: false };
                          }
                          return p;
                        });
                        setPricingPlans(next);
                      }}
                    />
                    <span>设为推荐方案</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Guide */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">配置教程</h3>
            <p className="text-sm text-gray-600 mb-4">
              查看详细的支付接口配置指南，快速完成对接
            </p>
            <div className="space-y-2">
              {[
                { name: 'Stripe 配置教程', url: '#' },
                { name: 'PayPal 配置教程', url: '#' },
                { name: '支付宝配置教程', url: '#' },
                { name: '微信支付配置教程', url: '#' },
              ].map((guide) => (
                <a
                  key={guide.name}
                  href={guide.url}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  {guide.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Provider Config Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              配置 {paymentProviders.find((p) => p.id === selectedProvider)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>API Key / Publishable Key</Label>
              <div className="relative mt-1">
                <Input type="password" placeholder="pk_live_..." />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <Label>Secret Key</Label>
              <div className="relative mt-1">
                <Input type="password" placeholder="sk_live_..." />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <Label>Webhook Secret</Label>
              <Input type="password" placeholder="whsec_..." className="mt-1" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Switch id="sandbox" />
              <Label htmlFor="sandbox">启用测试模式 (Sandbox)</Label>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              保存配置
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  function UsersSection() {
    const [email, setEmail] = useState('');
    const [plan, setPlan] = useState('free');
    const [usersList, setUsersList] = useState<{
      id: string;
      email: string;
      plan: string;
      role?: 'super_admin' | 'admin' | 'viewer' | 'user';
    }[]>(() => {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('users');
        if (!raw) return [];
        const parsed = (() => { try { return JSON.parse(raw) } catch { return null } })();
        if (!Array.isArray(parsed)) return [];
        return parsed.map((u) => {
          if (!u || typeof u !== 'object') return u;
          if (!('role' in u)) {
            return { ...u, role: 'user' as const };
          }
          return u;
        });
      }
      return [];
    });

    const saveUsers = (list: typeof usersList) => {
      setUsersList(list);
      localStorage.setItem('users', JSON.stringify(list));
    };

    const getCurrentUserRole = () => {
      if (typeof window === 'undefined') return null as 'super_admin' | 'admin' | 'viewer' | 'user' | null;
      const raw = localStorage.getItem('user');
      if (!raw) return null as 'super_admin' | 'admin' | 'viewer' | 'user' | null;
      try {
        const parsed = JSON.parse(raw) as { email?: string; role?: string } | null;
        const role = parsed?.role;
        if (role === 'super_admin' || role === 'admin' || role === 'viewer' || role === 'user') {
          return role;
        }
        return null as 'super_admin' | 'admin' | 'viewer' | 'user' | null;
      } catch {
        return null as 'super_admin' | 'admin' | 'viewer' | 'user' | null;
      }
    };

    const currentUserRole = getCurrentUserRole();
    const canEditRoles = currentUserRole === 'super_admin' || currentUserRole === 'admin';

    const addUser = () => {
      if (!email.trim()) return;
      const next = [
        { id: Date.now().toString(), email: email.trim(), plan, role: 'user' as const },
        ...usersList,
      ];
      saveUsers(next);
      setEmail('');
      setPlan('free');
    };

    const removeUser = (id: string) => {
      const next = usersList.filter(u => u.id !== id);
      saveUsers(next);
    };

    const updateRole = (id: string, role: 'super_admin' | 'admin' | 'viewer' | 'user') => {
      const next = usersList.map(user => {
        if (user.id !== id) return user;
        return { ...user, role };
      });
      saveUsers(next);

      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('user');
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { email?: string; role?: string } | null;
            if (parsed && typeof parsed.email === 'string') {
              const current = next.find(u => u.email === parsed.email);
              if (current) {
                localStorage.setItem(
                  'user',
                  JSON.stringify({
                    email: current.email,
                    role: current.role || 'user',
                  })
                );
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">用户管理</h2>
          <p className="text-sm text-gray-500">新增、删除用户（本地存储）</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label>用户邮箱</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>套餐</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="free">免费版</SelectItem>
                <SelectItem value="pro">专业版</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3 flex justify-end">
            <Button onClick={addUser} className="bg-blue-600 hover:bg-blue-700 text-white">添加用户</Button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(user => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-6 py-3 text-sm">{user.email}</td>
                  <td className="px-6 py-3 text-sm">{user.plan}</td>
                  <td className="px-6 py-3 text-sm">
                    <Select
                      value={user.role || 'user'}
                      onValueChange={(value) =>
                        canEditRoles &&
                        updateRole(
                          user.id,
                          value as 'super_admin' | 'admin' | 'viewer' | 'user'
                        )
                      }
                      disabled={!canEditRoles}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">普通用户</SelectItem>
                        <SelectItem value="viewer">只读管理员</SelectItem>
                        <SelectItem value="admin">管理员</SelectItem>
                        {currentUserRole === 'super_admin' && (
                          <SelectItem value="super_admin">超级管理员</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeUser(user.id)}
                        disabled={!canEditRoles}
                      >
                        删除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  function TemplatesSection() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [industry, setIndustry] = useState('tech');
    const [style, setStyle] = useState('modern');
    const [atsScore, setAtsScore] = useState(95);
    const [tags, setTags] = useState<string>('ATS-Optimized');

    const saveTemplate = () => {
      const raw = localStorage.getItem('customTemplates');
      let list: { id: string; name: string; description: string; atsScore: number; industry: string; style: string; tags: string[]; isNew: boolean; isPopular: boolean }[] = [];
      if (raw) {
        const parsed = (() => { try { return JSON.parse(raw) } catch { return null } })();
        list = Array.isArray(parsed) ? parsed : [];
      }
      const item = {
        id: Date.now().toString(),
        name,
        description,
        atsScore,
        industry,
        style,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isNew: true,
        isPopular: false,
      };
      localStorage.setItem('customTemplates', JSON.stringify([item, ...list]));
      setName('');
      setDescription('');
      setTags('ATS-Optimized');
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">模板管理</h2>
          <p className="text-sm text-gray-500">新增模板后将在“模板库”页面展示</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-2 gap-4">
          <div>
            <Label>模板名称</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>行业</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">技术岗</SelectItem>
                <SelectItem value="finance">金融岗</SelectItem>
                <SelectItem value="marketing">营销岗</SelectItem>
                <SelectItem value="education">教育岗</SelectItem>
                <SelectItem value="entry">应届生</SelectItem>
                <SelectItem value="career-change">转行者</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>描述</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>风格</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">现代</SelectItem>
                <SelectItem value="classic">经典</SelectItem>
                <SelectItem value="minimal">极简</SelectItem>
                <SelectItem value="creative">创意</SelectItem>
                <SelectItem value="elegant">优雅</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ATS 分数</Label>
            <Input type="number" value={atsScore} onChange={(e) => setAtsScore(Number(e.target.value))} className="mt-1" />
          </div>
          <div className="col-span-2">
            <Label>标签（逗号分隔）</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1" />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button onClick={saveTemplate} className="bg-blue-600 hover:bg-blue-700 text-white">保存模板</Button>
          </div>
        </div>
      </div>
    );
  };

  const [analyticsConfig, setAnalyticsConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('adminAnalyticsConfig');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            showUsers: boolean;
            showTemplates: boolean;
            showArticles: boolean;
          };
          if (
            parsed &&
            typeof parsed.showUsers === 'boolean' &&
            typeof parsed.showTemplates === 'boolean' &&
            typeof parsed.showArticles === 'boolean'
          ) {
            return parsed;
          }
        } catch (e) {
          console.error('Failed to parse adminAnalyticsConfig from localStorage', e);
        }
      }
    }
    return { showUsers: true, showTemplates: true, showArticles: true };
  });
  useEffect(() => {
    localStorage.setItem('adminAnalyticsConfig', JSON.stringify(analyticsConfig));
  }, [analyticsConfig]);
  const renderAnalytics = () => {
    const usersCount = (() => {
      const raw = localStorage.getItem('users') || '[]';
      const parsed = (() => { try { return JSON.parse(raw) } catch { return [] } })();
      return Array.isArray(parsed) ? parsed.length : 0;
    })();
    const templatesCount = (() => {
      const raw = localStorage.getItem('customTemplates') || '[]';
      const parsed = (() => { try { return JSON.parse(raw) } catch { return [] } })();
      return Array.isArray(parsed) ? parsed.length : 0;
    })();
    const articlesCount = articles.length;
    const trend = [12, 16, 14, 18, 22, 20, 25];
    const metrics = [
      analyticsConfig.showUsers && { label: '用户总数', value: usersCount },
      analyticsConfig.showTemplates && { label: '自定义模板', value: templatesCount },
      analyticsConfig.showArticles && { label: '文章数量', value: articlesCount },
    ].filter(Boolean) as { label: string; value: number }[];
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">数据分析</h2>
          <p className="text-sm text-gray-500">基础统计概览</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between">
          <p className="text-sm text-gray-500">选择要展示的指标</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>用户</span>
              <Switch
                checked={analyticsConfig.showUsers}
                onCheckedChange={checked =>
                  setAnalyticsConfig(prev => ({ ...prev, showUsers: checked }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span>模板</span>
              <Switch
                checked={analyticsConfig.showTemplates}
                onCheckedChange={checked =>
                  setAnalyticsConfig(prev => ({ ...prev, showTemplates: checked }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span>文章</span>
              <Switch
                checked={analyticsConfig.showArticles}
                onCheckedChange={checked =>
                  setAnalyticsConfig(prev => ({ ...prev, showArticles: checked }))
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {metrics.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border">
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-2">近7期趋势</p>
          <svg viewBox="0 0 140 40" className="w-full h-24">
            <polyline
              fill="none"
              stroke="#ff6a00"
              strokeWidth="2"
              points={trend.map((v, i) => `${i * 20},${40 - v}`).join(' ')}
            />
          </svg>
        </div>
      </div>
    );
  };
  const [aiModel, setAiModel] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('aiModelSettings');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { model?: string; temperature?: string };
          if (parsed && typeof parsed.model === 'string') {
            return parsed.model;
          }
        } catch (e) {
          console.error('Failed to parse aiModelSettings from localStorage', e);
        }
      }
    }
    return 'gpt-4';
  });
  const [aiTemperature, setAiTemperature] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('aiModelSettings');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { model?: string; temperature?: string };
          if (parsed && typeof parsed.temperature === 'string') {
            return parsed.temperature;
          }
        } catch (e) {
          console.error('Failed to parse aiModelSettings from localStorage', e);
        }
      }
    }
    return '0.7';
  });
  useEffect(() => {
    localStorage.setItem(
      'aiModelSettings',
      JSON.stringify({ model: aiModel, temperature: aiTemperature })
    );
  }, [aiModel, aiTemperature]);
  const renderAIConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI 配置</h2>
          <p className="text-sm text-gray-500">自定义 AI 提示词，优化生成效果</p>
        </div>
        {hasChanges && (
          <Button 
            onClick={handleSavePrompts}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Save className="w-4 h-4" />
            保存更改
          </Button>
        )}
      </div>

      <Tabs defaultValue="resume_polish" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="resume_polish">简历润色</TabsTrigger>
          <TabsTrigger value="cover_letter">求职信</TabsTrigger>
          <TabsTrigger value="interview_prep">面试准备</TabsTrigger>
          <TabsTrigger value="ats_analysis">ATS 分析</TabsTrigger>
          <TabsTrigger value="chatbot_welcome">在线客服欢迎语</TabsTrigger>
          <TabsTrigger value="chatbot_quick_questions">在线客服快捷提问</TabsTrigger>
          <TabsTrigger value="job_description">职位描述</TabsTrigger>
          <TabsTrigger value="cold_email">冷邮件</TabsTrigger>
        </TabsList>

        {Object.entries(prompts).map(([key, prompt]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    {key === 'resume_polish' && '简历润色提示词'}
                    {key === 'cover_letter' && '求职信生成提示词'}
                    {key === 'interview_prep' && '面试准备提示词'}
                    {key === 'ats_analysis' && 'ATS 分析提示词'}
                    {key === 'chatbot_welcome' && '在线客服欢迎语'}
                    {key === 'chatbot_quick_questions' && '在线客服快捷提问'}
                    {key === 'job_description' && '职位描述生成提示词'}
                    {key === 'cold_email' && '冷邮件生成提示词'}
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const fallback = (defaultPrompts as Record<string, string>)[key] ?? '';
                    updatePrompt(key, fallback);
                  }}
                >
                  重置为默认
                </Button>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => updatePrompt(key, e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                使用 {'{{variable}}'} 格式插入动态变量
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* AI Model Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          AI 模型设置
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>AI 模型</Label>
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Temperature (创造性)</Label>
            <Select value={aiTemperature} onValueChange={setAiTemperature}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.3">保守 (0.3)</SelectItem>
                <SelectItem value="0.5">平衡 (0.5)</SelectItem>
                <SelectItem value="0.7">创意 (0.7)</SelectItem>
                <SelectItem value="0.9">大胆 (0.9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Max Tokens</Label>
            <Input defaultValue="2000" className="mt-1" />
          </div>
          <div>
            <Label>API Key</Label>
            <div className="relative mt-1">
              <Input type="password" defaultValue="sk-..." />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cleaning API Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          清洗 API 接入
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>API Base URL</Label>
            <Input
              defaultValue={(() => localStorage.getItem('cleanApi.base') || '')()}
              onChange={(e) => localStorage.setItem('cleanApi.base', e.target.value)}
              placeholder="例如：https://api.example.com"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>Authorization Token</Label>
            <Input
              type="password"
              defaultValue={(() => localStorage.getItem('cleanApi.token') || '')()}
              onChange={(e) => localStorage.setItem('cleanApi.token', e.target.value)}
              placeholder="可选，Bearer Token"
              className="mt-1"
            />
          </div>
          <p className="col-span-2 text-xs text-gray-500">
            ResumeEditor 的“AI 清洗”会读取以上配置请求后端：POST /clean-resume，失败将自动使用本地清洗策略。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          ATS 检测 API 接入
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>API Base URL</Label>
            <Input
              defaultValue={(() => localStorage.getItem('atsApi.base') || '')()}
              onChange={(e) => localStorage.setItem('atsApi.base', e.target.value)}
              placeholder="例如：https://api.example.com"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>Authorization Token</Label>
            <Input
              type="password"
              defaultValue={(() => localStorage.getItem('atsApi.token') || '')()}
              onChange={(e) => localStorage.setItem('atsApi.token', e.target.value)}
              placeholder="可选，Bearer Token"
              className="mt-1"
            />
          </div>
          <p className="col-span-2 text-xs text-gray-500">
            ATS 检测页面会读取以上配置请求后端：POST /ats-analyze，失败将自动使用本地模拟分析。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          面试报告 API 接入
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>API Base URL</Label>
            <Input
              defaultValue={(() => localStorage.getItem('interviewApi.base') || '')()}
              onChange={(e) => localStorage.setItem('interviewApi.base', e.target.value)}
              placeholder="例如：https://api.example.com"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>Authorization Token</Label>
            <Input
              type="password"
              defaultValue={(() => localStorage.getItem('interviewApi.token') || '')()}
              onChange={(e) => localStorage.setItem('interviewApi.token', e.target.value)}
              placeholder="可选，Bearer Token"
              className="mt-1"
            />
          </div>
          <p className="col-span-2 text-xs text-gray-500">
            AI 面试报告会读取以上配置请求后端：POST /interview-report，失败将使用前端本地评分逻辑。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          SEO 文章 API 接入
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>API Base URL</Label>
            <Input
              defaultValue={(() => localStorage.getItem('seoApi.base') || '')()}
              onChange={(e) => localStorage.setItem('seoApi.base', e.target.value)}
              placeholder="例如：https://api.example.com"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>Authorization Token</Label>
            <Input
              type="password"
              defaultValue={(() => localStorage.getItem('seoApi.token') || '')()}
              onChange={(e) => localStorage.setItem('seoApi.token', e.target.value)}
              placeholder="可选，Bearer Token"
              className="mt-1"
            />
          </div>
          <p className="col-span-2 text-xs text-gray-500">
            博客管理中的“AI生成SEO文章”会读取以上配置请求后端：POST /seo-article，失败将自动使用本地生成模板。
          </p>
        </div>
      </div>

      {/* Chrome 扩展配置 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Chrome className="w-5 h-5 text-blue-600" />
          Chrome 扩展配置
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ICON 16 URL</Label>
            <Input
              defaultValue={(() => localStorage.getItem('ext.icon16') || '')()}
              onChange={(e) => localStorage.setItem('ext.icon16', e.target.value)}
              placeholder="https://.../icon16.png"
              className="mt-1"
            />
          </div>
          <div>
            <Label>ICON 48 URL</Label>
            <Input
              defaultValue={(() => localStorage.getItem('ext.icon48') || '')()}
              onChange={(e) => localStorage.setItem('ext.icon48', e.target.value)}
              placeholder="https://.../icon48.png"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>ICON 128 URL</Label>
            <Input
              defaultValue={(() => localStorage.getItem('ext.icon128') || '')()}
              onChange={(e) => localStorage.setItem('ext.icon128', e.target.value)}
              placeholder="https://.../icon128.png"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>扩展 API Base</Label>
            <Input
              defaultValue={(() => localStorage.getItem('ext.api.base') || '')()}
              onChange={(e) => localStorage.setItem('ext.api.base', e.target.value)}
              placeholder="https://api.resumeai.com"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>扩展 API Token</Label>
            <Input
              type="password"
              defaultValue={(() => localStorage.getItem('ext.api.token') || '')()}
              onChange={(e) => localStorage.setItem('ext.api.token', e.target.value)}
              placeholder="可选"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>默认模板ID</Label>
            <Input
              defaultValue={(() => localStorage.getItem('ext.tpl.defaultId') || '')()}
              onChange={(e) => localStorage.setItem('ext.tpl.defaultId', e.target.value)}
              placeholder="如：modern-tech-pro"
              className="mt-1"
            />
          </div>
          <div className="col-span-2">
            <Label>复制打包命令</Label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={(() => {
                  const ICON16_URL = localStorage.getItem('ext.icon16') || '';
                  const ICON48_URL = localStorage.getItem('ext.icon48') || '';
                  const ICON128_URL = localStorage.getItem('ext.icon128') || '';
                  const EXT_API_BASE = localStorage.getItem('ext.api.base') || '';
                  const EXT_API_TOKEN = localStorage.getItem('ext.api.token') || '';
                  const TPL_DEFAULT_ID = localStorage.getItem('ext.tpl.defaultId') || '';
                  const env = [
                    ICON16_URL ? `ICON16_URL=${ICON16_URL}` : '',
                    ICON48_URL ? `ICON48_URL=${ICON48_URL}` : '',
                    ICON128_URL ? `ICON128_URL=${ICON128_URL}` : '',
                    EXT_API_BASE ? `EXT_API_BASE=${EXT_API_BASE}` : '',
                    EXT_API_TOKEN ? `EXT_API_TOKEN=${EXT_API_TOKEN}` : '',
                    TPL_DEFAULT_ID ? `TPL_DEFAULT_ID=${TPL_DEFAULT_ID}` : '',
                  ].filter(Boolean).join(' ');
                  return `${env} bash public/extension/build.sh`.trim();
                })()}
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const ICON16_URL = localStorage.getItem('ext.icon16') || '';
                  const ICON48_URL = localStorage.getItem('ext.icon48') || '';
                  const ICON128_URL = localStorage.getItem('ext.icon128') || '';
                  const EXT_API_BASE = localStorage.getItem('ext.api.base') || '';
                  const EXT_API_TOKEN = localStorage.getItem('ext.api.token') || '';
                  const TPL_DEFAULT_ID = localStorage.getItem('ext.tpl.defaultId') || '';
                  const env = [
                    ICON16_URL ? `ICON16_URL=${ICON16_URL}` : '',
                    ICON48_URL ? `ICON48_URL=${ICON48_URL}` : '',
                    ICON128_URL ? `ICON128_URL=${ICON128_URL}` : '',
                    EXT_API_BASE ? `EXT_API_BASE=${EXT_API_BASE}` : '',
                    EXT_API_TOKEN ? `EXT_API_TOKEN=${EXT_API_TOKEN}` : '',
                    TPL_DEFAULT_ID ? `TPL_DEFAULT_ID=${TPL_DEFAULT_ID}` : '',
                  ].filter(Boolean).join(' ');
                  const val = `${env} bash public/extension/build.sh`.trim();
                  navigator.clipboard.writeText(val);
                }}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                复制
              </Button>
              <Button
                disabled={isBuildingExt}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  if (isBuildingExt) return;
                  setIsBuildingExt(true);
                  const ICON16_URL = localStorage.getItem('ext.icon16') || '';
                  const ICON48_URL = localStorage.getItem('ext.icon48') || '';
                  const ICON128_URL = localStorage.getItem('ext.icon128') || '';
                  const EXT_API_BASE = localStorage.getItem('ext.api.base') || '';
                  const EXT_API_TOKEN = localStorage.getItem('ext.api.token') || '';
                  const TPL_DEFAULT_ID = localStorage.getItem('ext.tpl.defaultId') || '';
                  const env = {
                    ICON16_URL, ICON48_URL, ICON128_URL,
                    EXT_API_BASE, EXT_API_TOKEN, TPL_DEFAULT_ID,
                  };
                  try {
                    await fetch('/api/build-extension', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(env),
                    }).catch(() => {});
                  } finally {
                    setIsBuildingExt(false);
                    const url = '/extension/resumeai-extension.zip';
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ResumeAI-Extension.zip';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }
                }}
              >
                {isBuildingExt ? '生成中...' : '生成并下载'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">外观设置</h2>
        <p className="text-sm text-gray-500">自定义网站首页、主题颜色和整体风格</p>
      </div>

      {/* Theme Colors */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Paintbrush className="w-5 h-5 text-blue-600" />
          主题颜色
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>主色调</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={themeConfig.primaryColor}
                onChange={(e) => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Input 
                value={themeConfig.primaryColor}
                onChange={(e) => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">用于按钮、链接和重点元素</p>
          </div>
          <div>
            <Label>辅助色</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={themeConfig.secondaryColor}
                onChange={(e) => setThemeConfig({ ...themeConfig, secondaryColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Input 
                value={themeConfig.secondaryColor}
                onChange={(e) => setThemeConfig({ ...themeConfig, secondaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">用于文字和次要元素</p>
          </div>
        </div>
        <div className="mt-4">
          <Label>圆角大小</Label>
          <Select 
            value={themeConfig.borderRadius} 
            onValueChange={(v) => setThemeConfig({ ...themeConfig, borderRadius: v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">无圆角</SelectItem>
              <SelectItem value="0.25rem">小</SelectItem>
              <SelectItem value="0.625rem">中</SelectItem>
              <SelectItem value="1rem">大</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">预览效果:</p>
          <div className="flex gap-4">
            <Button 
              style={{ backgroundColor: themeConfig.primaryColor }}
              className="text-white"
            >
              主按钮
            </Button>
            <Button 
              variant="outline"
              style={{ borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor }}
            >
              次要按钮
            </Button>
          </div>
        </div>
      </div>

      {/* Homepage Config */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-blue-600" />
          首页配置
        </h3>
        <div className="space-y-6">
          <div>
            <Label>首页背景图片</Label>
            <div className="mt-2 space-y-3">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {homepageConfig.heroImage ? (
                  <img 
                    src={homepageConfig.heroImage} 
                    alt="Hero" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={homepageConfig.heroImage}
                  onChange={(e) => setHomepageConfig({ ...homepageConfig, heroImage: e.target.value })}
                  placeholder="图片URL"
                  className="flex-1"
                />
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  上传
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Label>主标题</Label>
            <Input 
              value={homepageConfig.heroTitle}
              onChange={(e) => setHomepageConfig({ ...homepageConfig, heroTitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>副标题</Label>
            <Input 
              value={homepageConfig.heroSubtitle}
              onChange={(e) => setHomepageConfig({ ...homepageConfig, heroSubtitle: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>CTA 按钮文字</Label>
            <Input 
              value={homepageConfig.ctaText}
              onChange={(e) => setHomepageConfig({ ...homepageConfig, ctaText: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>功能点列表</Label>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setHomepageConfig({
                    ...homepageConfig,
                    features: [
                      ...homepageConfig.features,
                      { title: '新的功能点', description: '在这里描述这个功能的价值' },
                    ],
                  });
                }}
              >
                <Plus className="w-4 h-4" />
                添加功能
              </Button>
            </div>
            <div className="space-y-3">
              {homepageConfig.features.map((feature, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr,2fr,auto] gap-2 items-center"
                >
                  <Input
                    placeholder="功能标题"
                    value={feature.title}
                    onChange={(e) => {
                      const next = [...homepageConfig.features];
                      next[index] = { ...next[index], title: e.target.value };
                      setHomepageConfig({ ...homepageConfig, features: next });
                    }}
                  />
                  <Input
                    placeholder="功能描述"
                    value={feature.description}
                    onChange={(e) => {
                      const next = [...homepageConfig.features];
                      next[index] = { ...next[index], description: e.target.value };
                      setHomepageConfig({ ...homepageConfig, features: next });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const next = homepageConfig.features.filter((_, i) => i !== index);
                      setHomepageConfig({ ...homepageConfig, features: next });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header Config */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          页眉配置
        </h3>
        <div className="space-y-4">
          <div>
            <Label>网站 Logo</Label>
            <Input 
              value={headerConfig.logo}
              onChange={(e) => setHeaderConfig({ ...headerConfig, logo: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>导航菜单</Label>
            <div className="space-y-2 mt-2">
              {headerConfig.navItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    value={item.name} 
                    className="flex-1" 
                    onChange={(e) => {
                      const next = [...headerConfig.navItems];
                      next[index] = { ...next[index], name: e.target.value };
                      setHeaderConfig({ ...headerConfig, navItems: next });
                    }}
                  />
                  <Input 
                    value={item.href} 
                    className="flex-1" 
                    placeholder="链接" 
                    onChange={(e) => {
                      const next = [...headerConfig.navItems];
                      next[index] = { ...next[index], href: e.target.value };
                      setHeaderConfig({ ...headerConfig, navItems: next });
                    }}
                  />
                  <button 
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    onClick={() => {
                      const next = headerConfig.navItems.filter((_, i) => i !== index);
                      setHeaderConfig({ ...headerConfig, navItems: next });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-1"
                onClick={() => {
                  setHeaderConfig({
                    ...headerConfig,
                    navItems: [...headerConfig.navItems, { name: '新链接', href: '/' }],
                  });
                }}
              >
                <Plus className="w-4 h-4" />
                添加导航项
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Config */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Menu className="w-5 h-5 text-blue-600" />
          页脚配置
        </h3>
        <div className="space-y-4">
          {footerConfig.columns.map((column, colIndex) => (
            <div key={colIndex} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Input 
                  value={column.title}
                  className="w-32 font-semibold"
                  onChange={(e) => {
                    const next = [...footerConfig.columns];
                    next[colIndex] = { ...next[colIndex], title: e.target.value };
                    setFooterConfig({ ...footerConfig, columns: next });
                  }}
                />
                <button 
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  onClick={() => {
                    const next = footerConfig.columns.filter((_, i) => i !== colIndex);
                    setFooterConfig({ ...footerConfig, columns: next });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center gap-2">
                    <Input 
                      value={link.name} 
                      className="flex-1" 
                      onChange={(e) => {
                        const nextCols = [...footerConfig.columns];
                        const nextLinks = [...nextCols[colIndex].links];
                        nextLinks[linkIndex] = { ...nextLinks[linkIndex], name: e.target.value };
                        nextCols[colIndex] = { ...nextCols[colIndex], links: nextLinks };
                        setFooterConfig({ ...footerConfig, columns: nextCols });
                      }}
                    />
                    <Input 
                      value={link.href} 
                      className="flex-1" 
                      placeholder="链接" 
                      onChange={(e) => {
                        const nextCols = [...footerConfig.columns];
                        const nextLinks = [...nextCols[colIndex].links];
                        nextLinks[linkIndex] = { ...nextLinks[linkIndex], href: e.target.value };
                        nextCols[colIndex] = { ...nextCols[colIndex], links: nextLinks };
                        setFooterConfig({ ...footerConfig, columns: nextCols });
                      }}
                    />
                    <button 
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      onClick={() => {
                        const nextCols = [...footerConfig.columns];
                        const nextLinks = nextCols[colIndex].links.filter((_, i) => i !== linkIndex);
                        nextCols[colIndex] = { ...nextCols[colIndex], links: nextLinks };
                        setFooterConfig({ ...footerConfig, columns: nextCols });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-1"
                  onClick={() => {
                    const nextCols = [...footerConfig.columns];
                    nextCols[colIndex] = {
                      ...nextCols[colIndex],
                      links: [...nextCols[colIndex].links, { name: '新链接', href: '/' }],
                    };
                    setFooterConfig({ ...footerConfig, columns: nextCols });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  添加链接
                </Button>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full gap-1"
            onClick={() => {
              setFooterConfig({
                ...footerConfig,
                columns: [
                  ...footerConfig.columns,
                  { title: '新栏目', links: [] },
                ],
              });
            }}
          >
            <Plus className="w-4 h-4" />
            添加栏目
          </Button>
          <div>
            <Label>版权信息</Label>
            <Textarea 
              value={footerConfig.copyright}
              onChange={(e) => setFooterConfig({ ...footerConfig, copyright: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        onClick={() => {
          setConfig({
            ...config,
            header: headerConfig,
            footer: footerConfig,
            homepage: homepageConfig,
          });
        }}
      >
        <Save className="w-4 h-4" />
        保存外观设置
      </Button>
    </div>
  );

  // Blog Management Functions
  const handleGenerateArticle = async () => {
    if (!generationPrompt.trim()) return;
    setIsGeneratingArticle(true);

    const base =
      (typeof window !== 'undefined'
        ? localStorage.getItem('seoApi.base')
        : '') || '';
    const token =
      (typeof window !== 'undefined'
        ? localStorage.getItem('seoApi.token')
        : '') || '';
    const trimmedBase = base.replace(/\/$/, '');
    const keywords = generationPrompt
      .split(/[,，\s]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    const mainKeyword = keywords[0] || '求职技巧';

    if (trimmedBase) {
      try {
        const resp = await fetch(`${trimmedBase}/seo-article`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            topic: generationPrompt,
            keywords,
          }),
        });

        if (resp.ok) {
          const payload = (await resp.json()) as SeoArticleApiResponse | null;
          if (payload && (payload.title || payload.content || payload.excerpt)) {
            const responseKeywords =
              Array.isArray(payload.keywords) && payload.keywords.length
                ? payload.keywords
                : keywords;
            const responseTags =
              Array.isArray(payload.tags) && payload.tags.length
                ? payload.tags
                : responseKeywords.slice(0, 5);
            const category = payload.category || '职场发展';
            const slugSource = payload.slug || mainKeyword;

            setGeneratedArticle({
              title: payload.title || `${mainKeyword}：2024年完整指南`,
              slug: slugSource.toLowerCase().replace(/\s+/g, '-'),
              excerpt:
                payload.excerpt ||
                `深入了解${mainKeyword}的关键策略和最佳实践，帮助你在求职中脱颖而出`,
              content:
                payload.content ||
                `## 引言\n\n在当今竞争激烈的就业市场中，${mainKeyword}变得越来越重要...\n\n## 主要内容\n\n### 1. 了解基本要求\n\n首先，你需要了解...\n\n### 2. 准备必要材料\n\n确保你准备好以下材料...\n\n### 3. 优化你的方法\n\n使用以下策略来提升...\n\n## 结论\n\n通过遵循这些建议，你可以...`,
              category,
              tags: responseTags,
              seoTitle:
                payload.seoTitle || `${mainKeyword}完整指南 | ResumeAI`,
              seoDescription:
                payload.seoDescription ||
                `学习${mainKeyword}的最佳实践，提高求职成功率`,
              keywords: responseKeywords,
              author: payload.author || 'ResumeAI AI助手',
              status: 'draft',
              publishDate: new Date().toISOString().split('T')[0],
              views: 0,
              featured: false,
            });
            setIsGeneratingArticle(false);
            return;
          }
        }
      } catch (e) {
        console.error('SEO article API request failed', e);
      }
    }

    const fallbackKeywords = keywords.length ? keywords : [mainKeyword];
    const fallbackMainKeyword = mainKeyword;

    setGeneratedArticle({
      title: `${fallbackMainKeyword}：2024年完整指南`,
      slug: fallbackMainKeyword.toLowerCase().replace(/\s+/g, '-'),
      excerpt: `深入了解${fallbackMainKeyword}的关键策略和最佳实践，帮助你在求职中脱颖而出`,
      content: `## 引言\n\n在当今竞争激烈的就业市场中，${fallbackMainKeyword}变得越来越重要...\n\n## 主要内容\n\n### 1. 了解基本要求\n\n首先，你需要了解...\n\n### 2. 准备必要材料\n\n确保你准备好以下材料...\n\n### 3. 优化你的方法\n\n使用以下策略来提升...\n\n## 结论\n\n通过遵循这些建议，你可以...`,
      category: '职场发展',
      tags: fallbackKeywords.slice(0, 5),
      seoTitle: `${fallbackMainKeyword}完整指南 | ResumeAI`,
      seoDescription: `学习${fallbackMainKeyword}的最佳实践，提高求职成功率`,
      keywords: fallbackKeywords,
      author: 'ResumeAI AI助手',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      views: 0,
      featured: false,
    });
    setIsGeneratingArticle(false);
  };

  const handleSaveArticle = () => {
    if (selectedArticle) {
      setArticles(prev => prev.map(a => a.id === selectedArticle.id ? selectedArticle : a));
    } else if (generatedArticle.title) {
      const newArticle: BlogArticle = {
        ...generatedArticle as BlogArticle,
        id: Date.now().toString(),
      };
      setArticles(prev => [newArticle, ...prev]);
    }
    setIsEditingArticle(false);
    setSelectedArticle(null);
    setGeneratedArticle({});
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(articleSearchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderBlog = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">博客管理</h2>
          <p className="text-sm text-gray-500">管理博客文章，生成SEO优化内容</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              setIsSeoDialogOpen(true);
              setIsGeneratingArticle(false);
              setGeneratedArticle({});
              setGenerationPrompt('');
            }}
          >
            <Wand2 className="w-4 h-4" />
            AI生成文章
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => {
              setSelectedArticle(null);
              setIsEditingArticle(true);
            }}
          >
            <Plus className="w-4 h-4" />
            新建文章
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索文章..."
            value={articleSearchQuery}
            onChange={(e) => setArticleSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {blogCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">文章</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">浏览量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布日期</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    {article.featured && (
                      <span className="flex-shrink-0 w-5 h-5 rounded bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs">
                        ★
                      </span>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{article.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {article.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{article.category}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {article.status === 'published' ? '已发布' : '草稿'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {article.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {article.publishDate}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedArticle(article);
                        setIsEditingArticle(true);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Generate Dialog */}
      <Dialog
        open={isSeoDialogOpen}
        onOpenChange={(open) => {
          setIsSeoDialogOpen(open);
          if (!open) {
            setIsGeneratingArticle(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-600" />
              AI生成SEO文章
            </DialogTitle>
          </DialogHeader>
          
          {!generatedArticle.title ? (
            <div className="space-y-4">
              <div>
                <Label>输入关键词或主题</Label>
                <Textarea
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  placeholder="输入关键词，如：H1B签证申请, 技术面试准备, 简历优化技巧..."
                  className="mt-2 min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  支持多个关键词，用逗号分隔。AI将生成符合SEO/GEO优化的文章
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">AI将自动生成：</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ SEO优化的标题和描述</li>
                  <li>✓ 结构化的文章内容</li>
                  <li>✓ 相关的标签和关键词</li>
                  <li>✓ 符合Google搜索规范</li>
                  <li>✓ 去AI化处理，更自然</li>
                </ul>
              </div>
              <Button 
                onClick={handleGenerateArticle}
                disabled={!generationPrompt.trim() || isGeneratingArticle}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGeneratingArticle ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    开始生成
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>文章标题</Label>
                <Input 
                  value={generatedArticle.title || ''}
                  onChange={(e) => setGeneratedArticle({...generatedArticle, title: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>SEO标题</Label>
                <Input 
                  value={generatedArticle.seoTitle || ''}
                  onChange={(e) => setGeneratedArticle({...generatedArticle, seoTitle: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>SEO描述</Label>
                <Textarea 
                  value={generatedArticle.seoDescription || ''}
                  onChange={(e) => setGeneratedArticle({...generatedArticle, seoDescription: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>文章摘要</Label>
                <Textarea 
                  value={generatedArticle.excerpt || ''}
                  onChange={(e) => setGeneratedArticle({...generatedArticle, excerpt: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>关键词</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {generatedArticle.keywords?.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label>文章内容</Label>
                <Textarea 
                  value={generatedArticle.content || ''}
                  onChange={(e) => setGeneratedArticle({...generatedArticle, content: e.target.value})}
                  className="mt-1 min-h-[200px]"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedArticle({})}
                  className="flex-1"
                >
                  重新生成
                </Button>
                <Button 
                  onClick={handleSaveArticle}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存为草稿
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={isEditingArticle} onOpenChange={setIsEditingArticle}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-blue-600" />
              {selectedArticle ? '编辑文章' : '新建文章'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>文章标题</Label>
              <Input 
                value={selectedArticle?.title || ''}
                onChange={(e) => selectedArticle && setSelectedArticle({...selectedArticle, title: e.target.value})}
                className="mt-1"
                placeholder="输入文章标题"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>分类</Label>
                <Select 
                  value={selectedArticle?.category || '职场发展'}
                  onValueChange={(v) => selectedArticle && setSelectedArticle({...selectedArticle, category: v})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.filter(c => c !== '全部').map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>状态</Label>
                <Select 
                  value={selectedArticle?.status || 'draft'}
                  onValueChange={(v) => selectedArticle && setSelectedArticle({...selectedArticle, status: v as 'draft' | 'published'})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>SEO标题</Label>
              <Input 
                value={selectedArticle?.seoTitle || ''}
                onChange={(e) => selectedArticle && setSelectedArticle({...selectedArticle, seoTitle: e.target.value})}
                className="mt-1"
                placeholder="SEO优化的标题"
              />
            </div>
            <div>
              <Label>SEO描述</Label>
              <Textarea 
                value={selectedArticle?.seoDescription || ''}
                onChange={(e) => selectedArticle && setSelectedArticle({...selectedArticle, seoDescription: e.target.value})}
                className="mt-1"
                placeholder="SEO描述（150字符以内）"
              />
            </div>
            <div>
              <Label>文章摘要</Label>
              <Textarea 
                value={selectedArticle?.excerpt || ''}
                onChange={(e) => selectedArticle && setSelectedArticle({...selectedArticle, excerpt: e.target.value})}
                className="mt-1"
                placeholder="简短的文章摘要"
              />
            </div>
            <div>
              <Label>文章内容 (Markdown)</Label>
              <Textarea 
                value={selectedArticle?.content || ''}
                onChange={(e) => selectedArticle && setSelectedArticle({...selectedArticle, content: e.target.value})}
                className="mt-1 min-h-[300px] font-mono text-sm"
                placeholder="# 标题\n\n文章内容..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={selectedArticle?.featured || false}
                onCheckedChange={(v) => selectedArticle && setSelectedArticle({...selectedArticle, featured: v})}
              />
              <Label>设为推荐文章</Label>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditingArticle(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button 
                onClick={handleSaveArticle}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderPages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">页面管理</h2>
          <p className="text-sm text-gray-500">管理网站的静态页面内容</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => {
            const today = new Date().toISOString().slice(0, 10);
            setPages(prev => [
              ...prev,
              {
                name: `新页面${prev.length + 1}`,
                slug: `page-${prev.length + 1}`,
                status: 'draft',
                lastEdited: today,
              },
            ]);
          }}
        >
          <Plus className="w-4 h-4" />
          新建页面
        </Button>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <div
            key={page.slug}
            className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{page.name}</h3>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                onClick={() => {
                  const today = new Date().toISOString().slice(0, 10);
                  setPages(prev =>
                    prev.map(p =>
                      p.slug === page.slug
                        ? {
                            ...p,
                            status: page.status === 'published' ? 'draft' : 'published',
                            lastEdited: today,
                          }
                        : p
                    )
                  );
                }}
                className={
                  page.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }
              >
                {page.status === 'published' ? '已发布' : '草稿'}
              </Badge>
              <span className="text-sm text-gray-400">{page.lastEdited}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const name = window.prompt('页面标题', page.name) || page.name;
                    const slug = window.prompt('路径（slug）', page.slug) || page.slug;
                    const today = new Date().toISOString().slice(0, 10);
                    setPages(prev =>
                      prev.map(p =>
                        p.slug === page.slug ? { ...p, name, slug, lastEdited: today } : p
                      )
                    );
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.open(`/${page.slug}`, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`h-screen bg-white shadow-lg border-r transition-all duration-300 flex-shrink-0 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && <span className="font-bold text-gray-900">Admin</span>}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="ml-auto w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
          {isSidebarOpen && (
            <div className="mt-3">
              <Input
                id="admin-sidebar-search"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveSearchHistory(sidebarSearch);
                  }
                }}
                placeholder="搜索菜单 (⌘K)"
                className="h-9"
              />
              {!!searchHistory.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {searchHistory.map((s, i) => (
                    <button
                      key={`${s}-${i}`}
                      className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                      onClick={() => setSidebarSearch(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <nav className="px-3 py-3 space-y-4">
          {sidebarGroups.map(group => {
            const orderedIds = sidebarOrder[group.title] || group.ids;
            const items = orderedIds
              .map(id => sidebarItems.find(i => i.id === id)!)
              .filter(i => matchesQuery(i, sidebarSearch));
            if (!items.length) return null;
            return (
              <div key={group.title}>
                {isSidebarOpen && (
                  <div className="px-2 pb-2 text-xs font-medium text-gray-400 uppercase flex items-center justify-between">
                    <span>{group.title}</span>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => toggleGroup(group.title)}
                      aria-label="Toggle Group"
                    >
                      {collapsedGroups[group.title] ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 rotate-180" />}
                    </button>
                  </div>
                )}
                {!collapsedGroups[group.title] && (
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <button
                            draggable
                            onDragStart={(e) => handleDragStart(e, group.title, item.id)}
                            aria-label={item.name}
                            onClick={() => setActiveSection(item.id)}
                            className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                              activeSection === item.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            <div
                              className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded ${
                                activeSection === item.id ? 'bg-white/80' : 'bg-transparent'
                              }`}
                            />
                            <item.icon className="w-5 h-5" />
                            {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                          </button>
                        </TooltipTrigger>
                        {!isSidebarOpen && <TooltipContent side="right">{item.name}</TooltipContent>}
                        <TooltipContent>
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, group.title, item.id)}
                          >
                            拖拽以排序
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-h-screen flex flex-col">
        <header className="bg-white shadow-sm px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {sidebarItems.find((item) => item.id === activeSection)?.name}
            </h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="font-medium text-gray-900">Admin</span>
              </div>
            </div>
          </div>
        </header>
        <div ref={contentRef} className="p-8 flex-1">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'blog' && renderBlog()}
          {activeSection === 'payments' && renderPayments()}
          {activeSection === 'ai' && renderAIConfig()}
          {activeSection === 'appearance' && renderAppearance()}
          {activeSection === 'pages' && renderPages()}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'templates' && <TemplatesSection />}
          {activeSection === 'analytics' && renderAnalytics()}
          {activeSection === 'shortcuts' && (
            <div className="bg-white rounded-xl p-8 shadow-sm max-w-3xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷键映射</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>切换侧边栏</Label>
                  <Input
                    value={shortcuts.toggleSidebar}
                    onChange={(e) => {
                      const next = { ...shortcuts, toggleSidebar: e.target.value };
                      setShortcuts(next);
                      localStorage.setItem('adminShortcuts', JSON.stringify(next));
                    }}
                    placeholder="例如：mod+b"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>聚焦搜索框</Label>
                  <Input
                    value={shortcuts.focusSearch}
                    onChange={(e) => {
                      const next = { ...shortcuts, focusSearch: e.target.value };
                      setShortcuts(next);
                      localStorage.setItem('adminShortcuts', JSON.stringify(next));
                    }}
                    placeholder="例如：mod+k"
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                支持组合键：mod(⌘/Ctrl) + shift + alt + 主键，如 mod+k, shift+mod+b
              </p>
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">系统设置</h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">启用 AI 客服</p>
                      <p className="text-sm text-gray-500">在前台页面右下角显示 AI 聊天窗口</p>
                    </div>
                    <Switch
                      checked={!!config.features?.enableChatbot}
                      onCheckedChange={(checked) => {
                        const prev = (config.features ||
                          {}) as Partial<
                          NonNullable<import('@/contexts/site-config-base').SiteConfig['features']>
                        >;
                        const next: NonNullable<
                          import('@/contexts/site-config-base').SiteConfig['features']
                        > = {
                          enableChatbot: checked,
                          enableAtsFloat: prev.enableAtsFloat ?? true,
                          atsFloatDefaultCollapsed:
                            prev.atsFloatDefaultCollapsed ?? false,
                        };
                        setFeatures(next);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">启用首页 ATS 浮窗</p>
                      <p className="text-sm text-gray-500">在首页右下角展示“AI 简历得分即时测试”入口</p>
                    </div>
                    <Switch
                      checked={config.features?.enableAtsFloat ?? true}
                      onCheckedChange={(checked) => {
                        const prev = (config.features ||
                          {}) as Partial<
                          NonNullable<import('@/contexts/site-config-base').SiteConfig['features']>
                        >;
                        const next: NonNullable<
                          import('@/contexts/site-config-base').SiteConfig['features']
                        > = {
                          enableChatbot: prev.enableChatbot ?? true,
                          enableAtsFloat: checked,
                          atsFloatDefaultCollapsed:
                            prev.atsFloatDefaultCollapsed ?? false,
                        };
                        setFeatures(next);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">默认收起 ATS 浮窗</p>
                      <p className="text-sm text-gray-500">仅显示一行提示条，点击后展开完整测分卡片</p>
                    </div>
                    <Switch
                      checked={config.features?.atsFloatDefaultCollapsed ?? false}
                      onCheckedChange={(checked) => {
                        const prev = (config.features ||
                          {}) as Partial<
                          NonNullable<import('@/contexts/site-config-base').SiteConfig['features']>
                        >;
                        const next: NonNullable<
                          import('@/contexts/site-config-base').SiteConfig['features']
                        > = {
                          enableChatbot: prev.enableChatbot ?? true,
                          enableAtsFloat: prev.enableAtsFloat ?? true,
                          atsFloatDefaultCollapsed: checked,
                        };
                        setFeatures(next);
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    保存设置
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
