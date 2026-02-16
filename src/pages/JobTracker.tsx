import { useState, useRef, useEffect } from 'react';
import { 
  Plus, Search, Filter, Calendar, 
  Building2, MapPin, DollarSign, CheckCircle2,
  Hourglass, Phone, ExternalLink, XCircle,
  Briefcase, Trash2,
  Edit3, BarChart3, Globe, Linkedin,
  Github, Layers, Bookmark, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STORAGE_KEY_JOBS = 'jobTracker.jobs';
const STORAGE_KEY_PLAN = 'jobGoalPlan';

type PlanSummary = {
  targetRole?: string;
  targetCompanies?: string;
  deadlineMonths?: number;
  dailyHours?: number;
};

function loadPlanSummary(): { hasPlan: boolean; planSummary: PlanSummary | null } {
  if (typeof window === 'undefined') {
    return { hasPlan: false, planSummary: null };
  }
  const raw = localStorage.getItem(STORAGE_KEY_PLAN);
  if (!raw) return { hasPlan: false, planSummary: null };
  try {
    const parsed = JSON.parse(raw) as PlanSummary;
    if (parsed && typeof parsed === 'object') {
      return { hasPlan: true, planSummary: parsed };
    }
    return { hasPlan: false, planSummary: null };
  } catch {
    return { hasPlan: false, planSummary: null };
  }
}

type JobStatus = 'saved' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
type JobSource = 'linkedin' | 'indeed' | 'glassdoor' | 'company' | 'referral' | 'other';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  status: JobStatus;
  appliedDate: string;
  notes: string;
  logo: string;
  url: string;
  source: JobSource;
  isFavorite: boolean;
  interviewRounds?: number;
  currentRound?: number;
}

