
import React from 'react';
import type { View } from '../App';
import { UsersIcon } from './icons/UsersIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { PackageIcon } from './icons/PackageIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'students', label: 'Students', icon: UsersIcon },
    { id: 'teachers', label: 'Teachers', icon: BriefcaseIcon },
    { id: 'inventory', label: 'Inventory', icon: PackageIcon },
    { id: 'data', label: 'Data Sheets', icon: DatabaseIcon },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col">
      <div className="h-20 flex items-center justify-center bg-slate-900">
        <BookOpenIcon className="w-8 h-8 mr-3 text-sky-400" />
        <h1 className="text-xl font-bold">School System</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id as View)}
                className={`flex items-center w-full px-4 py-3 my-1 text-left rounded-lg transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-sky-500 text-white'
                    : 'hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-4" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400">© 2024 School Management</p>
      </div>
    </aside>
  );
};

export default Sidebar;
