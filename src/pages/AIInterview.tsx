import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, MicOff, Video, VideoOff, SkipForward, 
  Lightbulb, Volume2, Type, Pause,
  Clock, CheckCircle2, Sparkles, ArrowLeft,
  BarChart3, MessageSquare, TrendingUp, AlertCircle,
  RotateCcw, Download, Share2, ChevronRight, Star,
  Lock, LogIn
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface InterviewQuestion {
  id: string;
  question: string;
  questionEn: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  sampleAnswer?: string;
}

interface InterviewAnswer {
  questionId: string;
  audioBlob?: Blob;
  transcript: string;
  duration: number;
  metrics: {
    wpm: number;
    clarity: number;
    confidence: number;
    relevance: number;
  };
}

interface InterviewReport {
  overallScore: number;
  totalDuration: number;
  strengths: string[];
  improvements: string[];
  answers: InterviewAnswer[];
  category: string;
}

interface SystemDesignMetrics {
  architecture: number;
  scalability: number;
  reliability: number;
}

interface InterviewReportApiResponse {
  overallScore: number;
  totalDuration: number;
  strengths: string[];
  improvements: string[];
  answers: InterviewAnswer[];
  category: string;
  systemDesignMetrics?: SystemDesignMetrics;
}

const getAiInterviewUiInfo = () => {
  if (typeof window === 'undefined') {
    return { modelLabel: null as string | null, hasPromptInfo: false };
  }
  let modelLabel: string | null = null;
  let hasPromptInfo = false;
  const rawModel = localStorage.getItem('aiModelSettings');
  if (rawModel) {
    try {
      const parsed = JSON.parse(rawModel) as { model?: string; temperature?: string };
      if (parsed && typeof parsed.model === 'string') {
        modelLabel = parsed.model;
      }
    } catch (e) {
      console.error('Failed to parse aiModelSettings', e);
    }
  }
  const rawPrompts = localStorage.getItem('aiPrompts');
  if (rawPrompts) {
    try {
      const parsed = JSON.parse(rawPrompts) as Record<string, string>;
      const p = parsed?.interview_prep;
      if (typeof p === 'string' && p.trim()) {
        hasPromptInfo = true;
      }
    } catch (e) {
      console.error('Failed to parse aiPrompts', e);
    }
  }
  return { modelLabel, hasPromptInfo };
};

