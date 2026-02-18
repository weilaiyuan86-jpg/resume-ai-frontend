import { useEffect, useMemo, useRef } from 'react';
import { Check, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '@/hooks/useSiteConfig';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { config } = useSiteConfig();
  const homepageFeatures = config.homepage?.features;
  const features = useMemo(
    () =>
      homepageFeatures && homepageFeatures.length > 0
        ? homepageFeatures
        : [
            { title: '结构排版诊断', description: '识别影响 ATS 解析和阅读体验的版式问题' },
            { title: 'ATS 匹配度评估', description: '评估与目标 JD 的匹配度和通过概率' },
            { title: '关键词覆盖分析', description: '找出职位要求但简历中缺失的关键能力词' },
            { title: '语言表达打磨', description: '用数据和结果重新包装你的经历亮点' },
          ],
    [homepageFeatures]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      features.forEach((_, index) => {
        const featureEl = document.querySelector(`#feature-${index}`);
        const contentEl = featureEl?.querySelector('.feature-content');

        const titleEl = contentEl?.querySelector('.feature-title');
        if (titleEl) {
          gsap.fromTo(
            titleEl,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: 0.7,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: featureEl,
                start: 'top 70%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        const items = contentEl?.querySelectorAll('.feature-item');
        gsap.fromTo(
          items || [],
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: featureEl,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [features]);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">
            四维简历深度诊断
          </h2>
          <p className="text-lg text-brand-gray-1 max-w-2xl mx-auto">
            从结构排版、关键词、表达方式到 ATS 匹配度，一份报告看清所有问题，再给出对应优化方案。
          </p>
        </div>

        {/* Features */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              id={`feature-${index}`}
              className="grid lg:grid-cols-[auto,1fr] gap-6 items-start"
            >
              <div
                className="feature-image w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center shadow-glow"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <div
                className="feature-content"
              >
                <h3 className="feature-title text-2xl sm:text-3xl font-bold text-brand-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-brand-gray-1 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  <li className="feature-item flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center mt-0.5 group-hover:bg-brand-orange transition-colors duration-300">
                      <Check className="w-4 h-4 text-brand-orange group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-brand-gray-1 group-hover:text-brand-black transition-colors duration-300">
                      {feature.description}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
