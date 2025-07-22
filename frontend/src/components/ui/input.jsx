import React from 'react';

const Input = ({ type = "text", ...props }) => {
  return (
    <input
      type={type}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
      {...props}
    />
  );
};

export default Input;
