import { Search, LayoutDashboard, Trophy, GraduationCap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </Link>
  );
};

const Navbar = () => (
  <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl fixed h-full">
    <div className="p-6 flex items-center gap-3 border-b border-slate-800">
      <div className="bg-blue-500 p-2 rounded-lg">
        <GraduationCap size={24} />
      </div>
      <span className="text-xl font-bold tracking-tight uppercase">
        G-Scores
      </span>
    </div>

    <nav className="flex-1 p-4 space-y-2 mt-4">
      <NavItem to="/" icon={Search} label="Score Search" />
      <NavItem to="/statistics" icon={LayoutDashboard} label="Statistics" />
      <NavItem to="/top-10" icon={Trophy} label="Top 10 Rankings" />
    </nav>

    <div className="p-4 border-t border-slate-800">
      <div className="text-xs text-slate-500 text-center">
        © 2025 Examination Portal
      </div>
    </div>
  </aside>
);

export default Navbar;
