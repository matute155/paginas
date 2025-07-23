// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-3.5">{icon}</div>}
      <input
        {...props}
        className={`w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);


export default Input;
