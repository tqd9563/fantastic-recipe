import { useState, useEffect } from 'react';
import { Container, Navbar, Button, Row, Col, Form, InputGroup, Card, Modal, Badge } from 'react-bootstrap';
import { FaSearch, FaPlus, FaClock, FaUserFriends, FaTrash, FaEdit, FaJournalWhills } from 'react-icons/fa';
import { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } from './services/api';
import RecipeModal from './components/RecipeModal';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [viewModalShow, setViewModalShow] = useState(false);
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
      alert('加载食谱失败');
    }
  };

  const handleAddRecipe = () => {
    setCurrentRecipe(null);
    setShowModal(true);
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setViewModalShow(false);
    setShowModal(true);
  };

  const handleViewRecipe = async (id) => {
    try {
      const recipe = await getRecipe(id);
      setViewRecipe(recipe);
      setViewModalShow(true);
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      alert('加载食谱详情失败');
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (confirm('确定要删除这个食谱吗？此操作无法撤销。')) {
      try {
        await deleteRecipe(id);
        setViewModalShow(false);
        fetchRecipes();
      } catch (error) {
        console.error('Failed to delete recipe:', error);
        alert('删除失败');
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
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">
            <FaJournalWhills className="me-2" /> 食谱管理
          </Navbar.Brand>
          <Button variant="light" onClick={handleAddRecipe}>
            <FaPlus className="me-1" /> 添加食谱
          </Button>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="搜索食谱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        <Row>
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaJournalWhills style={{ fontSize: '4rem', color: '#ccc' }} />
              <p className="mt-3">暂无食谱，点击"添加食谱"开始创建吧！</p>
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <Col md={6} lg={4} className="mb-4" key={recipe.id}>
                <Card className="recipe-card" onClick={() => handleViewRecipe(recipe.id)}>
                  {recipe.image_url && (
                    <Card.Img variant="top" src={recipe.image_url} alt={recipe.name} />
                  )}
                  <Card.Body>
                    <Card.Title>{recipe.name}</Card.Title>
                    {recipe.description && (
                      <Card.Text className="text-muted small text-truncate">
                        {recipe.description}
                      </Card.Text>
                    )}
                    <div className="d-flex gap-3 mt-3 text-muted small">
                      {recipe.cooking_time && (
                        <div><FaClock className="me-1" />{recipe.cooking_time} 分钟</div>
                      )}
                      {recipe.servings && (
                        <div><FaUserFriends className="me-1" />{recipe.servings} 人份</div>
                      )}
                      {recipe.difficulty && (
                        <Badge bg="secondary">{recipe.difficulty}</Badge>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* 查看详情模态框 */}
      <Modal show={viewModalShow} onHide={() => setViewModalShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{viewRecipe?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewRecipe && (
            <>
              {viewRecipe.image_url && (
                <div className="mb-3">
                  <img src={viewRecipe.image_url} className="img-fluid rounded w-100" alt={viewRecipe.name} style={{ maxHeight: '400px', objectFit: 'cover' }} />
                </div>
              )}
              
              {viewRecipe.description && (
                <p className="text-muted">{viewRecipe.description}</p>
              )}

              <div className="d-flex gap-4 mb-4 p-3 bg-light rounded">
                {viewRecipe.cooking_time && (
                  <div><strong>烹饪时间:</strong> {viewRecipe.cooking_time} 分钟</div>
                )}
                {viewRecipe.servings && (
                  <div><strong>份数:</strong> {viewRecipe.servings} 人份</div>
                )}
                {viewRecipe.difficulty && (
                  <div><strong>难度:</strong> <Badge bg="secondary">{viewRecipe.difficulty}</Badge></div>
                )}
              </div>

              {viewRecipe.ingredients?.length > 0 && (
                <div className="mb-4">
                  <h5>食材用料</h5>
                  <ul className="list-group">
                    {viewRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        {ing.name}
                        <span className="badge bg-primary rounded-pill">{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {viewRecipe.seasonings?.length > 0 && (
                <div className="mb-4">
                  <h5>配料表</h5>
                  <ul className="list-group">
                    {viewRecipe.seasonings.map((s, idx) => (
                      <li key={idx} className="list-group-item">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {viewRecipe.steps?.length > 0 && (
                <div className="mb-4">
                  <h5>烹饪步骤</h5>
                  <div className="list-group">
                    {viewRecipe.steps.map((step, idx) => (
                      <div key={idx} className="list-group-item d-flex">
                        <div className="step-number flex-shrink-0">{idx + 1}</div>
                        <div>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDeleteRecipe(viewRecipe.id)}>
            <FaTrash className="me-1" /> 删除
          </Button>
          <Button variant="secondary" onClick={() => setViewModalShow(false)}>关闭</Button>
          <Button variant="primary" onClick={() => handleEditRecipe(viewRecipe)}>
            <FaEdit className="me-1" /> 编辑
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 添加/编辑模态框 */}
      <RecipeModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
        recipe={currentRecipe}
      />
    </>
  );
}

export default App;

