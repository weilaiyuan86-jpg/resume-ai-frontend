import { useState } from 'react';
import { 
  DollarSign, TrendingUp, MapPin, Building2, Search,
  BarChart3, Briefcase, 
  Download, Share2, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface SalaryData {
  role: string;
  company: string;
  location: string;
  baseSalary: number;
  totalComp: number;
  experience: string;
  level: string;
  date: string;
}

const salaryData: SalaryData[] = [
  { role: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', baseSalary: 150000, totalComp: 220000, experience: '3-5 years', level: 'L4', date: '2024-01' },
  { role: 'Senior Software Engineer', company: 'Meta', location: 'Menlo Park, CA', baseSalary: 185000, totalComp: 320000, experience: '5-8 years', level: 'E5', date: '2024-01' },
  { role: 'Product Manager', company: 'Amazon', location: 'Seattle, WA', baseSalary: 160000, totalComp: 240000, experience: '4-6 years', level: 'L6', date: '2024-02' },
  { role: 'Data Scientist', company: 'Netflix', location: 'Los Gatos, CA', baseSalary: 200000, totalComp: 350000, experience: '3-5 years', level: 'Senior', date: '2024-01' },
  { role: 'UX Designer', company: 'Apple', location: 'Cupertino, CA', baseSalary: 140000, totalComp: 190000, experience: '3-5 years', level: 'ICT3', date: '2024-02' },
  { role: 'Engineering Manager', company: 'Microsoft', location: 'Redmond, WA', baseSalary: 200000, totalComp: 350000, experience: '8+ years', level: '63', date: '2024-01' },
];

const roleCategories = [
  { name: 'Software Engineer', avgSalary: 165000, growth: '+12%', count: 2453 },
  { name: 'Product Manager', avgSalary: 155000, growth: '+15%', count: 1234 },
  { name: 'Data Scientist', avgSalary: 175000, growth: '+18%', count: 987 },
  { name: 'UX Designer', avgSalary: 135000, growth: '+10%', count: 756 },
  { name: 'DevOps Engineer', avgSalary: 160000, growth: '+20%', count: 654 },
];

const locations = [
  { name: 'San Francisco Bay Area', avgSalary: 185000, col: 'Very High' },
  { name: 'Seattle, WA', avgSalary: 165000, col: 'High' },
  { name: 'New York, NY', avgSalary: 160000, col: 'Very High' },
  { name: 'Austin, TX', avgSalary: 140000, col: 'Medium' },
  { name: 'Denver, CO', avgSalary: 130000, col: 'Medium' },
];

export default function SalaryGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const filteredData = salaryData.filter(d => {
    const matchesSearch = d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || d.role === selectedRole;
    const matchesLocation = selectedLocation === 'all' || d.location.includes(selectedLocation);
    return matchesSearch && matchesRole && matchesLocation;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4" />
              <span>薪资透明化</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              薪资指南
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              基于真实数据的薪资参考，帮助你了解市场行情，做出明智的职业决策
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">平均薪资</p>
              <p className="text-2xl font-bold">$165k</p>
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">数据点</p>
              <p className="text-2xl font-bold">10k+</p>
              <p className="text-sm text-muted-foreground">真实薪资</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">覆盖公司</p>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">科技企业</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">更新频率</p>
              <p className="text-2xl font-bold">实时</p>
              <p className="text-sm text-muted-foreground">每日更新</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索职位或公司..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-4 py-2 rounded-lg border border-border bg-card"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">所有职位</option>
              {roleCategories.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
            <select 
              className="px-4 py-2 rounded-lg border border-border bg-card"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">所有地区</option>
              {locations.map(l => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="salaries" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="salaries" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                薪资数据
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-2">
                <Briefcase className="w-4 h-4" />
                职位分析
              </TabsTrigger>
              <TabsTrigger value="locations" className="gap-2">
                <MapPin className="w-4 h-4" />
                地区对比
              </TabsTrigger>
            </TabsList>

            <TabsContent value="salaries" className="space-y-6">
              {/* Salary Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-medium">职位</th>
                        <th className="text-left p-4 font-medium">公司</th>
                        <th className="text-left p-4 font-medium">地点</th>
                        <th className="text-left p-4 font-medium">级别</th>
                        <th className="text-right p-4 font-medium">基本工资</th>
                        <th className="text-right p-4 font-medium">总包</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredData.map((data, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="p-4">
                            <div className="font-medium">{data.role}</div>
                            <div className="text-sm text-muted-foreground">{data.experience}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              {data.company}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {data.location}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">{data.level}</Badge>
                          </td>
                          <td className="p-4 text-right font-medium">
                            {formatCurrency(data.baseSalary)}
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-bold text-primary">{formatCurrency(data.totalComp)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  导出数据
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  分享
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roleCategories.map((role) => (
                  <div 
                    key={role.name}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <Badge className="bg-green-500/10 text-green-500">
                        {role.growth}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{role.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {formatCurrency(role.avgSalary)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      基于 {role.count.toLocaleString()} 个数据点
                    </p>
                  </div>
                ))}
              </div>

              {/* Salary Range Chart */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-6">薪资范围分布</h3>
                <div className="space-y-4">
                  {roleCategories.slice(0, 3).map((role) => (
                    <div key={role.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">{role.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(role.avgSalary * 0.7)} - {formatCurrency(role.avgSalary * 1.3)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(role.avgSalary / 200000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {locations.map((loc) => (
                  <div 
                    key={loc.name}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{loc.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            生活成本: {loc.col}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(loc.avgSalary)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      平均年薪
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">分享你的薪资信息</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              匿名分享你的薪资数据，帮助更多人了解市场行情
            </p>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <ArrowUpRight className="w-4 h-4" />
              提交薪资信息
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
