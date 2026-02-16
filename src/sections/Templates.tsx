import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const templates = [
  {
    id: 1,
    name: '现代专业',
    category: '通用',
    rating: 4.9,
    views: '12K+',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=550&fit=crop',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    name: '创意科技',
    category: '技术',
    rating: 4.8,
    views: '8K+',
    image: 'https://images.unsplash.com/photo-1626197031507-c17099753214?w=400&h=550&fit=crop',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 3,
    name: '极简商务',
    category: '商务',
    rating: 4.9,
    views: '15K+',
    image: 'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed3?w=400&h=550&fit=crop',
    color: 'from-brand-orange to-orange-500',
  },
  {
    id: 4,
    name: '学术研究',
    category: '学术',
    rating: 4.7,
    views: '5K+',
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&h=550&fit=crop',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 5,
    name: '设计创意',
    category: '设计',
    rating: 4.8,
    views: '7K+',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=550&fit=crop',
    color: 'from-pink-500 to-pink-600',
  },
];

export default function Templates() {
  const [activeIndex, setActiveIndex] = useState(2);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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

      // Carousel animation
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % templates.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + templates.length) % templates.length);
    const adjustedDiff = normalizedDiff > templates.length / 2 ? normalizedDiff - templates.length : normalizedDiff;
    
    const isActive = adjustedDiff === 0;
    const isAdjacent = Math.abs(adjustedDiff) === 1;

    const translateX = adjustedDiff * 280;
    const scale = isActive ? 1 : isAdjacent ? 0.85 : 0.7;
    const opacity = isActive ? 1 : isAdjacent ? 0.7 : 0.3;
    const zIndex = isActive ? 30 : isAdjacent ? 20 : 10;
    const rotateY = adjustedDiff * -15;

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity,
      zIndex,
    };
  };

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">
            <span className="word inline-block">专业模板，</span>{' '}
            <span className="word inline-block text-brand-orange">成就事业</span>
          </h2>
          <p className="text-lg text-brand-gray-1 max-w-2xl mx-auto">
            从数十种ATS优化设计中选择，找到最适合您的简历模板
          </p>
        </div>

        {/* 3D Carousel */}
        <div ref={carouselRef} className="relative h-[500px] perspective-1000">
          <div className="absolute inset-0 flex items-center justify-center preserve-3d">
            {templates.map((template, index) => (
              <div
                key={template.id}
                className="absolute w-64 transition-all duration-600 ease-expo-out cursor-pointer"
                style={getCardStyle(index)}
                onClick={() => setActiveIndex(index)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  {/* Template Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Preview Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white/90 text-brand-black hover:bg-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        预览
                      </Button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-brand-black">{template.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${template.color} text-white`}>
                        {template.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-brand-gray-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                        <span>{template.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{template.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-brand-orange w-8'
                  : 'bg-brand-gray-3 hover:bg-brand-gray-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
