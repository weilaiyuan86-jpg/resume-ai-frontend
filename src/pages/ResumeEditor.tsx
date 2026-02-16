import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  User, Briefcase, GraduationCap, Plus, Trash2, 
  Download, Sparkles, CheckCircle, ChevronLeft, 
  Upload, FileText, GripVertical, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImportDialog from '@/components/ImportDialog';
import AIPolishPanel from '@/components/AIPolishPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import gsap from 'gsap';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://82.29.197.201:3000';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isOptimized?: boolean;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: 'Alexander Sterling',
    title: 'Senior Software Engineer',
    email: 'alexander.sterling@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/asterling',
    summary: 'Highly motivated Senior Software Engineer with 6+ years of experience in architecting scalable distributed systems and leading agile teams. Proven track record of delivering high-performance cloud solutions for Fortune 500 clients. Specialized in React, Python, and AWS ecosystem.',
  },
  experience: [
    {
      id: '1',
      company: 'TechGlobal Solutions Inc.',
      position: 'Senior Software Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: 'Spearheaded a cross-functional team of 10 to architect a distributed cloud platform, resulting in 35% reduction in latency.\nEngineered automated failover protocols that increased overall system uptime to 99.99%.',
      isOptimized: true,
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: '2013 - 2017',
      gpa: '3.8',
    },
  ],
  skills: ['TypeScript', 'Python', 'React.js', 'AWS', 'Docker', 'Microservices'],
};

const sections = [
  { id: 'personal', name: '个人信息', icon: User, status: 'completed' },
  { id: 'experience', name: '工作经历', icon: Briefcase, status: 'in-progress', count: 3 },
  { id: 'education', name: '教育背景', icon: GraduationCap, status: 'completed', count: 1 },
  { id: 'skills', name: '技能', icon: Briefcase, status: 'pending', count: 12 },
];

function analyzeExportIssues(
  data: ResumeData,
  pdf: { fontFamily: string; fontSizePt: number; marginInches: number; lineSpacing: number; headerText: string; showPageNumbers: boolean }
) {
  const issues = {
    spelling: [] as string[],
    links: [] as string[],
    typography: [] as string[],
    compliance: [] as string[],
  };

  const textParts: string[] = [];
  textParts.push(data.personalInfo.summary || '');
  data.experience.forEach((e) => {
    textParts.push(e.description || '');
    textParts.push(e.position || '');
    textParts.push(e.company || '');
  });
  const fullText = textParts.join('\n').toLowerCase();
  if (fullText.includes('lorem') || fullText.includes('todo') || fullText.includes('tbd')) {
    issues.spelling.push('检测到占位符文本（如 TODO 或 lorem），建议替换为真实内容。');
  }

  const linkedin = data.personalInfo.linkedin?.trim();
  if (!linkedin) {
    issues.links.push('未填写 LinkedIn 链接，建议补充以提升可信度。');
  } else if (!/^https?:\/\/.+/i.test(linkedin)) {
    issues.links.push('LinkedIn 链接建议以 https:// 开头，确保可点击访问。');
  }

  const recommendedFonts = ['Arial', 'Calibri', 'Georgia', 'Times New Roman', 'Inter'];
  if (!recommendedFonts.includes(pdf.fontFamily)) {
    issues.typography.push(`当前字体为 ${pdf.fontFamily}，建议使用 Arial 或 Calibri 等标准字体。`);
  }
  if (pdf.fontSizePt < 9 || pdf.fontSizePt > 12) {
    issues.typography.push(`当前正文字号为 ${pdf.fontSizePt}pt，建议控制在 9–12pt 之间。`);
  }

  const riskyKeywords = ['年龄', '岁', '婚姻', '已婚', '未婚', 'single', 'married', 'age', '照片', 'photo'];
  const hasRisky = riskyKeywords.some((k) => fullText.includes(k.toLowerCase()));
  if (hasRisky) {
    issues.compliance.push('检测到可能包含照片、年龄或婚姻状态等信息，建议移除以符合美式简历规范。');
  }

  return issues;
}

