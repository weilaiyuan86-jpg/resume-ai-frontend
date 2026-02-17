import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, FileText, Download, Wand2, 
  Lightbulb, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ResumeHighlights {
  skills: string[];
  experience: string;
  education: string;
}

interface JobAnalysis {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  keywords: string[];
}

const API_BASE_URL = '/api';

export default function CoverLetter() {
  const [tone, setTone] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [modelLabel, setModelLabel] = useState<string | null>(null);

  const resumeHighlights: ResumeHighlights = {
    skills: ['Full-stack Dev', 'Python', 'AWS'],
    experience: '5 年 (Senior)',
    education: 'MS, CS (US State)',
  };

  const jobAnalysis: JobAnalysis = {
    title: 'Senior Software Engineer',
    company: 'Google Inc.',
    location: 'Mountain View, CA',
    matchScore: 92,
    keywords: ['Distributed Systems', 'Scalability', 'Golang'],
  };

  const loadModelLabel = () => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('aiModelSettings');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { model?: string };
      return typeof parsed.model === 'string' ? parsed.model : null;
    } catch {
      return null;
    }
  };

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
    setIsGenerating(true);
    const currentModel = loadModelLabel();
    setModelLabel(currentModel);
    const prompt = getPrompt('cover_letter') || '';
    const toneLabel = tone < 33 ? 'Safe' : tone > 66 ? 'Bold' : 'Neutral';

    try {
      const response = await fetch(`${API_BASE_URL}/ai/cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tone,
          prompt,
          modelLabel: currentModel,
          resumeHighlights,
          jobAnalysis,
        }),
      });

      if (response.ok) {
        const data: { letter?: string; meta?: { modelLabel?: string } } = await response.json();
        if (data.letter) {
          setGeneratedLetter(data.letter);
          if (data.meta?.modelLabel) {
            setModelLabel(data.meta.modelLabel);
          }
          setIsGenerating(false);
          return;
        }
      }
    } catch (error) {
      console.error('cover-letter api error', error);
    }

    const fallbackLetter = `Dear Hiring Manager,
      
${resumeHighlights.experience} experience in ${resumeHighlights.skills.join(', ')} aligns with ${jobAnalysis.company}'s needs for a ${jobAnalysis.title}.

${prompt ? 'AI提示: ' + prompt.slice(0, 160) + '...' : '基于标准美式求职信格式生成'}

关键词匹配: ${jobAnalysis.keywords.join(', ')}。语气: ${toneLabel}.
${currentModel ? `\n模型: ${currentModel}` : ''}

Sincerely,
Alex Zhang`;
    setGeneratedLetter(fallbackLetter);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-brand-gray-3/50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-brand-black">一键生成求职信</h1>
              <span className="text-lg text-brand-orange">Cover Letter Generator</span>
            </div>
            <p className="text-brand-gray-2">
              基于您的简历和目标职位，AI 将为您定制一份符合美国职场标准的求职信。
            </p>
            {modelLabel && (
              <p className="mt-1 text-xs text-brand-gray-2">
                当前 AI 模型：{modelLabel}（可在后台“AI 配置”中调整）
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Panel - Input */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resume Highlights */}
              <div className="bg-white rounded-xl border border-border shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-brand-black flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-orange" />
                    您的简历亮点
                  </h3>
                  <Badge variant="outline" className="text-brand-orange border-brand-orange/20 bg-brand-orange/5">
                    已同步最新版
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-brand-gray-2 uppercase mb-2">核心技能</p>
                    <div className="flex flex-wrap gap-2">
                      {resumeHighlights.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-brand-gray-3 rounded-full text-sm text-brand-gray-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-brand-gray-2 uppercase mb-1">工作年限</p>
                      <p className="text-sm font-medium text-brand-black">{resumeHighlights.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray-2 uppercase mb-1">最高学历</p>
                      <p className="text-sm font-medium text-brand-black">{resumeHighlights.education}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Analysis */}
              <div className="bg-white rounded-xl border border-border shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-brand-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-orange" />
                    目标岗位分析
                  </h3>
                  <Badge className="bg-brand-orange/10 text-brand-orange">
                    {jobAnalysis.matchScore}% 匹配度
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-2 border-brand-orange pl-3">
                    <p className="font-medium text-brand-black">{jobAnalysis.title}</p>
                    <p className="text-sm text-brand-gray-2">{jobAnalysis.company} | {jobAnalysis.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-brand-gray-2 uppercase mb-2">职位关键词</p>
                    <div className="flex flex-wrap gap-2">
                      {jobAnalysis.keywords.map((keyword) => (
                        <span key={keyword} className="px-2 py-1 bg-brand-orange/10 text-brand-orange rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tone Selector */}
              <div className="bg-white rounded-xl border border-border shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-brand-gray-2">语气调节:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${tone < 50 ? 'text-brand-orange font-medium' : 'text-brand-gray-2'}`}>
                      稳重 (Safe)
                    </span>
                    <Slider 
                      value={[tone]} 
                      onValueChange={(v) => setTone(v[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className={`text-sm ${tone >= 50 ? 'text-brand-orange font-medium' : 'text-brand-gray-2'}`}>
                      亮眼 (Bold)
                    </span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange hover:to-orange-600 text-white text-lg gap-2 shadow-glow hover:shadow-glow-strong transition-all duration-300 ease-elastic hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    AI 正在生成...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    GENERATE
                  </>
                )}
              </Button>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-brand-gray-3/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-brand-gray-2">语气调节:</span>
                    <span className="text-sm text-brand-gray-2">稳重 (Safe)</span>
                    <div className="w-20 h-2 bg-brand-gray-3 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-brand-orange" />
                    </div>
                    <span className="text-sm text-brand-orange font-medium">亮眼 (Bold)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1 border-border">
                      <FileText className="w-4 h-4" />
                      PDF
                    </Button>
                    <Button size="sm" className="gap-1 bg-brand-orange hover:bg-brand-orange/90 text-white">
                      <Download className="w-4 h-4" />
                      Word 下载
                    </Button>
                  </div>
                </div>

                {/* Letter Content */}
                <div className="p-8 min-h-[600px]">
                    {generatedLetter ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-serif text-brand-black leading-relaxed">
                        {generatedLetter}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-brand-gray-2">
                      <Wand2 className="w-16 h-16 mb-4 opacity-30" />
                      <p>点击左侧生成按钮，AI 将为您生成求职信</p>
                    </div>
                  )}
                </div>

                {/* AI Suggestion */}
                {generatedLetter && (
                  <div className="px-4 py-3 border-t bg-brand-orange/5">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-brand-orange mt-0.5" />
                      <p className="text-sm text-brand-black">
                        <span className="font-medium">AI 建议：</span>
                        我们为您强化了关于"分布式系统"的关键词匹配，这符合 JD 中的高优先级要求。
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              {generatedLetter && (
                <div className="mt-4 bg-white rounded-xl border border-border shadow-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-brand-orange" />
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-black">快速提示</h4>
                      <p className="text-sm text-brand-gray-2 mt-1">
                        生成的求职信采用了标准的"三段式"美式商务格式。建议在导出前微调第二段中的具体项目案例。
                      </p>
                      <button className="mt-2 text-sm text-brand-orange hover:text-brand-orange/90 flex items-center gap-1">
                        了解更多技巧
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
