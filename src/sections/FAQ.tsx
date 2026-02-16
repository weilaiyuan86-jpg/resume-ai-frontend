import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'EvalShare如何帮助我的求职？',
    answer: 'EvalShare使用先进的AI技术分析您的经历和目标职位，提供个性化的简历优化建议。我们的ATS检测确保您的简历能够通过求职者追踪系统，提高获得面试的机会。',
  },
  {
    question: '免费版和专业版有什么区别？',
    answer: '免费版允许您创建最多3份简历，使用基础模板。专业版提供无限简历、所有高级模板、AI内容建议、ATS优化和优先客服支持，帮助您获得更好的求职结果。',
  },
  {
    question: '我的数据安全吗？',
    answer: '绝对安全。我们使用银行级别的加密技术保护您的个人信息。您的数据存储在安全的服务器上，绝不会与第三方共享。您可以随时导出或删除您的数据。',
  },
  {
    question: '如何取消订阅？',
    answer: '您可以随时在账户设置中取消订阅，无需任何理由。取消后，您仍可使用服务直到当前计费周期结束。我们不会收取任何取消费用。',
  },
  {
    question: 'EvalShare支持哪些文件格式？',
    answer: '我们支持PDF和Word（.docx）格式的导出。PDF格式适合在线申请，Word格式便于进一步编辑。所有格式都经过优化，确保ATS兼容性。',
  },
  {
    question: '我可以获得退款吗？',
    answer: '我们提供7天无理由退款保证。如果您对服务不满意，可以在购买后7天内申请全额退款，无需说明理由。',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

      // FAQ items animation
      const items = listRef.current?.querySelectorAll('.faq-item');
      items?.forEach((item, index) => {
        gsap.fromTo(
          item,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-24 bg-brand-gray-3/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">
            <span className="word inline-block">常见</span>{' '}
            <span className="word inline-block text-brand-orange">问题</span>
          </h2>
          <p className="text-lg text-brand-gray-1">
            找不到答案？随时联系我们的客服团队
          </p>
        </div>

        {/* FAQ List */}
        <div ref={listRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? 'shadow-card border-l-4 border-brand-orange'
                  : 'shadow-sm hover:shadow-card'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-bold transition-colors duration-300 ${
                      openIndex === index ? 'text-brand-orange' : 'text-brand-gray-2'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-semibold text-brand-black group-hover:text-brand-orange transition-colors duration-300">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-brand-gray-2 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-brand-orange' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-400 ease-expo-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pl-16">
                  <p className="text-brand-gray-1 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