// Extended interview questions with more variety
const interviewQuestions: InterviewQuestion[] = [
  // Behavioral Questions
  {
    id: '1',
    question: '请描述一次你在团队中解决技术冲突的经历。你是如何处理不同意见的，最终结果如何？',
    questionEn: 'Tell me about a time you resolved a technical conflict in your team. How did you handle differing opinions, and what was the outcome?',
    category: 'Behavioral',
    difficulty: 'medium',
    hints: ['使用STAR法则组织回答', '强调你的沟通和协调能力', '量化最终结果'],
    sampleAnswer: '在我之前的一个项目中，我们团队对于技术架构的选择产生了分歧...',
  },
  {
    id: '2',
    question: '请介绍一个你最自豪的项目，你在其中扮演了什么角色？遇到了哪些挑战？',
    questionEn: 'Tell me about a project you are most proud of. What was your role and what challenges did you face?',
    category: 'Project Experience',
    difficulty: 'medium',
    hints: ['突出你的技术贡献', '说明项目的影响力', '描述如何解决挑战'],
    sampleAnswer: '我最自豪的项目是为一家电商公司开发的推荐系统...',
  },
  {
    id: '3',
    question: '描述一次你未能按时完成任务的经历。你是如何处理的？',
    questionEn: 'Describe a time when you failed to meet a deadline. How did you handle it?',
    category: 'Behavioral',
    difficulty: 'hard',
    hints: ['诚实面对失败', '强调学到的经验', '展示改进措施'],
    sampleAnswer: '有一次我在开发一个新功能时低估了复杂度...',
  },
  {
    id: '4',
    question: '你是如何处理工作压力和紧急情况的？',
    questionEn: 'How do you handle work pressure and urgent situations?',
    category: 'Behavioral',
    difficulty: 'medium',
    hints: ['展示时间管理能力', '说明优先级排序方法', '举例说明'],
    sampleAnswer: '我使用优先级矩阵来管理任务，将任务分为紧急重要、重要不紧急等...',
  },
  
  // Technical Questions
  {
    id: '5',
    question: '描述一个你遇到的最困难的技术问题，以及你是如何解决的。',
    questionEn: 'Describe the most difficult technical problem you have encountered and how you solved it.',
    category: 'Technical',
    difficulty: 'hard',
    hints: ['详细说明问题背景', '展示你的分析过程', '强调学习到的经验'],
    sampleAnswer: '在我们的生产环境中，我们遇到了一个内存泄漏问题...',
  },
  {
    id: '6',
    question: '你如何保持技术技能的更新？',
    questionEn: 'How do you keep your technical skills up to date?',
    category: 'Technical',
    difficulty: 'easy',
    hints: ['提及具体的学习资源', '展示持续学习的习惯', '联系工作应用'],
    sampleAnswer: '我通过多种方式保持技能更新：阅读技术博客、参与开源项目...',
  },
  {
    id: '7',
    question: '解释一个复杂的技术概念，让非技术人员也能理解。',
    questionEn: 'Explain a complex technical concept in a way that non-technical people can understand.',
    category: 'Technical',
    difficulty: 'medium',
    hints: ['使用类比', '避免 jargon', '检查理解程度'],
    sampleAnswer: '我会用图书馆的比喻来解释数据库索引...',
  },
  
  // Motivation Questions
  {
    id: '8',
    question: '为什么选择加入我们公司？你对我们了解多少？',
    questionEn: 'Why do you want to join our company? What do you know about us?',
    category: 'Motivation',
    difficulty: 'easy',
    hints: ['研究公司背景和产品', '联系你的职业规划', '展示你的热情'],
    sampleAnswer: '我一直关注贵公司在AI领域的创新，特别是你们最近发布的...',
  },
  {
    id: '9',
    question: '你为什么离开上一份工作？',
    questionEn: 'Why did you leave your last job?',
    category: 'Motivation',
    difficulty: 'medium',
    hints: ['保持积极正面', '聚焦未来发展', '避免负面评价'],
    sampleAnswer: '我在上一家公司学到了很多，但我希望寻求更大的挑战...',
  },
  
  // Career Questions
  {
    id: '10',
    question: '你的职业规划是什么？未来3-5年你希望达到什么目标？',
    questionEn: 'What is your career plan? What goals do you hope to achieve in the next 3-5 years?',
    category: 'Career',
    difficulty: 'easy',
    hints: ['展示你的野心和动力', '联系公司的发展机会', '保持现实和可实现'],
    sampleAnswer: '未来3年，我希望成为技术领域的专家，能够独立负责核心系统...',
  },
  {
    id: '11',
    question: '你理想的工作环境是什么样的？',
    questionEn: 'What is your ideal work environment?',
    category: 'Career',
    difficulty: 'easy',
    hints: ['研究公司文化', '展示适应性', '强调团队协作'],
    sampleAnswer: '我理想的工作环境是开放、协作的，鼓励创新和持续学习...',
  },
  
  // Leadership Questions
  {
    id: '12',
    question: '描述一次你领导团队完成困难任务的经历。',
    questionEn: 'Describe a time when you led a team to complete a difficult task.',
    category: 'Leadership',
    difficulty: 'hard',
    hints: ['展示领导风格', '说明团队管理方法', '量化成果'],
    sampleAnswer: '在我担任技术负责人期间，我们面临一个紧急的产品发布...',
  },
  
  // Problem Solving
  {
    id: '13',
    question: '当你和同事意见不一致时，你会怎么做？',
    questionEn: 'What do you do when you disagree with a colleague?',
    category: 'Problem Solving',
    difficulty: 'medium',
    hints: ['展示沟通技巧', '强调数据驱动', '寻求共识'],
    sampleAnswer: '首先我会确保我理解对方的观点，然后分享我的看法和数据支持...',
  },
  {
    id: '14',
    question: '你如何向团队成员提供反馈？',
    questionEn: 'How do you provide feedback to team members?',
    category: 'Problem Solving',
    difficulty: 'medium',
    hints: ['使用具体例子', '保持建设性', '关注行为而非个人'],
    sampleAnswer: '我遵循SBI模型：情境-行为-影响。首先描述具体情境...',
  },
  
  // Company Specific
  {
    id: '15',
    question: '你对我们公司的产品/服务有什么看法？',
    questionEn: 'What do you think of our company\'s products/services?',
    category: 'Company Knowledge',
    difficulty: 'medium',
    hints: ['做充分的研究', '提出建设性意见', '展示热情'],
    sampleAnswer: '我对贵公司的产品印象深刻，特别是用户体验设计方面...',
  },
  // System Design / Senior-level
  {
    id: '16',
    question: '如果要设计一个高并发的简历投递系统，你会如何设计整体架构？',
    questionEn: 'How would you design a high-throughput resume submission system end-to-end?',
    category: 'Technical',
    difficulty: 'hard',
    hints: ['从用户流程出发', '拆解读写路径', '考虑扩展性与容错'],
    sampleAnswer: '我会从核心功能和读写比例出发，首先区分同步投递和异步处理流程...',
  },
  {
    id: '17',
    question: '你如何在项目中权衡交付速度和代码质量？',
    questionEn: 'How do you balance delivery speed and code quality in a project?',
    category: 'Project Experience',
    difficulty: 'medium',
    hints: ['给出具体实践', '提到自动化测试与代码评审', '体现 owner 意识'],
    sampleAnswer: '我通常会和产品一起明确优先级，在关键路径上保持较高的质量门槛...',
  },
  // Culture / Ownership
  {
    id: '18',
    question: '请举例说明一次你主动推动、而不是被要求去做的改进。',
    questionEn: 'Give an example of a time you proactively drove an improvement without being asked.',
    category: 'Behavioral',
    difficulty: 'medium',
    hints: ['突出主动性', '量化影响', '说明如何对齐利益相关方'],
    sampleAnswer: '在上一个团队中，我发现线上告警经常被忽视，于是我主动设计了一套...',
  },
  {
    id: '19',
    question: '当产品需求和技术实现存在明显冲突时，你通常如何沟通和推进？',
    questionEn: 'When there is a clear conflict between product requirements and technical constraints, how do you communicate and move forward?',
    category: 'Problem Solving',
    difficulty: 'hard',
    hints: ['展现沟通与影响力', '提到 trade-off 和数据支持', '给出实际案例'],
    sampleAnswer: '我会先和产品一起重新澄清目标，再用数据解释不同方案的成本与风险...',
  },
  // Localization / Global mindset
  {
    id: '20',
    question: '如果你的团队同时有中文和英文背景的成员，你会如何确保沟通顺畅？',
    questionEn: 'If your team has both Chinese-speaking and English-speaking members, how do you ensure smooth communication?',
    category: 'Career',
    difficulty: 'medium',
    hints: ['提到双语沟通策略', '强调包容性', '结合远程协作经验'],
    sampleAnswer: '我会在重要讨论中默认使用英文，并在需要时补充中文总结，确保信息对齐...',
  },
];

