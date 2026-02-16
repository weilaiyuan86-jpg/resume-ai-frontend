import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight, 
  Sparkles, CheckCircle, Github, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://82.29.197.201:3000';

type UserRole = 'super_admin' | 'admin' | 'viewer' | 'user';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const plainPassword = password;
    if (!trimmedEmail || !plainPassword) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: plainPassword,
        }),
      });
      if (!response.ok) {
        let message = '登录失败，请检查邮箱和密码';
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
        setError('登录响应异常，请稍后再试');
        setLoading(false);
        return;
      }
      let role: UserRole = 'user';
      try {
        const rawUsers = localStorage.getItem('users');
        if (rawUsers) {
          const parsed = JSON.parse(rawUsers) as {
            email?: string;
            role?: UserRole;
          }[] | null;
          if (Array.isArray(parsed)) {
            const found = parsed.find(
              (u) => u && typeof u.email === 'string' && u.email.toLowerCase() === trimmedEmail
            );
            if (found && found.role) {
              role = found.role;
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
      if (trimmedEmail === 'admin@resumeai.local') {
        role = 'super_admin';
      }
      const user = {
        id: data.user.id,
        email: data.user.email,
        role,
      };
      localStorage.setItem('auth_token', data.token as string);
      localStorage.setItem('user', JSON.stringify(user));
      if (from === '/admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      setError('网络异常，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-3/50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Form */}
            <div className="bg-white rounded-2xl shadow-card p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange/10 mb-4">
                  <Sparkles className="w-8 h-8 text-brand-orange" />
                </div>
                <h1 className="text-2xl font-bold text-brand-black mb-2">
                  欢迎回来
                </h1>
                <p className="text-brand-gray-2">
                  登录您的账户，继续创建专业简历
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
                    或使用邮箱登录
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      记住我
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand-orange hover:underline"
                  >
                    忘记密码？
                  </Link>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-brand-orange hover:bg-brand-orange/90 text-white disabled:opacity-50"
                >
                  {loading ? '登录中...' : '登录'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <p className="text-center mt-6 text-sm text-brand-gray-2">
                还没有账户？{' '}
                <Link to="/register" className="text-brand-orange hover:underline font-medium">
                  免费注册
                </Link>
              </p>
            </div>

            {/* Right Side - Benefits */}
            <div className="hidden lg:block">
              <h2 className="text-3xl font-bold text-brand-black mb-6">
                加入数万成功求职者的行列
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'AI驱动的简历优化',
                    description: '智能分析您的经历，提供个性化的改进建议',
                  },
                  {
                    title: 'ATS兼容性检测',
                    description: '确保您的简历能够通过求职者追踪系统',
                  },
                  {
                    title: '专业模板库',
                    description: '数十种经过验证的专业简历模板',
                  },
                  {
                    title: '投递追踪管理',
                    description: '跟踪所有求职申请，不再错过任何机会',
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-black">{benefit.title}</h3>
                      <p className="text-brand-gray-2 text-sm mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-brand-gray-3">
                <div>
                  <p className="text-3xl font-bold text-brand-orange">50K+</p>
                  <p className="text-sm text-brand-gray-2">成功求职</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-orange">4.9</p>
                  <p className="text-sm text-brand-gray-2">用户评分</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-orange">100+</p>
                  <p className="text-sm text-brand-gray-2">专业模板</p>
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
