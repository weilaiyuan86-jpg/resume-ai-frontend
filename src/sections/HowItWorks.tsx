import { useEffect, useRef } from 'react';
import { FileText, Edit3, Download, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: FileText,
    title: '选择模板',
    description: '从我们专业设计的ATS友好模板库中挑选，找到最适合您行业和风格的简历模板。',
  },
  {
    number: '02',
    icon: Edit3,
    title: '填入信息',
    description: '我们的AI会指导您添加针对您目标职位优化的内容，实时提供改进建议。',
  },
  {
    number: '03',
    icon: Download,
    title: '下载申请',
    description: '以PDF或Word格式导出您的专业简历，开始申请您梦想的工作。',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current?.querySelectorAll('.word') || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Progress bar animation
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.step-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { scale: 0.8, y: 50, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.6 + index * 0.2,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Connector lines animation
      const connectors = cardsRef.current?.querySelectorAll('.connector');
      connectors?.forEach((connector, index) => {
        gsap.fromTo(
          connector,
          { strokeDashoffset: 100 },
          {
            strokeDashoffset: 0,
            duration: 0.6,
            delay: 0.9 + index * 0.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-brand-gray-3/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">
            <span className="word inline-block">三步</span>{' '}
            <span className="word inline-block">打造</span>{' '}
            <span className="word inline-block text-brand-orange">完美简历</span>
          </h2>
          <p className="text-lg text-brand-gray-1 max-w-2xl mx-auto">
            简单三步，即可创建专业简历，开始您的求职之旅
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="h-1 bg-brand-gray-3 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-brand-orange to-orange-400 rounded-full"
            />
          </div>
        </div>

        {/* Steps */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="step-card bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 group">
                {/* Step Number */}
                <div className="absolute -top-4 left-8">
                  <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm shadow-glow animate-pulse-glow">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6 mt-4 group-hover:bg-brand-orange transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-brand-orange group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-brand-black mb-3">
                  {step.title}
                </h3>
                <p className="text-brand-gray-1 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-brand-orange" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
