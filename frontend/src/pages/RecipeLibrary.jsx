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
import { getTagColor } from "@/lib/tagUtils";

const RecipeLibrary = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'list'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    // ... existing filter logic ...
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    setFilteredRecipes(filtered);
  }, [searchTerm, recipes]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      console.log("Fetching recipes...");
      const data = await getRecipes();
      console.log("Fetched recipes:", data);
      setRecipes(data || []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
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
                className="pl-9 bg-muted/50 border-none focus-visible:bg-background !pl-11"
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
        {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mb-4"></div>
                <p>正在加载美味食谱...</p>
            </div>
        ) : (
            <>
                {viewMode === 'gallery' ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
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
            </>
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
    <div 
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-muted break-inside-avoid mb-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" 
        onClick={onClick}
    >
        {recipe.image_url ? (
            <img 
                src={recipe.image_url} 
                alt={recipe.name} 
                className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-110" 
            />
        ) : (
            <div className="w-full aspect-[3/4] flex flex-col items-center justify-center text-muted-foreground bg-sage-50/30">
                <Utensils className="h-12 w-12 opacity-10 mb-3" />
                <span className="text-sm font-medium opacity-40 px-6 text-center line-clamp-2">{recipe.name}</span>
            </div>
        )}
        
        {/* Hover Overlay */}
        {recipe.image_url && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-lg leading-snug transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md line-clamp-2">
                    {recipe.name}
                </h3>
            </div>
        )}
    </div>
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
            <div className="flex gap-2 mt-1">
                {(recipe.tags || []).map((tag, i) => (
                    <Badge key={i} variant="outline" className={cn("text-[10px] px-1.5 py-0 h-auto font-normal", getTagColor(tag))}>
                        {tag}
                    </Badge>
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
