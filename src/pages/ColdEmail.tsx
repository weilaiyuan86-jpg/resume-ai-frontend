import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Sparkles, User, Building2, Phone, Wand2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ColdEmail() {
  const [senderRole, setSenderRole] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [goal, setGoal] = useState('');
  const [commonGround, setCommonGround] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);

  const getPrompt = (key: string) => {
    const raw = localStorage.getItem('aiPrompts');
    if (!raw) return undefined;
    try {
      const data = JSON.parse(raw);
      return data?.[key] as string | undefined;
    } catch {
      return undefined;
    }
  };

  const handleGenerate = () => {
    if (!companyName.trim() || !goal.trim()) return;
    setIsGenerating(true);
    const prompt = getPrompt('cold_email') || '';
    const safeSenderRole = senderRole || '在美中国工程师';
    const safeRecipientRole = recipientRole || '招聘负责人';
    const safeCompanyName = companyName || '贵公司';
    const safeGoal = goal || '沟通潜在合作机会';
    const safeCommonGround =
      commonGround ||
      `关注 ${safeCompanyName} 已有一段时间，对近期发布的产品与团队方向很感兴趣`;
    const safeCta =
      callToAction || '如果方便的话，能否在未来几天内安排一次 15 分钟的电话沟通？';

    setTimeout(() => {
      const lines = [
        `主题：关于 ${safeCompanyName} ${safeGoal} 的简短自我介绍`,
        '',
        `${safeRecipientRole} 您好，`,
        '',
        `打扰了，我是一名 ${safeSenderRole}。由于长期关注 ${safeCompanyName}，一直对贵团队在行业中的产品方向与落地能力印象深刻，尤其是近期在公开渠道看到的相关动态，让我更加坚定想主动与您建立一次正式沟通的想法。`,
        '',
        `${safeCommonGround}，我相信自己在过往项目中沉淀的一些经验，可能与贵团队当前或不久的将来要解决的问题有一定契合度。`,
        '',
        `简单概括一下与 ${safeGoal} 相关的几段经历：`,
        '- 在跨区域、跨职能团队中推动过多方协同项目，对信息透明与节奏把控有较多实战经验',
        '- 在数据驱动的环境中，通过持续迭代实现了明确可量化的业务提升',
        '- 保持长期主义视角，更关注与团队共同成长与积累，而非一次性的短期机会',
        '',
        `${safeCta}`,
        '',
        '即使短期内没有合适机会，也非常感谢您耐心读完这封邮件。无论后续是否有进一步合作的可能，我都非常珍惜向您学习和了解团队的机会。',
        '',
        '祝工作顺利，期待您的回复。',
        '',
        '此致',
        '敬礼',
        '',
        '署名',
      ];
      if (prompt) {
        lines.push(
          '',
          '附：本邮件在生成时参考了后台配置的冷邮件提示词，已尽量避免标题党与过度营销用语，更关注准确表达动机与价值。'
        );
      }
      setGeneratedEmail(lines.join('\n'));
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">一键生成冷邮件</h1>
              <span className="text-lg text-blue-600">Cold Email Generator</span>
            </div>
            <p className="text-gray-600">
              为目标公司或潜在合作方生成一封语气真诚、信息具体、不过度营销的中文冷邮件正文。
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">
                更符合邮箱服务商和搜索引擎对高质量内容的判断
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    发件人与收件人
                  </h3>
                  <Badge variant="outline" className="text-gray-600 border-gray-200">
                    必填：目标公司与目的
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">发件人身份</p>
                    <Input
                      value={senderRole}
                      onChange={(e) => setSenderRole(e.target.value)}
                      placeholder="例如：在美中国工程师 / 初创公司联合创始人"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">收件人身份</p>
                      <Input
                        value={recipientRole}
                        onChange={(e) => setRecipientRole(e.target.value)}
                        placeholder="例如：招聘经理 / 技术负责人 / 合作伙伴"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">目标公司 / 团队</p>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="例如：Google / Stripe / 某 ToB SaaS 团队"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">目标职位或合作方向</p>
                    <Input
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="例如：沟通后端工程师岗位机会 / 探讨潜在渠道合作"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    关联点与行动
                  </h3>
                  <Badge variant="outline" className="text-gray-600 border-gray-200">
                    建议填写具体细节
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">与对方的关联点</p>
                    <Textarea
                      value={commonGround}
                      onChange={(e) => setCommonGround(e.target.value)}
                      placeholder="例如：校友 / 参加过同一会议 / 长期使用对方产品并有具体反馈"
                      className="min-h-[80px]"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">希望对方采取的行动</p>
                    <Textarea
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      placeholder="例如：在未来几天内抽空安排一次 15 分钟电话 / 将简历转交给招聘团队评估"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !companyName.trim() || !goal.trim()}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    AI 正在生成冷邮件...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    生成冷邮件
                  </>
                )}
              </Button>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">邮件预览</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      适配 Gmail / Outlook 等常见邮箱
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                      主题清晰，无标题党
                    </Badge>
                  </div>
                </div>

                <div className="p-8 min-h-[560px]">
                  {generatedEmail ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                        {generatedEmail}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <Wand2 className="w-16 h-16 mb-4 opacity-30" />
                      <p>填写左侧信息后点击「生成冷邮件」，这里将展示可直接复制进邮箱的正文内容。</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

