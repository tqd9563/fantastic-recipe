import { useState, useEffect } from 'react';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../services/api';
import RecipeModal from '../components/RecipeModal';
import RecipeDetailDrawer from '../components/RecipeDetailDrawer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, LayoutGrid, List as ListIcon, Clock, Flame, Utensils } from 'lucide-react';
import { cn } from "@/lib/utils";

const RecipeLibrary = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'list'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
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

  const handleCreate = () => {
    setEditingRecipe(null);
    setIsModalOpen(true);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsDrawerOpen(false);
    setIsModalOpen(true);
  };

  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个食谱吗？')) {
        await deleteRecipe(id);
        setIsDrawerOpen(false);
        fetchRecipes();
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, formData);
      } else {
        await createRecipe(formData);
      }
      setIsModalOpen(false);
      fetchRecipes();
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('保存失败');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Control */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="搜索食谱、食材..." 
                className="pl-9 bg-muted/50 border-none focus-visible:bg-background"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => {}} title="筛选">
                <Filter className="h-4 w-4" />
            </Button>
            <div className="flex items-center border rounded-lg p-1 bg-muted/30">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 px-2 rounded-md hover:bg-background", viewMode === 'gallery' && "bg-background shadow-sm")}
                    onClick={() => setViewMode('gallery')}
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 px-2 rounded-md hover:bg-background", viewMode === 'list' && "bg-background shadow-sm")}
                    onClick={() => setViewMode('list')}
                >
                    <ListIcon className="h-4 w-4" />
                </Button>
            </div>
            <Button className="bg-sage-600 hover:bg-sage-700 text-white gap-2" onClick={handleCreate}>
                <Plus className="h-4 w-4" /> 新建食谱
            </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'gallery' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} onClick={() => handleView(recipe)} />
                ))}
            </div>
        ) : (
            <div className="space-y-2">
                {filteredRecipes.map(recipe => (
                    <RecipeListItem key={recipe.id} recipe={recipe} onClick={() => handleView(recipe)} />
                ))}
            </div>
        )}
        
        {filteredRecipes.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Utensils className="h-12 w-12 mb-4 opacity-20" />
                <p>没有找到相关食谱</p>
            </div>
        )}
      </div>

      {/* Drawers & Modals */}
      <RecipeDetailDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
        recipe={selectedRecipe}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <RecipeModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        handleSave={handleSave}
        recipe={editingRecipe}
      />
    </div>
  );
};

const RecipeCard = ({ recipe, onClick }) => (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-md transition-all border-muted" onClick={onClick}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            {recipe.image_url ? (
                <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-sage-50">
                    <Utensils className="h-8 w-8 opacity-30" />
                </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
                {recipe.rating && <Badge className="bg-white/90 text-orange-500 hover:bg-white">⭐ {recipe.rating}</Badge>}
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-sage-700 transition-colors">{recipe.name}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.cooking_time || '-'}m</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.difficulty || '-'}</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {(recipe.tags || []).slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 h-5 bg-sage-50 text-sage-700 hover:bg-sage-100 border-sage-100">
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    </Card>
);

const RecipeListItem = ({ recipe, onClick }) => (
    <div 
        className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-sage-100 hover:bg-sage-50/50 transition-colors cursor-pointer group"
        onClick={onClick}
    >
        <div className="h-12 w-12 rounded-md bg-muted overflow-hidden shrink-0">
             {recipe.image_url ? (
                <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Utensils className="h-4 w-4 opacity-30" />
                </div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate group-hover:text-sage-700">{recipe.name}</h3>
            <div className="flex gap-2 mt-0.5">
                {(recipe.tags || []).map((tag, i) => (
                    <span key={i} className="text-xs text-muted-foreground">#{tag}</span>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
            <div className="w-20 text-right">{recipe.cooking_time ? `${recipe.cooking_time} min` : '--'}</div>
            <div className="w-20 text-right">{recipe.difficulty || '--'}</div>
            <div className="w-16 text-right font-medium text-orange-500">{recipe.rating ? `⭐ ${recipe.rating}` : ''}</div>
        </div>
    </div>
);

export default RecipeLibrary;
