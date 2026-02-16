import { useState } from 'react';
import { Target, Building2, MapPin, Clock, Zap, Calendar, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const STORAGE_KEY_PLAN = 'jobGoalPlan';

type StoredPlan = {
  targetRole?: string;
  targetCompanies?: string;
  targetCity?: string;
  deadlineMonths?: number;
  dailyHours?: number;
  notes?: string;
};

function loadStoredPlan(): StoredPlan {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(STORAGE_KEY_PLAN);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as StoredPlan;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

const defaultSkills = [
  { name: '算法与数据结构', current: 60, target: 90 },
  { name: '系统设计', current: 40, target: 80 },
  { name: '行为面试', current: 55, target: 85 },
  { name: '项目叙事', current: 70, target: 90 },
  { name: '英文表达', current: 50, target: 80 },
];

const weeklyRoadmap = [
  {
    week: 1,
    title: '搭建基础资产',
    focus: '完善简历与 LinkedIn',
    tasks: [
      '用 ATS 检测工具完成一版基础简历',
      '对齐 LinkedIn 标题与目标岗位关键词',
      '补全最近两段工作经历的量化成果',
    ],
  },
  {
    week: 2,
    title: '打开职场关系网',
    focus: 'Networking 与信息探索',
    tasks: [
      '每周至少联系 5 位目标公司/同行业从业者',
      '为 3 位目标公司员工写定制化 cold message',
      '整理 10 家目标公司岗位 JD 做对比分析',
    ],
  },
  {
    week: 3,
    title: '进入面试备战期',
    focus: '算法 + 行为面试强化',
    tasks: [
      '完成 20 道 LeetCode 高频题并整理错题本',
      '写出 5 个 STAR 法则行为面试故事',
      '参加至少 2 次模拟面试（AI 或真人）',
    ],
  },
  {
    week: 4,
    title: '规模化高质量投递',
    focus: '精准投递与节奏管理',
    tasks: [
      '为每个目标公司定制求职信或邮件模板',
      '每天投递 3–5 份高匹配度岗位',
      '在 JobTracker 中维护投递漏斗与状态',
    ],
  },
];

const storedPlan = loadStoredPlan();

export default function JobGoalPlanner() {
  const [targetRole, setTargetRole] = useState(
    storedPlan.targetRole || 'Senior Software Engineer'
  );
  const [targetCompanies, setTargetCompanies] = useState(
    storedPlan.targetCompanies || 'Google, Amazon, Meta'
  );
  const [targetCity, setTargetCity] = useState(
    storedPlan.targetCity || 'San Francisco / Seattle'
  );
  const [deadlineMonths, setDeadlineMonths] = useState(
    typeof storedPlan.deadlineMonths === 'number' ? storedPlan.deadlineMonths : 3
  );
  const [dailyHours, setDailyHours] = useState(
    typeof storedPlan.dailyHours === 'number' ? storedPlan.dailyHours : 2
  );
  const [notes, setNotes] = useState(
    typeof storedPlan.notes === 'string' ? storedPlan.notes : ''
  );
  const [planStarted, setPlanStarted] = useState(false);

  const intensity = deadlineMonths <= 2 ? 'high' : deadlineMonths <= 4 ? 'medium' : 'low';
  const totalWeeks = deadlineMonths * 4;
  const weeklyHours = dailyHours * 7;

  const persistPlan = () => {
    if (typeof window === 'undefined') return;
    const payload = {
      targetRole,
      targetCompanies,
      targetCity,
      deadlineMonths,
      dailyHours,
      notes,
      weeklyRoadmap,
    };
    localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(payload));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Target className="w-3 h-3" />
                AI 求职目标与路线图
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
                让求职变成一场可管理的工程项目
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                通过目标画像、时间强度和技能雷达，AI 帮你拆解出按周可执行的求职计划。
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>目标周期：{deadlineMonths} 个月 · 约 {totalWeeks} 周</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>预计每周投入：约 {weeklyHours} 小时</span>
              </div>
              <Badge variant="outline" className="text-xs">
                计划强度：{intensity === 'high' ? '冲刺模式' : intensity === 'medium' ? '平衡模式' : '缓步推进'}
              </Badge>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">目标精准画像</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">目标职位</Label>
                    <div className="relative">
                      <Input
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="pl-8"
                        placeholder="例如：Senior Backend Engineer"
                      />
                      <Target className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">心仪公司</Label>
                    <div className="relative">
                      <Input
                        value={targetCompanies}
                        onChange={(e) => setTargetCompanies(e.target.value)}
                        className="pl-8"
                        placeholder="例如：Google, Amazon, Netflix"
                      />
                      <Building2 className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">意向城市 / 地区</Label>
                    <div className="relative">
                      <Input
                        value={targetCity}
                        onChange={(e) => setTargetCity(e.target.value)}
                        className="pl-8"
                        placeholder="例如：Bay Area / Remote"
                      />
                      <MapPin className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">补充说明（可选）</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="resize-none text-xs"
                      placeholder="例如：更偏向后端 / 基础设施岗位，希望团队有远程文化。"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-muted-foreground">紧迫度与每日节奏</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>1 个月：高压冲刺</span>
                    <span className="hidden sm:inline">·</span>
                    <span>6 个月：长期规划</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">希望在多少个月内拿到 Offer</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={6}
                        value={deadlineMonths}
                        onChange={(e) => setDeadlineMonths(parseInt(e.target.value, 10))}
                        className="flex-1"
                      />
                      <span className="w-10 text-xs text-right text-muted-foreground">
                        {deadlineMonths} 个月
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">每日可投入时间</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={dailyHours}
                        onChange={(e) => setDailyHours(parseInt(e.target.value, 10))}
                        className="flex-1"
                      />
                      <span className="w-10 text-xs text-right text-muted-foreground">
                        {dailyHours} 小时
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    当前规划：{totalWeeks} 周 · 每周约 {weeklyHours} 小时
                  </span>
                  <span>
                    AI 会按此强度拆解每日任务提醒
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">技能缺口雷达图（示意）</p>
                <Badge variant="outline" className="text-[11px] gap-1">
                  <TrendingUp className="w-3 h-3" />
                  与目标岗位匹配度
                </Badge>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-52 h-52">
                  <div className="absolute inset-0 rounded-full border border-border/60" />
                  <div className="absolute inset-6 rounded-full border border-border/50" />
                  <div className="absolute inset-12 rounded-full border border-border/30" />
                  <div className="absolute inset-18 rounded-full border border-border/20" />
                  <svg viewBox="0 0 200 200" className="w-full h-full text-primary/50">
                    <polygon
                      points="100,40 160,80 140,150 60,150 40,80"
                      fill="currentColor"
                      fillOpacity={0.12}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">当前能力轮廓</span>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {defaultSkills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{skill.name}</span>
                        <span>
                          {skill.current} / {skill.target}
                        </span>
                      </div>
                      <Progress
                        value={(skill.current / skill.target) * 100}
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">AI 动态路线图</p>
                <h2 className="mt-1 text-base font-semibold">按周拆解的求职任务时间轴</h2>
              </div>
              <Badge variant="outline" className="text-[11px]">
                将任务同步至仪表盘 & 日历
              </Badge>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {weeklyRoadmap.map((item) => (
                  <div key={item.week} className="relative pl-10">
                    <div className="absolute -left-[7px] top-1 w-4 h-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
                      {item.week}
                    </div>
                    <div className="rounded-xl border border-border bg-background/80 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            第 {item.week} 周 · {item.focus}
                          </p>
                          <p className="text-sm font-semibold">{item.title}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          预计本周 {weeklyHours} 小时
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                        {item.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1 h-1 w-1 rounded-full bg-primary" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border border-border rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">准备好以工程思维启动你的求职了吗？</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  启动后，AI 会把上述周计划拆分到你的仪表盘和日历（示意），并生成每日提醒。
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-stretch sm:items-end">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-2 px-6"
                onClick={() => {
                  persistPlan();
                  setPlanStarted(true);
                }}
              >
                启动我的求职计划
                <Calendar className="w-4 h-4" />
              </Button>
              {planStarted && (
                <p className="text-[11px] text-emerald-700">
                  任务已同步到仪表盘与日历视图（示意），可在 JobTracker 中查看执行进度。
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
