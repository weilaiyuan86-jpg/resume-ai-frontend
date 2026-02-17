import { createContext } from 'react'

export type NavItem = { name: string; href: string }
export type FooterLink = { name: string; href: string }
export type FooterColumn = { title: string; links: FooterLink[] }
export type SocialLink = { name: string; href: string }

export interface HeaderConfig {
  logo: string
  navItems: NavItem[]
}

export interface FooterConfig {
  columns: FooterColumn[]
  socialLinks: SocialLink[]
  copyright: string
}

export interface HomepageFeature {
  title: string
  description: string
}

export interface HomepageConfig {
  heroImage: string
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  features: HomepageFeature[]
}

export interface SiteConfig {
  header: HeaderConfig
  footer: FooterConfig
  homepage?: HomepageConfig
  features?: {
    enableChatbot: boolean
    enableAtsFloat: boolean
    atsFloatDefaultCollapsed: boolean
  }
  analytics?: {
    gaMeasurementId?: string
    gtmId?: string
  }
}

export interface SiteConfigContextType {
  config: SiteConfig
  setConfig: (next: SiteConfig) => void
  setHeader: (next: HeaderConfig) => void
  setFooter: (next: FooterConfig) => void
  setFeatures: (next: NonNullable<SiteConfig['features']>) => void
}

export const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined)
