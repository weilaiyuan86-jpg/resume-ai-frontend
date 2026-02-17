import { useState, useRef, useEffect } from 'react';
import { 
  Search, Clock, ArrowRight, 
  ChevronDown, Bookmark,
  Mail, ChevronRight, ArrowLeft
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { id: 'resume', name: '简历优化', count: 45 },
  { id: 'interview', name: '面试准备', count: 32 },
  { id: 'visa', name: '签证指南', count: 28 },
  { id: 'career', name: '职业发展', count: 24 },
  { id: 'networking', name: '社交技巧', count: 18 },
];

const hotTopics = [
  '# FAANG 面经',
  '# OPT 延期',
  '# 软技能',
  '# 远程办公',
  '# 薪资谈判',
  '# 创业签证',
];

// Generate 20 SEO articles
const generateArticles = () => {
  const articles = [
    {
      id: '1',
      title: '如何撰写符合美国规范的简历 (ATS友好)',
      excerpt: '了解美国求职市场中的 ATS 系统工作原理，手把手教你避开常见的排版错误。',
      category: 'resume',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
      readTime: '8分钟',
      date: '2024-01-20',
      featured: false,
    },
    {
      id: '2',
      title: '2024 H1B 签证政策深度解析',
      excerpt: '解析最新的抽签规则、生效日期以及应对裁员潮的身份维持方案。',
      category: 'visa',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      readTime: '15分钟',
      date: '2024-01-18',
      featured: false,
    },
    {
      id: '3',
      title: '硅谷社交网络技巧：打破文化隔阂',
      excerpt: '如何在 LinkedIn 上进行 Cold Outreach 并获得极高的回复率？',
      category: 'networking',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop',
      readTime: '10分钟',
      date: '2024-01-15',
      featured: false,
    },
    {
      id: '4',
      title: '入职第一周：如何快速融入美国团队',
      excerpt: '理解美国职场文化中的 Small Talk 与 1:1 会议的重要性。',
      category: 'career',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
      readTime: '6分钟',
      date: '2024-01-12',
      featured: false,
    },
    // Featured article
    {
      id: 'featured',
      title: 'Mastering the US Tech Interview: 玩转美国技术面试全攻略',
      excerpt: '从 LeetCode 刷题策略到行为面试 (Behavioral Question) 的 STAR 法则，本文将为你深度解析美国顶尖科技公司的面试套路与避坑指南。',
      category: 'interview',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop',
      readTime: '12分钟',
      date: '2024-01-22',
      featured: true,
    },
    // More articles for SEO
    {
      id: '5',
      title: 'Google XYP 简历法则深度解析',
      excerpt: '"Accomplished [X] as measured by [Y], by doing [Z]" - 为什么这是进入大厂的敲门砖？',
      category: 'resume',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      readTime: '10分钟',
      date: '2024-01-10',
      featured: false,
    },
    {
      id: '6',
      title: 'OPT 延期申请完整指南 (STEM Extension)',
      excerpt: '从 I-983 表格填写到雇主 E-Verify 验证，一步步教你成功延期 24 个月。',
      category: 'visa',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
      readTime: '18分钟',
      date: '2024-01-08',
      featured: false,
    },
    {
      id: '7',
      title: 'Behavioral Interview: 如何用 STAR 法则征服面试官',
      excerpt: '亚马逊领导力准则解析，以及如何用具体案例展现你的软技能。',
      category: 'interview',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      readTime: '14分钟',
      date: '2024-01-05',
      featured: false,
    },
    {
      id: '8',
      title: '美国职场薪资谈判技巧大全',
      excerpt: '从 Offer 接收到 Counter Offer，如何优雅地争取应得的报酬。',
      category: 'career',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      readTime: '9分钟',
      date: '2024-01-03',
      featured: false,
    },
    {
      id: '9',
      title: 'LinkedIn Profile 优化：让猎头主动找你',
      excerpt: 'Headline、About、Experience 各模块的优化策略与关键词布局。',
      category: 'networking',
      image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=600&h=400&fit=crop',
      readTime: '11分钟',
      date: '2023-12-28',
      featured: false,
    },
    {
      id: '10',
      title: 'FAANG 面经汇总：2024 最新真题整理',
      excerpt: 'Google、Meta、Amazon、Apple、Netflix 各公司面试流程与高频题目。',
      category: 'interview',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop',
      readTime: '25分钟',
      date: '2023-12-25',
      featured: false,
    },
    {
      id: '11',
      title: 'H1B 被裁员后的 60 天 Grace Period 应对策略',
      excerpt: 'Transfer、Change of Status、离境等各种方案的利弊分析。',
      category: 'visa',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
      readTime: '16分钟',
      date: '2023-12-22',
      featured: false,
    },
    {
      id: '12',
      title: '远程工作时代：如何管理跨国团队',
      excerpt: '时区协调、沟通工具、文化差异 - 远程团队管理的最佳实践。',
      category: 'career',
      image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=600&h=400&fit=crop',
      readTime: '8分钟',
      date: '2023-12-20',
      featured: false,
    },
    {
      id: '13',
      title: 'Technical Writing：工程师的隐藏技能',
      excerpt: '为什么优秀的文档能力能让你在职场中脱颖而出。',
      category: 'career',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
      readTime: '7分钟',
      date: '2023-12-18',
      featured: false,
    },
    {
      id: '14',
      title: 'O-1 杰出人才签证申请攻略',
      excerpt: '从标准解读到材料准备，如何证明你的"杰出能力"。',
      category: 'visa',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
      readTime: '20分钟',
      date: '2023-12-15',
      featured: false,
    },
    {
      id: '15',
      title: 'System Design Interview：从入门到精通',
      excerpt: '分布式系统设计的核心概念与面试答题框架。',
      category: 'interview',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      readTime: '30分钟',
      date: '2023-12-12',
      featured: false,
    },
    {
      id: '16',
      title: '美国职场中的 Diversity & Inclusion',
      excerpt: '理解 DEI 文化，以及如何在面试中展现你的包容性思维。',
      category: 'career',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
      readTime: '6分钟',
      date: '2023-12-10',
      featured: false,
    },
    {
      id: '17',
      title: 'Resume Action Verbs：动词选择的艺术',
      excerpt: 'Led vs Managed vs Spearheaded - 不同动词传递的不同信号。',
      category: 'resume',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      readTime: '5分钟',
      date: '2023-12-08',
      featured: false,
    },
    {
      id: '18',
      title: 'Coffee Chat：如何优雅地约人喝咖啡',
      excerpt: '从 Cold Email 到见面聊天，建立职场人脉的完整流程。',
      category: 'networking',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
      readTime: '9分钟',
      date: '2023-12-05',
      featured: false,
    },
    {
      id: '19',
      title: 'Green Card PERM 流程详解',
      excerpt: '从 Labor Certification 到 I-485，绿卡申请的完整时间线。',
      category: 'visa',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      readTime: '22分钟',
      date: '2023-12-02',
      featured: false,
    },
    {
      id: '20',
      title: '从 Junior 到 Senior：工程师的成长路径',
      excerpt: '技术深度 vs 广度，以及如何在职业发展中做出正确选择。',
      category: 'career',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
      readTime: '13分钟',
      date: '2023-11-28',
      featured: false,
    },
  ];
  return articles;
};

