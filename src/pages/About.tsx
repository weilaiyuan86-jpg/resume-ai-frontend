import { Sparkles, Target, Award, Globe, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const stats = [
  { value: '200K+', label: '简历生成' },
  { value: '50K+', label: '成功求职' },
  { value: '98%', label: 'ATS 通过率' },
  { value: '4.9', label: '用户评分' },
];

const values = [
  {
    icon: Target,
    title: '精准匹配',
    description: '基于 AI 技术深度分析职位要求，精准匹配关键词，让您的简历脱颖而出。',
  },
  {
    icon: Zap,
    title: '高效便捷',
    description: '从简历创建到投递追踪，一站式解决求职全流程，节省宝贵时间。',
  },
  {
    icon: Globe,
    title: '全球视野',
    description: '深度理解美国及全球职场文化，提供符合国际标准的求职解决方案。',
  },
  {
    icon: Award,
    title: '专业品质',
    description: '由资深 HR 和技术专家共同打造，确保每一份简历都达到专业水准。',
  },
];

const team = [
  {
    name: 'Alex Chen',
    role: '创始人 & CEO',
    bio: '前 Google 高级工程师，拥有 10 年硅谷工作经验',
    avatar: 'AC',
  },
  {
    name: 'Sarah Wang',
    role: '产品总监',
    bio: '前 LinkedIn 产品经理，专注用户体验设计',
    avatar: 'SW',
  },
  {
    name: 'Michael Liu',
    role: '技术负责人',
    bio: 'AI 领域专家，曾任职于多家顶级科技公司',
    avatar: 'ML',
  },
  {
    name: 'Emily Zhang',
    role: '内容策略师',
    bio: '资深职业顾问，帮助数千名求职者成功入职名企',
    avatar: 'EZ',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>关于我们</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              为全球求职者打造的
              <br />
              <span className="text-blue-600">精英简历平台</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ResumeAI 成立于 2020 年，致力于帮助全球求职者打造专业简历，
              通过 AI 技术优化求职体验，助力每一位用户实现职业梦想。
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">我们的使命</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              在 ResumeAI，我们相信每个人都值得拥有一份能够展现自己价值的简历。
              我们的使命是通过先进的 AI 技术，帮助求职者突破语言和文化的障碍，
              在竞争激烈的就业市场中脱颖而出。无论你是应届生还是资深专业人士，
              我们都致力于为你提供最专业、最便捷的求职解决方案。
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              我们的价值观
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              核心团队
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              准备好开始您的求职之旅了吗？
            </h2>
            <p className="text-gray-600 mb-8">
              加入 50,000+ 成功求职者的行列，让 ResumeAI 助您一臂之力
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/register"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                免费开始使用
              </a>
              <a
                href="/contact"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
