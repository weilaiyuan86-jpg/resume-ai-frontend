import { FileText, CheckCircle, AlertTriangle, Scale, RefreshCw, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
  {
    icon: CheckCircle,
    title: '接受条款',
    content: `通过访问和使用 ResumeAI（"本服务"），您同意受这些服务条款（"条款"）的约束。如果您不同意这些条款的任何部分，您不得访问或使用本服务。

我们保留随时修改这些条款的权利。修改后的条款将在本页面发布后立即生效。您继续使用本服务即表示您接受修改后的条款。`,
  },
  {
    icon: FileText,
    title: '服务描述',
    content: `ResumeAI 提供以下服务：

1. 简历生成和编辑工具
2. AI 驱动的简历优化建议
3. ATS 兼容性检测
4. 求职信生成
5. 面试准备资源
6. 职业发展内容

我们保留随时修改、暂停或终止任何服务的权利，恕不另行通知。`,
  },
  {
    icon: Scale,
    title: '用户责任',
    content: `使用本服务时，您同意：

1. 提供准确、完整和最新的个人信息
2. 维护您账户密码的机密性
3. 对您账户下的所有活动负责
4. 不得将本服务用于任何非法或未经授权的目的
5. 不得干扰或破坏本服务的正常运行
6. 不得尝试未经授权访问本服务的任何部分

您对您创建和上传的所有内容负全部责任。`,
  },
  {
    icon: AlertTriangle,
    title: '知识产权',
    content: `关于知识产权，您需要了解：

1. 本服务的所有内容、功能和设计均为 ResumeAI 的财产，受版权、商标和其他知识产权法律的保护。

2. 您保留您创建内容的知识产权。通过使用本服务，您授予我们非独占的、免版税的许可，以使用、修改和展示您的内容，仅用于提供和改进我们的服务。

3. 您不得复制、修改、分发、出售或出租本服务的任何部分，除非获得我们的明确书面许可。

4. 我们的商标和商业外观不得用于任何非 ResumeAI 的产品或服务。`,
  },
  {
    icon: RefreshCw,
    title: '订阅和付款',
    content: `关于订阅服务：

1. 某些服务可能需要付费订阅。订阅费用将在您订阅时明确说明。

2. 订阅将自动续期，除非您在当前计费周期结束前取消。

3. 您可以通过账户设置随时取消订阅。取消将在当前计费周期结束时生效。

4. 除非法律要求，否则订阅费用不予退还。

5. 我们保留随时调整价格的权利，但会提前通知现有订阅用户。`,
  },
  {
    icon: XCircle,
    title: '免责声明',
    content: `本服务按"原样"和"可用"的基础提供：

1. 我们不保证本服务将不间断、及时、安全或无错误。

2. 我们不保证通过本服务获得的结果的准确性或可靠性。

3. 您理解并同意，您使用本服务的风险由您自行承担。

4. 在法律允许的最大范围内，我们不对任何直接、间接、附带、特殊、后果性或惩罚性损害承担责任。

5. 我们的总责任不超过您在过去 12 个月内为本服务支付的金额。`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              <span>服务条款</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              服务条款
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
              欢迎使用 ResumeAI！这些服务条款（"条款"）构成您与 ResumeAI Inc.（"我们"、"我们的"或"公司"）之间的法律协议。
            </p>
            <p className="text-gray-600 leading-relaxed">
              请仔细阅读这些条款。通过访问或使用我们的服务，您确认您已阅读、理解并同意受这些条款的约束。
            </p>
          </div>
        </div>

        {/* Terms Sections */}
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
              如果您对这些服务条款有任何疑问，请随时与我们联系。
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:legal@resumeai.com"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                legal@resumeai.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
