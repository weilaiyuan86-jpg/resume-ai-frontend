import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    avatar: 'SC',
    avatarColor: 'from-blue-400 to-blue-600',
    rating: 5,
    content: 'ResumeAI帮我优化了简历，突出了我的技术技能。两周内就收到了Google的面试邀请！',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager at Meta',
    avatar: 'MR',
    avatarColor: 'from-green-400 to-green-600',
    rating: 5,
    content: 'ATS检测功能太棒了！我发现之前的简历有很多问题，修复后面试率提高了3倍。',
  },
  {
    name: 'Emily Watson',
    role: 'Marketing Director at Amazon',
    avatar: 'EW',
    avatarColor: 'from-purple-400 to-purple-600',
    rating: 5,
    content: '模板设计非常专业，AI建议的内容让我的简历更有说服力。强烈推荐！',
  },
  {
    name: 'David Kim',
    role: 'Data Scientist at Netflix',
    avatar: 'DK',
    avatarColor: 'from-red-400 to-red-600',
    rating: 5,
    content: '投递追踪功能帮我管理所有申请，再也不怕错过重要的面试通知了。',
  },
  {
    name: 'Lisa Thompson',
    role: 'UX Designer at Apple',
    avatar: 'LT',
    avatarColor: 'from-pink-400 to-pink-600',
    rating: 5,
    content: '作为设计师，我对简历的视觉效果要求很高。ResumeAI的模板既美观又专业。',
  },
  {
    name: 'James Wilson',
    role: 'Finance Analyst at Goldman Sachs',
    avatar: 'JW',
    avatarColor: 'from-yellow-400 to-yellow-600',
    rating: 5,
    content: '金融行业对简历要求很严格，ResumeAI帮我创建了符合行业标准的简历。',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
      const cards = gridRef.current?.querySelectorAll('.testimonial-card');
      cards?.forEach((card, index) => {
        const rotation = index % 2 === 0 ? -5 : 5;
        gsap.fromTo(
          card,
          { scale: 0.8, rotate: rotation, opacity: 0 },
          {
            scale: 1,
            rotate: index % 3 === 0 ? -2 : index % 3 === 1 ? 0 : 2,
            opacity: 1,
            duration: 0.6,
            delay: 0.2 + index * 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Quote marks animation
      const quotes = gridRef.current?.querySelectorAll('.quote-mark');
      quotes?.forEach((quote, index) => {
        gsap.fromTo(
          quote,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.1,
            duration: 0.5,
            delay: 0.4 + index * 0.1,
            ease: 'elastic.out(1, 0.8)',
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">
            <span className="word inline-block">客户</span>{' '}
            <span className="word inline-block text-brand-orange">怎么说</span>
          </h2>
          <p className="text-lg text-brand-gray-1 max-w-2xl mx-auto">
            加入数千名成功求职的专业人士
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card relative bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 group ${
                index % 3 === 0 ? 'rotate-[-2deg]' : index % 3 === 1 ? 'rotate-0' : 'rotate-[2deg]'
              } hover:rotate-0`}
            >
              {/* Quote Mark */}
              <Quote className="quote-mark absolute top-4 right-4 w-12 h-12 text-brand-orange opacity-10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-brand-orange fill-brand-orange"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-brand-gray-1 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center text-white font-bold`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-brand-black">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-brand-gray-2">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
