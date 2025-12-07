import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Wand2, ArrowLeft } from 'lucide-react';

const Planning = () => {
  const [mode, setMode] = useState(null); // 'manual', 'magic', null

  if (mode === 'manual') {
      return <ManualPlan onBack={() => setMode(null)} />;
  }
  
  if (mode === 'magic') {
      return <MagicPlan onBack={() => setMode(null)} />;
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">计划 (Planning)</h1>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px]">
        <Card 
            className="relative overflow-hidden cursor-pointer group border-sage-100 hover:border-sage-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-sage-50"
            onClick={() => setMode('manual')}
        >
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center z-10">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-sage-600 group-hover:scale-110 transition-transform">
                    <Calendar className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-charcoal mb-2">自主规划</h2>
                <p className="text-slate-500">拖拽食谱，定制每一餐</p>
            </div>
        </Card>

        <Card 
            className="relative overflow-hidden cursor-pointer group border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-purple-50"
            onClick={() => setMode('magic')}
        >
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center z-10">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-charcoal mb-2">一键托管</h2>
                <p className="text-slate-500">一键生成未来几天的完美菜单</p>
            </div>
        </Card>
      </div>
    </div>
  );
};

const ManualPlan = ({ onBack }) => (
    <div className="p-6">
        <Button variant="ghost" onClick={onBack} className="mb-4 gap-2"><ArrowLeft className="w-4 h-4" /> 返回</Button>
        <h2 className="text-xl font-bold mb-4">自主规划日历</h2>
        <div className="border rounded-lg h-[600px] flex items-center justify-center bg-white text-slate-400">
            Calendar View Placeholder (Requires backend 'Plan' model)
        </div>
    </div>
);

const MagicPlan = ({ onBack }) => (
    <div className="p-6">
        <Button variant="ghost" onClick={onBack} className="mb-4 gap-2"><ArrowLeft className="w-4 h-4" /> 返回</Button>
        <h2 className="text-xl font-bold mb-4">一键生成配置</h2>
        <div className="border rounded-lg h-[400px] flex items-center justify-center bg-white text-slate-400">
            Wizard Steps Placeholder
        </div>
    </div>
);

export default Planning;
