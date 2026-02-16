import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/sections/Hero';
import ClientLogos from '@/sections/ClientLogos';
import Features from '@/sections/Features';
import HowItWorks from '@/sections/HowItWorks';
import Templates from '@/sections/Templates';
import Pricing from '@/sections/Pricing';
import Testimonials from '@/sections/Testimonials';
import FAQ from '@/sections/FAQ';
import CTA from '@/sections/CTA';

interface AtsQuickTestFloatProps {
  collapsedByDefault?: boolean;
}

function AtsQuickTestFloat({ collapsedByDefault = false }: AtsQuickTestFloatProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreLabel, setScoreLabel] = useState('');
  const [scoreGain, setScoreGain] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(collapsedByDefault);

  const startScan = (file: File) => {
    setFileName(file.name);
    setIsDragging(false);
    setIsScanning(true);
    setProgress(0);

    setTimeout(() => setProgress(65), 300);
    setTimeout(() => setProgress(100), 900);
    setTimeout(() => {
      setIsScanning(false);
      const baseScore = 50 + Math.round(Math.random() * 30);
      const gain = 15 + Math.round(Math.random() * 10);
      const label =
        baseScore >= 80 ? '较强' : baseScore >= 60 ? '中等' : '偏弱';
      setScore(baseScore);
      setScoreGain(gain);
      setScoreLabel(label);
      setShowReport(true);
    }, 1300);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startScan(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      startScan(file);
    }
  };

  const ringStyle =
    isScanning || progress > 0
      ? {
          backgroundImage: `conic-gradient(#fb923c ${progress}%, #e5e7eb ${progress}%)`,
        }
      : {};

  return (
    <>
      <div className="fixed right-4 bottom-24 sm:right-6 sm:bottom-24 z-40 max-w-sm w-full">
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="ml-auto flex items-center justify-center w-14 h-14 rounded-full bg-brand-orange text-white shadow-glow hover:bg-brand-orange/90 hover:shadow-glow-strong transition-all duration-300 ease-out hover:scale-110"
            aria-label="打开 ATS 测分浮窗"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand-orange font-semibold text-xs">
              ATS
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-brand-orange" />
            </span>
          </button>
        ) : (
        <div className="bg-card border border-border shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  你的简历能过 ATS 吗？
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  拖入简历，AI 即时测分，看看能不能通过机器筛选。
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="收起测分浮窗"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div
            className={`mt-1 border-2 border-dashed rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary hover:bg-primary/5'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <label htmlFor="ats-float-upload" className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Upload className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">
                  拖拽或点击上传简历
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  支持 PDF / DOC / DOCX，无需注册即可体验
                </p>
                {fileName && (
                  <p className="text-[11px] sm:text-xs text-primary mt-0.5 truncate">
                    已选择：{fileName}
                  </p>
                )}
              </div>
            </label>
            <input
              id="ats-float-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
            <div
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 relative"
              style={ringStyle}
            >
              <div className="w-7 h-7 rounded-full bg-card flex items-center justify-center text-[11px] font-semibold text-gray-600">
                {isScanning ? (
                  <span>扫描中</span>
                ) : progress > 0 ? (
                  <span>{progress}%</span>
                ) : (
                  <span>即测</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              今日已有 <span className="font-semibold text-foreground">1,200+</span> 人完成测试
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                收起
              </button>
              <Link to="/ats-checker">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-brand-orange text-white text-xs sm:text-sm font-medium shadow-glow hover:bg-brand-orange/90 transition-colors">
                  开始即时测分
                  <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        )}
      </div>

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/90 rounded-3xl shadow-2xl border border-white/60 max-w-lg w-[90%] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  ATS 竞争力得分
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                    {score}
                  </span>
                  <span className="text-sm text-gray-500">/100</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {scoreLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                关闭
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                快速诊断（Quick Wins）
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div>• 核心关键词覆盖不足（如：Python / AWS / System Design）</div>
                <div>• 描述动词偏弱，亮点不够突出（建议用「主导 / 落地」等）</div>
                <div>• 格式中存在 ATS 识别风险（特殊符号、表格或多列排版）</div>
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">优化后预计可提升</span>
                <span className="text-blue-600 font-semibold">
                  约 {scoreGain} 分
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-brand-orange to-amber-400"
                  style={{ width: `${Math.min(scoreGain + 40, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/resume-editor" className="flex-1">
                <Button className="w-full justify-center bg-brand-orange hover:bg-brand-orange/90 text-white shadow-glow hover:shadow-glow-strong transition-all duration-300 ease-elastic hover:scale-[1.02]">
                  进入编辑器一键修复
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 border-dashed"
                onClick={() => setShowReport(false)}
              >
                下载免费检查清单
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ClientLogos />
        <Features />
        <HowItWorks />
        <Templates />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <AtsQuickTestFloatWrapper />
    </div>
  );
}

function AtsQuickTestFloatWrapper() {
  const { config } = useSiteConfig();
  const features = config.features;
  const enabled = features?.enableAtsFloat ?? true;
  const collapsed = features?.atsFloatDefaultCollapsed ?? false;

  if (!enabled) return null;
  return <AtsQuickTestFloat collapsedByDefault={collapsed} />;
}
