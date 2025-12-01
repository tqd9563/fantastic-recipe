// API 基础 URL
const API_BASE = '/api';

// 全局变量
let recipes = [];
let currentEditingId = null;
let ingredientIndex = 0;
let seasoningIndex = 0;
let stepIndex = 0;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    loadRecipes();
});

// 加载所有食谱
async function loadRecipes() {
    try {
        const response = await fetch(`${API_BASE}/recipes`);
        recipes = await response.json();
        renderRecipes(recipes);
    } catch (error) {
        console.error('加载食谱失败:', error);
        showAlert('加载食谱失败，请刷新页面重试', 'danger');
    }
}

// 渲染食谱列表
function renderRecipes(recipeList) {
    const container = document.getElementById('recipeList');
    const emptyState = document.getElementById('emptyState');
    
    if (recipeList.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = recipeList.map(recipe => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card recipe-card" onclick="viewRecipe(${recipe.id})">
                ${recipe.image_url ? `<img src="${recipe.image_url}" class="card-img-top" alt="${escapeHtml(recipe.name)}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(recipe.name)}</h5>
                    ${recipe.description ? `<p class="card-text text-muted small">${escapeHtml(recipe.description)}</p>` : ''}
                    <div class="recipe-meta mt-3">
                        ${recipe.cooking_time ? `<div><i class="bi bi-clock"></i> ${recipe.cooking_time} 分钟</div>` : ''}
                        ${recipe.servings ? `<div><i class="bi bi-people"></i> ${recipe.servings} 人份</div>` : ''}
                        ${recipe.difficulty ? `<div><span class="badge bg-secondary badge-difficulty">${escapeHtml(recipe.difficulty)}</span></div>` : ''}
                    </div>
                    ${recipe.ingredients && recipe.ingredients.length > 0 ? 
                        `<div class="mt-2"><small class="text-muted">${recipe.ingredients.length} 种食材</small></div>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// 预览图片
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const existingImage = document.getElementById('existingImage');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            existingImage.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
    }
}

// 查看食谱详情
async function viewRecipe(id) {
    try {
        const response = await fetch(`${API_BASE}/recipes/${id}`);
        const recipe = await response.json();
        
        document.getElementById('viewRecipeName').textContent = recipe.name;
        document.getElementById('editRecipeBtn').setAttribute('onclick', `editRecipe(${recipe.id})`);
        document.getElementById('deleteRecipeBtn').setAttribute('onclick', `confirmDelete(${recipe.id})`);
        
        let content = '';
        
        // 显示图片
        if (recipe.image_url) {
            content += `<div class="mb-3"><img src="${recipe.image_url}" class="img-fluid rounded" alt="${escapeHtml(recipe.name)}"></div>`;
        }
        
        if (recipe.description) {
            content += `<p class="text-muted">${escapeHtml(recipe.description)}</p>`;
        }
        
        // 基本信息
        content += '<div class="row mb-3">';
        if (recipe.cooking_time) {
            content += `<div class="col-md-4"><strong>烹饪时间:</strong> ${recipe.cooking_time} 分钟</div>`;
        }
        if (recipe.servings) {
            content += `<div class="col-md-4"><strong>份数:</strong> ${recipe.servings} 人份</div>`;
        }
        if (recipe.difficulty) {
            content += `<div class="col-md-4"><strong>难度:</strong> <span class="badge bg-secondary">${escapeHtml(recipe.difficulty)}</span></div>`;
        }
        content += '</div>';
        
        // 食材
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            content += '<h6 class="mt-4 mb-2">食材用料</h6><ul class="list-group mb-3">';
            recipe.ingredients.forEach(ing => {
                content += `<li class="list-group-item">${escapeHtml(ing.name)} - ${escapeHtml(ing.amount)}</li>`;
            });
            content += '</ul>';
        }
        
        // 配料
        if (recipe.seasonings && recipe.seasonings.length > 0) {
            content += '<h6 class="mt-4 mb-2">配料表</h6><ul class="list-group mb-3">';
            recipe.seasonings.forEach(seasoning => {
                content += `<li class="list-group-item">${escapeHtml(seasoning)}</li>`;
            });
            content += '</ul>';
        }
        
        // 步骤
        if (recipe.steps && recipe.steps.length > 0) {
            content += '<h6 class="mt-4 mb-2">烹饪步骤</h6><ol class="list-group list-group-numbered">';
            recipe.steps.forEach((step, index) => {
                content += `<li class="list-group-item">${escapeHtml(step)}</li>`;
            });
            content += '</ol>';
        }
        
        document.getElementById('viewRecipeContent').innerHTML = content;
        
        const modal = new bootstrap.Modal(document.getElementById('viewModal'));
        modal.show();
    } catch (error) {
        console.error('加载食谱详情失败:', error);
        showAlert('加载食谱详情失败', 'danger');
    }
}

// 显示添加食谱模态框
function showAddRecipeModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = '添加食谱';
    document.getElementById('recipeForm').reset();
    document.getElementById('recipeId').value = '';
    document.getElementById('ingredientsList').innerHTML = '';
    document.getElementById('seasoningsList').innerHTML = '';
    document.getElementById('stepsList').innerHTML = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('existingImage').style.display = 'none';
    document.getElementById('recipeImage').value = '';
    ingredientIndex = 0;
    seasoningIndex = 0;
    stepIndex = 0;
    
    const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
    modal.show();
}