function computeSystemDesignMetrics(answers: InterviewAnswer[]): SystemDesignMetrics | null {
  const designAnswers = answers.filter((a) => {
    const question = interviewQuestions.find((q) => q.id === a.questionId);
    if (!question) return false;
    if (question.id === '16') return true;
    if (question.category === 'Technical' && question.question.includes('设计')) return true;
    return false;
  });
  if (!designAnswers.length) return null;

  const architectureKeywords = [
    '分层',
    '架构',
    '微服务',
    'microservice',
    'gateway',
    '网关',
    '缓存',
    'cache',
    '读写分离',
    'read replica',
    '消息队列',
    'message queue',
    'event',
    'cqrs',
  ];
  const scalabilityKeywords = [
    '水平扩展',
    'scale out',
    'scalab',
    '分片',
    'shard',
    'sharding',
    '负载均衡',
    'load balancer',
    '缓存',
    'cache',
    '队列',
    'queue',
    'kafka',
    '流量',
    'traffic',
  ];
  const reliabilityKeywords = [
    '降级',
    'degrade',
    '熔断',
    'circuit breaker',
    '重试',
    'retry',
    '限流',
    'rate limit',
    '备份',
    'backup',
    '多活',
    'multi-active',
    '多可用区',
    'multi az',
    '监控',
    'monitor',
    '告警',
    'alert',
    '容灾',
    'dr',
    'failover',
    '故障',
  ];

  const clamp = (v: number) => Math.max(60, Math.min(100, v));

  const scoreWithKeywords = (base: number, text: string, keywords: string[]) => {
    if (!text.trim()) return clamp(base);
    const lower = text.toLowerCase();
    let count = 0;
    keywords.forEach((k) => {
      if (lower.includes(k.toLowerCase())) count += 1;
    });
    const bonus = Math.min(15, count * 5);
    return clamp(base + bonus);
  };

  let architectureSum = 0;
  let scalabilitySum = 0;
  let reliabilitySum = 0;

  designAnswers.forEach((a) => {
    const base = (a.metrics.clarity + a.metrics.relevance) / 2;
    const text = a.transcript || '';
    architectureSum += scoreWithKeywords(base, text, architectureKeywords);
    scalabilitySum += scoreWithKeywords(base, text, scalabilityKeywords);
    reliabilitySum += scoreWithKeywords(base, text, reliabilityKeywords);
  });

  const count = designAnswers.length || 1;
  return {
    architecture: Math.round(architectureSum / count),
    scalability: Math.round(scalabilitySum / count),
    reliability: Math.round(reliabilitySum / count),
  };
}

