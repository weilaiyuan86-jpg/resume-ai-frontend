import { useEffect, useRef } from 'react';
import { FileText, Edit3, Download, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: FileText,
    title: '结构不可读',
    description: '复杂排版、分栏和花哨样式会被 ATS 读成乱码，HR 也难以快速抓住重点。',
  },
  {
    number: '02',
    icon: Edit3,
    title: '匹配度太低',
    description: '和职位 JD 中的核心关键词错位，重要经历没有对齐招聘方真正关心的点。',
  },
  {
    number: '03',
    icon: Download,
    title: '表达不够有说服力',
    description: '缺少数据和结果，只讲做了什么，不讲做成怎样，很难在筛选中脱颖而出。',
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
            <span className="word inline-block">为什么</span>{' '}
            <span className="word inline-block">你的简历</span>{' '}
            <span className="word inline-block text-brand-orange">没有面试？</span>
          </h2>
          <p className="text-lg text-brand-gray-1 max-w-2xl mx-auto">
            大多数候选人输在三个看不见的细节上，我们先帮你把问题逐条查清楚。
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
