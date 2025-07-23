import React from 'react';
import { Camera } from 'lucide-react';

const FileUpload = ({ onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
    <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center">
      <Camera className="mx-auto mb-3 text-gray-400" />
      <p className="text-sm text-gray-500">
        Arrastrá tus fotos o hacé clic para subirlas
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="mt-4 w-full border border-gray-300 p-2 rounded"
      />
    </div>
  </div>
);

export default FileUpload;
