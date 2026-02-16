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
            { title: 'AI智能优化', description: '一键优化简历内容' },
            { title: 'ATS检测', description: '确保通过筛选系统' },
            { title: '面试准备', description: '模拟面试练习' },
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
            强大功能，助力求职
          </h2>
          <p className="text-lg text-brand-gray-1 max-w-2xl mx-auto">
            我们的AI驱动工具帮助您创建专业简历，通过ATS检测，获得更多面试机会
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
