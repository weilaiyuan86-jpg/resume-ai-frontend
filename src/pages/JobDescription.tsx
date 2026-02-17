import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building2, MapPin, Users, Sparkles, Wand2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function JobDescription() {
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [reportTo, setReportTo] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [idealProfile, setIdealProfile] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<string | null>(null);

  const API_BASE_URL = '/api';

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

  const handleGenerate = async () => {
    if (!jobTitle.trim()) return;
    setIsGenerating(true);
    const prompt = getPrompt('job_description') || '';
    const safeDepartment = department || '所属部门';
    const safeLocation = location || '工作地点';
    const safeReportTo = reportTo || '汇报对象';
    const respLines = responsibilities
      ? responsibilities.split('\n').map((value) => value.trim()).filter(Boolean)
      : [];
    const reqLines = requirements
      ? requirements.split('\n').map((value) => value.trim()).filter(Boolean)
      : [];
    const profileLines = idealProfile
      ? idealProfile.split('\n').map((value) => value.trim()).filter(Boolean)
      : [];

    try {
      const response = await fetch(`${API_BASE_URL}/ai/job-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          department,
          location,
          reportTo,
          responsibilities,
          requirements,
          idealProfile,
          prompt,
        }),
      });

      if (response.ok) {
        const data: { jd?: string } = await response.json();
        if (data.jd) {
          setGeneratedJD(data.jd);
          setIsGenerating(false);
          return;
        }
      }
    } catch (error) {
      console.error('job-description api error', error);
    }

    const jd = [
      `# ${jobTitle}`,
      '',
      `${safeDepartment} · ${safeLocation}`,
      '',
      '## 岗位概述',
      `我们正在寻找一位 ${jobTitle}，加入 ${safeDepartment} 团队，共同推动关键业务场景的落地与优化。该岗位将与产品、技术及业务同学紧密合作，在真实业务问题中创造可衡量的价值。`,
      '',
      '在这个角色中，你将有机会：',
      '- 参与从需求洞察到方案落地的完整闭环，持续打磨产品体验',
      '- 从数据与用户反馈出发，沉淀可复用的方法论与最佳实践',
      '- 在稳健的团队氛围中获得长期成长，而非短期刺激',
      '',
      '## 工作职责',
      ...(respLines.length
        ? respLines.map((line) => `- ${line}`)
        : [
            `- 负责与上下游团队协同，确保与 ${safeReportTo} 对齐目标与节奏`,
            '- 拆解业务问题并形成可执行的项目计划，按期推动落地',
            '- 基于数据与用户反馈持续迭代产品与流程',
            '- 沉淀标准化文档与知识库，提升团队整体效率',
          ]),
      '',
      '## 任职要求',
      ...(reqLines.length
        ? reqLines.map((line) => `- ${line}`)
        : [
            '- 本科及以上学历，具备与岗位匹配的专业背景或同等经验',
            '- 具备良好的结构化思考能力与清晰的书面、口头表达能力',
            '- 能够在不确定环境下保持节奏感与推动力',
            '- 关注长期职业发展，对领域有持续学习的兴趣',
          ]),
      '',
      '## 加分项',
      ...(profileLines.length
        ? profileLines.map((line) => `- ${line}`)
        : [
            '- 有在高速发展团队中的跨部门合作经验',
            '- 有从 0 到 1 或大规模重构项目的实战经历',
            '- 对本行业的业务模式、生态链有比较深入的理解',
          ]),
      '',
      '## 你将获得',
      '- 与优秀同事一起解决真实问题的机会，而非停留在概念层面',
      '- 公开透明的反馈文化与清晰的成长路径',
      '- 合理的工作节奏与可持续的产出预期',
      '',
      prompt
        ? '本职位描述基于后台配置的提示词进行撰写，已尽量保证语言自然、信息清晰，避免关键词堆砌，更适合发布在招聘官网与公开渠道。'
        : '如需更细致的文案风格控制，可以在后台「AI 配置」中为职位描述单独设置提示词。',
    ].join('\n');
    setGeneratedJD(jd);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-brand-gray-3/50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-brand-black">一键生成职位描述</h1>
              <span className="text-lg text-brand-orange">Job Description Generator</span>
            </div>
            <p className="text-brand-gray-2">
              根据岗位关键信息，生成结构化、易阅读且符合搜索引擎高质量内容要求的中文 JD。
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-brand-gray-2">
              <Badge variant="outline" className="border-brand-orange/20 text-brand-orange bg-brand-orange/5">
                更适合投放招聘官网与搜索结果页
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-brand-black flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand-orange" />
                    基本信息
                  </h3>
                  <Badge variant="outline" className="text-brand-gray-2 border-border">
                    必填项：职位名称
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-brand-gray-2 mb-1">职位名称</p>
                    <Input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="例如：高级前端工程师 / HRBP / 产品运营负责人"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-brand-gray-2 mb-1">所属部门 / 团队</p>
                      <Input
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="例如：增长产品部 / 人力资源部"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray-2 mb-1">工作地点</p>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="例如：北京 / 上海 / 远程"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray-2 mb-1">汇报对象</p>
                    <Input
                      value={reportTo}
                      onChange={(e) => setReportTo(e.target.value)}
                      placeholder="例如：向产品负责人汇报 / 向 HRD 汇报"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-brand-black flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand-orange" />
                    岗位重点
                  </h3>
                  <Badge variant="outline" className="text-brand-gray-2 border-border">
                    可选，建议列成要点
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-brand-gray-2 mb-1">主要工作职责</p>
                    <Textarea
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                      placeholder="每行一条，例如：\n- 负责核心业务模块的需求分析与产品设计\n- 跟进项目从立项到上线的完整流程"
                      className="min-h-[96px]"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray-2 mb-1">任职要求</p>
                    <Textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="每行一条，例如：\n- 统招本科及以上学历，3 年以上相关经验\n- 熟悉 B 端产品设计，有独立负责项目经验"
                      className="min-h-[96px]"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray-2 mb-1">理想候选人画像 / 加分项</p>
                    <Textarea
                      value={idealProfile}
                      onChange={(e) => setIdealProfile(e.target.value)}
                      placeholder="每行一条，例如：\n- 有互联网或 SaaS 行业经验\n- 有从 0 到 1 搭建团队或项目的经历"
                      className="min-h-[96px]"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !jobTitle.trim()}
                className="w-full h-14 bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange hover:to-orange-600 text-white text-lg gap-2 shadow-glow hover:shadow-glow-strong transition-all duration-300 ease-elastic hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    AI 正在生成 JD...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    生成职位描述
                  </>
                )}
              </Button>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-brand-gray-3/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-orange" />
                    <span className="text-sm text-brand-gray-2">候选人视角预览</span>
                    <span className="text-xs text-brand-gray-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-orange" />
                      {location || '暂未填写工作地点'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-brand-orange bg-brand-orange/5 border-brand-orange/20">
                      更易理解的 JD 结构
                    </Badge>
                  </div>
                </div>

                <div className="p-8 min-h-[560px]">
                  {generatedJD ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-brand-black leading-relaxed">
                        {generatedJD}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-brand-gray-2">
                      <Wand2 className="w-16 h-16 mb-4 opacity-30" />
                      <p>填写左侧信息后点击「生成职位描述」，这里将展示候选人可以直接阅读的 JD 文案。</p>
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
