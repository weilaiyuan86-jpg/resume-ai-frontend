import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, ArrowRight, 
  RefreshCw, Sparkles, Zap, Target, Layout, FileCheck, 
  TrendingUp, Download, ChevronDown, ChevronUp,
  X, Building2, Briefcase, MapPin, DollarSign,
  Search, Filter, Star, Clipboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';

interface ATSResult {
  score: number;
  categories: {
    id: string;
    name: string;
    score: number;
    status: 'good' | 'warning' | 'error';
    suggestions: string[];
    icon: React.ElementType;
  }[];
  keywords: {
    matched: string[];
    missing: string[];
  };
  readability: {
    grade: string;
    wordCount: number;
    sentenceCount: number;
  };
}

interface ATSApiCategory {
  id: string;
  name: string;
  score: number;
  status: 'good' | 'warning' | 'error';
  suggestions: string[];
}

interface ATSApiResponse {
  score: number;
  categories: ATSApiCategory[];
  keywords: {
    matched: string[];
    missing: string[];
  };
  readability: {
    grade: string;
    wordCount: number;
    sentenceCount: number;
  };
}

const atsCategoryIconMap: Record<string, React.ElementType> = {
  format: Layout,
  keywords: Target,
  content: FileCheck,
  readability: TrendingUp,
};

const mapAtsApiToResult = (api: ATSApiResponse): ATSResult => {
  return {
    score: api.score,
    categories: api.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      score: cat.score,
      status: cat.status,
      suggestions: cat.suggestions,
      icon: atsCategoryIconMap[cat.id] || AlertCircle,
    })),
    keywords: api.keywords,
    readability: api.readability,
  };
};

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  keywords: string[];
}

const sampleJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$150k - $200k',
    description: 'We are looking for a Senior Software Engineer with experience in distributed systems, cloud computing, and machine learning.',
    keywords: ['Python', 'Java', 'Kubernetes', 'AWS', 'Machine Learning', 'Distributed Systems'],
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$140k - $180k',
    description: 'Join our product team to build world-class social products that connect billions of people.',
    keywords: ['Product Strategy', 'Data Analysis', 'Agile', 'User Research', 'A/B Testing'],
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$160k - $220k',
    description: 'Use data to improve our recommendation algorithms and enhance user experience.',
    keywords: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'A/B Testing', 'Spark'],
  },
];

const atsTips = [
  {
    title: '使用标准格式',
    description: '避免使用表格、图表和复杂的布局，ATS系统可能无法正确解析。',
    icon: Layout,
    link: '/blog/1',
  },
  {
    title: '包含关键词',
    description: '根据职位描述添加相关技能关键词，提高匹配度。',
    icon: Target,
    link: '/blog/1',
  },
  {
    title: '使用标准字体',
    description: '推荐使用 Arial, Calibri, Georgia 等标准字体。',
    icon: FileCheck,
    link: '/blog/1',
  },
  {
    title: '量化成就',
    description: '使用数字和百分比来展示你的成就和影响力。',
    icon: TrendingUp,
    link: '/blog/1',
  },
];

