import { useEffect, useState, type ReactNode } from 'react'
import {
  SiteConfigContext,
  type SiteConfig,
  type HeaderConfig,
  type FooterConfig,
  type HomepageConfig,
} from './site-config-base'

const STORAGE_KEY = 'siteConfig'

const defaultHomepage: HomepageConfig = {
  heroImage:
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
  heroTitle: '先诊断，再优化，面试率提升 217%',
  heroSubtitle:
    'AI 深度评估 28 个维度，精准定位简历问题，针对性优化提升竞争力。已帮助 3,000+ 留学生获得 Google、Amazon、Meta 等大厂面试。',
  ctaText: '免费诊断简历（30 秒出结果）',
  features: [
    { title: '结构排版诊断', description: '识别双栏、表格等影响 ATS 解析的问题版式' },
    { title: 'ATS 匹配度评估', description: '对照目标 JD 评估通过 ATS 的概率' },
    { title: '关键词覆盖分析', description: '找出职位要求但简历中缺失的重要关键词' },
    { title: '语言表达打磨', description: '用数据化语言突出结果与影响力' },
  ],
}

const defaultConfig: SiteConfig = {
  header: {
    logo: 'EvalShare',
    navItems: [
      { name: '首页', href: '/' },
      { name: 'ATS检测', href: '/ats-checker' },
      { name: '简历编辑', href: '/resume-editor' },
      { name: '求职路线图', href: '/job-goal-planner' },
      { name: '投递追踪', href: '/job-tracker' },
      { name: '模板库', href: '/templates' },
      { name: '博客', href: '/blog' },
    ],
  },
  footer: {
    columns: [
      {
        title: '产品',
        links: [
          { name: 'ATS检测', href: '/ats-checker' },
          { name: '简历编辑器', href: '/resume-editor' },
          { name: '投递追踪', href: '/job-tracker' },
          { name: '模板库', href: '/templates' },
          { name: 'AI面试', href: '/ai-interview' },
          { name: '求职信生成', href: '/cover-letter' },
          { name: '职位描述生成', href: '/job-description' },
          { name: '冷邮件生成', href: '/cold-email' },
        ],
      },
      {
        title: '资源',
        links: [
          { name: '职业博客', href: '/blog' },
          { name: '面试题库', href: '/interview-prep' },
          { name: '薪资指南', href: '/salary-guide' },
          { name: '签证资讯', href: '/visa-info' },
        ],
      },
      {
        title: '公司',
        links: [
          { name: '关于我们', href: '/about' },
          { name: '联系我们', href: '/contact' },
          { name: '加入我们', href: '/careers' },
          { name: '合作伙伴', href: '/partners' },
        ],
      },
      {
        title: '法律',
        links: [
          { name: '隐私政策', href: '/privacy' },
          { name: '服务条款', href: '/terms' },
          { name: 'Cookie政策', href: '/cookies' },
        ],
      },
    ],
    socialLinks: [
      { name: 'LinkedIn', href: '#' },
      { name: 'Twitter', href: '#' },
      { name: 'Facebook', href: '#' },
      { name: 'Instagram', href: '#' },
    ],
    copyright: `© ${new Date().getFullYear()} EvalShare. 保留所有权利。`,
  },
  homepage: defaultHomepage,
  features: {
    enableChatbot: true,
    enableAtsFloat: true,
    atsFloatDefaultCollapsed: false,
    enableHomepagePricing: true,
    enableHomepageTestimonials: true,
    enableHomepageHowItWorks: true,
  },
  analytics: {
    gaMeasurementId: '',
    gtmId: '',
  },
}

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<SiteConfig>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as SiteConfig
          const merged: SiteConfig = {
            ...defaultConfig,
            ...parsed,
            homepage: parsed.homepage || defaultHomepage,
            features: {
              ...defaultConfig.features,
              ...(parsed.features || {}),
            } as NonNullable<SiteConfig['features']>,
            analytics: {
              ...defaultConfig.analytics,
              ...(parsed.analytics || {}),
            },
          }
          return merged
        } catch (e) {
          console.error('Failed to parse siteConfig from localStorage', e)
        }
      }
    }
    return defaultConfig
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const setConfig = (next: SiteConfig) => {
    setConfigState(next)
  }

  const setHeader = (next: HeaderConfig) => {
    setConfigState(prev => ({ ...prev, header: next }))
  }

  const setFooter = (next: FooterConfig) => {
    setConfigState(prev => ({ ...prev, footer: next }))
  }

  const setFeatures = (next: NonNullable<SiteConfig['features']>) => {
    setConfigState(prev => ({ ...prev, features: next }))
  }

  return (
    <SiteConfigContext.Provider value={{ config, setConfig, setHeader, setFooter, setFeatures }}>
      {children}
    </SiteConfigContext.Provider>
  )
}
