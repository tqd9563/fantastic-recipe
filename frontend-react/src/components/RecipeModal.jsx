import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';

const RecipeModal = ({ show, handleClose, handleSave, recipe }) => {
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
  }, [recipe, show]);

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

  // 食材操作
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '' }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // 配料操作
  const addSeasoning = () => {
    setFormData(prev => ({
      ...prev,
      seasonings: [...prev.seasonings, '']
    }));
  };

  const updateSeasoning = (index, value) => {
    const newSeasonings = [...formData.seasonings];
    newSeasonings[index] = value;
    setFormData(prev => ({ ...prev, seasonings: newSeasonings }));
  };

  const removeSeasoning = (index) => {
    setFormData(prev => ({
      ...prev,
      seasonings: prev.seasonings.filter((_, i) => i !== index)
    }));
  };

  // 步骤操作
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const updateStep = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
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
    
    // 过滤空值
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

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{recipe ? '编辑食谱' : '添加食谱'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>菜品图片</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="mt-2">
                <Image src={imagePreview} thumbnail style={{ maxHeight: '200px' }} />
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>菜品名称 <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>菜品描述</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>烹饪时间（分钟）</Form.Label>
                <Form.Control
                  type="number"
                  name="cooking_time"
                  value={formData.cooking_time}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>份数</Form.Label>
                <Form.Control
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>难度</Form.Label>
                <Form.Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="">请选择</option>
                  <option value="简单">简单</option>
                  <option value="中等">中等</option>
                  <option value="困难">困难</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-4">
            <Form.Label>食材用料</Form.Label>
            {formData.ingredients.map((ing, index) => (
              <Row key={index} className="mb-2">
                <Col xs={5}>
                  <Form.Control
                    placeholder="食材名称"
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  />
                </Col>
                <Col xs={5}>
                  <Form.Control
                    placeholder="用量"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  />
                </Col>
                <Col xs={2}>
                  <Button variant="danger" size="sm" onClick={() => removeIngredient(index)}>
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addIngredient}>
              <FaPlus /> 添加食材
            </Button>
          </div>

          <div className="mb-4">
            <Form.Label>配料表</Form.Label>
            {formData.seasonings.map((seasoning, index) => (
              <Row key={index} className="mb-2">
                <Col xs={10}>
                  <Form.Control
                    placeholder="配料名称"
                    value={seasoning}
                    onChange={(e) => updateSeasoning(index, e.target.value)}
                  />
                </Col>
                <Col xs={2}>
                  <Button variant="danger" size="sm" onClick={() => removeSeasoning(index)}>
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addSeasoning}>
              <FaPlus /> 添加配料
            </Button>
          </div>

          <div className="mb-4">
            <Form.Label>烹饪步骤</Form.Label>
            {formData.steps.map((step, index) => (
              <Row key={index} className="mb-2">
                <Col xs={10}>
                  <div className="d-flex">
                    <span className="me-2 mt-2 badge bg-secondary rounded-circle" style={{width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{index + 1}</span>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="描述步骤..."
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                    />
                  </div>
                </Col>
                <Col xs={2}>
                  <Button variant="danger" size="sm" onClick={() => removeStep(index)}>
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addStep}>
              <FaPlus /> 添加步骤
            </Button>
          </div>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>取消</Button>
        <Button variant="primary" onClick={handleSubmit}>保存</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeModal;

