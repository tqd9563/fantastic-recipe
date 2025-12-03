import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Upload, Image as ImageIcon } from 'lucide-react';

const RecipeModal = ({ open, onOpenChange, handleSave, recipe }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cooking_time: '',
    servings: '',
    difficulty: '',
    ingredients: [],
    seasonings: [],
    steps: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (open) {
      if (recipe) {
        setFormData({
          name: recipe.name || '',
          description: recipe.description || '',
          cooking_time: recipe.cooking_time || '',
          servings: recipe.servings || '',
          difficulty: recipe.difficulty || '',
          ingredients: recipe.ingredients || [],
          seasonings: recipe.seasonings || [],
          steps: recipe.steps || []
        });
        setImagePreview(recipe.image_url);
      } else {
        resetForm();
      }
    }
  }, [recipe, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cooking_time: '',
      servings: '',
      difficulty: '',
      ingredients: [],
      seasonings: [],
      steps: []
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert('请输入菜品名称');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    if (formData.description) submitData.append('description', formData.description);
    if (formData.cooking_time) submitData.append('cooking_time', formData.cooking_time);
    if (formData.servings) submitData.append('servings', formData.servings);
    if (formData.difficulty) submitData.append('difficulty', formData.difficulty);
    
    const validIngredients = formData.ingredients.filter(i => i.name.trim());
    const validSeasonings = formData.seasonings.filter(s => s.trim());
    const validSteps = formData.steps.filter(s => s.trim());

    submitData.append('ingredients', JSON.stringify(validIngredients));
    submitData.append('seasonings', JSON.stringify(validSeasonings));
    submitData.append('steps', JSON.stringify(validSteps));

    if (imageFile) {
      submitData.append('image', imageFile);
    }

    handleSave(submitData);
  };

  // Helper to update nested arrays
  const updateArrayItem = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      if (field) {
        newArray[index] = { ...newArray[index], [field]: value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const addArrayItem = (arrayName, initialValue) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], initialValue]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{recipe ? '编辑食谱' : '创建新食谱'}</DialogTitle>
          <DialogDescription>
            填写下面的信息来{recipe ? '更新' : '添加'}你的美味食谱。
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="flex justify-center">
              <label className="relative cursor-pointer group block w-full max-w-sm aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/50 hover:bg-muted transition-all overflow-hidden">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> 更换图片</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">点击上传菜品照片</span>
                  </div>
                )}
              </label>
            </div>

            {/* Basic Info */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">菜品名称 <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="例如：红烧肉" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">描述</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="简单介绍一下这道菜..." className="resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cooking_time">时间 (分钟)</Label>
                  <Input type="number" id="cooking_time" name="cooking_time" value={formData.cooking_time} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="servings">份数 (人)</Label>
                  <Input type="number" id="servings" name="servings" value={formData.servings} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">难度</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="简单">简单</SelectItem>
                      <SelectItem value="中等">中等</SelectItem>
                      <SelectItem value="困难">困难</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">食材用料</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem('ingredients', { name: '', amount: '' })}>
                  <Plus className="w-4 h-4 mr-1" /> 添加
                </Button>
              </div>
              <div className="space-y-2">
                {formData.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input 
                      placeholder="食材名 (如: 猪肉)" 
                      value={ing.name} 
                      onChange={(e) => updateArrayItem('ingredients', idx, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input 
                      placeholder="用量 (如: 500g)" 
                      value={ing.amount} 
                      onChange={(e) => updateArrayItem('ingredients', idx, 'amount', e.target.value)}
                      className="w-24 sm:w-32"
                    />
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeArrayItem('ingredients', idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {formData.ingredients.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-md border border-dashed">
                    还没有添加食材
                  </p>
                )}
              </div>
            </div>

            {/* Seasonings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">配料/调味</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem('seasonings', '')}>
                  <Plus className="w-4 h-4 mr-1" /> 添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.seasonings.map((s, idx) => (
                  <div key={idx} className="flex items-center bg-muted rounded-md pl-3 pr-1 py-1 border">
                    <input 
                      className="bg-transparent border-none focus:outline-none text-sm w-20 sm:w-24"
                      value={s}
                      onChange={(e) => updateArrayItem('seasonings', idx, null, e.target.value)}
                      placeholder="配料名"
                    />
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-background/50" onClick={() => removeArrayItem('seasonings', idx)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {formData.seasonings.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center w-full py-2">无配料</p>
                )}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">烹饪步骤</Label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem('steps', '')}>
                  <Plus className="w-4 h-4 mr-1" /> 添加
                </Button>
              </div>
              <div className="space-y-3">
                {formData.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start group">
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium mt-2">
                      {idx + 1}
                    </div>
                    <Textarea 
                      placeholder={`描述第 ${idx + 1} 步...`}
                      value={step}
                      onChange={(e) => updateArrayItem('steps', idx, null, e.target.value)}
                      className="flex-1 min-h-[80px]"
                    />
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity mt-2" onClick={() => removeArrayItem('steps', idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSubmit}>保存食谱</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
