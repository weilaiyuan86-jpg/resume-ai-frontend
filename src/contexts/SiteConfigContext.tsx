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
  heroTitle: 'AI简历评估诊断平台',
  heroSubtitle:
    '先诊断问题，再智能优化。基于 10万+ 美国大厂录取简历训练的求职成功率预测系统，让评估更准、诊断更深、优化更狠。',
  ctaText: '免费创建简历',
  features: [
    { title: 'AI智能评估', description: '先做深度简历体检与问题诊断' },
    { title: 'ATS检测', description: '检查是否符合主流 ATS 解析与筛选规则' },
    { title: '智能优化', description: '基于诊断结果一键生成针对性优化方案' },
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