// Speech recognition hook
function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + ' ' + finalTranscript);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { transcript, startListening, stopListening, setTranscript };
}

// Check auth state from localStorage
function useAuth() {
  const [isLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
  });
  const [user] = useState<{ email: string; role?: string } | null>(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { email?: string; role?: string } | null;
      if (!parsed || typeof parsed.email !== 'string') return null;
      return { email: parsed.email, role: parsed.role };
    } catch {
      return null;
    }
  });
  const isLoading = false;
  const isAdmin = !!user && user.role === 'admin';
  return { isLoggedIn, isLoading, user, isAdmin };
}

export default function AIInterview() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(!isLoading && !isLoggedIn);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textAnswer, setTextAnswer] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setAudioChunks] = useState<Blob[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [reportState, setReportState] = useState<InterviewReport | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const { modelLabel, hasPromptInfo } = getAiInterviewUiInfo();
  
  // Filter questions by category
  const filteredQuestions = selectedCategory === 'all' 
    ? interviewQuestions 
    : interviewQuestions.filter(q => q.category === selectedCategory);
  
  const currentQuestion = filteredQuestions[currentQuestionIndex] || interviewQuestions[0];

  // auth effect removed; initial state derived from useAuth

  useEffect(() => {
    if (!isLoggedIn) return;

    let localStream: MediaStream | null = null;

    const requestPermissions = async () => {
      try {
        if (
          typeof navigator === 'undefined' ||
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          setPermissionError('当前浏览器不支持摄像头或麦克风，请尝试使用最新版 Chrome / Edge');
          return;
        }

        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          const playPromise = videoRef.current.play();
          if (playPromise && typeof (playPromise as Promise<void>).catch === 'function') {
            playPromise.catch((err) => {
              console.error('Failed to start video playback', err);
            });
          }
        }
        setPermissionError(null);
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setPermissionError('无法访问摄像头或麦克风，请检查浏览器和系统权限设置');
      }
    };

    requestPermissions();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLoggedIn]);

  // Toggle video
  useEffect(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOn;
      }
    }
  }, [isVideoOn, stream]);

  // Toggle audio
  useEffect(() => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMicOn;
      }
    }
  }, [isMicOn, stream]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (!stream) return;
    
    try {
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        // Store the answer
        const answer: InterviewAnswer = {
          questionId: currentQuestion.id,
          audioBlob,
          transcript: transcript || textAnswer,
          duration: recordingTime,
          metrics: {
            wpm: Math.floor(Math.random() * 40) + 100,
            clarity: Math.floor(Math.random() * 15) + 80,
            confidence: Math.floor(Math.random() * 20) + 75,
            relevance: Math.floor(Math.random() * 15) + 80,
          },
        };
        setAnswers((prev) => [...prev, answer]);
      };
      
      recorder.start(100);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setIsRecording(true);
      startListening();
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    stopListening();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setRecordingTime(0);
      setTranscript('');
      startRecording();
    }
  };

  const computeMetrics = (text: string, durationSec: number) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const wpm = durationSec > 0 ? Math.round((words / durationSec) * 60) : 0;
    const clarity = Math.max(60, Math.min(95, 80 + Math.min(20, Math.floor(words / 50)) - (wpm > 160 ? 10 : 0)));
    const confidence = Math.max(60, Math.min(95, 78 + Math.min(15, Math.floor(words / 80))));
    const relevance = Math.max(60, Math.min(95, 82 + (text.toLowerCase().includes('team') ? 3 : 0)));
    return { wpm, clarity, confidence, relevance };
  };

  const handleNext = () => {
    // Save current answer if exists
    if ((transcript || textAnswer) && !isRecording) {
      const metrics = computeMetrics(transcript || textAnswer, recordingTime);
      const answer: InterviewAnswer = {
        questionId: currentQuestion.id,
        transcript: transcript || textAnswer,
        duration: recordingTime,
        metrics,
      };
      setAnswers((prev) => [...prev, answer]);
    }

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setRecordingTime(0);
      setTranscript('');
      setTextAnswer('');
      setIsRecording(false);
    } else {
      setInterviewComplete(true);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const generateReport = (): InterviewReport => {
    const totalDuration = answers.reduce((sum, a) => sum + a.duration, 0);
    if (answers.length === 0) {
      return {
        overallScore: 0,
        totalDuration,
        category: currentQuestion.category,
        strengths: ['你已经熟悉了面试流程，下一步可以尝试完整作答每一道题目'],
        improvements: ['完成至少3道题的练习，有助于生成更准确的评估'],
        answers,
      };
    }

    let sumClarity = 0;
    let sumConfidence = 0;
    let sumRelevance = 0;
    let sumWpm = 0;
    let weightedSum = 0;
    let weightTotal = 0;

    let technicalCount = 0;
    let behavioralCount = 0;
    let projectCount = 0;

    answers.forEach((a) => {
      sumClarity += a.metrics.clarity;
      sumConfidence += a.metrics.confidence;
      sumRelevance += a.metrics.relevance;
      sumWpm += a.metrics.wpm;

      const question = interviewQuestions.find((q) => q.id === a.questionId);
      const category = question?.category || 'General';
      const baseScore = (a.metrics.clarity + a.metrics.confidence + a.metrics.relevance) / 3;

      let weight = 1;
      if (category === 'Technical') {
        weight = 1.15;
        technicalCount += 1;
      } else if (category === 'Project Experience') {
        weight = 1.1;
        projectCount += 1;
      } else if (category === 'Behavioral') {
        weight = 1.05;
        behavioralCount += 1;
      }

      weightedSum += baseScore * weight;
      weightTotal += weight;
    });

    const avgClarity = sumClarity / answers.length;
    const avgConfidence = sumConfidence / answers.length;
    const avgRelevance = sumRelevance / answers.length;
    const avgWpm = sumWpm / answers.length;
    const overallScore = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0;
    const avgDurationPerAnswer = totalDuration / answers.length;

    // Generate personalized feedback based on answers
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    if (avgWpm >= 120 && avgWpm <= 160) {
      strengths.push('语速适中，表达清晰流畅');
    } else if (avgWpm > 170) {
      improvements.push('语速偏快，可以适当放慢以留出思考空间');
    } else if (avgWpm < 90) {
      improvements.push('语速偏慢，可以尝试提高语速以保持面试官注意力');
    }

    if (avgRelevance >= 88) {
      strengths.push('回答紧扣问题，能够抓住核心要点');
    } else if (avgRelevance < 80) {
      improvements.push('部分回答偏离主题，建议用一两句话先正面回答问题再展开细节');
    }

    if (avgClarity >= 88) {
      strengths.push('表达逻辑清晰，结构完整，层次分明');
    } else if (avgClarity < 80) {
      improvements.push('可以尝试使用 STAR 法（情境、任务、行动、结果）来组织回答结构');
    }

    if (avgConfidence >= 88) {
      strengths.push('表达自信，语气自然，具备良好的说服力');
    } else if (avgConfidence < 80) {
      improvements.push('可以通过适当停顿和总结关键点来增强自信感的呈现');
    }

    if (avgDurationPerAnswer < 45) {
      improvements.push('部分回答略显简短，可以补充更多细节和量化结果');
    } else if (avgDurationPerAnswer > 150) {
      improvements.push('部分回答略长，建议在 1-2 分钟内聚焦最关键的经历和成果');
    }

    if (technicalCount > 0 && avgClarity >= 85) {
      strengths.push('技术问题回答思路清晰，能用通俗语言解释复杂概念');
    }

    if (projectCount > 0 && avgRelevance >= 85) {
      strengths.push('项目经历描述能够突出你的角色和业务价值');
    }

    if (behavioralCount > 0 && avgConfidence < 82) {
      improvements.push('在行为面试题中可以多强调你在团队中的影响力和决策过程');
    }

    if (answers.length >= 5 && overallScore >= 85) {
      strengths.push('多轮回答表现稳定，具备良好的面试耐力和状态管理能力');
    }

    if (overallScore < 75) {
      improvements.push('整体得分还有提升空间，建议针对高频问题多做几轮模拟练习');
    }

    if (hasPromptInfo) {
      strengths.push('已基于自定义面试提示词进行练习，场景更贴近目标岗位');
    }

    const systemDesignMetrics = computeSystemDesignMetrics(answers);
    if (systemDesignMetrics) {
      const { architecture, scalability, reliability } = systemDesignMetrics;
      strengths.push(
        `系统设计-架构：${architecture} / 100`,
        `系统设计-扩展性：${scalability} / 100`,
        `系统设计-可靠性与故障预案：${reliability} / 100`
      );
      if (architecture < 80) {
        improvements.push('在整体架构设计上可以进一步明确核心组件和边界，避免耦合过高');
      }
      if (scalability < 80) {
        improvements.push('扩展性方面可以多考虑缓存、队列和水平扩展方案，并说明扩容策略');
      }
      if (reliability < 80) {
        improvements.push('可靠性与故障预案方面可以补充降级、限流、熔断和多机房容灾等设计');
      }
    }
    
    return {
      overallScore,
      totalDuration,
      category: currentQuestion.category,
      strengths: strengths.length > 0 ? strengths : ['回答结构清晰，逻辑性强'],
      improvements: improvements.length > 0 ? improvements : ['可以尝试更多具体的数据支撑'],
      answers,
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViewReport = async () => {
    setReportError(null);
    setIsReportLoading(true);

    const base = typeof window !== 'undefined' ? localStorage.getItem('interviewApi.base') || '' : '';
    const token = typeof window !== 'undefined' ? localStorage.getItem('interviewApi.token') || '' : '';
    const trimmedBase = base.replace(/\/$/, '');
    const hasApi = !!trimmedBase;

    if (hasApi) {
      try {
        let prompt = '';
        if (typeof window !== 'undefined') {
          const rawPrompts = localStorage.getItem('aiPrompts');
          if (rawPrompts) {
            try {
              const parsed = JSON.parse(rawPrompts) as Record<string, string>;
              const p = parsed?.interview_prep;
              if (typeof p === 'string' && p.trim()) {
                prompt = p;
              }
            } catch (e) {
              console.error('Failed to parse aiPrompts for interview report', e);
            }
          }
        }

        const resp = await fetch(`${trimmedBase}/interview-report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            answers: answers.map(a => {
              const question = interviewQuestions.find(q => q.id === a.questionId);
              return {
                questionId: a.questionId,
                question: question ? question.question : '',
                answerText: a.transcript,
                duration: a.duration,
                metrics: a.metrics,
              };
            }),
            category: currentQuestion.category,
            prompt,
            systemDesignMetrics: computeSystemDesignMetrics(answers),
          }),
        });

        if (resp.ok) {
          const payload = (await resp.json()) as InterviewReportApiResponse | null;
          if (payload && typeof payload.overallScore === 'number') {
            setReportState({
              overallScore: payload.overallScore,
              totalDuration: payload.totalDuration,
              strengths: payload.strengths,
              improvements: payload.improvements,
              answers: payload.answers && payload.answers.length ? payload.answers : answers,
              category: payload.category || currentQuestion.category,
            });
            setShowReport(true);
            setIsReportLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Interview report API request failed', e);
        setReportError('面试报告服务暂时不可用，已使用本地评估结果');
      }
    }

    const localReport = generateReport();
    setReportState(localReport);
    setShowReport(true);
    setIsReportLoading(false);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setRecordingTime(0);
    setTranscript('');
    setTextAnswer('');
    setIsRecording(false);
    setInterviewComplete(false);
    setShowReport(false);
    setAnswers([]);
    setInterviewStarted(false);
    setReportState(null);
    setReportError(null);
    setIsReportLoading(false);
  };

  const startInterview = (category: string = 'all') => {
    setSelectedCategory(category);
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(interviewQuestions.map(q => q.category)))];

  // Login Dialog
  if (showLoginDialog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-center text-xl">需要登录</DialogTitle>
              <DialogDescription className="text-center">
                AI面试功能需要登录后才能使用。请先登录或注册账号。
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={() => navigate('/login')} className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                立即登录
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')} className="w-full">
                注册账号
              </Button>
              <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
                返回首页
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Interview Setup / Category Selection
  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">返回首页</span>
            </Link>
            <h1 className="text-xl font-semibold">AI 面试模拟</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              准备开始 AI 面试练习
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              选择面试类型，我们的 AI 将模拟真实面试场景，帮助你提升面试表现
            </p>
            {(modelLabel || hasPromptInfo) && (
              <p className="mt-2 text-xs text-muted-foreground">
                {modelLabel && <>当前 AI 模型：{modelLabel}</>}
                {modelLabel && hasPromptInfo && ' · '}
                {hasPromptInfo && '已应用自定义面试提示词'}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {categories.map((category) => {
              const questionCount = category === 'all' 
                ? interviewQuestions.length 
                : interviewQuestions.filter(q => q.category === category).length;
              
              const categoryNames: Record<string, string> = {
                all: '综合面试',
                Behavioral: '行为面试',
                'Project Experience': '项目经验',
                Technical: '技术面试',
                Motivation: '求职动机',
                Career: '职业规划',
                Leadership: '领导力',
                'Problem Solving': '问题解决',
                'Company Knowledge': '公司了解',
              };
              
              const categoryDescriptions: Record<string, string> = {
                all: '涵盖所有类型的面试问题',
                Behavioral: '考察过往经历和软技能',
                'Project Experience': '深入了解你的项目经验',
                Technical: '技术能力和问题解决',
                Motivation: '了解你的求职动机',
                Career: '职业发展规划',
                Leadership: '团队管理和领导能力',
                'Problem Solving': '解决冲突和沟通',
                'Company Knowledge': '对公司的了解和热情',
              };
              
              return (
                <button
                  key={category}
                  onClick={() => startInterview(category)}
                  className="p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {categoryNames[category] || category}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {questionCount} 题
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {categoryDescriptions[category] || ''}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-primary">
                    <span>开始练习</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-1">语音回答</h4>
              <p className="text-sm text-muted-foreground">支持语音录制和实时转录</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-1">视频模拟</h4>
              <p className="text-sm text-muted-foreground">模拟真实视频面试场景</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-1">详细报告</h4>
              <p className="text-sm text-muted-foreground">获得个性化的面试反馈</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Interview Report View
  if (showReport) {
    const report = reportState ?? generateReport();
    
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">返回首页</span>
            </Link>
            <h1 className="text-xl font-semibold">面试报告</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                分享
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                下载
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Overall Score */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(report.overallScore / 100) * 351.86} 351.86`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{report.overallScore}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">总体评分</h2>
                  <p className="text-muted-foreground">
                    基于 {answers.length} 个问题的综合表现
                  </p>
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatTime(report.totalDuration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{answers.length} 题</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="font-medium">清晰度</span>
                </div>
                <Progress value={report.answers[0]?.metrics.clarity || 80} className="h-2" />
                <span className="text-sm text-muted-foreground mt-1">
                  {report.answers[0]?.metrics.clarity || 80}%
                </span>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">自信心</span>
                </div>
                <Progress value={report.answers[0]?.metrics.confidence || 75} className="h-2" />
                <span className="text-sm text-muted-foreground mt-1">
                  {report.answers[0]?.metrics.confidence || 75}%
                </span>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                优势亮点
              </h3>
              <ul className="space-y-3">
                {report.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                改进建议
              </h3>
              <ul className="space-y-3">
                {report.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Answer Details */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                回答详情
              </h3>
            </div>
            <div className="divide-y divide-border">
              {report.answers.map((answer, index) => {
                const question = interviewQuestions.find(q => q.id === answer.questionId);
                return (
                  <div key={answer.questionId} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">问题 {index + 1}</span>
                        <h4 className="font-medium mt-1">{question?.question}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{formatTime(answer.duration)}</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {answer.metrics.clarity}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {answer.transcript || '（未提供文字回答）'}
                      </p>
                    </div>
                    {question?.sampleAnswer && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">参考答案:</p>
                        <p className="text-sm text-green-700 dark:text-green-500">{question.sampleAnswer}</p>
                      </div>
                    )}
                    {answer.audioBlob && (
                      <audio 
                        controls 
                        src={URL.createObjectURL(answer.audioBlob)} 
                        className="mt-4 w-full h-8"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              重新面试
            </Button>
            <Link to="/templates">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                继续优化简历
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Interview Complete View
  if (interviewComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">面试完成！</h1>
          <p className="text-muted-foreground mb-8">
            感谢您的参与，我们已为您生成详细的面试报告
          </p>
          {reportError && (
            <p className="text-xs text-amber-500 mb-4">{reportError}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={handleViewReport}
              className="gap-2"
              disabled={isReportLoading}
            >
              {isReportLoading && (
                <span className="mr-1 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
              <BarChart3 className="w-4 h-4" />
              查看报告
            </Button>
            <Button 
              onClick={handleRestart}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <RotateCcw className="w-4 h-4" />
              开始新面试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Interview View
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold hidden sm:inline">EvalShare</span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
            {currentQuestion.category} Interview
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Progress 
            value={((currentQuestionIndex + 1) / filteredQuestions.length) * 100} 
            className="w-20 sm:w-32 h-2" 
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {currentQuestionIndex + 1}/{filteredQuestions.length}
          </span>
          <Link to="/">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              退出
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Video & Question */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6">
          {/* Video Preview */}
          <div className="relative mb-6 w-full max-w-md">
            <div className="aspect-video bg-muted rounded-2xl overflow-hidden border border-border">
              {isVideoOn && stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full text-xs font-medium text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                REC
              </div>
            )}
          </div>

          {/* Question */}
          <div className="max-w-2xl w-full text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground">{currentQuestion.category}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium leading-relaxed mb-3">
              {currentQuestion.question}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base italic">
              {currentQuestion.questionEn}
            </p>
          </div>
        </div>

        {/* Right: Input Area */}
        <div className="lg:w-96 bg-card border-t lg:border-t-0 lg:border-l border-border p-4 sm:p-6">
          <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'voice' | 'text')}>
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="voice" className="gap-2">
                <Mic className="w-4 h-4" />
                语音
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-2">
                <Type className="w-4 h-4" />
                文字
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="mt-0">
              {/* Voice Input */}
              <div className="space-y-4">
                {permissionError && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-600">
                    {permissionError}
                  </div>
                )}

                {/* Recording Button */}
                <div className="flex justify-center py-4">
                  <button
                    onClick={toggleRecording}
                    disabled={!!permissionError}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/30' 
                        : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isRecording ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </button>
                </div>

                {isRecording && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">正在录音...</p>
                  </div>
                )}

                {/* Live Transcript */}
                {(transcript || isRecording) && (
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm font-medium mb-2">实时转录</p>
                    <p className="text-muted-foreground text-sm min-h-[60px]">
                      {transcript || '正在聆听...'}
                    </p>
                  </div>
                )}

                {/* Tips */}
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">提示：</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 保持语速适中，清晰表达</li>
                    <li>• 使用 STAR 法则组织回答</li>
                    <li>• 每个问题建议回答 1-2 分钟</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0">
              {/* Text Input */}
              <div className="space-y-4">
                <Textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="在此输入你的回答..."
                  className="min-h-[200px] resize-none"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{textAnswer.length} 字符</span>
                  <span>建议 100-500 字</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="border-t border-border bg-card px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Hint */}
          <button 
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-full transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span className="text-sm hidden sm:inline">提示</span>
          </button>

          {/* Center: Media Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-colors ${isMicOn ? 'bg-muted hover:bg-muted/80' : 'bg-red-500/10 text-red-500'}`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-colors ${isVideoOn ? 'bg-muted hover:bg-muted/80' : 'bg-red-500/10 text-red-500'}`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSkip}
              className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-full transition-colors"
            >
              <SkipForward className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">跳过</span>
            </button>
            <Button 
              onClick={handleNext}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {currentQuestionIndex < filteredQuestions.length - 1 ? '下一题' : '完成'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </footer>

      {/* Hint Modal */}
      {showHint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-lg w-full p-6 border border-border shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">面试提示</h3>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">回答这个问题时，建议：</p>
              <ul className="space-y-2">
                {currentQuestion.hints.map((hint, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-muted rounded-lg p-4 mt-4">
                <p className="text-sm font-medium mb-2">STAR 法则：</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>S</strong>ituation - 背景</div>
                  <div><strong>T</strong>ask - 任务</div>
                  <div><strong>A</strong>ction - 行动</div>
                  <div><strong>R</strong>esult - 结果</div>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowHint(false)}
              className="mt-6 w-full bg-primary hover:bg-primary/90"
            >
              明白了
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