type IconComponent = React.ComponentType<{ className?: string }>;
const statusConfig: Record<JobStatus, { label: string; color: string; bgColor: string; icon: IconComponent }> = {
  saved: { label: '已收藏', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Bookmark },
  applied: { label: '已申请', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle2 },
  screening: { label: '筛选中', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Hourglass },
  interview: { label: '面试中', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Phone },
  offer: { label: '已录用', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
  rejected: { label: '已拒绝', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
};

const sourceConfig: Record<JobSource, { label: string; icon: IconComponent; color: string }> = {
  linkedin: { label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  indeed: { label: 'Indeed', icon: Globe, color: 'text-orange-600' },
  glassdoor: { label: 'Glassdoor', icon: BarChart3, color: 'text-green-600' },
  company: { label: '公司官网', icon: Building2, color: 'text-gray-600' },
  referral: { label: '内推', icon: Star, color: 'text-yellow-600' },
  other: { label: '其他', icon: Layers, color: 'text-gray-500' },
};

const jobPlatforms = [
  { name: 'LinkedIn', url: 'https://linkedin.com/jobs', icon: Linkedin, color: 'bg-blue-600' },
  { name: 'Indeed', url: 'https://indeed.com', icon: Globe, color: 'bg-orange-500' },
  { name: 'Glassdoor', url: 'https://glassdoor.com', icon: BarChart3, color: 'bg-green-500' },
  { name: 'GitHub Jobs', url: 'https://github.com/jobs', icon: Github, color: 'bg-gray-800' },
  { name: 'AngelList', url: 'https://angel.co/jobs', icon: Star, color: 'bg-black' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/jobs', icon: Layers, color: 'bg-orange-600' },
];

const initialJobs: JobApplication[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Senior Software Engineer',
    location: 'Mountain View, CA',
    salary: '$180k - $250k',
    status: 'interview',
    appliedDate: '2024-01-15',
    notes: '完成第二轮技术面试，等待onsite安排。面试官很友好，题目难度适中。',
    logo: 'G',
    url: 'https://careers.google.com',
    source: 'linkedin',
    isFavorite: true,
    interviewRounds: 5,
    currentRound: 2,
  },
  {
    id: '2',
    company: 'Meta',
    position: 'Product Manager',
    location: 'Menlo Park, CA',
    salary: '$160k - $220k',
    status: 'screening',
    appliedDate: '2024-01-18',
    notes: 'HR电话筛选已安排，下周二上午10点',
    logo: 'M',
    url: 'https://meta.com/careers',
    source: 'referral',
    isFavorite: false,
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'Data Scientist',
    location: 'Seattle, WA',
    salary: '$150k - $200k',
    status: 'applied',
    appliedDate: '2024-01-20',
    notes: '',
    logo: 'A',
    url: 'https://amazon.jobs',
    source: 'company',
    isFavorite: false,
  },
  {
    id: '4',
    company: 'Microsoft',
    position: 'UX Designer',
    location: 'Redmond, WA',
    salary: '$140k - $180k',
    status: 'offer',
    appliedDate: '2024-01-10',
    notes: '收到offer，总包$175k，正在考虑中。需要回复截止日期是下周。',
    logo: 'MS',
    url: 'https://careers.microsoft.com',
    source: 'linkedin',
    isFavorite: true,
  },
  {
    id: '5',
    company: 'OpenAI',
    position: 'ML Engineer',
    location: 'San Francisco, CA',
    salary: '$200k - $300k',
    status: 'saved',
    appliedDate: '',
    notes: '非常感兴趣的职位，准备优化简历后申请',
    logo: 'O',
    url: 'https://openai.com/careers',
    source: 'other',
    isFavorite: true,
  },
];

export default function JobTracker() {
  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    if (typeof window === 'undefined') return initialJobs;
    const raw = localStorage.getItem(STORAGE_KEY_JOBS);
    if (!raw) return initialJobs;
    try {
      const parsed = JSON.parse(raw) as JobApplication[];
      return Array.isArray(parsed) && parsed.length ? parsed : initialJobs;
    } catch {
      return initialJobs;
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<JobSource | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const initialPlan = loadPlanSummary();
  const [hasPlan] = useState(initialPlan.hasPlan);
  const [planSummary] = useState<PlanSummary | null>(initialPlan.planSummary);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        statsRef.current?.querySelectorAll('.stat-card') || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        listRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || job.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const stats = {
    total: jobs.length,
    saved: jobs.filter((j) => j.status === 'saved').length,
    active: jobs.filter((j) => ['applied', 'screening', 'interview'].includes(j.status)).length,
    interviews: jobs.filter((j) => j.status === 'interview').length,
    offers: jobs.filter((j) => j.status === 'offer').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
  };

  const addJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newJob: JobApplication = {
      id: Date.now().toString(),
      company: formData.get('company') as string,
      position: formData.get('position') as string,
      location: formData.get('location') as string,
      salary: formData.get('salary') as string,
      status: formData.get('status') as JobStatus,
      appliedDate: formData.get('appliedDate') as string || new Date().toISOString().split('T')[0],
      notes: formData.get('notes') as string,
      logo: (formData.get('company') as string).charAt(0).toUpperCase(),
      url: formData.get('url') as string,
      source: formData.get('source') as JobSource,
      isFavorite: false,
    };
    setJobs([newJob, ...jobs]);
    setIsAddDialogOpen(false);
  };

  const updateJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingJob) return;
    const formData = new FormData(e.currentTarget);
    const updatedJob: JobApplication = {
      ...editingJob,
      company: formData.get('company') as string,
      position: formData.get('position') as string,
      location: formData.get('location') as string,
      salary: formData.get('salary') as string,
      status: formData.get('status') as JobStatus,
      appliedDate: formData.get('appliedDate') as string,
      notes: formData.get('notes') as string,
      url: formData.get('url') as string,
      source: formData.get('source') as JobSource,
    };
    setJobs(jobs.map(j => j.id === editingJob.id ? updatedJob : j));
    setEditingJob(null);
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, isFavorite: !j.isFavorite } : j));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">投递追踪</h1>
              <p className="text-muted-foreground mt-1">
                管理您的求职申请，跟踪面试进度
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  添加申请
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>添加新申请</DialogTitle>
                </DialogHeader>
                <form onSubmit={addJob} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>公司 *</Label>
                      <Input name="company" required />
                    </div>
                    <div>
                      <Label>职位 *</Label>
                      <Input name="position" required />
                    </div>
                  </div>
                  <div>
                    <Label>地点</Label>
                    <Input name="location" placeholder="例如: San Francisco, CA" />
                  </div>
                  <div>
                    <Label>薪资范围</Label>
                    <Input name="salary" placeholder="$100k - $150k" />
                  </div>
                  <div>
                    <Label>职位链接</Label>
                    <Input name="url" type="url" placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>状态 *</Label>
                      <Select name="status" defaultValue="applied">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>来源</Label>
                      <Select name="source" defaultValue="other">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(sourceConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>申请日期</Label>
                    <Input name="appliedDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <Label>备注</Label>
                    <Textarea name="notes" placeholder="面试反馈、联系人信息等..." />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    添加申请
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Plan Summary + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 mb-8">
            {hasPlan && planSummary && (
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      求职路线图 · 执行摘要
                    </p>
                    <p className="text-sm font-semibold">
                      {planSummary.targetRole || '目标职位未设置'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      目标公司：{planSummary.targetCompanies || '未设置'} · 目标周期：
                      {planSummary.deadlineMonths || 3} 个月
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>建议每日投入：{planSummary.dailyHours || 2} 小时</span>
                  <span>可在「求职路线图」中调整计划</span>
                </div>
              </div>
            )}
            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              <div className="stat-card bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">总申请</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="stat-card bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">已收藏</p>
                <p className="text-2xl font-bold">{stats.saved}</p>
              </div>
              <div className="stat-card bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">进行中</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <div className="stat-card bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">面试中</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.interviews}
                </p>
              </div>
              <div className="stat-card bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">Offer</p>
                <p className="text-2xl font-bold text-green-600">{stats.offers}</p>
              </div>
              <div className="stat-card bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">已拒绝</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </div>

          {/* Job Platforms */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              招聘平台
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {jobPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground">{platform.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div ref={listRef} className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索公司或职位..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as JobStatus | 'all')}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as JobSource | 'all')}>
                <SelectTrigger className="w-full sm:w-40">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="筛选来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部来源</SelectItem>
                  {Object.entries(sourceConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const StatusIcon = statusConfig[job.status].icon;
              const SourceIcon = sourceConfig[job.source].icon;
              return (
                <div
                  key={job.id}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {job.logo}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h3 className="text-lg font-semibold truncate">
                          {job.position}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`${statusConfig[job.status].bgColor} ${statusConfig[job.status].color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[job.status].label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <SourceIcon className={`w-3 h-3 mr-1 ${sourceConfig[job.source].color}`} />
                            {sourceConfig[job.source].label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
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
                        {job.appliedDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {job.appliedDate}
                          </span>
                        )}
                      </div>
                      
                      {/* Interview Progress */}
                      {job.status === 'interview' && job.interviewRounds && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">面试进度</span>
                            <span className="text-primary">第 {job.currentRound} / {job.interviewRounds} 轮</span>
                          </div>
                          <Progress 
                            value={((job.currentRound || 0) / job.interviewRounds) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                      
                      {job.notes && (
                        <p className="mt-3 text-sm text-muted-foreground bg-muted rounded-lg p-3">
                          {job.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleFavorite(job.id)}
                        className={`p-2 rounded-lg transition-colors ${job.isFavorite ? 'text-yellow-500 bg-yellow-500/10' : 'hover:bg-muted'}`}
                      >
                        <Star className={`w-4 h-4 ${job.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Dialog open={editingJob?.id === job.id} onOpenChange={(open) => !open && setEditingJob(null)}>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => setEditingJob(job)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>编辑申请</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={updateJob} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>公司</Label>
                                <Input name="company" defaultValue={job.company} required />
                              </div>
                              <div>
                                <Label>职位</Label>
                                <Input name="position" defaultValue={job.position} required />
                              </div>
                            </div>
                            <div>
                              <Label>地点</Label>
                              <Input name="location" defaultValue={job.location} />
                            </div>
                            <div>
                              <Label>薪资范围</Label>
                              <Input name="salary" defaultValue={job.salary} />
                            </div>
                            <div>
                              <Label>职位链接</Label>
                              <Input name="url" type="url" defaultValue={job.url} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>状态</Label>
                                <Select name="status" defaultValue={job.status}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                      <SelectItem key={key} value={key}>
                                        {config.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>来源</Label>
                                <Select name="source" defaultValue={job.source}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(sourceConfig).map(([key, config]) => (
                                      <SelectItem key={key} value={key}>
                                        {config.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>申请日期</Label>
                              <Input name="appliedDate" type="date" defaultValue={job.appliedDate} />
                            </div>
                            <div>
                              <Label>备注</Label>
                              <Textarea name="notes" defaultValue={job.notes} />
                            </div>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                              保存修改
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">没有找到匹配的申请</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSourceFilter('all');
                }}
              >
                清除筛选
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