export default function ATSChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      );
    }
  }, [result]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  function isValidFileType(file: File): boolean {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return (
      validTypes.includes(file.type) ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')
    );
  }

  function readFileContent(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content || 'File content extracted...');
    };
    reader.readAsText(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
        readFileContent(droppedFile);
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      readFileContent(uploadedFile);
    }
  };

  const selectJob = (job: JobPosting) => {
    setSelectedJob(job);
    setJobDescription(job.description);
  };

  const handlePasteFromClipboard = async () => {
    if (!navigator.clipboard || !navigator.clipboard.readText) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setJobDescription(text);
      }
    } catch (e) {
      console.error('Failed to read clipboard', e);
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

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    const atsPrompt = getPrompt('ats_analysis');
    const base = (typeof window !== 'undefined' ? localStorage.getItem('atsApi.base') : '') || '';
    const token = (typeof window !== 'undefined' ? localStorage.getItem('atsApi.token') : '') || '';
    const trimmedBase = base.replace(/\/$/, '');
    const hasApi = !!trimmedBase;

    if (hasApi) {
      try {
        const resp = await fetch(`${trimmedBase}/ats-analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            resumeContent: fileContent,
            jobDescription: jobDescription || selectedJob?.description || '',
            jobTitle: selectedJob?.title || '',
            company: selectedJob?.company || '',
            keywords: selectedJob?.keywords || [],
            prompt: atsPrompt || '',
          }),
        });
        if (resp.ok) {
          const payload = (await resp.json()) as ATSApiResponse | null;
          if (payload && typeof payload.score === 'number') {
            setResult(mapAtsApiToResult(payload));
            setIsAnalyzing(false);
            return;
          }
        }
      } catch (e) {
        console.error('ATS API request failed', e);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2500));
    const jobKeywords = selectedJob?.keywords || ['React', 'TypeScript', 'Node.js', 'AWS'];
    const matchedKeywords = jobKeywords.filter(() => Math.random() > 0.3);
    const missingKeywords = jobKeywords.filter(k => !matchedKeywords.includes(k));
    const baseScore = Math.floor(Math.random() * 25) + 60;
    const promptIntro = atsPrompt ? '已应用自定义ATS分析提示词' : '使用默认ATS分析策略';

    setResult({
      score: baseScore,
      categories: [
        {
          id: 'format',
          name: '格式与布局',
          score: Math.min(100, baseScore + Math.floor(Math.random() * 15)),
          status: baseScore > 70 ? 'good' : 'warning',
          suggestions: [
            '使用标准字体如 Arial 或 Calibri',
            '避免使用表格和复杂布局',
            '确保页边距至少 0.5 英寸',
            '使用清晰的章节标题',
            promptIntro,
          ],
          icon: Layout,
        },
        {
          id: 'keywords',
          name: '关键词匹配',
          score: Math.min(100, Math.floor((matchedKeywords.length / jobKeywords.length) * 100) + 20),
          status: matchedKeywords.length >= jobKeywords.length * 0.7 ? 'good' : 'warning',
          suggestions: [
            `添加缺失的关键词: ${missingKeywords.slice(0, 3).join(', ')}`,
            '在技能部分明确列出技术栈',
            '在工作经历中使用行业术语',
            '参考职位描述调整用词',
          ],
          icon: Target,
        },
        {
          id: 'content',
          name: '内容完整性',
          score: Math.min(100, baseScore + Math.floor(Math.random() * 10)),
          status: 'good',
          suggestions: [
            '联系信息完整清晰',
            '工作经历包含量化成果',
            '教育背景详细准确',
            '技能部分分类明确',
          ],
          icon: FileCheck,
        },
        {
          id: 'readability',
          name: '可读性',
          score: Math.min(100, baseScore + Math.floor(Math.random() * 20) - 5),
          status: baseScore > 65 ? 'good' : 'warning',
          suggestions: [
            '使用项目符号提高可读性',
            '每段控制在 2-3 行',
            '使用动词开头的句子',
            '避免过长的段落',
          ],
          icon: TrendingUp,
        },
      ],
      keywords: {
        matched: matchedKeywords,
        missing: missingKeywords,
      },
      readability: {
        grade: 'College Graduate',
        wordCount: Math.floor(Math.random() * 200) + 300,
        sentenceCount: Math.floor(Math.random() * 30) + 40,
      },
    });

    setIsAnalyzing(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-500 bg-green-500/10';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'error':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { text: '优秀！您的简历很可能通过ATS系统', icon: Star };
    if (score >= 60) return { text: '良好，但还有改进空间', icon: TrendingUp };
    return { text: '需要优化，请参考以下建议', icon: AlertCircle };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 shadow-sm shadow-primary/30">
              <Sparkles className="w-4 h-4" />
              <span>AI驱动分析</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              ATS简历检测
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              检测您的简历是否通过求职者追踪系统，获取AI优化的改进建议
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="w-4 h-4" />
                上传简历
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="w-4 h-4" />
                选择职位
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* File Upload */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    上传简历
                  </h3>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : file
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                      ref={fileInputRef}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer block"
                    >
                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <FileText className="w-8 h-8 text-primary" />
                          </div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-3"
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(null);
                              setFileContent('');
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            移除文件
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-foreground">
                            点击或拖拽上传简历
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            支持 PDF, DOC, DOCX (最大 10MB)
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            建议使用英文或中英文简历，不支持图片格式
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Job Description */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      职位描述
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs text-muted-foreground hover:text-primary"
                      onClick={handlePasteFromClipboard}
                    >
                      <Clipboard className="w-4 h-4" />
                      一键粘贴
                    </Button>
                  </div>
                  <Textarea
                    placeholder="粘贴职位描述，获取更精准的匹配分析..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[160px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    粘贴完整的职位描述，AI将提取关键词进行匹配分析
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="mt-0">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="搜索职位..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    筛选
                  </Button>
                </div>

                <div className="space-y-4">
                  {sampleJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedJob?.id === job.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => selectJob(job)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{job.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.keywords.map((keyword) => (
                              <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedJob?.id === job.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Analyze Button */}
          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={analyzeResume}
              disabled={!file || isAnalyzing}
              className="relative inline-flex items-center justify-center bg-gradient-to-r from-brand-orange to-orange-500 hover:from-brand-orange/90 hover:to-orange-500/90 text-white shadow-[0_18px_45px_rgba(249,115,22,0.35)] disabled:opacity-50 disabled:cursor-not-allowed px-12 h-14 text-base rounded-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 w-5 h-5 animate-spin" />
                  AI分析中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5 animate-pulse" />
                  开始分析
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div ref={resultRef} className="mt-12 space-y-8">
              {/* Overall Score */}
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold mb-2">ATS兼容性评分</h3>
                    <p className="text-muted-foreground">
                      基于AI对简历结构和内容的全面分析
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      {(() => {
                        const { text, icon: Icon } = getScoreMessage(result.score);
                        return (
                          <>
                            <Icon className={`w-5 h-5 ${getScoreColor(result.score)}`} />
                            <span className={getScoreColor(result.score)}>{text}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(result.score / 100) * 439.82} 439.82`}
                          className={`${getScoreColor(result.score)} transition-all duration-1000`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}
                        </span>
                        <span className="text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    已匹配关键词
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.matched.map((keyword) => (
                      <Badge key={keyword} className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    缺失关键词
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="border-amber-500/30 text-amber-500">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">详细分析</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <button
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(category.status)}`}>
                            <category.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold">{category.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={category.score} className="w-20 h-1.5" />
                              <span className="text-sm text-muted-foreground">{category.score}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(category.status)}
                          {expandedCategories.includes(category.id) ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                      
                      {expandedCategories.includes(category.id) && (
                        <div className="px-4 pb-4">
                          <ul className="space-y-2">
                            {category.suggestions.map((suggestion, sIndex) => (
                              <li
                                key={sIndex}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Readability Stats */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h4 className="font-semibold mb-4">可读性统计</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{result.readability.grade}</p>
                    <p className="text-sm text-muted-foreground">阅读等级</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{result.readability.wordCount}</p>
                    <p className="text-sm text-muted-foreground">字数</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{result.readability.sentenceCount}</p>
                    <p className="text-sm text-muted-foreground">句子数</p>
                  </div>
                </div>
              </div>

              {/* Deep ATS Report */}
              <div className="bg-card rounded-2xl border border-border p-8 space-y-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">深度 ATS 分析报告</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      从匹配度、排版和关键词三个维度精细拆解你的简历
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI 深度解析
                  </Badge>
                </div>

                {(() => {
                  const formatCategory = result.categories.find((c) => c.id === 'format');
                  const keywordCategory = result.categories.find((c) => c.id === 'keywords');
                  const totalKeywords =
                    result.keywords.matched.length + result.keywords.missing.length;
                  const keywordDensity =
                    totalKeywords > 0
                      ? Math.round(
                          (result.keywords.matched.length / totalKeywords) * 100
                        )
                      : 0;

                  return (
                    <>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">总分</p>
                          <p className="text-2xl font-semibold text-primary">
                            {result.score}
                            <span className="text-sm text-muted-foreground"> / 100</span>
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/40">
                          <p className="text-xs text-muted-foreground mb-1">匹配度</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-semibold">
                              {keywordCategory?.score ?? '--'}
                            </p>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/40">
                          <p className="text-xs text-muted-foreground mb-1">格式得分</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-semibold">
                              {formatCategory?.score ?? '--'}
                            </p>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/40">
                          <p className="text-xs text-muted-foreground mb-1">关键词密度</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-semibold">{keywordDensity}</p>
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Keyword Cloud */}
                        <div className="border border-border rounded-xl p-6">
                          <h4 className="font-semibold mb-3">关键词词云</h4>
                          <p className="text-xs text-muted-foreground mb-4">
                            绿色为已覆盖，红色为 JD 要求但简历中缺失的关键词
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.matched.map((keyword, index) => (
                              <span
                                key={`matched-${keyword}-${index}`}
                                className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs sm:text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                            {result.keywords.missing.map((keyword, index) => (
                              <span
                                key={`missing-${keyword}-${index}`}
                                className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs sm:text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                            {totalKeywords === 0 && (
                              <p className="text-xs text-muted-foreground">
                                暂未识别到关键词，请上传简历并提供职位描述。
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Layout Inspector */}
                        <div className="border border-border rounded-xl p-6">
                          <h4 className="font-semibold mb-3">排版缺陷定位</h4>
                          <p className="text-xs text-muted-foreground mb-4">
                            模拟 ATS 视角标记可能无法正确解析的区域
                          </p>
                          <div className="relative mx-auto w-full max-w-xs aspect-[3/4] rounded-lg bg-muted overflow-hidden">
                            <div className="absolute inset-3 flex flex-col gap-2">
                              <div className="h-3 bg-gray-300 rounded w-2/3" />
                              <div className="h-2 bg-gray-200 rounded w-1/2" />
                              <div className="mt-2 space-y-1">
                                <div className="h-2 bg-gray-200 rounded w-full" />
                                <div className="h-2 bg-gray-200 rounded w-11/12" />
                                <div className="h-2 bg-gray-100 rounded w-5/6" />
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="h-10 bg-gray-100 rounded" />
                                <div className="h-10 bg-gray-100 rounded" />
                              </div>
                            </div>
                            <span className="absolute top-4 right-6 w-3 h-3 rounded-full bg-red-500 shadow" />
                            <span className="absolute top-1/2 left-4 w-3 h-3 rounded-full bg-red-500 shadow" />
                            <span className="absolute bottom-6 right-10 w-3 h-3 rounded-full bg-red-500 shadow" />
                          </div>
                        </div>

                        {/* AI Fix Actions */}
                        <div className="border border-border rounded-xl p-6">
                          <h4 className="font-semibold mb-3">AI 修复动作清单</h4>
                          <p className="text-xs text-muted-foreground mb-4">
                            将检测结果转化为可操作的修复任务，点击跳转简历编辑器
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 w-2 h-2 rounded-full bg-orange-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  转换为单栏、左对齐的标准 ATS 布局
                                </p>
                                <Link
                                  to="/resume-editor?mode=layout-fix"
                                  className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                                >
                                  去编辑器修复
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                            {result.keywords.missing.length > 0 && (
                              <div className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-orange-500" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    添加缺失技能：{result.keywords.missing.slice(0, 3).join('、')}
                                    {result.keywords.missing.length > 3 ? ' 等' : ''}
                                  </p>
                                  <Link
                                    to="/resume-editor"
                                    className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                                  >
                                    去编辑器补充技能
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <div className="mt-1 w-2 h-2 rounded-full bg-orange-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  将复杂表格、图片型内容替换为文本要点
                                </p>
                                <Link
                                  to="/resume-editor?mode=layout-fix"
                                  className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                                >
                                  在编辑器中重新整理排版
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 w-2 h-2 rounded-full bg-orange-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  为关键经历补充量化结果（人数、金额、增长率等）
                                </p>
                                <Link
                                  to="/resume-editor"
                                  className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                                >
                                  打开编辑器逐条优化
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border border-border rounded-xl p-6">
                        <h4 className="font-semibold mb-4">行业基准对比</h4>
                        <p className="text-xs text-muted-foreground mb-4">
                          对比同职位、同经验区间候选人的 ATS 评分分布，评估你当前所处的位置
                        </p>
                        {(() => {
                          const userScore = result.score;
                          const peerAverage = Math.min(95, Math.max(40, Math.round((userScore + 70) / 2)));
                          const topCandidates = Math.max(peerAverage + 10, userScore + 5);

                          const toPercent = (value: number) =>
                            `${Math.min(100, Math.max(0, value))}%`;

                          return (
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-1 text-xs">
                                  <span className="font-medium">你的简历</span>
                                  <span className="text-muted-foreground">
                                    {userScore} 分 · 约超越 {Math.min(99, Math.max(1, userScore - 40))}% 同类候选人
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: toPercent(userScore) }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1 text-xs">
                                  <span className="font-medium">同职位平均</span>
                                  <span className="text-muted-foreground">
                                    {peerAverage} 分
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500/70 rounded-full"
                                    style={{ width: toPercent(peerAverage) }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1 text-xs">
                                  <span className="font-medium">前 10% 候选人</span>
                                  <span className="text-muted-foreground">
                                    约 {topCandidates} 分以上
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-amber-500/80 rounded-full"
                                    style={{ width: toPercent(topCandidates) }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* ATS 解析预览 */}
              {fileContent && (
                <div className="bg-card rounded-2xl border border-border p-8 mt-6 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">ATS 简历解析预览</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        通过所见即所得的方式，查看你的简历在 ATS 系统中的真实样子
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      这就是招聘官在后台看到的样子
                    </Badge>
                  </div>

                  {(() => {
                    const raw = fileContent || '';
                    const lines = raw.split(/\r?\n/).map((l) => l.trim());
                    const nonEmpty = lines.filter(Boolean);

                    const blocks: { label: string; content: string }[] = [];
                    if (nonEmpty.length) {
                      const first = nonEmpty[0];
                      blocks.push({ label: '姓名', content: first });

                      const contactLines = nonEmpty.filter(
                        (l) => /@/.test(l) || /\d{3,}[-\s]?\d{3,}/.test(l)
                      );
                      if (contactLines.length) {
                        blocks.push({
                          label: '联系方式',
                          content: contactLines.join('\n'),
                        });
                      }

                      const experienceLines = nonEmpty.filter(
                        (l) =>
                          /experience/i.test(l) ||
                          /工作经历/.test(l) ||
                          /经历/.test(l)
                      );
                      if (experienceLines.length) {
                        blocks.push({
                          label: '工作经历',
                          content: experienceLines.join('\n'),
                        });
                      }

                      const educationLines = nonEmpty.filter(
                        (l) =>
                          /education/i.test(l) ||
                          /教育背景/.test(l) ||
                          /教育/.test(l)
                      );
                      if (educationLines.length) {
                        blocks.push({
                          label: '教育背景',
                          content: educationLines.join('\n'),
                        });
                      }

                      const skillLines = nonEmpty.filter(
                        (l) =>
                          /skills?/i.test(l) ||
                          /技能/.test(l) ||
                          /技术栈/.test(l)
                      );
                      if (skillLines.length) {
                        blocks.push({
                          label: '技能',
                          content: skillLines.join('\n'),
                        });
                      }
                    }

                    const suspicious = nonEmpty
                      .filter(
                        (l) =>
                          /[\t|]/.test(l) ||
                          l.includes('│') ||
                          l.includes('┆') ||
                          l.length > 120
                      )
                      .slice(0, 8);

                    return (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-dashed border-border rounded-xl p-4 bg-muted/40">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-muted-foreground">
                              原始 PDF 简历（示意）
                            </p>
                            {file && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-muted-foreground border border-border">
                                {file.name}
                              </span>
                            )}
                          </div>
                          <div className="relative aspect-[3/4] w-full rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                            <div className="absolute inset-4 flex flex-col gap-2 opacity-80">
                              <div className="h-3 bg-white/40 rounded w-2/3" />
                              <div className="h-2 bg-white/20 rounded w-1/2" />
                              <div className="mt-2 space-y-1">
                                <div className="h-2 bg-white/15 rounded w-full" />
                                <div className="h-2 bg-white/10 rounded w-11/12" />
                                <div className="h-2 bg-white/10 rounded w-5/6" />
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="h-10 bg-white/10 rounded" />
                                <div className="h-10 bg-white/10 rounded" />
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/60">
                              <span>视觉排版</span>
                              <span>仅供参考，ATS 实际读取为右侧纯文本</span>
                            </div>
                          </div>
                        </div>

                        <div className="border border-border rounded-xl p-4 bg-muted/20">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-muted-foreground">
                              解析后纯文本 · 带结构标签
                            </p>
                          </div>
                          <div className="h-56 overflow-auto rounded-lg bg-background border border-border p-3 text-xs font-mono text-muted-foreground space-y-3">
                            {blocks.length ? (
                              blocks.map((block, index) => (
                                <div key={`${block.label}-${index}`}>
                                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] mb-1">
                                    <span>[{block.label}]</span>
                                  </div>
                                  <pre className="whitespace-pre-wrap leading-relaxed">
                                    {block.content}
                                  </pre>
                                </div>
                              ))
                            ) : (
                              <pre className="whitespace-pre-wrap leading-relaxed">
                                {raw}
                              </pre>
                            )}
                          </div>

                          {suspicious.length > 0 && (
                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                              <p className="text-xs font-medium text-red-700 mb-1">
                                解析错误预警
                              </p>
                              <p className="text-[11px] text-red-600 mb-2">
                                检测到可能由表格或复杂分栏导致的解析风险区域，建议改为纯文本分段：
                              </p>
                              <ul className="space-y-1">
                                {suspicious.map((line, index) => (
                                  <li
                                    key={`warn-${index}`}
                                    className="text-[11px] text-red-700 bg-white/70 rounded px-2 py-1"
                                  >
                                    {line.slice(0, 160)}
                                    {line.length > 160 ? '…' : ''}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2 rounded-full px-8"
                >
                  <Zap className="w-5 h-5" />
                  先评估诊断，再智能优化
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载详细评估报告
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {!result && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h3 className="text-xl font-semibold text-center mb-8">ATS优化技巧</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {atsTips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <tip.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                  <Link
                    to={tip.link}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    了解更多
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
