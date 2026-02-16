import { useState, useRef, useEffect } from 'react';
import { 
  Search, Eye, Check, Sparkles, Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Template type definition
interface Template {
  id: string;
  name: string;
  description: string;
  atsScore: number;
  industry: string;
  style: string;
  tags: string[];
  isNew: boolean;
  isPopular: boolean;
}

// Industry filters
const industryFilters = [
  { id: 'all', name: '全部' },
  { id: 'tech', name: '技术岗' },
  { id: 'entry', name: '应届生' },
  { id: 'marketing', name: '营销岗' },
  { id: 'finance', name: '金融岗' },
  { id: 'education', name: '教育岗' },
  { id: 'career-change', name: '转行者' },
];

// Style filters
const styleFilters = [
  { id: 'all', name: '全部风格' },
  { id: 'modern', name: '现代' },
  { id: 'classic', name: '经典' },
  { id: 'minimal', name: '极简' },
  { id: 'creative', name: '创意' },
  { id: 'elegant', name: '优雅' },
];

// Template data with ATS scores and details
const templatesData: Template[] = [
  {
    id: '1',
    name: 'Modern Tech Pro',
    description: 'Clean and professional design for software engineers',
    atsScore: 98,
    industry: 'tech',
    style: 'modern',
    tags: ['ATS-Optimized', 'Skills Highlight'],
    isNew: true,
    isPopular: true,
  },
  {
    id: '2',
    name: 'Minimal Developer',
    description: 'Minimalist design focusing on skills and projects',
    atsScore: 97,
    industry: 'tech',
    style: 'minimal',
    tags: ['Clean Layout', 'Code Snippets'],
    isNew: false,
    isPopular: true,
  },
  {
    id: '3',
    name: 'Creative Coder',
    description: 'Stand out with this creative tech-focused template',
    atsScore: 94,
    industry: 'tech',
    style: 'creative',
    tags: ['Visual Portfolio', 'Color Accents'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '4',
    name: 'Senior Engineer',
    description: 'Professional template for senior-level positions',
    atsScore: 99,
    industry: 'tech',
    style: 'classic',
    tags: ['Leadership Focus', 'Architecture Diagrams'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '5',
    name: 'Full Stack Hero',
    description: 'Highlight your full-stack expertise and projects',
    atsScore: 96,
    industry: 'tech',
    style: 'modern',
    tags: ['Tech Stack Icons', 'End-to-End Projects'],
    isNew: true,
    isPopular: false,
  },
  {
    id: '6',
    name: 'Frontend Specialist',
    description: 'Perfect for frontend developers and UI engineers',
    atsScore: 95,
    industry: 'tech',
    style: 'creative',
    tags: ['UI/UX Focus', 'Framework Badges'],
    isNew: false,
    isPopular: true,
  },
  {
    id: '7',
    name: 'Backend Architect',
    description: 'Showcase your backend and infrastructure skills',
    atsScore: 97,
    industry: 'tech',
    style: 'classic',
    tags: ['API Design', 'Database Schema'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '8',
    name: 'DevOps Engineer',
    description: 'Highlight CI/CD and cloud infrastructure experience',
    atsScore: 95,
    industry: 'tech',
    style: 'modern',
    tags: ['Cloud Badges', 'Pipeline Diagrams'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '9',
    name: 'Data Scientist',
    description: 'Showcase ML/AI projects and data analysis skills',
    atsScore: 96,
    industry: 'tech',
    style: 'minimal',
    tags: ['Research Papers', 'Model Metrics'],
    isNew: false,
    isPopular: true,
  },
  {
    id: '10',
    name: 'Mobile Developer',
    description: 'iOS/Android developer focused template',
    atsScore: 94,
    industry: 'tech',
    style: 'modern',
    tags: ['App Store Links', 'Download Stats'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '11',
    name: 'Security Engineer',
    description: 'Cybersecurity and compliance focused design',
    atsScore: 98,
    industry: 'tech',
    style: 'classic',
    tags: ['Certifications', 'Security Tools'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '12',
    name: 'Game Developer',
    description: 'Creative template for game industry professionals',
    atsScore: 92,
    industry: 'tech',
    style: 'creative',
    tags: ['Game Portfolio', 'Engine Icons'],
    isNew: true,
    isPopular: false,
  },
  {
    id: '13',
    name: 'Blockchain Dev',
    description: 'Web3 and blockchain developer template',
    atsScore: 95,
    industry: 'tech',
    style: 'modern',
    tags: ['Smart Contracts', 'DeFi Projects'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '14',
    name: 'AI Engineer',
    description: 'Machine learning and AI research focused',
    atsScore: 97,
    industry: 'tech',
    style: 'minimal',
    tags: ['Publications', 'Model Performance'],
    isNew: false,
    isPopular: true,
  },
  {
    id: '15',
    name: 'Cloud Architect',
    description: 'Enterprise cloud architecture template',
    atsScore: 98,
    industry: 'tech',
    style: 'classic',
    tags: ['Multi-Cloud', 'Cost Optimization'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '16',
    name: 'QA Engineer',
    description: 'Quality assurance and testing focused',
    atsScore: 94,
    industry: 'tech',
    style: 'minimal',
    tags: ['Test Coverage', 'Automation Tools'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '17',
    name: 'Embedded Systems',
    description: 'Hardware and firmware engineer template',
    atsScore: 93,
    industry: 'tech',
    style: 'classic',
    tags: ['Hardware Skills', 'IoT Projects'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '18',
    name: 'Tech Lead',
    description: 'Engineering leadership and management',
    atsScore: 99,
    industry: 'tech',
    style: 'elegant',
    tags: ['Team Size', 'Project Scale'],
    isNew: false,
    isPopular: true,
  },
  {
    id: '19',
    name: 'Open Source',
    description: 'Highlight open source contributions',
    atsScore: 95,
    industry: 'tech',
    style: 'modern',
    tags: ['GitHub Stats', 'Contributor Badges'],
    isNew: false,
    isPopular: false,
  },
  {
    id: '20',
    name: 'Startup Engineer',
    description: 'Fast-paced startup environment focused',
    atsScore: 96,
    industry: 'tech',
    style: 'creative',
    tags: ['Rapid Prototyping', 'Full Ownership'],
    isNew: true,
    isPopular: false,
  },
];

// Generate more templates for other industries
const generateMoreTemplates = (): Template[] => {
  const moreTemplates: Template[] = [];
  const industries = ['finance', 'marketing', 'education', 'entry', 'career-change'];
  const names: Record<string, string[]> = {
    finance: ['Investment Banking', 'Financial Analyst', 'Risk Manager', 'Portfolio Manager', 'Wealth Advisor'],
    marketing: ['Brand Manager', 'Digital Marketing', 'Content Strategist', 'SEO Specialist', 'Growth Hacker'],
    education: ['Research Academic', 'Teaching Fellow', 'Education Coordinator', 'Academic Advisor', 'Curriculum Developer'],
    entry: ['Fresh Graduate', 'Internship Ready', 'Entry Level Pro', 'Career Starter', 'New Graduate'],
    'career-change': ['Career Pivot', 'Industry Switcher', 'Transferable Skills', 'New Direction', 'Professional Transition'],
  };
  
  let id = 21;
  industries.forEach((industry) => {
    const nameList = names[industry];
    nameList.forEach((name, idx) => {
      moreTemplates.push({
        id: String(id++),
        name: `${name}`,
        description: `Professional ${industry} resume template optimized for ATS systems`,
        atsScore: 92 + Math.floor(Math.random() * 8),
        industry,
        style: ['modern', 'classic', 'minimal', 'creative', 'elegant'][idx % 5],
        tags: ['ATS-Optimized', industry === 'finance' ? 'Finance Focus' : industry === 'marketing' ? 'Marketing Ready' : 'Industry Specific'],
        isNew: Math.random() > 0.8,
        isPopular: Math.random() > 0.7,
      });
    });
  });
  
  return moreTemplates;
};

const loadCustomTemplates = (): Template[] => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('customTemplates');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Template[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
  }
  return [];
};

const allTemplates = [...templatesData, ...generateMoreTemplates(), ...loadCustomTemplates()];

// Get ATS score color
const getATSColor = (score: number) => {
  if (score >= 95) return 'bg-green-500';
  if (score >= 90) return 'bg-blue-500';
  if (score >= 85) return 'bg-yellow-500';
  return 'bg-orange-500';
};

// Get ATS score text color
const getATSTextColor = (score: number) => {
  if (score >= 95) return 'text-green-600';
  if (score >= 90) return 'text-blue-600';
  if (score >= 85) return 'text-yellow-600';
  return 'text-orange-600';
};

// Template preview component
const TemplatePreview = ({ template }: { template: typeof allTemplates[0] }) => {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col">
      {/* Resume Header */}
      <div className="border-b-2 border-gray-800 pb-3 mb-3">
        <div className="h-4 bg-gray-800 rounded w-1/3 mb-2"></div>
        <div className="flex gap-2">
          <div className="h-2 bg-gray-400 rounded w-20"></div>
          <div className="h-2 bg-gray-400 rounded w-20"></div>
          <div className="h-2 bg-gray-400 rounded w-20"></div>
        </div>
      </div>
      
      {/* Summary */}
      <div className="mb-3">
        <div className="h-2 bg-gray-800 rounded w-16 mb-2"></div>
        <div className="space-y-1">
          <div className="h-1.5 bg-gray-300 rounded w-full"></div>
          <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
      
      {/* Experience */}
      <div className="mb-3">
        <div className="h-2 bg-gray-800 rounded w-20 mb-2"></div>
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <div className="h-2 bg-gray-600 rounded w-24"></div>
            <div className="h-2 bg-gray-400 rounded w-16"></div>
          </div>
          <div className="h-1.5 bg-gray-300 rounded w-20 mb-1"></div>
          <div className="space-y-1">
            <div className="h-1 bg-gray-200 rounded w-full"></div>
            <div className="h-1 bg-gray-200 rounded w-11/12"></div>
          </div>
        </div>
      </div>
      
      {/* Skills */}
      <div>
        <div className="h-2 bg-gray-800 rounded w-14 mb-2"></div>
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded-full w-14"></div>
          ))}
        </div>
      </div>
      
      {/* ATS Score Badge */}
      <div className="absolute top-2 right-2">
        <Badge className={`${getATSColor(template.atsScore)} text-white text-xs font-bold`}>
          ATS {template.atsScore}
        </Badge>
      </div>
      
      {/* New/Popular badges */}
      {(template.isNew || template.isPopular) && (
        <div className="absolute top-2 left-2 flex gap-1">
          {template.isNew && (
            <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
          )}
          {template.isPopular && (
            <Badge className="bg-orange-500 text-white text-xs">HOT</Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default function TemplatesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<typeof allTemplates[0] | null>(null);
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        gridRef.current?.querySelectorAll('.template-card') || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    const matchesStyle = selectedStyle === 'all' || template.style === selectedStyle;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesStyle && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    setUsedTemplates((prev) => [...prev, templateId]);
    // Navigate to resume editor with template
    window.location.href = `/resume-editor?template=${templateId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Header Section */}
        <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            专业简历模板库
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            20+ 套ATS友好模板，专为美国求职市场设计。涵盖技术、金融、营销、教育等多个行业。
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card border-input"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-y border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Industry Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground mr-2" />
              {industryFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedIndustry(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedIndustry === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
            
            {/* Style Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">风格:</span>
              {styleFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStyle(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                    selectedStyle === filter.id
                      ? 'bg-primary/10 text-primary border border-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-muted-foreground">
            找到 <span className="font-semibold text-foreground">{filteredTemplates.length}</span> 个模板
          </p>
        </div>

        {/* Templates Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="template-card bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Preview Area */}
                <div 
                  className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div className="absolute inset-4">
                    <TemplatePreview template={template} />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      预览
                    </Button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* ATS Score Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">ATS</span>
                      <span className={`text-xs font-semibold ${getATSTextColor(template.atsScore)}`}>
                        {template.atsScore}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getATSColor(template.atsScore)} transition-all duration-500`}
                        style={{ width: `${template.atsScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Industry Badge */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {industryFilters.find(i => i.id === template.industry)?.name || '技术岗'}
                    </Badge>
                    
                    {/* Use Button */}
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                      disabled={usedTemplates.includes(template.id)}
                      className={`gap-1 ${
                        usedTemplates.includes(template.id)
                          ? 'bg-green-500 hover:bg-green-500'
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {usedTemplates.includes(template.id) ? (
                        <>
                          <Check className="w-3 h-3" />
                          已使用
                        </>
                      ) : (
                        '使用'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">未找到模板</h3>
              <p className="text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground mt-1">平均 ATS 通过率</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">80+</p>
                <p className="text-sm text-muted-foreground mt-1">专业模板</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">6</p>
                <p className="text-sm text-muted-foreground mt-1">行业覆盖</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground mt-1">AI 优化支持</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {previewTemplate?.name}
              {previewTemplate && (
                <Badge className={`${getATSColor(previewTemplate.atsScore)} text-white`}>
                  ATS {previewTemplate.atsScore}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl">
                <div className="max-w-lg mx-auto bg-white shadow-lg">
                  <TemplatePreview template={previewTemplate} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => handleUseTemplate(previewTemplate.id)}
                  disabled={usedTemplates.includes(previewTemplate.id)}
                >
                  {usedTemplates.includes(previewTemplate.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      已使用
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      使用此模板
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">模板特点:</p>
                <ul className="list-disc list-inside space-y-1">
                  {previewTemplate.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
