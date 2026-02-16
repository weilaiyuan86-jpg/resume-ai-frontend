import { useState } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Users, Zap,
  Heart, Coffee, Globe, Laptop, GraduationCap, PartyPopper,
  Search, ArrowRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const jobOpenings: JobOpening[] = [
  {
    id: '1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    salary: '$150k - $200k',
    description: 'Join our engineering team to build the future of AI-powered career tools. You will work on challenging problems at scale.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong proficiency in React, TypeScript, and Node.js',
      'Experience with cloud platforms (AWS/GCP)',
      'Passion for building user-centric products',
    ],
    benefits: ['Equity', 'Health insurance', 'Unlimited PTO'],
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY / Remote',
    type: 'Full-time',
    salary: '$130k - $170k',
    description: 'Lead product strategy and execution for our core resume builder and AI interview products.',
    requirements: [
      '3+ years of product management experience',
      'Experience in B2C or SaaS products',
      'Strong analytical and communication skills',
      'Background in HR tech is a plus',
    ],
    benefits: ['Equity', 'Health insurance', 'Learning budget'],
  },
  {
    id: '3',
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$160k - $220k',
    description: 'Build and deploy ML models for resume parsing, job matching, and interview coaching.',
    requirements: [
      'MS/PhD in CS, ML, or related field',
      'Experience with NLP and LLMs',
      'Proficiency in Python and ML frameworks',
      'Publications in top-tier conferences',
    ],
    benefits: ['Equity', 'Research budget', 'Conference travel'],
  },
  {
    id: '4',
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $140k',
    description: 'Create beautiful, intuitive user experiences that help millions of job seekers succeed.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Strong portfolio demonstrating user-centered design',
      'Proficiency in Figma and design systems',
      'Experience with user research',
    ],
    benefits: ['Equity', 'Design tools budget', 'Flexible hours'],
  },
  {
    id: '5',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Austin, TX / Remote',
    type: 'Full-time',
    salary: '$80k - $110k',
    description: 'Help our users achieve their career goals through exceptional support and guidance.',
    requirements: [
      '2+ years in customer success or support',
      'Excellent communication skills',
      'Empathy and problem-solving abilities',
      'Experience with CRM tools',
    ],
    benefits: ['Equity', 'Health insurance', 'Career growth'],
  },
  {
    id: '6',
    title: 'Content Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $120k',
    description: 'Create compelling content that educates and inspires job seekers worldwide.',
    requirements: [
      '3+ years of content marketing experience',
      'Excellent writing and editing skills',
      'SEO knowledge and experience',
      'Understanding of the job market',
    ],
    benefits: ['Equity', 'Learning budget', 'Flexible schedule'],
  },
];

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance for you and your family.',
  },
  {
    icon: DollarSign,
    title: 'Competitive Pay',
    description: 'Salary benchmarking against top tech companies, plus equity for all employees.',
  },
  {
    icon: Laptop,
    title: 'Remote First',
    description: 'Work from anywhere in the US. We believe in flexibility and trust.',
  },
  {
    icon: GraduationCap,
    title: 'Learning Budget',
    description: '$2,000 annual budget for courses, conferences, and professional development.',
  },
  {
    icon: Coffee,
    title: 'Unlimited PTO',
    description: 'Take the time you need to recharge. We value work-life balance.',
  },
  {
    icon: PartyPopper,
    title: 'Team Events',
    description: 'Regular team offsites, virtual events, and annual company retreat.',
  },
];

const values = [
  {
    title: 'User First',
    description: 'Everything we do is to help our users succeed in their careers.',
  },
  {
    title: 'Move Fast',
    description: 'We iterate quickly and learn from our mistakes.',
  },
  {
    title: 'Stay Curious',
    description: 'We are always learning and exploring new ideas.',
  },
  {
    title: 'Be Kind',
    description: 'We treat everyone with respect and empathy.',
  },
];

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = ['all', ...Array.from(new Set(jobOpenings.map(j => j.department)))];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || job.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>We are hiring!</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              加入我们
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              帮助数百万人找到理想工作，构建改变职业生涯的AI工具
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>50+ 团队成员</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>Remote First</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>500万+ 用户</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">我们的价值观</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-muted py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-12">员工福利</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job Openings */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-8">开放职位</h2>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索职位..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-4 py-2 rounded-lg border border-border bg-card"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="all">所有部门</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge variant="secondary">{job.department}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <Button className="gap-2">
                    申请职位
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">没有找到匹配的职位</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('all');
                }}
              >
                清除筛选
              </Button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">没有找到合适的职位？</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              我们始终在寻找优秀的人才。发送你的简历，我们会在有合适职位时联系你。
            </p>
            <Button variant="outline" className="gap-2">
              发送简历
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
