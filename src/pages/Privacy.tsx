import { Shield, Lock, Eye, FileText, User, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
  {
    icon: Eye,
    title: '信息收集',
    content: `我们收集的信息包括：

1. 账户信息：当您注册账户时，我们会收集您的姓名、邮箱地址、密码等基本信息。

2. 简历内容：您在使用我们的简历编辑服务时创建和上传的简历内容，包括个人信息、工作经历、教育背景、技能等。

3. 使用数据：我们自动收集您使用我们服务时的信息，包括访问时间、页面浏览记录、功能使用情况等。

4. 设备信息：我们收集您使用的设备类型、操作系统、浏览器类型等技术信息。`,
  },
  {
    icon: Lock,
    title: '信息使用',
    content: `我们使用您的信息用于以下目的：

1. 提供服务：使用您的信息来提供、维护和改进我们的简历生成和优化服务。

2. AI 优化：使用您的简历内容通过 AI 技术提供优化建议和改进方案。

3. 个性化体验：根据您的使用习惯和偏好，为您提供个性化的服务和推荐。

4. 客户支持：使用您的联系信息来响应您的咨询和提供技术支持。

5. 服务改进：分析使用数据以改进我们的产品和服务。`,
  },
  {
    icon: Shield,
    title: '信息保护',
    content: `我们采取多种安全措施来保护您的信息：

1. 数据加密：所有敏感数据在传输和存储过程中都使用行业标准的加密技术。

2. 访问控制：只有经过授权的人员才能访问您的个人信息。

3. 安全审计：我们定期进行安全审计和漏洞扫描，确保系统安全。

4. 数据备份：我们定期备份数据，防止数据丢失。

5. 合规认证：我们的服务符合 GDPR、CCPA 等国际隐私保护标准。`,
  },
  {
    icon: User,
    title: '您的权利',
    content: `根据适用的隐私法律，您拥有以下权利：

1. 访问权：您有权访问我们持有的关于您的个人信息。

2. 更正权：您有权要求更正不准确或不完整的个人信息。

3. 删除权：您有权要求删除您的个人信息（在某些情况下）。

4. 限制处理权：您有权限制我们对您个人信息的处理。

5. 数据可携带权：您有权以结构化、通用的格式获取您的数据。

6. 反对权：您有权反对我们处理您的个人信息。`,
  },
  {
    icon: Globe,
    title: '数据跨境传输',
    content: `我们的服务可能涉及数据跨境传输：

1. 服务器位置：我们的服务器主要位于美国，但可能使用全球 CDN 服务。

2. 第三方服务：我们可能使用位于其他国家的第三方服务提供商。

3. 数据传输保护：所有跨境数据传输都采用适当的保护措施。

4. 合规承诺：我们承诺遵守所有适用的数据保护法律和法规。`,
  },
  {
    icon: FileText,
    title: 'Cookie 政策',
    content: `我们使用 Cookie 和类似技术：

1. 必要 Cookie：用于网站的基本功能和安全性。

2. 功能 Cookie：用于记住您的偏好和设置。

3. 分析 Cookie：用于分析网站使用情况和改进服务。

4. 广告 Cookie：用于提供相关的广告内容（如适用）。

5. Cookie 控制：您可以通过浏览器设置控制 Cookie 的使用。`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>隐私政策</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              隐私政策
            </h1>
            <p className="text-lg text-gray-600">
              最后更新日期：2024年1月1日
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="py-12 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 leading-relaxed mb-6">
              EvalShare（"我们"、"我们的"或"本公司"）高度重视您的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
            </p>
            <p className="text-gray-600 leading-relaxed">
              使用我们的服务即表示您同意本隐私政策中描述的做法。如果您不同意本政策的任何部分，请停止使用我们的服务。
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="scroll-mt-24" id={`section-${index}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <div key={pIndex} className="mb-4">
                      {paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.') || paragraph.startsWith('5.') || paragraph.startsWith('6.') ? (
                        <ul className="space-y-2">
                          {paragraph.split('\n').map((item, iIndex) => (
                            <li key={iIndex} className="flex items-start gap-2 text-gray-600">
                              <span className="text-blue-600 font-medium">{item.split('.')[0]}.</span>
                              <span>{item.substring(item.indexOf('.') + 1).trim()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 leading-relaxed">{paragraph}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">联系我们</h2>
            <p className="text-gray-600 mb-6">
              如果您对本隐私政策有任何疑问或担忧，请随时与我们联系。
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:privacy@resumeai.com"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                privacy@resumeai.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