export default function ResumeEditor() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('experience');
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [showPreview] = useState(true);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [showAIPolish, setShowAIPolish] = useState(false);
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
  const [collapsedExpIds, setCollapsedExpIds] = useState<string[]>(() =>
    initialData.experience.filter((e) => e.isOptimized).map((e) => e.id)
  );
  const [atsScore] = useState(92);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; style: 'modern' | 'classic' | 'minimal' | 'creative' | 'elegant'; color: string; font: string }>({
    id: 'default',
    name: 'Default',
    style: 'modern',
    color: '#1f2937',
    font: 'Inter',
  });
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [pdfOptions, setPdfOptions] = useState<{ fontFamily: string; fontSizePt: number; marginInches: number; lineSpacing: number; headerText: string; showPageNumbers: boolean }>(() => {
    const raw = (typeof window !== 'undefined') ? localStorage.getItem('pdfOptions') : null;
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === 'object') {
        return {
          fontFamily: parsed.fontFamily || 'Times New Roman',
          fontSizePt: typeof parsed.fontSizePt === 'number' ? parsed.fontSizePt : 10.5,
          marginInches: typeof parsed.marginInches === 'number' ? parsed.marginInches : 0.75,
          lineSpacing: typeof parsed.lineSpacing === 'number' ? parsed.lineSpacing : 1.15,
          headerText: typeof parsed.headerText === 'string' ? parsed.headerText : '',
          showPageNumbers: !!parsed.showPageNumbers,
        };
      }
    } catch { void 0 }
    return { fontFamily: 'Times New Roman', fontSizePt: 10.5, marginInches: 0.75, lineSpacing: 1.15, headerText: '', showPageNumbers: true };
  });
  const [showCleaningDialog, setShowCleaningDialog] = useState(false);
  const [cleanScope, setCleanScope] = useState<'all' | 'current'>('all');
  const [cleanOpts, setCleanOpts] = useState({
    grammarFix: true,
    capitalization: true,
    actionVerbs: true,
    dedupeBullets: true,
    alignKeywords: false,
  });
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanStats, setCleanStats] = useState<{ affected: number; improved: number } | null>(null);
  const isLayoutFixMode = location.search.includes('mode=layout-fix');
  const [hasAppliedLayoutFix, setHasAppliedLayoutFix] = useState(false);
  const [showLayoutBeforeAfter, setShowLayoutBeforeAfter] = useState(false);
  const [showExportChecklist, setShowExportChecklist] = useState(false);
  const [contactConfirmed, setContactConfirmed] = useState(false);
  const [usComplianceConfirmed, setUsComplianceConfirmed] = useState(false);
  const exportIssues = analyzeExportIssues(resumeData, pdfOptions);
  const totalExportChecks = 5;
  let completedExportChecks = 0;
  if (exportIssues.spelling.length === 0) completedExportChecks += 1;
  if (exportIssues.links.length === 0) completedExportChecks += 1;
  if (exportIssues.typography.length === 0) completedExportChecks += 1;
  if (exportIssues.compliance.length === 0) completedExportChecks += 1;
  if (contactConfirmed && usComplianceConfirmed) completedExportChecks += 1;
  const exportReadiness = Math.round((completedExportChecks / totalExportChecks) * 100);
  const canExport = exportReadiness === 100;
  const handleApplyLayoutFix = () => {
    setSelectedTemplate((prev) => ({
      ...prev,
      style: 'modern',
      font: 'Arial',
      name: prev.name.includes('ATS') ? prev.name : `${prev.name} · ATS 优化`,
    }));
    setPdfOptions((prev) => ({
      ...prev,
      fontFamily: 'Arial',
      marginInches: 0.75,
      lineSpacing: 1.15,
    }));
    setHasAppliedLayoutFix(true);
  };
  const exportPDF = () => {
    const el = previewRef.current;
    if (!el) return;
    const style = document.createElement('style');
    style.setAttribute('data-print-style', 'resume');
    style.media = 'print';
    const header = pdfOptions.headerText && pdfOptions.headerText.trim().length > 0
      ? pdfOptions.headerText
      : `${resumeData.personalInfo.fullName} • ${resumeData.personalInfo.email} • ${resumeData.personalInfo.phone}`;
    style.textContent = `
      @page { size: A4; margin: ${pdfOptions.marginInches}in; }
      body * { visibility: hidden; }
      #resume-print-area, #resume-print-area * { visibility: visible; }
      #resume-print-area { position: absolute; left: 0; top: 0; width: 210mm; font-family: "${pdfOptions.fontFamily}"; font-size: ${pdfOptions.fontSizePt}pt; line-height: ${pdfOptions.lineSpacing}; -webkit-print-color-adjust: exact; }
      body::before { content: "${header.replace(/"/g, '\\"')}"; position: fixed; top: 10mm; left: 15mm; right: 15mm; text-align: center; font-family: "${pdfOptions.fontFamily}"; font-size: ${Math.max(9, Math.floor(pdfOptions.fontSizePt))}pt; color: #6b7280; }
      ${pdfOptions.showPageNumbers ? `body::after { content: "Page " counter(page) " / " counter(pages); position: fixed; bottom: 12mm; right: 15mm; font-family: "${pdfOptions.fontFamily}"; font-size: ${Math.max(9, Math.floor(pdfOptions.fontSizePt - 1))}pt; color: #374151; }` : ''}
      #resume-print-area .print-hide { display: none !important; }
    `;
    document.head.appendChild(style);
    const prevId = el.id;
    el.id = 'resume-print-area';
    window.print();
    setTimeout(() => {
      if (prevId) el.id = prevId; else el.removeAttribute('id');
      document.head.removeChild(style);
    }, 300);
  };

  const inlinePolish = (input: string, level: 'impactful' | 'standard' | 'conservative' = 'impactful') => {
    const keywords = {
      impactful: ['Spearheaded', 'Engineered', 'Orchestrated', 'Optimized'],
      standard: ['Led', 'Improved', 'Implemented', 'Developed'],
      conservative: ['Collaborated', 'Contributed', 'Ensured', 'Supported'],
    } as const;
    const pool = keywords[level];
    const seed = Array.from(input || 'resume').reduce((acc, c) => acc + c.charCodeAt(0), 0) + (level === 'impactful' ? 3 : level === 'standard' ? 2 : 1);
    const verb = pool[seed % pool.length];
    const metric = level === 'impactful' ? 'by 25%' : level === 'standard' ? 'by 15%' : 'by 8%';
    const extra = level === 'conservative' ? 'aligned to ATS guidelines' : 'through cross-functional collaboration';
    const base = input || 'Delivered project results';
    const action = base.replace(/^([A-Za-z]+)/, verb);
    return `${action}, increasing key metrics ${metric} ${extra}.`;
  };
  const applyInlineSuggestion = (id: string) => {
    const exp = resumeData.experience.find(e => e.id === id);
    const improved = inlinePolish(exp?.description || '', 'impactful');
    updateExperience(id, 'description', improved);
    updateExperience(id, 'isOptimized', true);
  };
  const formatToUSMonthYear = (input: string) => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const mzh = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
    const s = (input || '').trim();
    if (!s) return '';
    const m1 = s.match(/(\d{4})[-/年.]\s*(\d{1,2})/);
    if (m1) {
      const y = parseInt(m1[1], 10);
      const mo = Math.max(1, Math.min(12, parseInt(m1[2], 10)));
      return `${months[mo - 1].slice(0,3) === 'May' ? 'May' : months[mo - 1]} ${y}`;
    }
    const m2 = s.match(/(\d{4}).*?(一|二|三|四|五|六|七|八|九|十|十一|十二)/);
    if (m2) {
      const y = parseInt(m2[1], 10);
      const idx = mzh.indexOf(m2[2]) + 1;
      const mo = Math.max(1, Math.min(12, idx));
      return `${months[mo - 1].slice(0,3) === 'May' ? 'May' : months[mo - 1]} ${y}`;
    }
    const m3 = months.findIndex(m => s.toLowerCase().includes(m.toLowerCase()));
    const y3 = s.match(/\b(19|20)\d{2}\b/);
    if (m3 >= 0 && y3) {
      const y = parseInt(y3[0], 10);
      return `${months[m3].slice(0,3) === 'May' ? 'May' : months[m3]} ${y}`;
    }
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return `${months[d.getMonth()].slice(0,3) === 'May' ? 'May' : months[d.getMonth()]} ${d.getFullYear()}`;
    }
    return s;
  };
  const onFormatDuration = (id: string) => {
    const exp = resumeData.experience.find(e => e.id === id);
    if (!exp) return;
    const nextStart = formatToUSMonthYear(exp.startDate);
    const nextEnd = formatToUSMonthYear(exp.endDate);
    updateExperience(id, 'startDate', nextStart);
    updateExperience(id, 'endDate', nextEnd);
  };
  const formatGPA = (input?: string) => {
    const s = (input || '').trim();
    if (!s) return '';
    const m = s.match(/(\d+(\.\d+)?)/);
    if (!m) return '';
    let v = parseFloat(m[1]);
    if (isNaN(v)) return '';
    v = Math.max(0, Math.min(4.0, v));
    const x = Math.round(v * 10) / 10;
    return `GPA: ${x.toFixed(1)}/4.0`;
  };
  const toTitle = (input?: string) => {
    const s = (input || '').trim();
    if (!s) return '';
    return s.split(/\s+/).map(t => /[A-Z]/.test(t) ? t : (t.charAt(0).toUpperCase() + t.slice(1))).join(' ');
  };
  const normalizeSkill = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
  const addSkill = () => {
    const items = newSkill.split(',').map(normalizeSkill).filter(Boolean);
    if (!items.length) return;
    const existing = new Set(resumeData.skills.map(k => k.toLowerCase()));
    const merged = [...resumeData.skills];
    for (const it of items) {
      if (!existing.has(it)) {
        merged.push(it);
        existing.add(it);
      }
    }
    setResumeData(prev => ({ ...prev, skills: merged }));
    setNewSkill('');
    setShowSkillInput(false);
  };
  const applyStrongVerb = (id: string, verb: string) => {
    const exp = resumeData.experience.find(e => e.id === id);
    const txt = exp?.description || '';
    const lines = txt.split('\n').map(line => {
      const m = line.match(/^([A-Za-z]+)(.*)$/);
      if (m) return `${verb}${m[2]}`;
      return `${verb} ${line}`.trim();
    });
    const next = lines.join('\n');
    updateExperience(id, 'description', next);
  };

  useEffect(() => {
    if (previewRef.current) {
      gsap.fromTo(
        previewRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }
      );
    }
  }, []);
  type Experience = { id: string; company: string; position: string; startDate: string; endDate: string; description: string; isOptimized?: boolean };
  type ResumeDataShape = { personalInfo: Record<string, string>; experience: Experience[]; education: unknown; skills: unknown };
  type ImportMessage = { type?: string; payload?: Partial<ResumeDataShape> };
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e?.data as unknown;
      const m = d as ImportMessage;
      if (m && m.type === 'resumeai_import' && m.payload) {
        handleImportComplete(m.payload);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);
  useEffect(() => {
    const raw = localStorage.getItem('resumeSelectedTemplate');
    let parsed: unknown = null;
    try { parsed = raw ? JSON.parse(raw) : null } catch { parsed = null }
    if (parsed && typeof parsed === 'object' && parsed !== null && 'id' in (parsed as object)) {
      const t = parsed as { id: string; name: string; style: string; color: string; font: string };
      setSelectedTemplate({
        id: t.id,
        name: t.name,
        style: (['modern','classic','minimal','creative','elegant'].includes(t.style) ? t.style : 'modern') as 'modern'|'classic'|'minimal'|'creative'|'elegant',
        color: t.color,
        font: t.font,
      });
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tid = params.get('template');
      if (tid) {
        const all = getAllTemplates();
        const t = all.find(x => x.id === tid);
        if (t) applyTemplate(t);
      }
    }
  }, []);

  type Template = { id: string; name: string; style: 'modern'|'classic'|'minimal'|'creative'|'elegant'; color: string; font: string; atsScore: number; tags: string[] };
  const ensureStyle = (s: unknown): Template['style'] => {
    const v = typeof s === 'string' ? s : '';
    return (['modern','classic','minimal','creative','elegant'].includes(v) ? v : 'modern') as Template['style'];
  };
  const getAllTemplates = (): Template[] => {
    const customRaw = localStorage.getItem('customTemplates') || '[]';
    let customParsed: unknown = [];
    try { customParsed = JSON.parse(customRaw) } catch { customParsed = [] }
    const builtins = [
      { id: '1', name: 'Modern Tech Pro', style: 'modern' as const, color: '#0ea5e9', font: 'Inter', atsScore: 98, tags: ['ATS-Optimized', 'Skills Highlight'] },
      { id: '2', name: 'Minimal Developer', style: 'minimal' as const, color: '#111827', font: 'Inter', atsScore: 97, tags: ['Clean Layout'] },
      { id: '3', name: 'Classic Senior', style: 'classic' as const, color: '#1f2937', font: 'Georgia', atsScore: 95, tags: ['Leadership Focus'] },
      { id: '4', name: 'Creative Coder', style: 'creative' as const, color: '#8b5cf6', font: 'Inter', atsScore: 94, tags: ['Visual Accents'] },
      { id: '5', name: 'Elegant Manager', style: 'elegant' as const, color: '#374151', font: 'Serif', atsScore: 96, tags: ['Executive'] },
    ];
    const arr = Array.isArray(customParsed) ? customParsed : [];
    const mappedCustom: Template[] = arr.map((c, idx) => {
      const obj = typeof c === 'object' && c !== null ? (c as Record<string, unknown>) : {};
      return {
        id: typeof obj.id === 'string' ? obj.id : `c-${idx}`,
        name: typeof obj.name === 'string' ? obj.name : 'Custom Template',
        style: ensureStyle(obj.style),
        color: '#1f2937',
        font: 'Inter',
        atsScore: typeof obj.atsScore === 'number' ? obj.atsScore : 95,
        tags: Array.isArray(obj.tags) ? (obj.tags.filter((t): t is string => typeof t === 'string')) : ['Custom'],
      };
    });
    return [...builtins, ...mappedCustom];
  };
  const applyTemplate = (tpl: Template) => {
    const next = {
      id: tpl.id,
      name: tpl.name,
      style: tpl.style,
      color: tpl.color,
      font: tpl.font,
    };
    setSelectedTemplate(next);
    localStorage.setItem('resumeSelectedTemplate', JSON.stringify(next));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',

    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    if (field === 'isOptimized') {
      if (value === true) {
        setCollapsedExpIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      } else {
        setCollapsedExpIds((prev) => prev.filter((x) => x !== id));
      }
    }
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const toggleExperienceCollapsed = (id: string) => {
    setCollapsedExpIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };
  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };
  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleImportComplete = (data: unknown) => {
    const obj = (data && typeof data === 'object') ? (data as Record<string, unknown>) : {};
    const pi = obj['personalInfo'];
    const expSrc = obj['experience'];
    const eduSrc = obj['education'];
    const skillsSrc = obj['skills'];
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...((pi && typeof pi === 'object') ? (pi as Record<string, string>) : {}),
      },
      experience: (Array.isArray(expSrc) ? expSrc : prev.experience).map((exp: unknown, idx: number) => {
        const e = (exp && typeof exp === 'object') ? (exp as Record<string, unknown>) : {};
        return {
          id: typeof e.id === 'string' ? e.id : `${Date.now()}-${idx}`,
          company: typeof e.company === 'string' ? e.company : '',
          position: typeof e.position === 'string' ? e.position : '',
          startDate: typeof e.startDate === 'string' ? e.startDate : '',
          endDate: typeof e.endDate === 'string' ? e.endDate : '',
          description: typeof e.description === 'string' ? e.description : '',
          isOptimized: !!e.isOptimized,
        };
      }),
      education: (Array.isArray(eduSrc)
        ? (eduSrc as unknown[]).map((ed: unknown, i: number) => {
            const e = (ed && typeof ed === 'object') ? (ed as Record<string, unknown>) : {};
            return {
              id: typeof e.id === 'string' ? e.id : `ed-${Date.now()}-${i}`,
              school: typeof e.school === 'string' ? e.school : '',
              degree: typeof e.degree === 'string' ? e.degree : '',
              field: typeof e.field === 'string' ? e.field : '',
              graduationDate: typeof e.graduationDate === 'string' ? e.graduationDate : '',
            };
          })
        : prev.education),
      skills: (Array.isArray(skillsSrc)
        ? (skillsSrc as unknown[]).filter((s: unknown): s is string => typeof s === 'string')
        : prev.skills),
    }));
  };

  const handleAIPolish = (expId: string) => {
    setSelectedExpId(expId);
    setShowAIPolish(true);
  };

  const applyPolish = (polishedText: string) => {
    if (selectedExpId) {
      updateExperience(selectedExpId, 'description', polishedText);
      updateExperience(selectedExpId, 'isOptimized', true);
    }
    setShowAIPolish(false);
    setSelectedExpId(null);
  };

  const localClean = (data: ResumeData, scope: 'all' | 'current') => {
    const verbs = ['Spearheaded', 'Optimized', 'Architected', 'Implemented', 'Automated', 'Led', 'Improved'];
    const improveSentence = (txt: string) => {
      let t = txt.trim();
      if (!t) return t;
      if (cleanOpts.capitalization) {
        t = t.replace(/\s+/g, ' ');
        t = t.charAt(0).toUpperCase() + t.slice(1);
      }
      if (cleanOpts.grammarFix) {
        t = t.replace(/\bfix(ed|ing)?\b/gi, 'resolved');
        t = t.replace(/\bbug(s)?\b/gi, 'issues');
      }
      if (cleanOpts.actionVerbs) {
        t = t.replace(/^(Responsible for|Worked on|Helped|Participated in)\b/i, () => verbs[Math.floor(Math.random() * verbs.length)]);
      }
      return t;
    };
    let affected = 0;
    let improved = 0;
    const next: ResumeData = JSON.parse(JSON.stringify(data));
    const applyOnExp = () => {
      next.experience = next.experience.map((exp) => {
        const before = exp.description || '';
        let after = before;
        after = improveSentence(after);
        if (cleanOpts.dedupeBullets) {
          after = after.replace(/\n{2,}/g, '\n').replace(/-+\s*/g, '- ');
        }
        if (before !== after) {
          affected += 1;
          improved += 1;
        }
        return { ...exp, description: after, isOptimized: true };
      });
    };
    const applyOnSummary = () => {
      const before = next.personalInfo.summary || '';
      const after = improveSentence(before);
      if (before !== after) {
        affected += 1;
        improved += 1;
      }
      next.personalInfo.summary = after;
    };
    const applyOnSkills = () => {
      const seen = new Set<string>();
      const out: string[] = [];
      for (const raw of next.skills) {
        const norm = normalizeSkill(raw);
        if (!norm || seen.has(norm)) continue;
        seen.add(norm);
        out.push(norm);
      }
      next.skills = out;
    };
    const applyOnEducation = () => {
      next.education = next.education.map(ed => ({ ...ed, field: improveSentence(ed.field) }));
    };
    if (scope === 'all') {
      applyOnSummary();
      applyOnExp();
      applyOnSkills();
      applyOnEducation();
    } else {
      if (activeSection === 'experience') applyOnExp();
      if (activeSection === 'personal') applyOnSummary();
      if (activeSection === 'skills') applyOnSkills();
      if (activeSection === 'education') applyOnEducation();
    }
    return { next, stats: { affected, improved } };
  };

  const runCleaning = async () => {
    setIsCleaning(true);
    setCleanStats(null);
    try {
      const base = (typeof window !== 'undefined' ? localStorage.getItem('cleanApi.base') : '') || '/api';
      const token = (typeof window !== 'undefined' ? localStorage.getItem('cleanApi.token') : '') || '';
      const resp = await fetch(`${base.replace(/\/$/, '')}/clean-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          scope: cleanScope,
          options: cleanOpts,
          data: resumeData,
          activeSection,
        }),
      });
      if (resp.ok) {
        const payload = await resp.json();
        const next = payload?.data as ResumeData | null;
        const stats = payload?.stats || null;
        if (next) {
          setResumeData(next);
          if (stats) setCleanStats(stats);
        } else {
          const { next: localNext, stats } = localClean(resumeData, cleanScope);
          setResumeData(localNext);
          setCleanStats(stats);
        }
      } else {
        const { next, stats } = localClean(resumeData, cleanScope);
        setResumeData(next);
        setCleanStats(stats);
      }
    } catch {
      const { next, stats } = localClean(resumeData, cleanScope);
      setResumeData(next);
      setCleanStats(stats);
    } finally {
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (!id) return;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    const load = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/resumes/${numericId}`);
        if (!resp.ok) return;
        const data = await resp.json();
        if (!data?.ok || !data.resume?.content) return;
        const parsed = JSON.parse(data.resume.content) as ResumeData;
        setResumeData(parsed);
        setResumeId(data.resume.id as number);
      } catch (error) {
        console.error("Failed to load resume", error);
      }
    };
    load();
  }, [location.search]);

  const getResumeTitle = () => {
    const name = resumeData.personalInfo.fullName?.trim();
    const title = resumeData.personalInfo.title?.trim();
    if (name && title) return `${name} · ${title}`;
    if (name) return `${name} · Resume`;
    return 'My Resume';
  };

  const saveResume = async () => {
    try {
      const payload = {
        userId: 'demo-user',
        title: getResumeTitle(),
        content: JSON.stringify(resumeData),
      };
      const url = resumeId ? `${API_BASE_URL}/resumes/${resumeId}` : `${API_BASE_URL}/resumes`;
      const method = resumeId ? 'PUT' : 'POST';
      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) return;
      const data = await resp.json();
      if (data?.ok && data.resume?.id) {
        setResumeId(data.resume.id as number);
      }
    } catch (error) {
      console.error("Failed to save resume", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="fixed top-16 left-0 right-0 z-40 border-b border-border glass">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex flex-col gap-3 items-stretch">
            <div className="flex items-center gap-4">
              <div className="h-6 w-px bg-gray-200" />
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => setIsTemplateOpen(true)}>
                <FileText className="w-4 h-4" />
                模板选择
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsImportOpen(true)}
              >
                <Upload className="w-4 h-4" />
                导入简历
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setShowCleaningDialog(true)}
              >
                <Sparkles className="w-4 h-4" />
                AI 清洗
              </Button>
            </div>

            {isLayoutFixMode && (
              <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50/70">
                <div>
                  <div className="text-xs font-medium text-amber-700">
                    ATS 排版修复模式
                  </div>
                  <p className="text-[11px] text-amber-700 mt-1">
                    已从 ATS 深度报告跳转，优先修复双栏布局与非标准字体等问题。
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-600">修复前后对比</span>
                    <Switch
                      checked={showLayoutBeforeAfter}
                      onCheckedChange={(v) => setShowLayoutBeforeAfter(!!v)}
                    />
                  </div>
                  <Button
                    size="sm"
                    className="gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white"
                    onClick={handleApplyLayoutFix}
                    disabled={hasAppliedLayoutFix}
                  >
                    <Sparkles className="w-4 h-4" />
                    {hasAppliedLayoutFix ? '已完成排版修复' : '执行 AI 格式修复'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">ATS 分数: {atsScore}/100</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">数据同步成功</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={saveResume}
            >
              <CheckCircle className="w-4 h-4" />
              保存到云端
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white"
              onClick={() => setShowExportChecklist(true)}
            >
              <Download className="w-4 h-4" />
              导出 PDF
            </Button>
          </div>
        </div>
      </div>

      <main className="pt-32 pb-16">
        <div className="flex h-[calc(100vh-8rem)]">
          <div className="w-20 bg-white border-r border-border flex flex-col" style={{ transition: 'width 0.3s ease' }}>
            <div className="p-4 border-b border-border"></div>
            
            <nav className="flex-1 p-3 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-center px-3 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                </button>
              ))}
            </nav>

          </div>

          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            {activeSection === 'experience' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">工作经历</h2>
                    <p className="text-sm text-gray-500">Work Experience</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">完成度: 65%</span>
                    <Button variant="outline" size="sm" className="gap-1 text-blue-600">
                      <Plus className="w-4 h-4" />
                      手动添加
                    </Button>
                  </div>
                </div>

                {resumeData.experience.map((exp) => {
                  const isCollapsed = collapsedExpIds.includes(exp.id);
                  return (
                    <div
                      key={exp.id}
                      className={`bg-white/95 rounded-2xl shadow-md overflow-hidden border border-slate-100 ${
                        hasAppliedLayoutFix && showLayoutBeforeAfter
                          ? 'ring-2 ring-brand-orange/40 bg-amber-50/40'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
                        <button
                          type="button"
                          onClick={() => toggleExperienceCollapsed(exp.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <GripVertical className="w-5 h-5 text-gray-300 cursor-move" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {exp.position || 'New Position'} at {exp.company || 'Company'}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {isCollapsed ? '已核对完成，可随时展开检查' : '当前正在编辑，完成后可折叠'}
                            </p>
                            {hasAppliedLayoutFix && showLayoutBeforeAfter && (
                              <p className="text-[11px] text-amber-700 mt-1">
                                已应用 AI 排版修复：统一为单栏布局与标准字体。
                              </p>
                            )}
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          {exp.isOptimized ? (
                            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1 badge-soft-pulse">
                              <CheckCircle className="w-3 h-3" />
                              已就绪 (Ready)
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-full flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              待核对 (Requires Review)
                            </span>
                          )}
                          <ChevronLeft
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              isCollapsed ? '-rotate-90' : 'rotate-90'
                            }`}
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      {!isCollapsed && (
                        <div className="p-4 space-y-4 bg-white">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-gray-500">公司名称</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">起止时间（美式ATS标准化）</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => onFormatDuration(exp.id)}
                                >
                                  标准化日期
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">关键成就（要点）</Label>
                            <div className="relative mt-1">
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                className="min-h-[120px] pr-10"
                              />
                              <button
                                onClick={() => handleAIPolish(exp.id)}
                                className="absolute top-2 right-2 p-1.5 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Sparkles className="w-4 h-4 text-blue-600" />
                              </button>
                              <div className="absolute bottom-2 right-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-xs">
                                      动词建议
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>强势动词</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Spearheaded')}>
                                      Spearheaded
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Engineered')}>
                                      Engineered
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Orchestrated')}>
                                      Orchestrated
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Optimized')}>
                                      Optimized
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Led')}>
                                      Led
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Improved')}>
                                      Improved
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Implemented')}>
                                      Implemented
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => applyStrongVerb(exp.id, 'Developed')}>
                                      Developed
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {!exp.isOptimized && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-red-700">Weak bullet point detected</p>
                                    <p className="text-xs text-red-600 italic">
                                      "Missing quantifiable metrics. Try: Accomplished [X] as measured by [Y], by doing [Z]."
                                    </p>
                                  </div>
                                  <Button size="sm" variant="ghost" className="text-blue-600 text-xs">
                                    Apply Google XYP Formula
                                  </Button>
                                </div>
                              </div>
                            )}

                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-blue-700 mb-1">AI 建议（XYP 强化，美式ATS）</p>
                                  <p className="text-sm text-gray-800">
                                    {inlinePolish(exp.description || '', 'impactful')}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => applyInlineSuggestion(exp.id)}
                                >
                                  应用 AI 优化建议
                                </Button>
                              </div>
                            </div>

                            {exp.isOptimized && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800">
                                  Spearheaded transition to microservices architecture, improving system scalability by
                                  40% and reducing deployment time by 2 hours.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <Button onClick={addExperience} variant="outline" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  添加工作经历
                </Button>
              </div>
            )}

            {activeSection === 'personal' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-brand-orange rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">基本信息</h2>
                  <span className="text-sm text-gray-400">Personal Information</span>
                </div>

                  <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">姓名</Label>
                      <Input 
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">当前职位</Label>
                      <Input 
                        value={resumeData.personalInfo.title}
                        onChange={(e) => updatePersonalInfo('title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">邮箱</Label>
                      <Input 
                        value={resumeData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">所在地（City, State）</Label>
                      <Input 
                        value={resumeData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">职业摘要</Label>
                    <Textarea 
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-brand-orange rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">教育背景</h2>
                  <span className="text-sm text-gray-400">Education</span>
                </div>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">教育记录</span>
                      <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">学校名称</Label>
                        <Input 
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">学位</Label>
                        <Input 
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">专业</Label>
                        <Input 
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">毕业时间</Label>
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => updateEducation(edu.id, 'graduationDate', formatToUSMonthYear(edu.graduationDate))}>
                            标准化日期
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">GPA（选填）</Label>
                        <Input 
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={addEducation} variant="outline" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  添加教育背景
                </Button>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-brand-orange rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">技能特长</h2>
                  <span className="text-sm text-gray-400">Skills & Expertise</span>
                </div>

                <div className="bg-white rounded-xl border shadow-sm p-6">
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                        <button className="hover:text-blue-900" onClick={() => removeSkill(index)}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {showSkillInput ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-dashed border-gray-300 rounded-full">
                        <Input 
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') addSkill(); }}
                          className="h-7 w-40 text-sm"
                          placeholder="输入技能, 逗号分隔"
                        />
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={addSkill}>添加</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setShowSkillInput(false); setNewSkill(''); }}>取消</Button>
                      </div>
                    ) : (
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-blue-400 hover:text-blue-600" onClick={() => setShowSkillInput(true)}>
                        <Plus className="w-3 h-3" />
                        添加技能
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {showPreview && (
            <div className="w-[520px] bg-slate-900 border-l border-slate-800 flex items-center justify-center">
              <div
                ref={previewRef}
                className="max-h-[calc(100vh-8rem)] w-[460px] bg-white rounded-2xl shadow-2xl overflow-auto"
                style={{ fontFamily: '"Times New Roman", ui-serif' }}
              >
              <div className="p-8">
                <div className="space-y-6">
                  <div
                    className={`${
                      selectedTemplate.style === 'classic'
                        ? 'text-left'
                        : selectedTemplate.style === 'minimal'
                        ? 'text-left'
                        : 'text-center'
                    } border-b pb-6`}
                    style={{ borderColor: selectedTemplate.color }}
                  >
                    <h1 className="text-2xl font-bold uppercase tracking-wide" style={{ color: selectedTemplate.color }}>
                      {resumeData.personalInfo.fullName}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2 flex-wrap">
                      <span>{resumeData.personalInfo.location}</span>
                      <span>•</span>
                      <span>{resumeData.personalInfo.phone}</span>
                      <span>•</span>
                      <span>{resumeData.personalInfo.email}</span>
                      <span>•</span>
                      <span className="text-blue-600">{resumeData.personalInfo.linkedin}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ borderColor: selectedTemplate.color, color: selectedTemplate.style === 'creative' ? selectedTemplate.color : '#111827' }}>
                      Professional Summary
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {resumeData.personalInfo.summary}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ borderColor: selectedTemplate.color, color: selectedTemplate.style === 'creative' ? selectedTemplate.color : '#111827' }}>
                      Professional Experience
                    </h2>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="mb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold" style={{ color: '#111827' }}>{exp.company}</h3>
                            <p className="text-sm" style={{ color: '#374151' }}>{exp.position}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p>{resumeData.personalInfo.location}</p>
                            <p>{exp.startDate} – {exp.endDate}</p>
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {exp.description.split('\n').map((item, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-gray-400 mt-1.5">•</span>
                              <span dangerouslySetInnerHTML={{ 
                                __html: item.replace(/(\d+%)/g, '<strong>$1</strong>') 
                              }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ borderColor: selectedTemplate.color, color: selectedTemplate.style === 'creative' ? selectedTemplate.color : '#111827' }}>
                      Education
                    </h2>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold" style={{ color: '#111827' }}>{toTitle(edu.school)}</h3>
                          <p className="text-sm" style={{ color: '#374151' }}>
                            {toTitle(edu.degree)} in {toTitle(edu.field)}{edu.gpa ? ` | ${formatGPA(edu.gpa)}` : ''}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ borderColor: selectedTemplate.color, color: selectedTemplate.style === 'creative' ? selectedTemplate.color : '#111827' }}>
                      Skills
                    </h2>
                    <p className="text-sm text-gray-700">
                      {resumeData.skills.map(s => toTitle(s)).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">智能建议</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        您的"工作经历"中缺少量化指标。尝试加入百分比（如：效率提升 20%）来吸引招聘官。
                      </p>
                      <Button size="sm" variant="ghost" className="mt-2 text-blue-600">
                        一键修复所有弱动词
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="hover:text-gray-700">放弃全部 (Discard All)</button>
            <span>2 项待核对，14 项已自动清洗</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">保存草稿</Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white gap-2">
              完成核对并应用 (Finish & Apply)
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      <ImportDialog 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Cleaning Utility Dialog */}
      <Dialog open={showCleaningDialog} onOpenChange={setShowCleaningDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              AI 清洗工具
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white p-4">
              <p className="text-xs text-gray-300">
                选择清洗范围与策略，支持后端接入；失败自动回退本地策略。
              </p>
            </div>
            <div>
              <Label className="text-sm">清洗范围</Label>
              <RadioGroup value={cleanScope} onValueChange={(v) => setCleanScope(v as 'all' | 'current')} className="mt-2 flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="clean-all" />
                  <Label htmlFor="clean-all">整份简历</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="current" id="clean-current" />
                  <Label htmlFor="clean-current">当前模块（{sections.find(s => s.id === activeSection)?.name || '模块'}）</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-sm">清洗策略</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox checked={cleanOpts.grammarFix} onCheckedChange={(v) => setCleanOpts({ ...cleanOpts, grammarFix: !!v })} id="opt-grammar" />
                  <Label htmlFor="opt-grammar">语法修复</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={cleanOpts.capitalization} onCheckedChange={(v) => setCleanOpts({ ...cleanOpts, capitalization: !!v })} id="opt-cap" />
                  <Label htmlFor="opt-cap">大小写与空格规范</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={cleanOpts.actionVerbs} onCheckedChange={(v) => setCleanOpts({ ...cleanOpts, actionVerbs: !!v })} id="opt-verb" />
                  <Label htmlFor="opt-verb">强化动词</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={cleanOpts.dedupeBullets} onCheckedChange={(v) => setCleanOpts({ ...cleanOpts, dedupeBullets: !!v })} id="opt-dedupe" />
                  <Label htmlFor="opt-dedupe">去重并规整条目</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={cleanOpts.alignKeywords} onCheckedChange={(v) => setCleanOpts({ ...cleanOpts, alignKeywords: !!v })} id="opt-ats" />
                  <Label htmlFor="opt-ats">关键词对齐（ATS）</Label>
                </div>
              </div>
            </div>
            {isCleaning ? (
              <div className="space-y-2">
                <Progress value={60} className="h-2" />
                <p className="text-xs text-gray-500">正在清洗，请稍候…</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={runCleaning} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Sparkles className="w-4 h-4 mr-1" />
                  开始清洗
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowCleaningDialog(false)}>
                  关闭
                </Button>
              </div>
            )}
            {cleanStats && (
              <div className="rounded-lg border p-3 text-sm text-gray-700">
                <p>已影响条目：{cleanStats.affected}，显著改进：{cleanStats.improved}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showExportChecklist} onOpenChange={setShowExportChecklist}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              简历导出前质量自检清单
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">导出就绪度</span>
                <span className="text-xs font-medium text-gray-700">{exportReadiness}%</span>
              </div>
              <Progress value={exportReadiness} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700">全自动扫描报告</div>
              <div className="space-y-1 text-xs">
                {exportIssues.spelling.length === 0 ? (
                  <div className="text-emerald-600">拼写与语法：未检测到明显占位符或异常文本。</div>
                ) : (
                  exportIssues.spelling.map((msg, index) => (
                    <div key={`spell-${index}`} className="text-red-600">
                      {msg}
                    </div>
                  ))
                )}
                {exportIssues.links.length === 0 ? (
                  <div className="text-emerald-600">超链接：主要链接格式正常。</div>
                ) : (
                  exportIssues.links.map((msg, index) => (
                    <div key={`link-${index}`} className="flex items-center justify-between gap-2">
                      <span className="text-red-600">{msg}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-7 px-2"
                        onClick={() => {
                          const current = resumeData.personalInfo.linkedin || '';
                          const next = current
                            ? current.startsWith('http')
                              ? current
                              : `https://${current}`
                            : 'https://linkedin.com/in/your-profile';
                          setResumeData({
                            ...resumeData,
                            personalInfo: {
                              ...resumeData.personalInfo,
                              linkedin: next,
                            },
                          });
                        }}
                      >
                        快速修复
                      </Button>
                    </div>
                  ))
                )}
                {exportIssues.typography.length === 0 ? (
                  <div className="text-emerald-600">排版一致性：字体和字号均在推荐范围内。</div>
                ) : (
                  exportIssues.typography.map((msg, index) => (
                    <div key={`typo-${index}`} className="flex items-center justify-between gap-2">
                      <span className="text-red-600">{msg}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-7 px-2"
                        onClick={() => {
                          setPdfOptions({
                            ...pdfOptions,
                            fontFamily: 'Arial',
                            fontSizePt:
                              pdfOptions.fontSizePt < 9 || pdfOptions.fontSizePt > 12
                                ? 10.5
                                : pdfOptions.fontSizePt,
                          });
                        }}
                      >
                        快速修复
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700">关键信息二次确认</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 rounded-lg border border-border bg-muted/40">
                  <div className="text-gray-500">联系电话</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {resumeData.personalInfo.phone || '未填写'}
                  </div>
                </div>
                <div className="p-2 rounded-lg border border-border bg-muted/40">
                  <div className="text-gray-500">邮箱</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {resumeData.personalInfo.email || '未填写'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  id="confirm-contact"
                  checked={contactConfirmed}
                  onCheckedChange={(v) => setContactConfirmed(!!v)}
                />
                <Label htmlFor="confirm-contact" className="text-xs text-gray-600">
                  我已肉眼核对电话和邮箱，确认无误。
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700">美式简历合规性检测</div>
              {exportIssues.compliance.length === 0 ? (
                <p className="text-xs text-emerald-600">
                  未检测到照片、年龄或婚姻状况等敏感个人信息。
                </p>
              ) : (
                exportIssues.compliance.map((msg, index) => (
                  <p key={`comp-${index}`} className="text-xs text-red-600">
                    {msg}
                  </p>
                ))
              )}
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  id="confirm-us"
                  checked={usComplianceConfirmed}
                  onCheckedChange={(v) => setUsComplianceConfirmed(!!v)}
                />
                <Label htmlFor="confirm-us" className="text-xs text-gray-600">
                  我确认已移除不符合美式职场规范的内容。
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExportChecklist(false);
                }}
              >
                取消
              </Button>
              <Button
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                disabled={!canExport}
                onClick={() => {
                  exportPDF();
                  setShowExportChecklist(false);
                }}
              >
                {canExport ? '导出简历（完全就绪）' : '请先完成关键检查'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>导出设置</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>字体</Label>
              <Select value={pdfOptions.fontFamily} onValueChange={(v) => setPdfOptions({ ...pdfOptions, fontFamily: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>字号</Label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min={8}
                  max={14}
                  step={0.5}
                  value={pdfOptions.fontSizePt}
                  onChange={(e) => setPdfOptions({ ...pdfOptions, fontSizePt: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm w-16 text-right">{pdfOptions.fontSizePt} pt</span>
              </div>
            </div>
            <div>
              <Label>页边距</Label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  value={pdfOptions.marginInches}
                  onChange={(e) => setPdfOptions({ ...pdfOptions, marginInches: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm w-16 text-right">{pdfOptions.marginInches} in</span>
              </div>
            </div>
            <div>
              <Label>行距</Label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min={1.0}
                  max={1.8}
                  step={0.05}
                  value={pdfOptions.lineSpacing}
                  onChange={(e) => setPdfOptions({ ...pdfOptions, lineSpacing: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm w-16 text-right">{pdfOptions.lineSpacing}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>页眉文案（姓名 / 邮箱 / 电话）</Label>
              <input
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={pdfOptions.headerText}
                onChange={(e) => setPdfOptions({ ...pdfOptions, headerText: e.target.value })}
                placeholder={`${resumeData.personalInfo.fullName} • ${resumeData.personalInfo.email} • ${resumeData.personalInfo.phone}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>显示页码</Label>
              <Switch
                checked={pdfOptions.showPageNumbers}
                onCheckedChange={(v) => setPdfOptions({ ...pdfOptions, showPageNumbers: v })}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('pdfOptions', JSON.stringify(pdfOptions));
                }
                setIsExportOpen(false);
              }}
            >
              保存
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setIsExportOpen(false)}>
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Select Dialog */}
      <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              模板选择
              <Badge variant="outline">{selectedTemplate.name}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getAllTemplates().map((tpl) => (
              <button
                key={tpl.id}
                className={`border rounded-xl p-3 text-left hover:shadow-sm transition ${selectedTemplate.id === tpl.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => applyTemplate(tpl)}
              >
                <div className="h-32 bg-gray-50 rounded mb-2 overflow-hidden relative">
                  <div className="absolute inset-3">
                    <div className="border-b mb-2" style={{ borderColor: tpl.color }} />
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 w-2/3" />
                      <div className="h-2 bg-gray-300 w-1/2" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{tpl.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{tpl.style}</p>
                  </div>
                  <Badge>ATS {tpl.atsScore}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tpl.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsTemplateOpen(false)}>
              应用
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setIsTemplateOpen(false)}>
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* AI Polish Panel */}
      {showAIPolish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <AIPolishPanel
              originalText={selectedExpId ? resumeData.experience.find(e => e.id === selectedExpId)?.description || '' : ''}
              onApply={applyPolish}
              onClose={() => {
                setShowAIPolish(false);
                setSelectedExpId(null);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex items-center justify-end gap-3">
        <Button variant="outline">保存草稿</Button>
        <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">完成校对并应用</Button>
      </div>
    </div>
  );
}
