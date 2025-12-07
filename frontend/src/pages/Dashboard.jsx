import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Telescope, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(today);
  
  // Mock Plan Data for now
  const [todaysPlan, setTodayPlan] = useState([]); 
  
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-charcoal">👋 下午好</h1>
            <p className="text-slate-500 mt-1">今天是 {formattedDate}</p>
        </div>
        
        {/* Mini Heatmap Mock */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="flex gap-1">
                {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className={`w-3 h-8 rounded-sm ${Math.random() > 0.5 ? 'bg-sage-500' : 'bg-sage-100'}`} />
                ))}
            </div>
            <div className="text-xs text-slate-500 font-medium">
                <div>本月已下厨</div>
                <div className="text-lg text-sage-600 font-bold">12 <span className="text-xs font-normal">次</span></div>
            </div>
        </div>
      </div>

      {/* Today's Menu */}
      <section>
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-charcoal">今日菜单</h2>
            {todaysPlan.length > 0 && <span className="text-sm text-slate-500">共 {todaysPlan.length} 道菜 | 预计耗时 45min</span>}
        </div>
        
        {todaysPlan.length > 0 ? (
            // Active State
            <div className="grid gap-4">
                {/* Mock Cards if we had plan */}
            </div>
        ) : (
            // Empty State
            <Card className="flex flex-col items-center justify-center py-12 border-dashed border-2 border-sage-100 bg-sage-50/30">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <span className="text-4xl">🍳</span>
                </div>
                <h3 className="text-lg font-semibold text-charcoal">今天还没想好吃什么？</h3>
                <p className="text-slate-500 mt-2 mb-6">去计划一下，或者探索新灵感吧</p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/discovery')}>
                        🎲 随机来一道
                    </Button>
                    <Button className="bg-sage-600 hover:bg-sage-700 text-white" onClick={() => navigate('/planning')}>
                        📅 去做计划
                    </Button>
                </div>
            </Card>
        )}
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
            className="p-0 overflow-hidden cursor-pointer group hover:shadow-md transition-all border-slate-100"
            onClick={() => navigate('/planning')}
        >
            <div className="p-5 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-sage-600" />
                        <h3 className="font-bold text-charcoal">未来计划</h3>
                    </div>
                    <p className="text-sm text-slate-500">查看明后两天的安排</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sage-600" />
                </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 text-xs text-slate-500 border-t border-slate-100 group-hover:bg-sage-50/50">
                明天：暂无计划
            </div>
        </Card>

        <Card 
            className="p-0 overflow-hidden cursor-pointer group hover:shadow-md transition-all border-slate-100"
            onClick={() => navigate('/discovery')}
        >
            <div className="relative h-full min-h-[120px] bg-sage-800">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-5 flex flex-col justify-center z-10">
                    <div className="flex items-center gap-2 mb-1 text-white">
                        <Telescope className="w-5 h-5" />
                        <h3 className="font-bold">探索灵感</h3>
                    </div>
                    <p className="text-sm text-white/80">发现从未尝试过的新美味</p>
                </div>
                {/* Decorative background pattern or image */}
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 rotate-12 transform scale-150 translate-x-10"></div>
            </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
