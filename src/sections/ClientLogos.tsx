import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logos = [
  'Google',
  'Microsoft',
  'Amazon',
  'Apple',
  'Meta',
  'Netflix',
  'Tesla',
  'Adobe',
];

export default function ClientLogos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-brand-gray-3/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p
          ref={titleRef}
          className="text-center text-sm font-medium text-brand-gray-2 uppercase tracking-wider"
        >
          受到领先公司信赖
        </p>
      </div>

      {/* Logo Scroller */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-gray-3/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-gray-3/50 to-transparent z-10" />

        {/* Scrolling Container */}
        <div className="flex animate-slide-infinite hover:[animation-play-state:paused]">
          {[...logos, ...logos].map((name, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-12 group cursor-pointer"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white shadow-sm transition-all duration-300 group-hover:shadow-card group-hover:scale-110">
                <span className="w-10 h-10 rounded-lg bg-brand-gray-3 flex items-center justify-center text-lg font-bold text-brand-gray-1 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                  {name.charAt(0)}
                </span>
                <span className="text-lg font-semibold text-brand-gray-2 group-hover:text-brand-black transition-colors duration-300">
                  {name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
