import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import RecipeLibrary from './pages/RecipeLibrary';
import Planning from './pages/Planning';
import Discovery from './pages/Discovery';
import Stats from './pages/Stats';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="recipes" element={<RecipeLibrary />} />
        <Route path="planning" element={<Planning />} />
        <Route path="discovery" element={<Discovery />} />
        <Route path="stats" element={<Stats />} />
      </Route>
    </Routes>
  );
}

export default App;
