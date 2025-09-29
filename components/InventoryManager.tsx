
import React from 'react';
import type { Item } from '../types';

interface InventoryManagerProps {
  items: Item[];
  updateItemQuantity: (itemId: string, newQuantity: number) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ items, updateItemQuantity }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Inventory Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Item ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-bold">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-red-500 text-white rounded-md font-bold text-lg leading-none">-</button>
                      <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-green-500 text-white rounded-md font-bold text-lg leading-none">+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
