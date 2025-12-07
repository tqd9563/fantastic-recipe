import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, X, Clock, Users, Flame } from 'lucide-react';
import { cn } from "@/lib/utils";
import { getTagColor } from "@/lib/tagUtils";

const RecipeDetailDrawer = ({ recipe, open, onOpenChange, onEdit, onDelete }) => {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-md border-l bg-background p-0 shadow-2xl data-[state=open]:duration-500 data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-lg rounded-none sm:rounded-none overflow-hidden gap-0 translate-x-0 !translate-y-0 top-0 left-auto bottom-auto [&>button]:hidden">
        <div className="flex flex-col h-full max-h-screen">
            {/* Header Image */}
            <div className="relative h-64 bg-muted shrink-0">
                {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-sage-100">
                        No Image
                    </div>
                )}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <h2 className="text-2xl font-bold text-white">{recipe.name}</h2>
                    <div className="flex gap-2 mt-2">
                        {recipe.tags && recipe.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className={cn("border-none opacity-90 hover:opacity-100", getTagColor(tag))}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="space-y-6">
                    {/* Meta Stats */}
                    <div className="flex justify-between items-center p-4 bg-sage-50 rounded-xl border border-sage-100">
                        <div className="text-center">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">耗时</div>
                            <div className="font-semibold flex items-center justify-center gap-1">
                                <Clock className="h-4 w-4 text-sage-600" />
                                {recipe.cooking_time || '--'}m
                            </div>
                        </div>
                        <div className="w-px h-8 bg-sage-200" />
                        <div className="text-center">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">难度</div>
                            <div className="font-semibold flex items-center justify-center gap-1">
                                <Flame className="h-4 w-4 text-orange-500" />
                                {recipe.difficulty || '--'}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-sage-200" />
                        <div className="text-center">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">评分</div>
                            <div className="font-semibold text-orange-500">
                                {'⭐'.repeat(recipe.rating || 0) || '-'}
                            </div>
                        </div>
                    </div>

                    {recipe.description && (
                        <p className="text-muted-foreground leading-relaxed">
                            {recipe.description}
                        </p>
                    )}

                    <Separator />

                    {/* Ingredients */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <span className="w-1 h-6 bg-sage-500 rounded-full"></span>
                            食材
                        </h3>
                        <div className="space-y-2">
                            {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
                                <div key={idx} className="flex justify-between py-2 border-b border-dashed border-gray-100 last:border-0">
                                    <span>{ing.name}</span>
                                    <span className="font-medium text-sage-700">{ing.amount}</span>
                                </div>
                            ))}
                        </div>
                        {recipe.seasonings && recipe.seasonings.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">配料</h4>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.seasonings.map((s, idx) => (
                                        <Badge key={idx} variant="outline" className="text-muted-foreground">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Steps */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <span className="w-1 h-6 bg-sage-500 rounded-full"></span>
                            步骤
                        </h3>
                        <div className="space-y-6 pl-2 border-l-2 border-sage-100 ml-2">
                            {recipe.steps && recipe.steps.map((step, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sage-500 ring-4 ring-white" />
                                    <div className="text-xs font-bold text-sage-600 mb-1">STEP {idx + 1}</div>
                                    <p className="text-sm leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer Actions */}
            <div className="p-4 border-t bg-background flex justify-between gap-4 shrink-0 z-10">
                <Button 
                    variant="outline" 
                    className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
                    onClick={() => onDelete(recipe.id)}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> 删除
                </Button>
                <Button 
                    className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
                    onClick={() => onEdit(recipe)}
                >
                    <Edit className="mr-2 h-4 w-4" /> 编辑
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailDrawer;

