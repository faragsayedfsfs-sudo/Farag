
import React, { useState, useEffect } from 'react';
import type { SheetData, DataRow } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface DataSheetProps {
  sheet: SheetData;
  updateSheetData: (newRows: DataRow[]) => void;
}

const columnHeaders: { key: keyof Omit<DataRow, 'id'>; label: string }[] = [
  { key: 'colA', label: 'Column A' },
  { key: 'colB', label: 'Column B' },
  { key: 'colC', label: 'Column C' },
  { key: 'colD', label: 'Column D' },
  { key: 'colE', label: 'Column E' },
];

const DataSheet: React.FC<DataSheetProps> = ({ sheet, updateSheetData }) => {
  const [rows, setRows] = useState<DataRow[]>(sheet.rows);
  const [editingCell, setEditingCell] = useState<{ rowId: string; colKey: string } | null>(null);

  useEffect(() => {
    setRows(sheet.rows); // Sync with props if sheet changes
  }, [sheet]);

  const handleCellChange = (rowId: string, colKey: keyof Omit<DataRow, 'id'>, value: string) => {
    const newRows = rows.map(row => 
      row.id === rowId ? { ...row, [colKey]: value } : row
    );
    setRows(newRows);
  };

  const handleCellBlur = () => {
    updateSheetData(rows);
    setEditingCell(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLElement).blur();
    }
  };

  const addRow = () => {
    const newRow: DataRow = {
      id: `row-${Date.now()}`,
      colA: '', colB: '', colC: '', colD: '', colE: '',
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    updateSheetData(newRows);
  };
  
  const deleteRow = (rowId: string) => {
    const newRows = rows.filter(row => row.id !== rowId);
    setRows(newRows);
    updateSheetData(newRows);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{sheet.name}</h2>
        <button
          onClick={addRow}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Add Row
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columnHeaders.map(header => (
                <th key={header.key} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {header.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {rows.map(row => (
              <tr key={row.id}>
                {columnHeaders.map(header => (
                  <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-800" onClick={() => setEditingCell({ rowId: row.id, colKey: header.key })}>
                    {editingCell?.rowId === row.id && editingCell?.colKey === header.key ? (
                      <input
                        type="text"
                        value={row[header.key]}
                        onChange={(e) => handleCellChange(row.id, header.key, e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full p-1 border border-sky-500 rounded-md"
                      />
                    ) : (
                      row[header.key] || <span className="text-slate-400">empty</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => deleteRow(row.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataSheet;