const allArticles = generateArticles();

// Article Detail Component
function ArticleDetail({ article, onBack }: { article: typeof allArticles[0]; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回博客列表
          </button>

          {/* Article Header */}
          <div className="mb-8">
            <Badge className="mb-4 bg-brand-orange/10 text-brand-orange">
              {categories.find(c => c.id === article.category)?.name || article.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}阅读
              </span>
              <span>{article.date}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {article.excerpt}
            </p>
            
            <div className="space-y-4 text-foreground">
              <h2 className="text-2xl font-semibold mt-8 mb-4">引言</h2>
              <p>
                在当今竞争激烈的就业市场中，掌握正确的求职技巧变得尤为重要。
                本文将深入探讨{article.title}的核心要点，帮助你更好地准备求职过程。
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">主要内容</h2>
              <p>
                首先，我们需要了解当前的市场环境和行业趋势。
                根据最新的数据统计，美国科技行业的招聘需求持续增长，
                尤其是对于拥有相关技能和经验的人才。
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">关键策略</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>深入了解目标公司的文化和价值观</li>
                <li>准备针对性的简历和求职信</li>
                <li>练习常见的面试问题和场景</li>
                <li>建立和维护专业人脉网络</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">实用技巧</h3>
              <p>
                在实际操作中，建议采用系统化的方法来准备求职。
                这包括制定详细的时间表、收集必要的材料、
                以及持续跟进申请进度。
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">常见误区</h2>
              <p>
                很多求职者在准备过程中容易犯一些常见错误。
                例如，过度依赖模板而忽视个性化，
                或者在面试中缺乏充分的准备。
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">总结</h2>
              <p>
                通过本文的介绍，相信你已经对{article.title}有了更深入的了解。
                记住，成功的求职需要持续的学习和实践。
                祝你在求职路上一切顺利！
              </p>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-xl font-semibold mb-6">相关文章</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {allArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3).map(related => (
                <Link 
                  key={related.id} 
                  to={`/blog/${related.id}`}
                  className="group"
                >
                  <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {related.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main Blog List Component
function BlogList({ onArticleClick }: { onArticleClick?: (article: typeof allArticles[0]) => void }) {
  const [activeCategory, ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [email, setEmail] = useState('');
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        featuredRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        gridRef.current?.querySelectorAll('.blog-card') || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const featuredArticle = allArticles.find((a) => a.featured);
  const regularArticles = allArticles.filter((a) => !a.featured);

  const filteredArticles = regularArticles.filter((article) => {
    const matchesCategory = !activeCategory || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  const getCategoryColor = (id: string) => {
    const colors: Record<string, string> = {
      default: 'bg-brand-orange/10 text-brand-orange',
    };
    return colors[id] || colors.default;
  };

  return (
    <div className="min-h-screen bg-brand-gray-3/50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Article */}
          {featuredArticle && (
            <div ref={featuredRef} className="mb-12">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-80 lg:h-auto">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-brand-orange text-white">
                      精选推荐
                    </Badge>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4 text-sm text-brand-gray-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-brand-orange" />
                        {featuredArticle.readTime}阅读
                      </span>
                      <Badge variant="outline" className="text-xs border-brand-orange/30 text-brand-orange bg-white">
                        进阶
                      </Badge>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-brand-black mb-4">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-brand-gray-2 mb-6">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-2 shadow-glow hover:shadow-glow-strong transition-all duration-300 ease-elastic hover:scale-105"
                        onClick={() => onArticleClick?.(featuredArticle)}
                      >
                        立即阅读
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <button className="p-2 hover:bg-brand-gray-3 rounded-full">
                        <Bookmark className="w-5 h-5 text-brand-gray-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Articles */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brand-black">最新文章</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === 'newest'
                        ? 'bg-brand-orange/10 text-brand-orange'
                        : 'text-brand-gray-2 hover:bg-brand-gray-3'
                    }`}
                  >
                    最新
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === 'popular'
                        ? 'bg-brand-orange/10 text-brand-orange'
                        : 'text-brand-gray-2 hover:bg-brand-gray-3'
                    }`}
                  >
                    最热
                  </button>
                </div>
              </div>

              {/* Articles Grid */}
              <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
                {sortedArticles.map((article) => (
                  <article
                    key={article.id}
                    className="blog-card bg-white rounded-xl shadow-card overflow-hidden hover:shadow-glow transition-shadow group"
                    onClick={() => onArticleClick?.(article)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className={`absolute top-3 left-3 ${getCategoryColor(article.category)}`}>
                        {getCategoryName(article.category)}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-brand-black mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-brand-gray-2 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-brand-gray-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-orange" />
                          {article.readTime}
                        </span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <Button variant="outline" className="gap-2">
                  加载更多文章
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-brand-black mb-4">搜索文章</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-2" />
                  <Input
                    placeholder="输入关键词，如 'OPT', '简历'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Hot Topics */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-brand-black mb-4">热门话题</h3>
                <div className="flex flex-wrap gap-2">
                  {hotTopics.map((topic) => (
                    <button
                      key={topic}
                      className="px-3 py-1.5 bg-brand-gray-3 hover:bg-brand-orange/10 text-brand-gray-2 hover:text-brand-orange rounded-full text-sm transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-brand-orange/5 via-white to-brand-orange/5 rounded-xl p-5 border border-brand-orange/20">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-semibold text-brand-black">订阅职业周报</h3>
                </div>
                <p className="text-sm text-brand-gray-2 mb-4">
                  每周获取最新的美国求职趋势、内部职位机会与签证政策动态。
                </p>
                <Input
                  placeholder="您的邮箱地址"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3"
                />
                <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white shadow-glow hover:shadow-glow-strong transition-all duration-300 ease-elastic hover:scale-105">
                  立即订阅
                </Button>
                <p className="text-xs text-brand-gray-2 mt-3 text-center">
                  我们承诺不发送垃圾邮件，您可以随时取消订阅。
                </p>
              </div>

              {/* Community */}
              <div className="bg-white rounded-xl shadow-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-black">加入求职社群</h3>
                    <p className="text-sm text-brand-gray-2">与 50,000+ 在美华人并肩作战</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-brand-gray-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Main Blog Component with Routing
export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState<typeof allArticles[0] | null>(null);
  const { articleId } = useParams();

  // Check if we're viewing a specific article
  if (articleId) {
    const article = allArticles.find(a => a.id === articleId);
    if (article) {
      return <ArticleDetail article={article} onBack={() => setSelectedArticle(null)} />;
    }
  }

  // Check if an article was selected via click
  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  // Show blog list
  return <BlogList onArticleClick={setSelectedArticle} />;
}
