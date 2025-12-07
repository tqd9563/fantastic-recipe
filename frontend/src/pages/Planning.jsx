import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Wand2, ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2, Utensils, Search, Eye } from 'lucide-react';
import { getPlans, createPlan, deletePlan, generatePlan, getRecipes } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RecipeDetailDrawer from '../components/RecipeDetailDrawer';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getTagColor } from "@/lib/tagUtils";

// Date Helpers
const formatDate = (date) => date.toISOString().split('T')[0];

const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const newDate = new Date(d.setDate(diff));
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

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

const ManualPlan = ({ onBack }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
    const [plans, setPlans] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null); // { dateStr, type }
    
    // View Recipe State
    const [viewingRecipe, setViewingRecipe] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const fetchPlans = () => {
        const start = formatDate(currentWeekStart);
        const end = formatDate(addDays(currentWeekStart, 6));
        getPlans(start, end).then(setPlans);
    };

    useEffect(() => {
        fetchPlans();
    }, [currentWeekStart]);

    useEffect(() => {
        getRecipes().then(setRecipes);
    }, []);

    const handlePrevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
    const handleNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));

    const handleAddClick = (dateStr) => {
        setSelectedSlot({ dateStr }); // No type needed strictly, or default to 'meal'
        setIsSelectorOpen(true);
    };

    const handleSelectRecipe = async (recipe) => {
        if (!selectedSlot) return;
        try {
            await createPlan({
                date: selectedSlot.dateStr,
                type: "meal", // Generic type
                recipe_id: recipe.id
            });
            fetchPlans();
            setIsSelectorOpen(false);
        } catch (error) {
            console.error("Failed to add plan", error);
        }
    };

    const handleDeletePlan = async (planId) => {
        if (!confirm('确定移除这个计划吗？')) return;
        try {
            await deletePlan(planId);
            fetchPlans();
        } catch (error) {
            console.error("Failed to delete plan", error);
        }
    };

    const getPlansForDate = (dateStr) => {
        return plans.filter(p => p.date === dateStr);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack} size="sm"><ArrowLeft className="w-4 h-4 mr-2" />返回</Button>
                    <h2 className="text-xl font-bold">
                        {formatDate(currentWeekStart)} ~ {formatDate(addDays(currentWeekStart, 6))}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevWeek}><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(getStartOfWeek(new Date()))}>今天</Button>
                    <Button variant="outline" size="icon" onClick={handleNextWeek}><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 gap-4 min-w-[1000px]">
                    {WEEKDAYS.map((day, index) => {
                        const date = addDays(currentWeekStart, index);
                        const dateStr = formatDate(date);
                        const isToday = dateStr === formatDate(new Date());
                        const dailyPlans = getPlansForDate(dateStr);
                        
                        return (
                            <div key={index} className={cn("flex flex-col gap-3 min-h-[400px]", isToday && "bg-sage-50/50 rounded-xl -m-2 p-2 border border-sage-100")}>
                                <div className="text-center mb-2">
                                    <div className="font-bold text-lg">{day}</div>
                                    <div className={cn("text-sm text-muted-foreground", isToday && "text-sage-600 font-medium")}>
                                        {date.getDate()}日
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col gap-3">
                                    {dailyPlans.map(plan => (
                                        <PlanCard 
                                            key={plan.id} 
                                            plan={plan}
                                            onDelete={handleDeletePlan}
                                            onView={(recipe) => {
                                                setViewingRecipe(recipe);
                                                setIsDrawerOpen(true);
                                            }}
                                        />
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        className="w-full border-dashed border-2 h-10 text-muted-foreground hover:text-sage-600 hover:border-sage-400 hover:bg-sage-50" 
                                        onClick={() => handleAddClick(dateStr)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <RecipeSelectorDialog 
                open={isSelectorOpen} 
                onOpenChange={setIsSelectorOpen} 
                recipes={recipes} 
                onSelect={handleSelectRecipe}
            />

            <RecipeDetailDrawer 
                open={isDrawerOpen} 
                onOpenChange={setIsDrawerOpen} 
                recipe={viewingRecipe}
                onEdit={() => {}} 
                onDelete={() => {}} 
            />
        </div>
    );
};

const PlanCard = ({ plan, onDelete, onView }) => {
    if (!plan || !plan.recipe) return null;
    return (
        <div className="bg-white border rounded-xl p-2 shadow-sm hover:shadow-md transition-all group relative">
             <div className="aspect-video w-full rounded-md bg-muted overflow-hidden relative">
                {plan.recipe.image_url ? (
                    <img src={plan.recipe.image_url} alt={plan.recipe.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sage-50 text-sage-300">
                        <Utensils className="w-6 h-6" />
                    </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-sage-600 shadow-sm border-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(plan.recipe);
                        }}
                        title="查看详情"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8 rounded-full shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(plan.id);
                        }}
                        title="移除计划"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
             </div>
             <div className="font-medium text-sm leading-tight line-clamp-2 mt-2 px-1 text-center">{plan.recipe.name}</div>
        </div>
    );
};

const RecipeSelectorDialog = ({ open, onOpenChange, recipes, onSelect }) => {
    const [search, setSearch] = useState('');
    const filtered = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>选择食谱</DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="搜索..." 
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 p-1 content-start">
                    {filtered.map(recipe => (
                        <div 
                            key={recipe.id} 
                            className="cursor-pointer border rounded-lg overflow-hidden hover:ring-2 hover:ring-sage-500 transition-all"
                            onClick={() => onSelect(recipe)}
                        >
                            <div className="aspect-video bg-muted">
                                {recipe.image_url ? (
                                    <img src={recipe.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-sage-50"><Utensils className="w-6 h-6 opacity-20" /></div>
                                )}
                            </div>
                            <div className="p-2 text-sm font-medium truncate">{recipe.name}</div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const MagicPlan = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await generatePlan(7);
            setResult(res);
            // Optionally redirect to manual plan to see result
        } catch (error) {
            console.error(error);
            alert('生成失败，可能是食谱不足');
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">生成成功！</h2>
                <p className="text-muted-foreground mb-6">已为你生成了未来 7 天的美味计划。</p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={onBack}>返回</Button>
                    <Button className="bg-sage-600 hover:bg-sage-700 text-white" onClick={onBack}>查看日历</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
            <Button variant="ghost" onClick={onBack} className="self-start mb-10 absolute top-6 left-6"><ArrowLeft className="w-4 h-4 mr-2" /> 返回</Button>
            
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <Wand2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">AI 智能规划</h2>
            <p className="text-lg text-muted-foreground mb-10">
                我们将根据你的食谱库，随机为你生成未来 7 天的午餐和晚餐计划。
                <br/><span className="text-sm opacity-70">（目前版本为完全随机，未来将支持更多偏好设置）</span>
            </p>
            
            <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 text-lg gap-2" onClick={handleGenerate} disabled={loading}>
                {loading ? (
                    <>正在施展魔法...</>
                ) : (
                    <><Wand2 className="w-5 h-5" /> 一键生成</>
                )}
            </Button>
        </div>
    );
};

export default Planning;
