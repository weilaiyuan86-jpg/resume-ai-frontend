import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { config } = useSiteConfig();
  const homepage = config.homepage;

  const heroTitle =
    homepage?.heroTitle || 'AI简历评估诊断平台';
  const heroSubtitle =
    homepage?.heroSubtitle ||
    '先诊断问题，再智能优化。基于 10万+ 美国大厂录取简历训练的求职成功率预测系统，让评估更准、诊断更深、优化更狠。';
  const heroCtaText = homepage?.ctaText || '免费创建简历';
  const heroImage =
    homepage?.heroImage ||
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // Badge animation
      tl.fromTo(
        badgeRef.current,
        { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6 },
        0.2
      );

      // Title words animation
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 30, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.8, stagger: 0.1 },
          0.4
        );
      }

      // Description animation
      tl.fromTo(
        descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.8
      );

      // Buttons animation
      tl.fromTo(
        buttonsRef.current?.children || [],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1 },
        1
      );

      // Main image animation
      tl.fromTo(
        imageRef.current,
        { rotateY: -15, rotateX: 5, x: 100, opacity: 0 },
        { rotateY: 0, rotateX: 0, x: 0, opacity: 1, duration: 1.2 },
        0.6
      );

      // Floating card animation
      tl.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.2
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-24 pb-16 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4" />
              <span>AI简历评估诊断平台</span>
            </div>

            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-black leading-tight mb-6"
            >
              <span className="word inline-block text-brand-orange">
                {heroTitle}
              </span>
            </h1>

            {/* Description */}
            <p
              ref={descRef}
              className="text-lg text-brand-gray-1 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {heroSubtitle}
            </p>

            {/* Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-glow hover:shadow-glow-strong transition-all duration-300 ease-elastic hover:scale-105 px-8 h-14 text-base group"
                >
                  {heroCtaText}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-gray-3 hover:border-brand-orange hover:bg-brand-orange/5 transition-all duration-300 h-14 px-8 text-base group"
                >
                  <Play className="mr-2 w-5 h-5" />
                  查看示例
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-sm text-brand-gray-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>免费开始使用</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-gray-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>无需信用卡</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-gray-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>ATS优化</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative perspective-1000">
            <div
              ref={imageRef}
              className="relative preserve-3d transition-transform duration-500 hover:rotate-y-[-5deg] hover:rotate-x-[3deg]"
            >
              {/* Main Dashboard Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                <img
                  src={heroImage}
                  alt="Resume Builder Dashboard"
                  className="w-full h-auto"
                />
                
                {/* Overlay UI Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Review Card */}
              <div
                ref={cardRef}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-card p-4 animate-float"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-sm">John Doe</p>
                    <p className="text-xs text-brand-gray-2">Software Engineer</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < 4 ? 'text-brand-orange fill-brand-orange' : 'text-brand-orange'}`}
                        />
                      ))}
                      <span className="text-xs text-brand-gray-2 ml-1">4.5</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-brand-gray-1 mt-2 max-w-[200px]">
                  "用EvalShare创建的简历帮我拿到了Google的面试机会！"
                </p>
              </div>

              {/* Stats Card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card p-4 animate-float-slow">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-orange">100K+</p>
                  <p className="text-xs text-brand-gray-2">大厂录取简历样本</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