// 编辑食谱
async function editRecipe(id) {
    try {
        const response = await fetch(`${API_BASE}/recipes/${id}`);
        const recipe = await response.json();
        
        currentEditingId = recipe.id;
        document.getElementById('modalTitle').textContent = '编辑食谱';
        document.getElementById('recipeId').value = recipe.id;
        document.getElementById('recipeName').value = recipe.name;
        document.getElementById('recipeDescription').value = recipe.description || '';
        document.getElementById('cookingTime').value = recipe.cooking_time || '';
        document.getElementById('servings').value = recipe.servings || '';
        document.getElementById('difficulty').value = recipe.difficulty || '';
        
        // 显示现有图片
        const existingImage = document.getElementById('existingImage');
        const existingImg = document.getElementById('existingImg');
        if (recipe.image_url) {
            existingImg.src = recipe.image_url;
            existingImage.style.display = 'block';
        } else {
            existingImage.style.display = 'none';
        }
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('recipeImage').value = '';
        
        // 加载食材
        document.getElementById('ingredientsList').innerHTML = '';
        ingredientIndex = 0;
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ing => {
                addIngredient(ing.name, ing.amount);
            });
        }
        
        // 加载配料
        document.getElementById('seasoningsList').innerHTML = '';
        seasoningIndex = 0;
        if (recipe.seasonings && recipe.seasonings.length > 0) {
            recipe.seasonings.forEach(seasoning => {
                addSeasoning(seasoning);
            });
        }
        
        // 加载步骤
        document.getElementById('stepsList').innerHTML = '';
        stepIndex = 0;
        if (recipe.steps && recipe.steps.length > 0) {
            recipe.steps.forEach(step => {
                addStep(step);
            });
        }
        
        // 关闭查看模态框，打开编辑模态框
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewModal'));
        if (viewModal) viewModal.hide();
        
        const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
        modal.show();
    } catch (error) {
        console.error('加载食谱失败:', error);
        showAlert('加载食谱失败', 'danger');
    }
}

