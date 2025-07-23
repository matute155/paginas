import React from 'react';

const CheckboxGroup = ({ label, options, selected, onToggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
            selected.includes(opt)
              ? 'bg-blue-100 border-blue-500'
              : 'bg-white border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

export default CheckboxGroup;