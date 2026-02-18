import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getActiveProviderLabel() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('paymentConfig');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { activeProviderId?: string | null };
    const id = parsed?.activeProviderId;
    if (!id) return null;
    const labelMap: Record<string, string> = {
      stripe: 'Stripe',
      paypal: 'PayPal',
      alipay: '支付宝',
      wechat_pay: '微信支付',
    };
    return labelMap[id] || null;
  } catch (e) {
    console.error('Failed to parse paymentConfig in Pricing', e);
    return null;
  }
}

type PricingIcon = 'sparkles' | 'zap' | 'building';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: PricingIcon;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
}

const defaultPlans: PricingPlan[] = [
  {
    name: '免费诊断',
    price: '¥0',
    period: '/次',
    description: '适合想先大致了解问题的求职者',
    icon: 'sparkles',
    features: [
      '基础综合评分',
      'Top 3 关键问题提示',
      '预估简历通过率',
      '简版诊断报告',
      '改简历方向建议（部分解锁）',
    ],
    cta: '免费开始',
    href: '/register',
    popular: false,
  },
  {
    name: '专业版',
    price: '¥49',
    period: '/次',
    description: '适合正在积极投递的求职者',
    icon: 'zap',
    features: [
      '完整 28 项诊断指标报告',
      'AI 定制改写建议',
      '行业与同岗位对标数据',
      'ATS 模拟检测与通过率评估',
      '竞争力评分与排名',
      '优先客服支持',
    ],
    cta: '开始专业诊断',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: '求职护航',
    price: '¥199',
    period: '/次',
    description: '适合转行者或准备冲击更高职位的求职者',
    icon: 'building',
    features: [
      '包含专业版全部功能',
      '1v1 简历与求职咨询（2 次/月）',
      '内推与资源对接建议',
      '面试思路梳理与答题框架',
      '求职路径与投递策略建议',
    ],
    cta: '预约求职护航',
    href: '/contact',
    popular: false,
  },
];

const STORAGE_KEY_PRICING = 'pricingPlans';

const iconMap: Record<PricingIcon, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  zap: Zap,
  building: Building2,
};

export default function Pricing() {
  const plans: PricingPlan[] = (() => {
    if (typeof window === 'undefined') return defaultPlans;
    const raw = localStorage.getItem(STORAGE_KEY_PRICING);
    if (!raw) return defaultPlans;
    try {
      const parsed = JSON.parse(raw) as PricingPlan[];
      return Array.isArray(parsed) && parsed.length ? parsed : defaultPlans;
    } catch {
      return defaultPlans;
    }
  })();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const activeProviderLabel = getActiveProviderLabel();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current?.querySelectorAll('.word') || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.pricing-card');
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { rotateX: -90, opacity: 0 },
          {
            rotateX: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.4 + index * 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Feature list animation
      const featureLists = cardsRef.current?.querySelectorAll('.feature-list');
      featureLists?.forEach((list) => {
        const items = list.querySelectorAll('.feature-item');
        gsap.fromTo(
          items,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
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
            <span className="word inline-block">选择</span>{' '}
            <span className="word inline-block text-brand-orange">适合你</span>{' '}
            <span className="word inline-block">的诊断方案</span>
          </h2>
          <p className="text-lg text-brand-gray-1 max-w-2xl mx-auto">
            从免费体验到深度诊断，按需求选择一次性方案，无任何自动续费。
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-8 perspective-1000"
        >
          {plans.map((plan, index) => {
            const Icon = iconMap[plan.icon] || Sparkles;
            return (
            <div
              key={index}
              className={`pricing-card relative preserve-3d transition-all duration-500 hover:-translate-y-2 ${
                plan.popular ? 'md:-translate-y-4' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 rounded-full bg-brand-orange text-white text-sm font-medium shadow-glow animate-pulse-glow">
                    推荐
                  </div>
                </div>
              )}

              <div
                className={`h-full rounded-2xl p-8 transition-all duration-500 ${
                  plan.popular
                    ? 'bg-white shadow-glow hover:shadow-glow-strong'
                    : 'bg-white shadow-card hover:shadow-card-hover'
                }`}
              >
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.popular
                        ? 'bg-brand-orange text-white'
                        : 'bg-brand-gray-3 text-brand-gray-1'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-black">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-brand-gray-2">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-black">
                    {plan.price}
                  </span>
                  <span className="text-brand-gray-2">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="feature-list space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="feature-item flex items-start gap-3"
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.popular
                            ? 'bg-brand-orange/10'
                            : 'bg-brand-gray-3'
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            plan.popular ? 'text-brand-orange' : 'text-brand-gray-2'
                          }`}
                        />
                      </div>
                      <span className="text-sm text-brand-gray-1">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link to={plan.href}>
                  <Button
                    className={`w-full h-12 transition-all duration-300 ${
                      plan.popular
                        ? 'bg-brand-orange hover:bg-brand-orange/90 text-white shadow-glow hover:shadow-glow-strong'
                        : 'bg-brand-gray-3 hover:bg-brand-orange hover:text-white text-brand-black'
                    }`}
                  >
                    {plan.name === '基础版' || !activeProviderLabel
                      ? plan.cta
                      : `${plan.cta} · ${activeProviderLabel}`}
                  </Button>
                </Link>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}
