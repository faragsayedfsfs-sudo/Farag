
import React, { useState } from 'react';
import type { SheetData } from '../types';
import DataSheet from './DataSheet';
import { DatabaseIcon } from './icons/DatabaseIcon';

interface DataManagerProps {
  sheets: SheetData[];
  updateDataSheet: (sheetId: string, newRows: SheetData['rows']) => void;
}

const DataManager: React.FC<DataManagerProps> = ({ sheets, updateDataSheet }) => {
  const [activeSheetId, setActiveSheetId] = useState<string>(sheets[0]?.id || '');

  const activeSheet = sheets.find(s => s.id === activeSheetId);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Data Sheets</h1>
      <div className="flex border-b border-slate-300 mb-6 overflow-x-auto">
        {sheets.map((sheet) => (
          <button
            key={sheet.id}
            onClick={() => setActiveSheetId(sheet.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              activeSheetId === sheet.id
                ? 'border-b-2 border-sky-500 text-sky-600'
                : 'text-slate-500 hover:text-sky-500'
            }`}
          >
            <DatabaseIcon className="w-4 h-4 mr-2" />
            {sheet.name}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeSheet ? (
          <DataSheet
            key={activeSheet.id} // Add key to force re-mount on sheet change
            sheet={activeSheet}
            updateSheetData={(newRows) => updateDataSheet(activeSheet.id, newRows)}
          />
        ) : (
          <p>No sheets available.</p>
        )}
      </div>
    </div>
  );
};

export default DataManager;
