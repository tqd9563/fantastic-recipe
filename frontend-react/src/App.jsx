import { useState, useEffect } from 'react';
import { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } from './services/api';
import RecipeModal from './components/RecipeModal';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Clock, Users, Trash2, Edit, ChefHat, Utensils } from 'lucide-react';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRecipe, setViewRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRecipes(filtered);
  }, [searchTerm, recipes]);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  const handleAddRecipe = () => {
    setCurrentRecipe(null);
    setShowModal(true);
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setViewModalOpen(false);
    setShowModal(true);
  };

  const handleViewRecipe = async (id) => {
    try {
      const recipe = await getRecipe(id);
      setViewRecipe(recipe);
      setViewModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (confirm('确定要删除这个食谱吗？')) {
      try {
        await deleteRecipe(id);
        setViewModalOpen(false);
        fetchRecipes();
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (currentRecipe) {
        await updateRecipe(currentRecipe.id, formData);
      } else {
        await createRecipe(formData);
      }
      setShowModal(false);
      fetchRecipes();
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('保存失败');
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Fantastic Recipe</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索食谱..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddRecipe}>
              <Plus className="mr-2 h-4 w-4" /> 添加食谱
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Mobile Search */}
        <div className="mb-6 sm:hidden">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索食谱..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg bg-muted/20">
            <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
              <Utensils className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">暂无食谱</h3>
            <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
              还没有添加任何食谱。点击右上角的按钮开始创建你的第一个美味食谱吧！
            </p>
            <Button variant="outline" onClick={handleAddRecipe}>
              <Plus className="mr-2 h-4 w-4" /> 创建食谱
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <Card 
                key={recipe.id} 
                className="group overflow-hidden cursor-pointer transition-all hover:shadow-md border-muted/60 hover:border-primary/50"
                onClick={() => handleViewRecipe(recipe.id)}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {recipe.image_url ? (
                    <img 
                      src={recipe.image_url} 
                      alt={recipe.name} 
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <Utensils className="h-10 w-10 opacity-20" />
                    </div>
                  )}
                  {recipe.difficulty && (
                    <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm hover:bg-background/90">
                      {recipe.difficulty}
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="line-clamp-1 text-lg">{recipe.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                    {recipe.description || "暂无描述..."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {recipe.cooking_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{recipe.cooking_time} 分钟</span>
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{recipe.servings} 人</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* 查看详情 Dialog */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          {viewRecipe && (
            <>
              <ScrollArea className="flex-1">
                {viewRecipe.image_url && (
                  <div className="relative w-full h-64 md:h-80">
                    <img 
                      src={viewRecipe.image_url} 
                      alt={viewRecipe.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h2 className="text-3xl font-bold">{viewRecipe.name}</h2>
                      <div className="flex gap-4 mt-2 text-white/90 text-sm">
                        {viewRecipe.cooking_time && <span>🕒 {viewRecipe.cooking_time} 分钟</span>}
                        {viewRecipe.servings && <span>👥 {viewRecipe.servings} 人份</span>}
                        {viewRecipe.difficulty && <span>🔥 {viewRecipe.difficulty}</span>}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6 space-y-8">
                  {!viewRecipe.image_url && (
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold">{viewRecipe.name}</h2>
                      <div className="flex gap-3 mt-2 text-muted-foreground text-sm">
                        {viewRecipe.cooking_time && <span>🕒 {viewRecipe.cooking_time} 分钟</span>}
                        {viewRecipe.servings && <span>👥 {viewRecipe.servings} 人份</span>}
                        {viewRecipe.difficulty && <Badge variant="outline">{viewRecipe.difficulty}</Badge>}
                      </div>
                    </div>
                  )}

                  {viewRecipe.description && (
                    <div className="bg-muted/30 p-4 rounded-lg text-muted-foreground italic border-l-4 border-primary">
                      "{viewRecipe.description}"
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <span className="bg-primary/10 p-1.5 rounded text-primary">🥕</span> 食材
                      </h3>
                      <div className="space-y-2">
                        {viewRecipe.ingredients?.length > 0 ? (
                          viewRecipe.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded border border-transparent hover:border-border transition-colors">
                              <span className="font-medium">{ing.name}</span>
                              <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">{ing.amount}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">暂无食材信息</p>
                        )}
                      </div>

                      {viewRecipe.seasonings?.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold flex items-center gap-2 mt-6 mb-4">
                            <span className="bg-primary/10 p-1.5 rounded text-primary">🧂</span> 配料
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {viewRecipe.seasonings.map((s, idx) => (
                              <Badge key={idx} variant="secondary">{s}</Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Steps */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <span className="bg-primary/10 p-1.5 rounded text-primary">📝</span> 步骤
                      </h3>
                      <div className="space-y-4">
                        {viewRecipe.steps?.length > 0 ? (
                          viewRecipe.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 group">
                              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                {idx + 1}
                              </div>
                              <p className="text-sm leading-relaxed pt-1.5 text-muted-foreground group-hover:text-foreground transition-colors">{step}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">暂无步骤信息</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4 bg-background flex justify-between items-center">
                <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteRecipe(viewRecipe.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> 删除
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setViewModalOpen(false)}>关闭</Button>
                  <Button onClick={() => handleEditRecipe(viewRecipe)}>
                    <Edit className="mr-2 h-4 w-4" /> 编辑
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <RecipeModal
        open={showModal}
        onOpenChange={setShowModal}
        handleSave={handleSave}
        recipe={currentRecipe}
      />
    </div>
  );
}

export default App;
