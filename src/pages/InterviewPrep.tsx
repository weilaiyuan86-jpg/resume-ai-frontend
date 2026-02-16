import { useState } from 'react';
import { 
  Search, Filter, BookOpen, MessageSquare, Code, 
  Users, Star, ChevronDown, ChevronUp, Lightbulb,
  CheckCircle, Clock, Play, ThumbsUp, Share2, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer: string;
  tips: string[];
  likes: number;
  isBookmarked: boolean;
}

const categories = [
  { id: 'behavioral', name: '行为面试', icon: Users, count: 150 },
  { id: 'technical', name: '技术面试', icon: Code, count: 200 },
  { id: 'system-design', name: '系统设计', icon: BookOpen, count: 80 },
  { id: 'hr', name: 'HR面试', icon: MessageSquare, count: 100 },
];

const questions: InterviewQuestion[] = [
  {
    id: '1',
    question: 'Tell me about yourself.',
    category: 'behavioral',
    difficulty: 'easy',
    answer: 'This is your elevator pitch. Focus on your professional background, key achievements, and what you are looking for in your next role. Keep it concise (1-2 minutes) and relevant to the position.',
    tips: ['Start with your current role', 'Highlight 2-3 key achievements', 'Connect to the position you are applying for', 'Practice until it sounds natural'],
    likes: 2453,
    isBookmarked: false,
  },
  {
    id: '2',
    question: 'What is your greatest weakness?',
    category: 'behavioral',
    difficulty: 'medium',
    answer: 'Choose a real weakness that is not critical to the job, then explain how you are working to improve it. Show self-awareness and growth mindset.',
    tips: ['Be honest but strategic', 'Show improvement efforts', 'Avoid clichés like "I work too hard"', 'Focus on professional weaknesses, not personal ones'],
    likes: 1892,
    isBookmarked: true,
  },
  {
    id: '3',
    question: 'Describe a time when you faced a conflict at work.',
    category: 'behavioral',
    difficulty: 'medium',
    answer: 'Use the STAR method: Situation, Task, Action, Result. Focus on how you resolved the conflict professionally and what you learned from the experience.',
    tips: ['Use the STAR method', 'Focus on resolution, not the conflict', 'Show emotional intelligence', 'Highlight what you learned'],
    likes: 1567,
    isBookmarked: false,
  },
  {
    id: '4',
    question: 'Design a URL shortener like bit.ly',
    category: 'system-design',
    difficulty: 'hard',
    answer: 'Key components: API layer, encoding service, database, cache. Consider: URL encoding algorithm (base62), database schema, read/write ratio, scalability, and analytics.',
    tips: ['Clarify requirements first', 'Discuss trade-offs', 'Consider scalability', 'Talk about database choice'],
    likes: 3421,
    isBookmarked: true,
  },
  {
    id: '5',
    question: 'Why do you want to leave your current job?',
    category: 'hr',
    difficulty: 'easy',
    answer: 'Focus on positive reasons for seeking new opportunities: growth, learning, new challenges. Never speak negatively about your current employer.',
    tips: ['Stay positive', 'Focus on growth', 'Show alignment with new role', 'Avoid negativity'],
    likes: 1234,
    isBookmarked: false,
  },
  {
    id: '6',
    question: 'Explain how you would implement a LRU Cache',
    category: 'technical',
    difficulty: 'medium',
    answer: 'Use a combination of HashMap and Doubly Linked List. HashMap provides O(1) lookup, and Doubly Linked List maintains order with O(1) insertion and deletion.',
    tips: ['Start with the data structures', 'Explain time complexity', 'Consider edge cases', 'Write clean, testable code'],
    likes: 2890,
    isBookmarked: true,
  },
];

export default function InterviewPrep() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>(['2', '4', '6']);
  const [likedQuestions, setLikedQuestions] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const toggleLike = (id: string) => {
    setLikedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'hard':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>面试准备资源</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              面试题库
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              500+ 精选面试问题与答案，涵盖行为面试、技术面试、系统设计等各类题型
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className={`bg-card rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedCategory === cat.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} 题</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索面试问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              筛选
            </Button>
          </div>
        </div>

        {/* Questions List */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">全部问题</TabsTrigger>
              <TabsTrigger value="bookmarked">我的收藏</TabsTrigger>
              <TabsTrigger value="popular">热门问题</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredQuestions.map((q) => (
                <div 
                  key={q.id}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(q.difficulty)}>
                            {q.difficulty.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">
                            {categories.find(c => c.id === q.category)?.name}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-medium">{q.question}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(q.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            likedQuestions.includes(q.id) 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleBookmark(q.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarkedQuestions.includes(q.id) 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarkedQuestions.includes(q.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {expandedQuestions.includes(q.id) && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="bg-muted rounded-lg p-4 mb-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            参考答案
                          </h4>
                          <p className="text-muted-foreground">{q.answer}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            答题技巧
                          </h4>
                          <ul className="space-y-2">
                            {q.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">
                                  {index + 1}
                                </span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {q.likes + (likedQuestions.includes(q.id) ? 1 : 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          2-3 min
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleExpand(q.id)}
                        className="gap-1"
                      >
                        {expandedQuestions.includes(q.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            收起
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            查看答案
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="bookmarked" className="space-y-4">
              {filteredQuestions.filter(q => bookmarkedQuestions.includes(q.id)).map((q) => (
                <div 
                  key={q.id}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  {/* Same content as above */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(q.difficulty)}>
                            {q.difficulty.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">
                            {categories.find(c => c.id === q.category)?.name}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-medium">{q.question}</h3>
                      </div>
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className="p-2 rounded-lg bg-primary/10 text-primary"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleExpand(q.id)}
                      className="mt-4 gap-1"
                    >
                      {expandedQuestions.includes(q.id) ? '收起' : '查看答案'}
                      {expandedQuestions.includes(q.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    {expandedQuestions.includes(q.id) && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-muted-foreground">{q.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="popular" className="space-y-4">
              {filteredQuestions.sort((a, b) => b.likes - a.likes).slice(0, 5).map((q) => (
                <div 
                  key={q.id}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">{q.likes} 赞</span>
                    </div>
                    <h3 className="text-lg font-medium">{q.question}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleExpand(q.id)}
                      className="mt-4 gap-1"
                    >
                      {expandedQuestions.includes(q.id) ? '收起' : '查看答案'}
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">想要更多练习？</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              使用我们的AI面试模拟器，获得实时反馈和个性化建议
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Play className="w-4 h-4" />
                开始模拟面试
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                分享给朋友
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
