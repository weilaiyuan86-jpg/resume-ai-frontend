import { useState } from 'react';
import { 
  Globe, FileText, Clock, CheckCircle, AlertCircle,
  GraduationCap, Briefcase, 
  Search, ChevronDown, ChevronUp, ExternalLink,
  Download, Calendar, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface VisaType {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: string;
  processingTime: string;
  cost: string;
  requirements: string[];
  eligible: string[];
  pros: string[];
  cons: string[];
}

const visaTypes: VisaType[] = [
  {
    id: 'h1b',
    name: 'H-1B 专业职业签证',
    code: 'H-1B',
    description: '针对需要专业知识和技能的工作岗位，是最常见的工作签证类型。',
    duration: '3年，可延期至6年',
    processingTime: '3-6个月（加急15天）',
    cost: '$2,500 - $7,500',
    requirements: [
      '学士学位或同等学历',
      '雇主提供的工作offer',
      '职位需要专业知识',
      '雇主需提交LCA',
    ],
    eligible: ['软件工程师', '数据科学家', '产品经理', '金融分析师', '设计师'],
    pros: ['可带家属(H-4)', '可转换绿卡', '可换雇主'],
    cons: ['年度配额限制', '需要抽签', '依赖雇主'],
  },
  {
    id: 'l1',
    name: 'L-1 跨国公司调派签证',
    code: 'L-1A/L-1B',
    description: '适用于跨国公司内部调派员工到美国分公司工作。',
    duration: 'L-1A: 7年, L-1B: 5年',
    processingTime: '2-4个月（加急15天）',
    cost: '$2,500 - $5,000',
    requirements: [
      '在海外公司工作满1年',
      '公司间存在合格关系',
      '担任管理或专业职位',
    ],
    eligible: ['高管', '经理', '专业技术人员'],
    pros: ['无配额限制', '可带家属(L-2)', 'L-1A可直接申请EB-1C绿卡'],
    cons: ['必须保持海外雇佣关系', 'L-1B不能申请EB-1C'],
  },
  {
    id: 'o1',
    name: 'O-1 杰出人才签证',
    code: 'O-1A/O-1B',
    description: '针对在科学、艺术、教育、商业或体育领域具有杰出能力的人才。',
    duration: '3年，可无限延期',
    processingTime: '2-3个月（加急15天）',
    cost: '$4,000 - $8,000',
    requirements: [
      '证明杰出能力的证据',
      '持续获得国家或国际认可',
      '来美继续从事相关领域工作',
    ],
    eligible: ['科研人员', '艺术家', '运动员', '企业家'],
    pros: ['无配额限制', '可带家属(O-3)', '可无限延期'],
    cons: ['门槛高', '需要大量证明材料'],
  },
  {
    id: 'tn',
    name: 'TN 北美自由贸易协定签证',
    code: 'TN',
    description: '适用于加拿大和墨西哥公民的专业人员。',
    duration: '3年，可无限延期',
    processingTime: '边境申请即时获批',
    cost: '$160 - $560',
    requirements: [
      '加拿大或墨西哥公民',
      '符合NAFTA职业列表',
      '相关学历或经验',
    ],
    eligible: ['工程师', '科学家', '教师', '会计师', '设计师'],
    pros: ['成本低', '处理快', '可无限延期'],
    cons: ['仅限加拿大和墨西哥公民', '非移民意图'],
  },
  {
    id: 'opt',
    name: 'OPT 选择性实习训练',
    code: 'OPT / STEM OPT',
    description: 'F-1学生毕业后在美国工作的许可。',
    duration: '12个月，STEM可延期24个月',
    processingTime: '3-5个月',
    cost: '$410',
    requirements: [
      '完成至少一学年全日制学习',
      '工作必须与专业相关',
      'STEM需雇主加入E-Verify',
    ],
    eligible: ['应届毕业生', 'STEM专业学生'],
    pros: ['无需雇主担保', '可自由换工作', 'STEM可工作3年'],
    cons: ['有时间限制', '需要找到雇主'],
  },
  {
    id: 'h1b1',
    name: 'H-1B1 智利/新加坡签证',
    code: 'H-1B1',
    description: '专为智利和新加坡公民设立的类似H-1B的签证。',
    duration: '18个月，可无限延期',
    processingTime: '2-4个月',
    cost: '$1,500 - $3,000',
    requirements: [
      '智利或新加坡公民',
      '学士学位或同等学历',
      '专业职位offer',
    ],
    eligible: ['智利公民', '新加坡公民'],
    pros: ['无需抽签', '配额充足', '可无限延期'],
    cons: ['仅限特定国籍', '需要非移民意图'],
  },
];

const timelineSteps = [
  { step: 1, title: '找到雇主', description: '获得愿意担保签证的雇主offer', duration: 'Varies' },
  { step: 2, title: '准备材料', description: '收集学历证明、工作经历等文件', duration: '2-4周' },
  { step: 3, title: '提交申请', description: '雇主提交请愿书到USCIS', duration: '1-2周' },
  { step: 4, title: '等待审批', description: 'USCIS处理申请（可加急）', duration: '2-6个月' },
  { step: 5, title: '签证面试', description: '在美国领事馆进行面试', duration: '1-2周' },
  { step: 6, title: '获得签证', description: '签证获批，准备入境美国', duration: '1-2周' },
];

export default function VisaInfo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVisa, setExpandedVisa] = useState<string | null>(null);

  const filteredVisas = visaTypes.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedVisa(expandedVisa === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              <span>美国工作签证指南</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              签证资讯
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              全面了解美国工作签证类型、申请流程和注意事项，助你顺利开启美国职业生涯
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜索签证类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* Visa Types */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="work" className="gap-2">
                <Briefcase className="w-4 h-4" />
                工作签证
              </TabsTrigger>
              <TabsTrigger value="student" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                学生签证
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <Clock className="w-4 h-4" />
                申请流程
              </TabsTrigger>
            </TabsList>

            <TabsContent value="work" className="space-y-4">
              {filteredVisas.map((visa) => (
                <div 
                  key={visa.id}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <button
                    className="w-full p-6 flex items-start justify-between hover:bg-muted/50 transition-colors"
                    onClick={() => toggleExpand(visa.id)}
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-primary/10 text-primary">{visa.code}</Badge>
                        <h3 className="font-semibold text-lg">{visa.name}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">{visa.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {visa.duration}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          {visa.cost}
                        </span>
                      </div>
                    </div>
                    {expandedVisa === visa.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedVisa === visa.id && (
                    <div className="px-6 pb-6 border-t border-border">
                      <div className="grid md:grid-cols-2 gap-6 pt-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            申请要求
                          </h4>
                          <ul className="space-y-2">
                            {visa.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                                  {i + 1}
                                </span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            适用职业
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {visa.eligible.map((job) => (
                              <Badge key={job} variant="secondary">{job}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            优势
                          </h4>
                          <ul className="space-y-1">
                            {visa.pros.map((pro, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            限制
                          </h4>
                          <ul className="space-y-1">
                            {visa.cons.map((con, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          官方信息
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          下载指南
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="student" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">F-1 学生签证</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    最常见的美国学生签证，允许全日制学习并在毕业后申请OPT工作许可。
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      全日制学习许可
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      校内工作许可
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      毕业后OPT机会
                    </li>
                  </ul>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">OPT / STEM OPT</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    F-1学生毕业后在美国工作的许可，STEM专业可延长至3年。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-xs text-muted-foreground">个月 (普通)</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-primary">36</p>
                      <p className="text-xs text-muted-foreground">个月 (STEM)</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-8">
                <h3 className="font-semibold text-lg mb-8">H-1B 签证申请流程</h3>
                <div className="space-y-6">
                  {timelineSteps.map((step, index) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                          {step.step}
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{step.title}</h4>
                          <Badge variant="secondary">{step.duration}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Resources */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-6">有用资源</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="https://www.uscis.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <Globe className="w-8 h-8 text-primary" />
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">USCIS 官网</h3>
              <p className="text-sm text-muted-foreground">美国公民及移民服务局</p>
            </a>
            <a 
              href="https://travel.state.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">美国国务院</h3>
              <p className="text-sm text-muted-foreground">签证申请和面试信息</p>
            </a>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">H-1B 抽签日历</h3>
              <p className="text-sm text-muted-foreground">每年3月开放注册</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
