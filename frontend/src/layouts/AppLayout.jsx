import { Outlet, NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, Telescope, BarChart2, Settings, ChefHat } from 'lucide-react';
import { cn } from "@/lib/utils";

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="flex h-16 items-center px-6 border-b">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md mr-2">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Fantastic Recipe</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem to="/" icon={<Home className="h-5 w-5" />} label="首页" />
          <NavItem to="/recipes" icon={<BookOpen className="h-5 w-5" />} label="食谱库" />
          <NavItem to="/planning" icon={<Calendar className="h-5 w-5" />} label="计划" />
          <NavItem to="/discovery" icon={<Telescope className="h-5 w-5" />} label="发现" />
          <NavItem to="/stats" icon={<BarChart2 className="h-5 w-5" />} label="统计" />
        </nav>

        <div className="p-4 border-t space-y-1">
           {/* Placeholder for settings/theme */}
           <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
             <Settings className="h-5 w-5 mr-3" />
             设置
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-card flex items-center justify-around px-4 z-50">
        <MobileNavItem to="/" icon={<Home className="h-5 w-5" />} label="首页" />
        <MobileNavItem to="/recipes" icon={<BookOpen className="h-5 w-5" />} label="食谱" />
        <MobileNavItem to="/planning" icon={<Calendar className="h-5 w-5" />} label="计划" />
        <MobileNavItem to="/discovery" icon={<Telescope className="h-5 w-5" />} label="发现" />
        <MobileNavItem to="/stats" icon={<BarChart2 className="h-5 w-5" />} label="统计" />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

const MobileNavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )
      }
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </NavLink>
  );
};

export default AppLayout;

