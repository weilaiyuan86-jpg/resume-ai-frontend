import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Twitter, Linkedin, Facebook, Instagram, 
  Mail, ArrowRight, Chrome, Download, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteConfig } from '@/hooks/useSiteConfig';

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Facebook: Facebook,
  Instagram: Instagram,
};

type ManagedPageStatus = 'draft' | 'published';

interface ManagedPage {
  slug: string;
  status: ManagedPageStatus;
}

export default function Footer() {
  const { config } = useSiteConfig();
  const footerColumns = config.footer.columns;
  const socialLinks = config.footer.socialLinks;
  const copyright = config.footer.copyright;
  const [pages] = useState<ManagedPage[] | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('adminPages');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as ManagedPage[];
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      console.error('Failed to parse adminPages from localStorage', e);
      return null;
    }
  });

  const isDraftPageLink = (href: string) => {
    if (!pages) return false;
    const slug = href.replace(/^\//, '').split(/[?#]/)[0];
    const page = pages.find((p) => p.slug === slug);
    return page ? page.status === 'draft' : false;
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Chrome Extension Banner */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-brand-orange flex items-center justify-center">
                <Chrome className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">EvalShare Chrome 插件</h3>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  一键优化 LinkedIn 简历，实时 ATS 评分，智能求职信生成
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                <span className="text-white font-medium">50,000+</span> 用户正在使用
              </div>
              <a
                href="/extension/resumeai-extension.zip"
                download="EvalShare-Extension.zip"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2 rounded-md"
              >
                <Download className="w-4 h-4" />
                免费安装
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                {config.header.logo || 'Resume'}<span className="text-brand-orange">{config.header.logo ? '' : 'AI'}</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              AI简历评估诊断平台：先诊断问题，再智能优化。基于 10万+ 美国大厂录取简历样本，预测求职成功率，让每一次投递更有把握。
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">订阅职业周报</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="输入您的邮箱"
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-brand-orange"
                  />
                </div>
                <Button className="bg-brand-orange hover:bg-brand-orange/90 px-4">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.name] ?? Sparkles;
                return (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center transition-all duration-300 hover:bg-brand-orange hover:scale-110"
                  aria-label={social.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
                )
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerColumns.map((col) => (
                <div key={col.title}>
                  <h3 className="font-semibold text-sm mb-4">{col.title}</h3>
                  <ul className="space-y-3">
                    {col.links
                      .filter((link) => !isDraftPageLink(link.href))
                      .map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.href}
                            className="text-sm text-gray-400 hover:text-brand-orange transition-colors"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              {copyright}
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-brand-orange transition-colors">
                隐私政策
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-brand-orange transition-colors">
                服务条款
              </Link>
              <Link to="/cookies" className="text-sm text-gray-500 hover:text-brand-orange transition-colors">
                Cookie设置
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
