import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Zap, MessageSquare, PenTool, Briefcase, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useSiteConfig } from '@/hooks/useSiteConfig';

type NavLink = { name: string; href: string };

const navLinks: NavLink[] = [
  { name: '首页', href: '/' },
  { name: 'ATS检测', href: '/ats-checker' },
  { name: '简历编辑', href: '/resume-editor' },
  { name: '求职路线图', href: '/job-goal-planner' },
  { name: '投递追踪', href: '/job-tracker' },
  { name: '模板库', href: '/templates' },
  { name: '博客', href: '/blog' },
];

const aiTools = [
  { name: 'AI 面试', href: '/ai-interview', icon: MessageSquare, description: '模拟面试练习' },
  { name: '求职信生成', href: '/cover-letter', icon: PenTool, description: '一键生成求职信' },
  { name: '职位描述生成', href: '/job-description', icon: Briefcase, description: '输出结构化 JD 文案' },
  { name: '冷邮件生成', href: '/cold-email', icon: Mail, description: '生成高回复率冷邮件' },
];

type UserRole = 'super_admin' | 'admin' | 'viewer' | 'user';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [remoteNavItems, setRemoteNavItems] = useState<NavLink[] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const rawUser = localStorage.getItem('user');
    return !!rawUser;
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { email?: string; role?: string } | null;
      const role = parsed?.role;
      if (role === 'super_admin' || role === 'admin' || role === 'viewer' || role === 'user') {
        return role;
      }
      return null;
    } catch {
      return null;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  const baseNavItems: NavLink[] = config.header?.navItems?.length
    ? config.header.navItems
    : navLinks;
  const navItems: NavLink[] =
    remoteNavItems && remoteNavItems.length ? remoteNavItems : baseNavItems;
  const brandName = (config.header?.logo && config.header.logo.trim()) || 'EvalShare';
  const brandInitial = brandName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadNavigation = async () => {
      try {
        const resp = await fetch('/api/navigation?position=header');
        if (!resp.ok) return;
        const data = (await resp.json()) as {
          ok?: boolean;
          items?: { label?: string; path?: string; visible?: boolean }[];
        };
        if (!data || data.ok === false || !Array.isArray(data.items)) return;
        const items: NavLink[] = data.items
          .filter((item) => item && item.visible !== false)
          .map((item) => ({
            name: String(item.label || '').trim() || '未命名',
            href: String(item.path || '/'),
          }));
        if (!items.length) return;
        if (!cancelled) {
          setRemoteNavItems(items);
        }
      } catch {
      }
    };
    loadNavigation();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem('user');
      if (!raw) {
        setUserRole(null);
        setIsLoggedIn(false);
        return;
      }
      try {
        const parsed = JSON.parse(raw) as { email?: string; role?: string } | null;
        const role = parsed?.role;
        if (role === 'super_admin' || role === 'admin' || role === 'viewer' || role === 'user') {
          setUserRole(role);
        } else {
          setUserRole('user');
        }
        setIsLoggedIn(true);
      } catch {
        setUserRole(null);
        setIsLoggedIn(false);
      }
    };
    syncAuth();
    const handleStorage = () => syncAuth();
    const handleAuthChanged = () => syncAuth();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('resumeai-auth-changed', handleAuthChanged as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('resumeai-auth-changed', handleAuthChanged as EventListener);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const canAccessAdmin =
    userRole === 'super_admin' || userRole === 'admin' || userRole === 'viewer';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('resumeai-auth-changed'));
    }
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-expo-out ${
        isScrolled
          ? 'glass shadow-card py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform duration-300 ease-elastic hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-glow">
              <span className="text-lg font-extrabold text-white">
                {brandInitial}
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {config.header.logo || 'Resume'}<span className="text-brand-orange">{config.header.logo ? '' : 'AI'}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                  isActive(link.href)
                    ? 'text-brand-orange'
                    : 'text-brand-gray-1 hover:text-brand-orange'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-brand-orange transition-all duration-300 ease-expo-out ${
                    isActive(link.href) ? 'w-4' : 'w-0 group-hover:w-4'
                  }`}
                />
              </Link>
            ))}
            
            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAITools(!showAITools)}
                onMouseEnter={() => setShowAITools(true)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-brand-gray-1 hover:text-brand-orange transition-colors rounded-lg"
              >
                <Zap className="w-4 h-4" />
                AI 工具
                <ChevronDown className={`w-4 h-4 transition-transform ${showAITools ? 'rotate-180' : ''}`} />
              </button>
              
              {showAITools && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50"
                  onMouseLeave={() => setShowAITools(false)}
                >
                  {aiTools.map((tool) => (
                    <Link
                      key={tool.name}
                      to={tool.href}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors"
                      onClick={() => setShowAITools(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground text-sm">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                {canAccessAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="outline"
                      className="text-sm font-medium border-border"
                    >
                      后台管理
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-brand-gray-1 hover:text-brand-orange hover:bg-brand-orange/5"
                  >
                    个人中心
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white px-5"
                >
                  退出登录
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-brand-gray-1 hover:text-brand-orange hover:bg-brand-orange/5"
                  >
                    登录
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-glow hover:shadow-glow-strong transition-all duration-300 ease-elastic hover:scale-102 px-6">
                    免费开始
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-expo-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-card rounded-2xl shadow-card border border-border p-4 space-y-2">
            {navItems.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-brand-orange/10 text-brand-orange'
                    : 'text-brand-gray-1 hover:bg-brand-gray-3 hover:text-brand-orange'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* AI Tools in Mobile */}
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase">AI 工具</div>
            {aiTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-gray-1 hover:bg-brand-gray-3 hover:text-brand-orange transition-all"
              >
                <tool.icon className="w-4 h-4" />
                {tool.name}
              </Link>
            ))}
            
            <div className="pt-2 border-t border-border space-y-2">
              {isLoggedIn ? (
                <>
                  {canAccessAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-center border-border"
                      >
                        后台管理
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-center border-border"
                    >
                      个人中心
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center bg-brand-orange hover:bg-brand-orange/90 text-white"
                  >
                    退出登录
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-center border-border"
                    >
                      登录
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-brand-orange hover:bg-brand-orange/90 text-white">
                      免费开始
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
