import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, CheckCircle2, X, ChevronRight, 
  AlertTriangle, Lightbulb, Wand2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

interface AIPolishPanelProps {
  onApply: (polishedText: string) => void;
  onClose: () => void;
  originalText?: string;
}

interface PolishSuggestion {
  id: string;
  type: 'improvement' | 'warning' | 'suggestion';
  title: string;
  description: string;
  original?: string;
  improved?: string;
}

const mockSuggestions: PolishSuggestion[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Weak bullet point detected',
    description: '"Missing quantifiable metrics. Try: Accomplished [X] as measured by [Y], by doing [Z]."',
    original: 'Responsible for leading a team and fixed some bugs in the cloud platform.',
    improved: 'Spearheaded transition to microservices architecture, improving system scalability by 40% and reducing deployment time by 2 hours.',
  },
  {
    id: '2',
    type: 'improvement',
    title: 'AI 优化建议',
    description: '"建议使用更有影响力的动词，并增加量化成果以适应 ATS 系统。"',
    original: 'Led a cross-functional team of 10 to deliver a distributed cloud platform.',
    improved: 'Spearheaded a cross-functional team of 10 to architect a distributed cloud platform, resulting in 35% reduction in latency.',
  },
];

export default function AIPolishPanel({ onApply, onClose, originalText }: AIPolishPanelProps) {
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
  const [polishLevel, setPolishLevel] = useState<'standard' | 'impactful' | 'conservative'>('impactful');
  const keywordsByLevel: Record<string, string[]> = {
    impactful: ['Spearheaded', 'Engineered', 'Orchestrated', 'Accelerated', 'Optimized', 'Reduced'],
    standard: ['Led', 'Improved', 'Implemented', 'Developed'],
    conservative: ['Collaborated', 'Contributed', 'Supported', 'Ensured'],
  };
  const buildImproved = (input: string) => {
    const base = input || 'Delivered project results';
    const verbPool = keywordsByLevel[polishLevel];
    const seed = Array.from(base).reduce((acc, c) => acc + c.charCodeAt(0), 0) + (polishLevel === 'impactful' ? 3 : polishLevel === 'standard' ? 2 : 1);
    const verb = verbPool[seed % verbPool.length];
    const action = base.replace(/^([A-Za-z]+)/, verb);
    const metric = polishLevel === 'impactful' ? 'by 25%' : polishLevel === 'standard' ? 'by 15%' : 'by 8%';
    const extra = polishLevel === 'conservative' ? 'while aligning to ATS guidelines' : 'through cross-functional collaboration';
    return `${action}, increasing key metrics ${metric} ${extra}.`;
  };
  const initial = originalText ? [{
    id: 'gen-1',
    type: 'improvement' as const,
    title: 'AI 优化建议',
    description: (getPrompt('resume_polish') || '使用XYP法则优化') as string,
    original: originalText,
    improved: buildImproved(originalText),
  }] : mockSuggestions;
  const [activeSuggestion, setActiveSuggestion] = useState<PolishSuggestion | null>(initial[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [suggestions, setSuggestions] = useState<PolishSuggestion[]>(initial);
  const nativeScore = useMemo(() => polishLevel === 'impactful' ? 98 : polishLevel === 'standard' ? 95 : 92, [polishLevel]);
  const highlightImproved = (text?: string) => {
    if (!text) return null;
    const keys = keywordsByLevel[polishLevel];
    const parts = text.split(/(\b\S+\b)/);
    return (
      <span>
        {parts.map((p, i) => {
          const hit = keys.includes(p);
          const metric = /\b\d+%/.test(p);
          if (hit || metric) {
            return <mark key={i} className="bg-green-100 text-green-700 px-0.5 rounded">{p}</mark>;
          }
          return <span key={i}>{p}</span>;
        })}
      </span>
    );
  };
  const splitGroups = (text?: string) => {
    const t = text || '';
    const sentences = t.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    const cut = Math.max(1, Math.floor(sentences.length / 2));
    return {
      experience: sentences.slice(0, cut).join(' ').trim(),
      technical: sentences.slice(cut).join(' ').trim(),
    };
  };
  const computeMetrics = (text: string | undefined, level: typeof polishLevel) => {
    const stop: string[] = ['the','and','of','to','in','a','for','on','with','by','is','at','as','from','that','this','it','an','be'];
    const t = (text || '').toLowerCase();
    const tokens = t.split(/[^a-z]+/).filter(Boolean);
    const content = tokens.filter(w => !stop.includes(w));
    const uniqContent = Array.from(new Set(content));
    const lexicalDensity = tokens.length ? Math.min(100, Math.round((uniqContent.length / tokens.length) * 100)) : 0;
    const strongVerbs = Array.from(new Set([
      ...keywordsByLevel.impactful,
      ...keywordsByLevel.standard,
      ...keywordsByLevel.conservative,
    ].map(v => v.toLowerCase())));
    const present = strongVerbs.filter(v => t.includes(v.toLowerCase())).length;
    let verbStrength = strongVerbs.length ? Math.round((present / strongVerbs.length) * 100) : 0;
    verbStrength = Math.max(20, Math.min(100, verbStrength + (level === 'impactful' ? 10 : level === 'conservative' ? -5 : 0)));
    return { lexicalDensity, verbStrength };
  };
  const metrics = computeMetrics(activeSuggestion?.improved, polishLevel);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      const improved = buildImproved(originalText || '');
      const promptText = getPrompt('resume_polish') || '优化动词并增加量化成果';
      setSuggestions([
        {
          id: 'gen-1',
          type: 'improvement',
          title: 'AI 优化建议',
          description: promptText,
          original: originalText || 'Led a team to improve system performance.',
          improved,
        },
        ...mockSuggestions,
      ]);
      setActiveSuggestion({
        id: 'gen-1',
        type: 'improvement',
        title: 'AI 优化建议',
        description: promptText,
        original: originalText || '',
        improved,
      });
    }, 1500);
  };

  const handleApply = (suggestion: PolishSuggestion) => {
    if (suggestion.improved) {
      onApply(suggestion.improved);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'improvement':
        return <Sparkles className="w-5 h-5 text-brand-orange" />;
      case 'suggestion':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-brand-orange" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-red-50 border-red-200';
      case 'improvement':
        return 'bg-blue-50 border-blue-200';
      case 'suggestion':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[75vh]">
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-brand-orange/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">AI 简历进阶润色</h4>
            <p className="text-xs text-gray-500">US MARKET PRO · 基于 XYP 法则</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="p-3 overflow-y-auto">
        {!showResults ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <Wand2 className="w-8 h-8 text-brand-orange" />
            </div>
            <h5 className="font-medium text-gray-900 mb-2">让 AI 帮您优化这段描述</h5>
            <p className="text-sm text-gray-500 mb-4">
              AI 将分析您的描述，提供符合美国职场标准的优化建议
            </p>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  开始分析
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge>ATS Friendly</Badge>
                <Badge variant="outline">XYP Formula</Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">语言评分</span>
                <div className="w-40">
                  <Progress value={nativeScore} />
                </div>
                <span className="text-xs text-green-600">{nativeScore}% Perfected</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">词汇密度</p>
                <Progress value={metrics.lexicalDensity} />
                <p className="text-[11px] text-gray-400 mt-1">{metrics.lexicalDensity}% 内容词占比</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">动词强度</p>
                <Progress value={metrics.verbStrength} />
                <p className="text-[11px] text-gray-400 mt-1">{metrics.verbStrength}% 强势动词覆盖</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-2 rounded-lg border bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-2">原文（ORIGINAL CHINESE）</p>
                <div className="text-xs text-gray-700 whitespace-pre-line">{activeSuggestion?.original || originalText}</div>
              </div>
              <div className="p-2 rounded-lg border bg-emerald-50/30">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-600">AI 润色结果（AI OPTIMIZED）</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">ATS FRIENDLY</Badge>
                    <Badge variant="outline">XYP</Badge>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="rounded-lg border p-2 bg-white/60">
                    <p className="text-[11px] font-medium text-gray-600 mb-1">EXPERIENCE OPTIMIZATION</p>
                    <div className="text-xs text-gray-900 font-medium">
                      {highlightImproved(splitGroups(activeSuggestion?.improved).experience)}
                    </div>
                  </div>
                  <div className="rounded-lg border p-2 bg-white/60">
                    <p className="text-[11px] font-medium text-gray-600 mb-1">TECHNICAL PRECISION</p>
                    <div className="text-xs text-gray-900 font-medium">
                      {highlightImproved(splitGroups(activeSuggestion?.improved).technical)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <RadioGroup value={polishLevel} onValueChange={(v) => setPolishLevel(v as typeof polishLevel)} className="flex gap-3">
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="standard" />
                  适中
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="impactful" />
                  大厂风格（Impactful）
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="conservative" />
                  保守（ATS）
                </label>
              </RadioGroup>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const txt = activeSuggestion?.improved || '';
                    navigator.clipboard?.writeText(txt).catch(() => void 0);
                  }}
                >
                  复制内容
                </Button>
                <Button 
                  size="sm"
                  onClick={() => activeSuggestion && handleApply(activeSuggestion)}
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                >
                  应用到简历
                </Button>
              </div>
            </div>
            {/* Suggestions List */}
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => setActiveSuggestion(suggestion)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all ${
                    activeSuggestion?.id === suggestion.id 
                      ? 'border-brand-orange bg-brand-orange/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getTypeIcon(suggestion.type)}
                    <div className="flex-1">
                      <p className="font-medium text-xs text-gray-900">{suggestion.title}</p>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{suggestion.description}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      activeSuggestion?.id === suggestion.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Active Suggestion Detail */}
            {activeSuggestion && (
              <div className={`p-4 rounded-lg border ${getTypeColor(activeSuggestion.type)}`}>
                <p className="text-xs font-medium text-gray-500 mb-2">优化建议</p>
                
                {activeSuggestion.original && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">原文：</p>
                    <p className="text-sm text-gray-600 line-through">{activeSuggestion.original}</p>
                  </div>
                )}
                
                {activeSuggestion.improved && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-1">优化后：</p>
                    <p className="text-sm text-gray-900 font-medium">{activeSuggestion.improved}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handleApply(activeSuggestion)}
                    className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    应用优化
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveSuggestion(null)}
                  >
                    忽略
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-brand-orange hover:text-brand-orange/80"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                一键修复所有弱动词
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="px-3 py-2 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            2 项待核对
          </span>
          <span>14 项已自动清洗</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">放弃全部</button>
          <Button size="sm" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
            完成核对并应用
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
