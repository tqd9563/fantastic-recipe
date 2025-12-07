import { Card } from "@/components/ui/card";
import { Flame, ChefHat, Book } from 'lucide-react';

const Stats = () => {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">统计 (Stats)</h1>
      
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Flame className="text-orange-500" />} label="连续打卡" value="12 天" />
        <StatCard icon={<ChefHat className="text-sage-600" />} label="累计下厨" value="145 次" />
        <StatCard icon={<Book className="text-blue-500" />} label="掌握食谱" value="32 道" />
        <StatCard label="获得勋章" value="川菜达人" />
      </div>

      {/* Heatmap */}
      <Card className="p-6">
        <div className="flex justify-between mb-4">
            <h3 className="font-bold text-lg">做饭频率</h3>
            <select className="text-sm border rounded p-1"><option>2023</option></select>
        </div>
        {/* Mock Heatmap Grid */}
        <div className="flex gap-1 overflow-x-auto pb-2">
            {Array.from({ length: 53 }).map((_, week) => (
                <div key={week} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, day) => (
                        <div 
                            key={day} 
                            className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? 'bg-sage-500' : Math.random() > 0.4 ? 'bg-sage-200' : 'bg-sage-50'}`} 
                            title={`Week ${week}, Day ${day}`}
                        />
                    ))}
                </div>
            ))}
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">我的最爱 Top 5</h3>
            <div className="space-y-3">
                {[
                    { name: '红烧肉', count: 12, percent: '100%' },
                    { name: '番茄炒蛋', count: 10, percent: '80%' },
                    { name: '青椒肉丝', count: 8, percent: '60%' },
                    { name: '酸辣土豆丝', count: 5, percent: '40%' },
                    { name: '水煮鱼', count: 3, percent: '20%' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-20 text-sm truncate">{item.name}</div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-sage-500 rounded-full" style={{ width: item.percent }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground w-8 text-right">{item.count}</div>
                    </div>
                ))}
            </div>
        </Card>

        <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">口味偏好</h3>
            {/* Mock Radar Chart / Distribution */}
            <div className="flex flex-wrap gap-3">
                {['辣 (40%)', '咸 (30%)', '甜 (15%)', '酸 (10%)', '鲜 (5%)'].map((tag, i) => (
                    <div key={i} className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium border border-orange-100">
                        {tag}
                    </div>
                ))}
            </div>
            <div className="mt-8 h-32 flex items-end justify-between gap-2 px-4">
                 <div className="w-full bg-orange-200 rounded-t h-[40%]"></div>
                 <div className="w-full bg-orange-300 rounded-t h-[30%]"></div>
                 <div className="w-full bg-orange-400 rounded-t h-[80%]"></div>
                 <div className="w-full bg-orange-300 rounded-t h-[50%]"></div>
                 <div className="w-full bg-orange-200 rounded-t h-[20%]"></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
                <span>酸</span><span>甜</span><span>辣</span><span>咸</span><span>鲜</span>
            </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
    <Card className="p-4 flex items-center gap-4">
        {icon && <div className="p-2 rounded-full bg-muted/50">{icon}</div>}
        <div>
            <div className="text-xs text-muted-foreground uppercase">{label}</div>
            <div className="text-xl font-bold text-charcoal">{value}</div>
        </div>
    </Card>
);

export default Stats;
