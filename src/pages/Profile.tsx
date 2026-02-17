import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Briefcase, 
  FileText, Edit3, Camera, CheckCircle, Plus, Trash2, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';

type UserRole = 'super_admin' | 'admin' | 'viewer' | 'user';

const mockResumes = [
  { id: '1', name: 'Software Engineer Resume', updatedAt: '2024-01-20', status: 'active' },
  { id: '2', name: 'Product Manager Resume', updatedAt: '2024-01-15', status: 'draft' },
  { id: '3', name: 'Data Scientist Resume', updatedAt: '2024-01-10', status: 'archived' },
];

const mockActivity = [
  { id: '1', action: '创建了新的简历', target: 'Software Engineer Resume', date: '2024-01-20' },
  { id: '2', action: '更新了个人信息', target: '', date: '2024-01-18' },
  { id: '3', action: '下载了PDF', target: 'Product Manager Resume', date: '2024-01-15' },
  { id: '4', action: '完成了ATS检测', target: 'Data Scientist Resume', date: '2024-01-12' },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const profileRef = useRef<HTMLDivElement>(null);
  const [email] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { email?: string } | null;
      return typeof parsed?.email === 'string' ? parsed.email : null;
    } catch {
      return null;
    }
  });
  const [role] = useState<UserRole | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { role?: string } | null;
      const rawRole = parsed?.role;
      return rawRole === 'super_admin' ||
        rawRole === 'admin' ||
        rawRole === 'viewer' ||
        rawRole === 'user'
        ? rawRole
        : null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        profileRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  const roleLabel =
    role === 'super_admin'
      ? '站长 / 超级管理员'
      : role === 'admin'
      ? '后台管理员'
      : role === 'viewer'
      ? '只读管理员'
      : role === 'user'
      ? '普通用户'
      : '未登录';

  const roleDescription =
    role === 'super_admin'
      ? '拥有系统内最高权限，可以管理所有后台配置、用户和角色，并访问所有实验性功能。'
      : role === 'admin'
      ? '拥有完整的后台管理权限，可以配置 AI 提示词、管理内容、管理用户，但无法修改超级管理员本身。'
      : role === 'viewer'
      ? '可以访问后台查看配置和数据，但无法修改配置、删除数据或调整用户角色。适合运营或观察者使用。'
      : role === 'user'
      ? '可以正常使用简历编辑、ATS 检测、AI 工具等前台功能，但无法访问后台管理。'
      : '登录后可以查看自己的账户邮箱和权限信息。';

  return (
    <div className="min-h-screen bg-brand-gray-3/50">
      <Navbar />
      <main className="pt-24 pb-16">
        <div ref={profileRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange to-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg hover:bg-brand-orange/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-brand-black">
                  {email || '未命名用户'}
                </h1>
                <p className="text-brand-gray-2">
                  {role === 'super_admin' || role === 'admin'
                    ? 'EvalShare 后台管理账号'
                    : 'EvalShare 普通用户'}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-brand-gray-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {email || '未登录邮箱'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    +1 234 567 890
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    San Francisco, CA
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <Badge
                    className={
                      role === 'super_admin'
                        ? 'bg-purple-100 text-purple-700'
                        : role === 'admin'
                        ? 'bg-green-100 text-green-700'
                        : role === 'viewer'
                        ? 'bg-blue-100 text-blue-700'
                        : role === 'user'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-slate-100 text-slate-600'
                    }
                  >
                    权限：{roleLabel}
                  </Badge>
                  <span className="text-xs text-brand-gray-2">
                    {role ? '根据当前登录身份自动识别权限' : '请先登录以查看权限'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? '保存' : '编辑资料'}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white p-1 rounded-xl shadow-card">
              <TabsTrigger value="overview" className="rounded-lg">
                概览
              </TabsTrigger>
              <TabsTrigger value="resumes" className="rounded-lg">
                我的简历
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg">
                设置
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '简历数量', value: '3', icon: FileText },
                  { label: '投递申请', value: '12', icon: Briefcase },
                  { label: '面试邀请', value: '4', icon: CheckCircle },
                  { label: 'Offer', value: '1', icon: CheckCircle },
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-brand-gray-2">{stat.label}</p>
                        <p className="text-2xl font-bold text-brand-black">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-brand-orange" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Resumes */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-brand-black">最近简历</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('resumes')}>
                      查看全部
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {mockResumes.slice(0, 3).map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-brand-gray-3/50 hover:bg-brand-gray-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-brand-orange" />
                          </div>
                          <div>
                            <p className="font-medium text-brand-black">{resume.name}</p>
                            <p className="text-sm text-brand-gray-2">{resume.updatedAt}</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            resume.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : resume.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {resume.status === 'active' ? '活跃' : resume.status === 'draft' ? '草稿' : '归档'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-brand-black mb-6">最近活动</h3>
                  <div className="space-y-4">
                    {mockActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-orange mt-2" />
                        <div>
                          <p className="text-brand-black">
                            {activity.action}
                            {activity.target && (
                              <span className="text-brand-orange"> {activity.target}</span>
                            )}
                          </p>
                          <p className="text-sm text-brand-gray-2">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permission Details */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-brand-black">权限说明</h3>
                  {(role === 'super_admin' || role === 'admin') && (
                    <Button
                      size="sm"
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                      onClick={() => navigate('/admin', { state: { section: 'users' } })}
                    >
                      后台用户管理
                    </Button>
                  )}
                </div>
                <p className="text-sm text-brand-gray-2 mb-4">
                  当前身份：<span className="font-medium text-brand-black">{roleLabel}</span>
                </p>
                <p className="text-sm text-brand-gray-2 mb-6">{roleDescription}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-brand-gray-2">
                  <div className="space-y-2">
                    <p className="font-medium text-brand-black">不同角色可以做什么？</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>普通用户：使用简历编辑、ATS 检测、AI 面试、职位描述、冷邮件等工具。</li>
                      <li>只读管理员：可以进入后台查看配置和数据，但不能修改。</li>
                      <li>管理员：可以管理 AI 提示词、博客内容、支付配置和用户列表。</li>
                      <li>超级管理员：在管理员基础上，还可以调整其他管理员和超级管理员的角色。</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-brand-black">如何变更权限？</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>只有管理员或超级管理员可以在「后台 → 用户管理」中调整用户角色。</li>
                      <li>超级管理员可以授予或取消其他用户的超级管理员权限。</li>
                      <li>权限变更后，下次登录或刷新页面即可生效。</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Resumes Tab */}
            <TabsContent value="resumes">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-brand-black">我的简历</h3>
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    新建简历
                  </Button>
                </div>
                <div className="space-y-4">
                  {mockResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-6 rounded-xl border border-brand-gray-3 hover:border-brand-orange/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                          <FileText className="w-7 h-7 text-brand-orange" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-black text-lg">{resume.name}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-brand-gray-2">
                            <span>更新于 {resume.updatedAt}</span>
                            <Badge
                              className={
                                resume.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : resume.status === 'draft'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }
                            >
                              {resume.status === 'active' ? '活跃' : resume.status === 'draft' ? '草稿' : '归档'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8">
              {/* Account Settings */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-brand-black mb-6">账户设置</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>全名</Label>
                      <Input defaultValue="John Doe" className="mt-2" />
                    </div>
                    <div>
                      <Label>邮箱</Label>
                      <Input defaultValue="john.doe@example.com" className="mt-2" />
                    </div>
                    <div>
                      <Label>电话</Label>
                      <Input defaultValue="+1 234 567 890" className="mt-2" />
                    </div>
                    <div>
                      <Label>地点</Label>
                      <Input defaultValue="San Francisco, CA" className="mt-2" />
                    </div>
                  </div>
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                    保存更改
                  </Button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-brand-black mb-6">通知设置</h3>
                <div className="space-y-4">
                  {[
                    { label: '邮件通知', description: '接收关于账户活动和更新的邮件' },
                    { label: '求职提醒', description: '当有新职位匹配时接收通知' },
                    { label: '面试提醒', description: '面试前接收提醒通知' },
                    { label: '产品更新', description: '了解新功能和改进' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-brand-black">{item.label}</p>
                        <p className="text-sm text-brand-gray-2">{item.description}</p>
                      </div>
                      <Switch defaultChecked={index < 2} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-brand-black mb-6">安全设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-brand-black">修改密码</p>
                      <p className="text-sm text-brand-gray-2">上次修改：3个月前</p>
                    </div>
                    <Button variant="outline">修改</Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-brand-black">双因素认证</p>
                      <p className="text-sm text-brand-gray-2">增强账户安全性</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
