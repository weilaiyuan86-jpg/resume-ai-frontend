import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const contactMethods = [
  {
    icon: Mail,
    title: '电子邮件',
    value: 'support@resumeai.com',
    description: '我们通常会在 24 小时内回复',
  },
  {
    icon: Phone,
    title: '电话支持',
    value: '+1 (555) 123-4567',
    description: '工作日 9:00 - 18:00 (PST)',
  },
  {
    icon: MapPin,
    title: '公司地址',
    value: 'San Francisco, CA',
    description: '美国加利福尼亚州',
  },
];

const faqItems = [
  {
    question: '如何重置我的密码？',
    answer: '您可以在登录页面点击"忘记密码"链接，然后按照邮件中的指示重置密码。',
  },
  {
    question: '我可以导出哪些格式的简历？',
    answer: '我们支持 PDF、Word (.docx) 和纯文本格式导出，以满足不同申请需求。',
  },
  {
    question: '如何取消订阅？',
    answer: '您可以在账户设置的"订阅管理"页面随时取消订阅，取消将在当前计费周期结束时生效。',
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>联系我们</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              我们随时为您服务
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              有任何问题或建议？我们的团队随时准备帮助您。选择最方便的方式与我们联系。
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
                    <method.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{method.value}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">发送消息</h2>
                
                {submitted ? (
                  <div className="bg-green-50 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      消息已发送！
                    </h3>
                    <p className="text-gray-600">
                      感谢您的留言，我们会尽快回复您。
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        placeholder="您的姓名"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">主题</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择主题" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">一般咨询</SelectItem>
                          <SelectItem value="technical">技术支持</SelectItem>
                          <SelectItem value="billing">账单问题</SelectItem>
                          <SelectItem value="partnership">商务合作</SelectItem>
                          <SelectItem value="feedback">产品反馈</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="message">消息</Label>
                      <Textarea
                        id="message"
                        placeholder="请详细描述您的问题或建议..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      <Send className="w-4 h-4" />
                      发送消息
                    </Button>
                  </form>
                )}
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">常见问题</h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border">
                      <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-sm text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">响应时间</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    我们致力于在 24 小时内回复所有咨询。对于紧急问题，请使用电话支持。
                  </p>
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
