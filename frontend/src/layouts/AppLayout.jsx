import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, Telescope, BarChart2, Settings, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
            "hidden md:flex flex-col border-r transition-all duration-300 ease-in-out relative",
            isCollapsed ? "w-16" : "w-64",
            "bg-[#FAF9F6]" // Warm off-white / very light cream instead of bluish card color
        )}
      >
        {/* Toggle Button */}
        <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted z-10 hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        <div className={cn("flex h-16 items-center border-b overflow-hidden whitespace-nowrap", isCollapsed ? "justify-center px-0" : "px-6")}>
          <div className="bg-sage-600 text-white p-1.5 rounded-md flex-shrink-0 transition-transform duration-300">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className={cn(
              "text-lg font-bold tracking-tight ml-2 transition-all duration-300 origin-left text-charcoal",
              isCollapsed ? "opacity-0 w-0 translate-x-[-10px]" : "opacity-100 w-auto translate-x-0"
          )}>
            Fantastic
          </span>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <NavItem to="/" icon={<Home className="h-5 w-5" />} label="首页" collapsed={isCollapsed} />
          <NavItem to="/recipes" icon={<BookOpen className="h-5 w-5" />} label="食谱库" collapsed={isCollapsed} />
          <NavItem to="/planning" icon={<Calendar className="h-5 w-5" />} label="计划" collapsed={isCollapsed} />
          <NavItem to="/discovery" icon={<Telescope className="h-5 w-5" />} label="发现" collapsed={isCollapsed} />
          <NavItem to="/stats" icon={<BarChart2 className="h-5 w-5" />} label="统计" collapsed={isCollapsed} />
        </nav>

        <div className="p-3 border-t space-y-1">
           <button 
                className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-sage-100/50 hover:text-sage-700 rounded-md transition-colors overflow-hidden whitespace-nowrap",
                    isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? "设置" : ""}
           >
             <Settings className="h-5 w-5 flex-shrink-0" />
             <span className={cn(
                 "ml-3 transition-all duration-300",
                 isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
             )}>
                设置
             </span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-white flex items-center justify-around px-4 z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <MobileNavItem to="/" icon={<Home className="h-5 w-5" />} label="首页" />
        <MobileNavItem to="/recipes" icon={<BookOpen className="h-5 w-5" />} label="食谱" />
        <MobileNavItem to="/planning" icon={<Calendar className="h-5 w-5" />} label="计划" />
        <MobileNavItem to="/discovery" icon={<Telescope className="h-5 w-5" />} label="发现" />
        <MobileNavItem to="/stats" icon={<BarChart2 className="h-5 w-5" />} label="统计" />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 overflow-hidden whitespace-nowrap group relative",
          isActive
            ? "bg-sage-100 text-sage-800"
            : "text-slate-600 hover:bg-sage-50/50 hover:text-sage-700",
          collapsed && "justify-center px-2"
        )
      }
      title={collapsed ? label : ""}
    >
      <span className={cn("flex-shrink-0 transition-colors", collapsed ? "" : "mr-3")}>{icon}</span>
      <span className={cn(
          "transition-all duration-300",
          collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
      )}>
        {label}
      </span>
      {/* Tooltip-like effect for collapsed state could be added here if needed */}
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

