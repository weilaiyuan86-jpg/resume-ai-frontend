import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, User, ArrowRight, 
  Sparkles, CheckCircle, Github, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API_BASE_URL = '/api';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const plainPassword = password;
    const name = fullName.trim();
    if (!agreeTerms || !trimmedEmail || !plainPassword || !name) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: plainPassword,
          fullName: name,
        }),
      });
      if (!response.ok) {
        let message = '注册失败，请稍后再试';
        try {
          const data = await response.json();
          if (data && typeof data.error === 'string') {
            message = data.error;
          }
        } catch (err) {
          console.error(err);
        }
        setError(message);
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (!data || !data.ok || !data.token || !data.user) {
        setError('注册响应异常，请稍后再试');
        setLoading(false);
        return;
      }
      const user = {
        id: data.user.id,
        email: data.user.email,
        role: 'user' as const,
      };
      localStorage.setItem('auth_token', data.token as string);
      localStorage.setItem('user', JSON.stringify(user));
      try {
        const rawUsers = localStorage.getItem('users');
        let users: { id: string; email: string; plan: string; role?: 'super_admin' | 'admin' | 'viewer' | 'user' }[] = [];
        if (rawUsers) {
          const parsed = JSON.parse(rawUsers);
          if (Array.isArray(parsed)) {
            users = parsed;
          }
        }
        const exists = users.some(
          (u) => u && typeof u.email === 'string' && u.email.toLowerCase() === trimmedEmail,
        );
        if (!exists) {
          users = [
            {
              id: data.user.id || Date.now().toString(),
              email: data.user.email,
              plan: 'free',
              role: 'user',
            },
            ...users,
          ];
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch (err) {
        console.error(err);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resumeai-auth-changed'));
      }
      navigate('/resume-editor', { replace: true });
    } catch (err) {
      console.error(err);
      setError('网络异常，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Form */}
            <div className="bg-card rounded-2xl shadow-card p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange/10 mb-4">
                  <Sparkles className="w-8 h-8 text-brand-orange" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  创建免费账户
                </h1>
                <p className="text-brand-gray-2">
                  开始您的专业简历创建之旅
                </p>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button variant="outline" className="h-12">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" className="h-12">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-gray-3" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-brand-gray-2">
                    或使用邮箱注册
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">全名</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-2" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">邮箱地址</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">密码</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-2" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-2 hover:text-brand-gray-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-brand-gray-2 mt-2">
                    密码至少需要8个字符，包含字母和数字
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                    我同意{' '}
                    <Link to="/terms" className="text-brand-orange hover:underline">
                      服务条款
                    </Link>{' '}
                    和{' '}
                    <Link to="/privacy" className="text-brand-orange hover:underline">
                      隐私政策
                    </Link>
                  </Label>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={!agreeTerms || loading}
                  className="w-full h-12 bg-brand-orange hover:bg-brand-orange/90 text-white disabled:opacity-50"
                >
                  {loading ? '创建中...' : '创建账户'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <p className="text-center mt-6 text-sm text-brand-gray-2">
                已有账户？{' '}
                <Link to="/login" className="text-brand-orange hover:underline font-medium">
                  立即登录
                </Link>
              </p>
            </div>

            {/* Right Side - Benefits */}
            <div className="hidden lg:block">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                免费开始，无需信用卡
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: '免费创建3份简历',
                    description: '基础版完全免费，满足您的基本需求',
                  },
                  {
                    title: 'ATS兼容性检测',
                    description: '确保您的简历能够通过求职者追踪系统',
                  },
                  {
                    title: '专业模板库',
                    description: '访问数十种经过验证的专业简历模板',
                  },
                  {
                    title: 'AI内容建议',
                    description: '获得智能的简历优化建议（专业版）',
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-brand-gray-2 text-sm mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="mt-12 p-6 bg-card rounded-2xl shadow-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-5 h-5 text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <p className="text-brand-gray-1 mb-4">
                  "EvalShare帮我优化了简历，两周内就收到了3个面试邀请。这个工具真的改变了我的求职体验！"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    SC
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sarah Chen</p>
                    <p className="text-sm text-brand-gray-2">Software Engineer at Google</p>
                  </div>
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
