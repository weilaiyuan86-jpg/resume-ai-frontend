import { 
  Handshake, Building2, GraduationCap, Briefcase, Users,
  ArrowRight, CheckCircle2,
  Mail, Phone, MapPin, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const partnerTypes = [
  {
    icon: Building2,
    title: '企业合作伙伴',
    description: '为员工提供专业的简历优化和职业发展服务',
    benefits: [
      '提升员工求职成功率',
      '降低招聘成本',
      '增强雇主品牌',
      '数据驱动的洞察',
    ],
  },
  {
    icon: GraduationCap,
    title: '教育机构',
    description: '帮助学生顺利进入职场，提升就业竞争力',
    benefits: [
      '提高毕业生就业率',
      '增强校友网络',
      '职业指导工具',
      '行业数据分析',
    ],
  },
  {
    icon: Briefcase,
    title: '招聘平台',
    description: '整合简历优化功能，提升用户体验',
    benefits: [
      '增加用户粘性',
      '差异化竞争优势',
      'API 轻松集成',
      '联合营销机会',
    ],
  },
  {
    icon: Users,
    title: '职业顾问',
    description: '为客户提供AI驱动的简历优化服务',
    benefits: [
      '提高工作效率',
      '扩大客户规模',
      '专业分析报告',
      '白标解决方案',
    ],
  },
];

const successStories = [
  {
    company: 'Tech University',
    type: '教育机构',
    quote: 'EvalShare 帮助我们的毕业生就业率提升了 35%。学生们反馈简历质量显著改善。',
    metric: '+35%',
    metricLabel: '就业率提升',
  },
  {
    company: 'Global HR Solutions',
    type: '招聘平台',
    quote: '集成 EvalShare 后，用户活跃度提升了 50%，简历投递转化率翻倍。',
    metric: '2x',
    metricLabel: '转化率提升',
  },
  {
    company: 'Fortune 500 Company',
    type: '企业客户',
    quote: '为员工提供 EvalShare 服务后，内部转岗成功率大幅提升，员工满意度创新高。',
    metric: '+60%',
    metricLabel: '转岗成功率',
  },
];

const integrationFeatures = [
  {
    title: 'RESTful API',
    description: '简单易用的 API，快速集成到您的平台',
  },
  {
    title: 'SSO 支持',
    description: '支持 SAML 和 OAuth 单点登录',
  },
  {
    title: '白标方案',
    description: '自定义品牌，无缝用户体验',
  },
  {
    title: '数据分析',
    description: '详细的使用数据和分析报告',
  },
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Handshake className="w-4 h-4" />
              <span>合作伙伴计划</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              成为合作伙伴
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              与 EvalShare 携手，共同帮助更多人实现职业梦想
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="gap-2">
                申请合作
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                了解更多
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Partner Types */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center mb-4">合作类型</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            无论您是企业、教育机构还是招聘平台，我们都有适合您的合作方案
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {partnerTypes.map((type) => (
              <div 
                key={type.title}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <type.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-muted py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-12">成功案例</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <div 
                  key={story.company}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{story.company}</h3>
                      <Badge variant="secondary" className="mt-1">{story.type}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{story.metric}</p>
                      <p className="text-xs text-muted-foreground">{story.metricLabel}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{story.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">轻松集成</h2>
              <p className="text-muted-foreground mb-8">
                我们的技术团队将全程支持您的集成过程，确保无缝的用户体验
              </p>
              <div className="space-y-4">
                {integrationFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="font-semibold mb-6">联系我们</h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">姓名</label>
                    <Input placeholder="您的姓名" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">公司</label>
                    <Input placeholder="公司名称" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">邮箱</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">合作类型</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-card">
                    <option>企业合作</option>
                    <option>教育机构</option>
                    <option>招聘平台</option>
                    <option>职业顾问</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">留言</label>
                  <textarea 
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card min-h-[100px] resize-none"
                    placeholder="请描述您的合作需求..."
                  />
                </div>
                <Button className="w-full">提交申请</Button>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-muted py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-12">联系方式</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 text-center border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">邮箱</h3>
                <p className="text-sm text-muted-foreground">partners@resumeai.com</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">电话</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">地址</h3>
                <p className="text-sm text-muted-foreground">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
