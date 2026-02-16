import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import ATSChecker from '@/pages/ATSChecker';
import ResumeEditor from '@/pages/ResumeEditor';
import JobTracker from '@/pages/JobTracker';
import Blog from '@/pages/Blog';
import TemplatesPage from '@/pages/Templates';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import AIInterview from '@/pages/AIInterview';
import CoverLetter from '@/pages/CoverLetter';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Cookies from '@/pages/Cookies';
import InterviewPrep from '@/pages/InterviewPrep';
import SalaryGuide from '@/pages/SalaryGuide';
import VisaInfo from '@/pages/VisaInfo';
import Careers from '@/pages/Careers';
import Partners from '@/pages/Partners';
import JobGoalPlanner from '@/pages/JobGoalPlanner';
import JobDescription from '@/pages/JobDescription';
import ColdEmail from '@/pages/ColdEmail';
import AIChatbot from '@/components/AIChatbot';
import { useMemo } from 'react';
import { SiteConfigProvider } from '@/contexts/SiteConfigContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';

type UserRole = 'super_admin' | 'admin' | 'viewer' | 'user';

function useAuth() {
  const { isLoggedIn, role, canAccessAdmin } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { isLoggedIn: false, role: null as UserRole | null, canAccessAdmin: false };
    }
    const token = localStorage.getItem('auth_token');
    const raw = localStorage.getItem('user');
    if (!token || !raw) {
      return { isLoggedIn: false, role: null as UserRole | null, canAccessAdmin: false };
    }
    try {
      const parsed = JSON.parse(raw) as { email?: string; role?: string } | null;
      const rawRole = parsed?.role;
      const role: UserRole =
        rawRole === 'super_admin' ||
        rawRole === 'admin' ||
        rawRole === 'viewer' ||
        rawRole === 'user'
          ? rawRole
          : 'user';
      const canAccessAdmin = role === 'super_admin' || role === 'admin' || role === 'viewer';
      return { isLoggedIn: true, role, canAccessAdmin };
    } catch {
      return { isLoggedIn: false, role: null as UserRole | null, canAccessAdmin: false };
    }
  }, []);
  return { isLoggedIn, role, canAccessAdmin };
}

// Chatbot wrapper - shows on all pages except admin
function ChatbotWrapper() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const { config } = useSiteConfig();
  
  if (isAdminPage || config.features === undefined || !config.features.enableChatbot) return null;
  return <AIChatbot />;
}

function AdminRoute() {
  const location = useLocation();
  const { isLoggedIn, canAccessAdmin } = useAuth();

  if (!isLoggedIn || !canAccessAdmin) {
    return <Login />;
  }

  return <Admin key={location.key} />;
}

function App() {
  return (
    <SiteConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/index" element={<Home />} />
          <Route path="/ats-checker" element={<ATSChecker />} />
          <Route path="/resume-editor" element={<ResumeEditor />} />
          <Route path="/job-tracker" element={<JobTracker />} />
            <Route path="/job-goal-planner" element={<JobGoalPlanner />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:articleId" element={<Blog />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/ai-interview" element={<AIInterview />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/job-description" element={<JobDescription />} />
          <Route path="/cold-email" element={<ColdEmail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/salary-guide" element={<SalaryGuide />} />
          <Route path="/visa-info" element={<VisaInfo />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <ChatbotWrapper />
      </Router>
    </SiteConfigProvider>
  );
}

export default App;
