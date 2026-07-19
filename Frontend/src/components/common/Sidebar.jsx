import { NavLink } from 'react-router-dom';
import { cn } from '@utils';
import { Home, Store, Star, Users, LayoutDashboard, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Stores', path: '/stores', icon: Store },
  { name: 'My Ratings', path: '/my-ratings', icon: Star },
  { name: 'Profile', path: '/profile', icon: Users },
];

const adminNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Stores', path: '/admin/stores', icon: Store },
];

const ownerNavItems = [
  { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
  { name: 'Raters', path: '/owner/raters', icon: Users },
];

export default function Sidebar({ isOpen, onClose, role = 'normal_user' }) {
  const items = role === 'admin' ? adminNavItems : role === 'store_owner' ? ownerNavItems : navItems;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => {
                // This will be handled by the layout
                window.location.href = '/login';
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout

            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
