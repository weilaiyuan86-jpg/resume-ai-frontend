import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Linkedin, FileText, CheckCircle2, 
  Loader2, X, ChevronRight, Shield
} from 'lucide-react';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (data: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
    };
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      field: string;
      graduationDate: string;
    }>;
    skills: string[];
  }) => void;
}

type ImportSource = 'linkedin' | 'pdf' | 'word' | null;
type ImportStep = 'select' | 'connect' | 'sync' | 'optimize' | 'complete';

const importSources = [
  {
    id: 'linkedin' as ImportSource,
    name: 'LinkedIn',
    description: '授权同步您的LinkedIn职业信息',
    icon: Linkedin,
    color: 'bg-[#0A66C2]',
    features: ['基本资料', '经历与教育', '技能关键词'],
  },
  {
    id: 'pdf' as ImportSource,
    name: 'PDF简历',
    description: '上传PDF格式简历自动解析',
    icon: FileText,
    color: 'bg-red-500',
    features: ['智能识别', '自动填充', '格式保留'],
  },
  {
    id: 'word' as ImportSource,
    name: 'Word文档',
    description: '上传Word格式简历自动解析',
    icon: FileText,
    color: 'bg-blue-500',
    features: ['智能识别', '自动填充', '格式保留'],
  },
];

export default function ImportDialog({ isOpen, onClose, onImportComplete }: ImportDialogProps) {
  const [, setSelectedSource] = useState<ImportSource>(null);
  const [currentStep, setCurrentStep] = useState<ImportStep>('select');
  const [progress, setProgress] = useState(0);

  const handleSourceSelect = (source: ImportSource) => {
    setSelectedSource(source);
    setCurrentStep('connect');
  };

  const handleConnect = () => {
    setCurrentStep('sync');
    setProgress(33);
    
    // Simulate sync process
    setTimeout(() => {
      setCurrentStep('optimize');
      setProgress(66);
      
      setTimeout(() => {
        setCurrentStep('complete');
        setProgress(100);
        
        setTimeout(() => {
          onImportComplete({
            personalInfo: {
              fullName: 'Alexander Sterling',
              email: 'alexander.sterling@example.com',
              phone: '(555) 123-4567',
              location: 'San Francisco, CA',
            },
            experience: [
              {
                company: 'TechGlobal Solutions Inc.',
                position: 'Senior Software Engineer',
                startDate: 'Jan 2020',
                endDate: 'Present',
                description: 'Led a cross-functional team of 10 to deliver a distributed cloud platform.',
              },
            ],
            education: [
              {
                school: 'University of California, Berkeley',
                degree: 'Bachelor of Science',
                field: 'Computer Science',
                graduationDate: '2017',
              },
            ],
            skills: ['TypeScript', 'Python', 'React.js', 'AWS', 'Docker', 'Microservices'],
          });
          onClose();
          setCurrentStep('select');
          setSelectedSource(null);
          setProgress(0);
        }, 1500);
      }, 2000);
    }, 2000);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'connect', label: '连接 (Connect)' },
      { key: 'sync', label: '同步 (Sync)' },
      { key: 'optimize', label: '优化 (Optimize)' },
    ];
    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index <= currentIndex ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {index < currentIndex ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`text-sm ${index <= currentIndex ? 'text-brand-orange font-medium' : 'text-gray-400'}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${index < currentIndex ? 'bg-brand-orange' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'select':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">选择数据来源导入您的简历信息</p>
            {importSources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceSelect(source.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-brand-orange hover:bg-brand-orange/5 transition-all text-left"
              >
                <div className={`w-12 h-12 rounded-xl ${source.color} flex items-center justify-center text-white`}>
                  <source.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  <p className="text-sm text-gray-500">{source.description}</p>
                  <div className="flex gap-2 mt-2">
                    {source.features.map((feature, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        );

      case 'connect':
        return (
          <div className="text-center">
            {renderStepIndicator()}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#0A66C2]/10 flex items-center justify-center">
                <Linkedin className="w-10 h-10 text-[#0A66C2]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">授权您的 LinkedIn 数据</h3>
              <p className="text-gray-500">我们使用官方 API 安全地同步您的职业信息</p>
            </div>

            <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
              {[
                { title: '基本资料 (Basic Profile)', desc: '用于生成简历头像、姓名和联系方式。' },
                { title: '经历与教育 (Experience & Education)', desc: '用于 AI 生成符合美国市场标准的 ATS 优化职场描述。' },
                { title: '技能关键词 (Skills & Endorsements)', desc: '用于精准匹配目标职位并突出核心竞争优势。' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleConnect}
              className="w-full max-w-md bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white h-12"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              通过 LinkedIn 授权登录
            </Button>
            <button 
              onClick={() => setCurrentStep('select')}
              className="mt-4 text-gray-400 hover:text-gray-600 text-sm"
            >
              以后再说 (Skip for now)
            </button>

            <div className="mt-8 pt-6 border-t flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-gray-600">服务条款</a>
                <a href="#" className="hover:text-gray-600">隐私政策</a>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                OFFICIAL API PARTNER
              </div>
            </div>
          </div>
        );

      case 'sync':
      case 'optimize':
        return (
          <div className="text-center py-12">
            {renderStepIndicator()}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentStep === 'sync' ? '正在同步数据...' : 'AI 正在优化您的简历...'}
            </h3>
            <p className="text-gray-500 mb-8">
              {currentStep === 'sync' ? '请稍候，我们正在从 LinkedIn 获取您的职业信息' : '正在分析并优化您的经历描述'}
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-400 mt-2">{progress}% 完成</p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center py-12">
            {renderStepIndicator()}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">导入成功！</h3>
            <p className="text-gray-500">您的简历信息已成功导入并优化</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>导入简历</span>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
