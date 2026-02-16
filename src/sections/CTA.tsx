import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  const { config } = useSiteConfig();
  const ctaText = config.homepage?.ctaText || '免费开始';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background shapes animation
      const shapes = shapesRef.current?.querySelectorAll('.shape');
      shapes?.forEach((shape, index) => {
        gsap.fromTo(
          shape,
          { scale: 0, rotate: -10, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 0.1,
            duration: 1,
            delay: index * 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Continuous rotation
        gsap.to(shape, {
          rotate: 360,
          duration: 60 + index * 10,
          repeat: -1,
          ease: 'none',
        });
      });

      // Content animation
      const words = contentRef.current?.querySelectorAll('.word');
      gsap.fromTo(
        words || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );

      const descEl = contentRef.current?.querySelector('.description');
      if (descEl) {
        gsap.fromTo(
          descEl,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      const ctaEl = contentRef.current?.querySelector('.cta-button');
      if (ctaEl) {
        gsap.fromTo(
          ctaEl,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            delay: 0.8,
            ease: 'elastic.out(1, 0.8)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-orange-500 to-orange-600" />

      {/* Animated Shapes */}
      <div ref={shapesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="shape absolute top-10 left-10 w-32 h-32 border-4 border-white/20 rounded-full" />
        <div className="shape absolute bottom-10 right-10 w-48 h-48 border-4 border-white/20 rounded-full" />
        <div className="shape absolute top-1/2 left-1/4 w-24 h-24 border-4 border-white/20 rotate-45" />
        <div className="shape absolute top-1/4 right-1/3 w-16 h-16 bg-white/10 rounded-lg" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={contentRef}>
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="word inline-block">准备好</span>{' '}
            <span className="word inline-block">获得</span>{' '}
            <span className="word inline-block">您</span>{' '}
            <span className="word inline-block">梦想的</span>{' '}
            <span className="word inline-block">工作了吗？</span>
          </h2>

          {/* Description */}
          <p className="description text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            加入数千名使用我们AI简历生成器成功求职的专业人士。
            免费开始，无需信用卡。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button
                size="lg"
                className="cta-button bg-white text-brand-orange hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 ease-elastic hover:scale-105 px-10 h-16 text-lg font-semibold group animate-pulse-glow"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                {ctaText}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <a
              href="/extension/resumeai-extension.zip"
              download="ResumeAI-Extension.zip"
              className="inline-flex items-center justify-center rounded-xl border border-white/70 text-white hover:text-brand-orange bg-white/10 hover:bg-white px-6 h-16 text-lg font-semibold transition-colors"
            >
              安装 Chrome 插件
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
