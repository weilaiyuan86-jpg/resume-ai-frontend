import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Bot, User, 
  Loader2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import gsap from 'gsap';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const getStoredChatbotConfig = () => {
  if (typeof window === 'undefined') {
    return {
      welcome: '您好！我是 EvalShare 的智能助手。请问有什么可以帮您？',
      quickQuestions: [
        '如何优化简历?',
        '免费版有什么限制?',
        'H1B签证注意事项',
        'ATS检查是什么?',
      ],
    };
  }
  const raw = localStorage.getItem('aiPrompts');
  if (!raw) {
    return {
      welcome: '您好！我是 EvalShare 的智能助手。请问有什么可以帮您？',
      quickQuestions: [
        '如何优化简历?',
        '免费版有什么限制?',
        'H1B签证注意事项',
        'ATS检查是什么?',
      ],
    };
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    const welcome = parsed.chatbot_welcome || '您好！我是 EvalShare 的智能助手。请问有什么可以帮您？';
    const quick =
      parsed.chatbot_quick_questions
        ?.split('|')
        .map(s => s.trim())
        .filter(Boolean) || [
        '如何优化简历?',
        '免费版有什么限制?',
        'H1B签证注意事项',
        'ATS检查是什么?',
      ];
    return {
      welcome,
      quickQuestions: quick,
    };
  } catch {
    return {
      welcome: '您好！我是 EvalShare 的智能助手。请问有什么可以帮您？',
      quickQuestions: [
        '如何优化简历?',
        '免费版有什么限制?',
        'H1B签证注意事项',
        'ATS检查是什么?',
      ],
    };
  }
};

const chatbotConfig = getStoredChatbotConfig();

const quickQuestions = chatbotConfig.quickQuestions;

const welcomeMessage: Message = {
  id: 'welcome',
  type: 'bot',
  content: chatbotConfig.welcome,
  timestamp: new Date(),
  suggestions: quickQuestions,
};

// Simulated AI responses
const getAIResponse = (question: string): string => {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('优化') || lowerQ.includes('改进') || lowerQ.includes('提升')) {
    return `优化简历的几个关键建议：

1. **关键词匹配** - 根据职位描述调整关键词
2. **量化成果** - 用数字展示你的成就
3. **简洁明了** - 保持1-2页，重点突出
4. **ATS友好** - 使用标准格式，避免复杂设计
5. **定制化** - 针对不同职位调整内容

您可以使用我们的ATS检测工具来检查简历的优化程度！`;
  }
  
  if (lowerQ.includes('免费') || lowerQ.includes('限制') || lowerQ.includes('付费')) {
    return `我们的免费版包含：
✅ 基础简历编辑
✅ 3个ATS友好模板
✅ 基础ATS检测
✅ 投递追踪（最多10条）

付费版解锁：
⭐ 80+专业模板
⭐ 高级AI优化
⭐ 无限ATS检测
⭐ AI面试模拟
⭐ 求职信生成
⭐ 优先客服支持

月付$9.99，年付$79.99（省33%）`;
  }
  
  if (lowerQ.includes('h1b') || lowerQ.includes('签证')) {
    return `H1B签证申请注意事项：

📋 **时间线**
- 每年4月1日开始申请
- 10月1日生效
- 建议提前6个月准备

📄 **简历要求**
- 与学位相关的职位
- 详细的工作职责描述
- 强调专业技能匹配

💡 **我们的服务**
- H1B友好简历模板
- 职位匹配度分析
- 雇主推荐信指导

需要了解更多细节吗？`;
  }
  
  if (lowerQ.includes('ats') || lowerQ.includes('检测')) {
    return `ATS（申请人追踪系统）是什么：

🤖 **工作原理**
ATS是雇主用来筛选简历的自动化系统，它会：
- 解析简历内容
- 提取关键词和技能
- 匹配职位要求
- 为候选人打分

⚠️ **常见错误**
- 使用图片或图表
- 复杂的表格布局
- 非标准字体
- 缺少关键词

✅ **优化建议**
使用我们的ATS检测工具，可以：
- 检测兼容性得分
- 识别缺失关键词
- 提供优化建议

立即试用ATS检测功能！`;
  }
  
  if (lowerQ.includes('模板') || lowerQ.includes('template')) {
    return `我们的模板库包含80+专业简历模板：

🏢 **按行业分类**
- 技术岗：30+模板
- 金融岗：20+模板
- 营销岗：15+模板
- 教育岗：15+模板

🎨 **按风格分类**
- 现代简约
- 经典专业
- 创意设计
- 极简风格

⭐ **特色功能**
- ATS兼容性评分
- 一键应用模板
- 智能内容适配

浏览模板库找到最适合您的模板！`;
  }
  
  if (lowerQ.includes('面试') || lowerQ.includes('interview')) {
    return `我们的AI面试功能可以帮助您：

🎯 **模拟面试**
- 技术面试（算法、系统设计）
- 行为面试（STAR法则）
- 案例面试（咨询行业）

📹 **练习方式**
- 文字回答
- 语音录制
- 视频模拟

📊 **反馈报告**
- 回答质量评分
- 改进建议
- 参考答案

开始AI面试练习，提升面试表现！`;
  }
  
  return `感谢您的提问！我是EvalShare的智能助手，可以帮助您：

💼 简历优化建议
🎯 ATS检测分析
📋 模板推荐
🎤 面试准备指导
💰 套餐咨询
📄 求职信生成

请告诉我您具体想了解什么，我会为您提供详细的帮助！`;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const idCounterRef = useRef(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nextId = () => {
    idCounterRef.current += 1;
    return `msg_${idCounterRef.current}`;
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Animate chat window open/close
  useEffect(() => {
    if (chatWindowRef.current) {
      if (isOpen) {
        gsap.fromTo(
          chatWindowRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [isOpen]);

  // Animate button pulse
  useEffect(() => {
    if (buttonRef.current && !isOpen) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
    return () => {
      if (buttonRef.current) {
        gsap.killTweensOf(buttonRef.current);
      }
    };
  }, [isOpen]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: nextId(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const botResponse: Message = {
        id: nextId(),
        type: 'bot',
        content: getAIResponse(content),
        timestamp: new Date(),
        suggestions: quickQuestions.filter(q => q !== content).slice(0, 3),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-110"
          aria-label="打开AI客服"
        >
          <MessageCircle className="w-6 h-6" />
          {/* Notification dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary"></span>
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">在线客服</h3>
                <p className="text-xs text-primary-foreground/70 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  7×24 AI智能助手
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className={`w-8 h-8 flex-shrink-0 ${
                    message.type === 'bot' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    <AvatarFallback className={
                      message.type === 'bot' ? 'text-primary-foreground' : 'text-foreground'
                    }>
                      {message.type === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[80%] ${
                    message.type === 'user' ? 'items-end' : 'items-start'
                  }`}>
                    <div
                      className={`p-3 rounded-2xl text-sm whitespace-pre-line ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      {message.content}
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSendMessage(suggestion)}
                            className="text-xs px-3 py-1.5 bg-background border border-border rounded-full hover:bg-muted hover:border-primary transition-colors text-left"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      {message.timestamp.toLocaleTimeString('zh-CN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 bg-primary">
                    <AvatarFallback className="text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-bl-md p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-center gap-4 text-xs">
            <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              隐私政策
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              服务条款
            </a>
            <a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie政策
            </a>
          </div>
        </div>
      )}
    </>
  );
}
