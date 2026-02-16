import { Cookie, Settings, Shield, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const cookieTypes = [
  {
    name: '必要 Cookie',
    description: '这些 Cookie 对于网站的正常运行至关重要，无法在我们的系统中关闭。',
    examples: ['会话 Cookie', '安全 Cookie', '负载均衡 Cookie'],
    required: true,
  },
  {
    name: '功能 Cookie',
    description: '这些 Cookie 使网站能够提供增强的功能和个性化体验。',
    examples: ['语言偏好', '主题设置', '用户偏好'],
    required: false,
  },
  {
    name: '分析 Cookie',
    description: '这些 Cookie 帮助我们了解访问者如何与网站互动，发现错误并改进服务。',
    examples: ['Google Analytics', 'Mixpanel', 'Hotjar'],
    required: false,
  },
  {
    name: '广告 Cookie',
    description: '这些 Cookie 用于提供与您相关的广告，并衡量广告活动的效果。',
    examples: ['Facebook Pixel', 'Google Ads', 'LinkedIn Insight'],
    required: false,
  },
];

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Cookie className="w-4 h-4" />
              <span>Cookie 政策</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cookie 政策
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
              本 Cookie 政策解释了 ResumeAI（"我们"、"我们的"或"公司"）如何使用 Cookie 和类似技术来识别您何时访问我们的网站，以及我们如何使用这些信息。
            </p>
            <p className="text-gray-600 leading-relaxed">
              使用我们的服务即表示您同意我们按照本政策所述使用 Cookie。您可以随时通过浏览器设置管理您的 Cookie 偏好。
            </p>
          </div>
        </div>

        {/* What are Cookies */}
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">什么是 Cookie？</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookie 是在您访问网站时存储在您计算机或移动设备上的小型文本文件。它们被广泛用于使网站正常工作或更高效地工作，以及向网站所有者提供信息。
            </p>
            <p className="text-gray-600 leading-relaxed">
              Cookie 可以存储各种信息，包括您的偏好、登录状态、购物车内容等。它们不会损害您的设备，也不会包含病毒。
            </p>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">我们使用的 Cookie 类型</h2>
            </div>
            
            <div className="space-y-6">
              {cookieTypes.map((type, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </div>
                    {type.required ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        必需
                      </span>
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, eIndex) => (
                      <span key={eIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Managing Cookies */}
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">如何管理 Cookie</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              大多数网络浏览器允许您通过浏览器设置控制 Cookie。以下是一些常见浏览器的 Cookie 管理指南：
            </p>
            <ul className="space-y-3 mb-6">
              {[
                { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer' },
                { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471' },
                { name: 'Microsoft Edge', url: 'https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
              ].map((browser, index) => (
                <li key={index}>
                  <a
                    href={browser.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {browser.name} Cookie 设置
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed">
              请注意，禁用某些 Cookie 可能会影响我们网站的功能和您的用户体验。
            </p>
          </div>
        </div>

        {/* Third Party Cookies */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">第三方 Cookie</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              我们可能会使用第三方服务提供商来帮助我们分析和改进我们的服务。这些第三方可能会在您访问我们的网站时设置自己的 Cookie。
            </p>
            <p className="text-gray-600 leading-relaxed">
              我们使用的第三方服务包括 Google Analytics、Mixpanel 和 Hotjar。这些服务有自己的隐私政策，我们建议您阅读这些政策以了解他们如何使用您的信息。
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">联系我们</h2>
            <p className="text-gray-600 mb-6">
              如果您对本 Cookie 政策有任何疑问，请随时与我们联系。
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
