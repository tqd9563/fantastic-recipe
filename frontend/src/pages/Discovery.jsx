import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bot, ArrowLeft, Sparkles } from 'lucide-react';

const Discovery = () => {
  const [mode, setMode] = useState(null); // 'web', 'ai', null

  if (mode === 'web') return <WebSearch onBack={() => setMode(null)} />;
  if (mode === 'ai') return <AIChef onBack={() => setMode(null)} />;

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">发现 (Discovery)</h1>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px]">
        <Card 
            className="relative overflow-hidden cursor-pointer group border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-blue-50"
            onClick={() => setMode('web')}
        >
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center z-10">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                    <Search className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-charcoal mb-2">全网搜罗</h2>
                <p className="text-slate-500">汇集下厨房、小红书的热门美味</p>
            </div>
        </Card>

        <Card 
            className="relative overflow-hidden cursor-pointer group border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-pink-50"
            onClick={() => setMode('ai')}
        >
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center z-10">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform">
                    <Bot className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-charcoal mb-2">AI 创意厨房</h2>
                <p className="text-slate-500">剩菜大变身 & 灵感生成器</p>
            </div>
        </Card>
      </div>
    </div>
  );
};

const WebSearch = ({ onBack }) => (
    <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
            <Input placeholder="输入菜名、食材..." className="max-w-md" />
            <Button>搜索</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock Cards */}
            {[1, 2, 3].map(i => (
                <Card key={i} className="h-64 bg-muted flex items-center justify-center text-muted-foreground">
                    Result {i}
                </Card>
            ))}
        </div>
    </div>
);

const AIChef = ({ onBack }) => (
    <div className="p-6 max-w-2xl mx-auto text-center relative">
        <Button variant="ghost" onClick={onBack} className="mb-8 absolute left-0 -top-12"><ArrowLeft className="w-4 h-4" /> 返回</Button>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 mt-12">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-600">
                <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">告诉我你冰箱里还剩下什么？</h2>
            <p className="text-slate-500 mb-6">例如：半个洋葱、两个番茄、一点五花肉</p>
            
            <Input placeholder="输入食材..." className="mb-4" />
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white h-12 text-lg">✨ 开始生成</Button>
        </div>
    </div>
);

export default Discovery;