// 添加食材输入框
function addIngredient(name = '', amount = '') {
    const index = ingredientIndex++;
    const div = document.createElement('div');
    div.className = 'ingredient-item';
    div.innerHTML = `
        <div class="row g-2">
            <div class="col-md-5">
                <input type="text" class="form-control form-control-sm" placeholder="食材名称" 
                       value="${escapeHtml(name)}" data-ingredient-name="${index}">
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control form-control-sm" placeholder="用量" 
                       value="${escapeHtml(amount)}" data-ingredient-amount="${index}">
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-sm btn-danger w-100" onclick="removeIngredient(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    document.getElementById('ingredientsList').appendChild(div);
}

// 移除食材
function removeIngredient(btn) {
    btn.closest('.ingredient-item').remove();
}

// 添加配料输入框
function addSeasoning(value = '') {
    const index = seasoningIndex++;
    const div = document.createElement('div');
    div.className = 'seasoning-item';
    div.innerHTML = `
        <div class="row g-2">
            <div class="col-md-10">
                <input type="text" class="form-control form-control-sm" placeholder="配料名称" 
                       value="${escapeHtml(value)}" data-seasoning="${index}">
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-sm btn-danger w-100" onclick="removeSeasoning(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    document.getElementById('seasoningsList').appendChild(div);
}

// 移除配料
function removeSeasoning(btn) {
    btn.closest('.seasoning-item').remove();
}

// 添加步骤输入框
function addStep(value = '') {
    const index = stepIndex++;
    const div = document.createElement('div');
    div.className = 'step-item';
    div.innerHTML = `
        <span class="step-number">${index + 1}</span>
        <div class="row g-2">
            <div class="col-md-10">
                <textarea class="form-control form-control-sm" rows="2" placeholder="描述步骤..." 
                          data-step="${index}">${escapeHtml(value)}</textarea>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-sm btn-danger w-100" onclick="removeStep(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    document.getElementById('stepsList').appendChild(div);
    updateStepNumbers();
}

// 移除步骤
function removeStep(btn) {
    btn.closest('.step-item').remove();
    updateStepNumbers();
}

// 更新步骤编号
function updateStepNumbers() {
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, index) => {
        step.querySelector('.step-number').textContent = index + 1;
    });
}

// 保存食谱
async function saveRecipe() {
    const form = document.getElementById('recipeForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 收集食材
    const ingredients = [];
    document.querySelectorAll('[data-ingredient-name]').forEach(input => {
        const name = input.value.trim();
        const amountInput = document.querySelector(`[data-ingredient-amount="${input.dataset.ingredientName}"]`);
        const amount = amountInput ? amountInput.value.trim() : '';
        if (name) {
            ingredients.push({ name, amount });
        }
    });
    
    // 收集配料
    const seasonings = [];
    document.querySelectorAll('[data-seasoning]').forEach(input => {
        const value = input.value.trim();
        if (value) {
            seasonings.push(value);
        }
    });
    
    // 收集步骤
    const steps = [];
    document.querySelectorAll('[data-step]').forEach(textarea => {
        const value = textarea.value.trim();
        if (value) {
            steps.push(value);
        }
    });
    
    // 创建 FormData
    const formData = new FormData();
    formData.append('name', document.getElementById('recipeName').value.trim());
    formData.append('description', document.getElementById('recipeDescription').value.trim() || '');
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('seasonings', JSON.stringify(seasonings));
    formData.append('steps', JSON.stringify(steps));
    
    const cookingTime = document.getElementById('cookingTime').value;
    if (cookingTime) formData.append('cooking_time', cookingTime);
    
    const servings = document.getElementById('servings').value;
    if (servings) formData.append('servings', servings);
    
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty) formData.append('difficulty', difficulty);
    
    // 添加图片（如果有）
    const imageInput = document.getElementById('recipeImage');
    if (imageInput.files && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }
    
    try {
        const url = currentEditingId 
            ? `${API_BASE}/recipes/${currentEditingId}`
            : `${API_BASE}/recipes`;
        const method = currentEditingId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        if (response.ok) {
            showAlert(currentEditingId ? '食谱更新成功！' : '食谱添加成功！', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('recipeModal'));
            modal.hide();
            loadRecipes();
        } else {
            const error = await response.json();
            throw new Error(error.detail || '保存失败');
        }
    } catch (error) {
        console.error('保存食谱失败:', error);
        showAlert('保存失败：' + error.message, 'danger');
    }
}

// 确认删除
function confirmDelete(id) {
    if (confirm('确定要删除这个食谱吗？此操作无法撤销。')) {
        deleteRecipe(id);
    }
}

// 删除食谱
async function deleteRecipe(id) {
    try {
        const response = await fetch(`${API_BASE}/recipes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('食谱已删除', 'success');
            // 关闭查看模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('viewModal'));
            if (modal) modal.hide();
            loadRecipes();
        } else {
            throw new Error('删除失败');
        }
    } catch (error) {
        console.error('删除食谱失败:', error);
        showAlert('删除失败，请重试', 'danger');
    }
}

// 搜索过滤
function filterRecipes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchTerm))
    );
    renderRecipes(filtered);
}

// 显示提示消息
function showAlert(message, type) {
    // 创建提示框
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
