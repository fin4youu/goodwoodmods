import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase';
import { LogOut, Shield, LayoutDashboard, BookOpen, Users } from 'lucide-react';

export default function Layout() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#004225] text-white flex flex-col">
        <div className="p-6 border-b border-[#00331c] flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h1 className="font-bold text-lg tracking-tight">Goodwood RBLX</h1>
            <p className="text-xs text-[#D4AF37] uppercase tracking-wider">Moderator Academy</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#00331c] transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          {profile?.role === 'trainee' && (
            <Link to="/course" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#00331c] transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>Training Course</span>
            </Link>
          )}

          {profile?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#00331c] transition-colors">
              <Users className="w-5 h-5" />
              <span>Staff Management</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-[#00331c]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user.photoURL || ''} alt="Profile" className="w-10 h-10 rounded-full border-2 border-[#D4AF37]" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.displayName}</p>
              <p className="text-xs text-gray-300 capitalize">{profile?.role || 'Guest'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
