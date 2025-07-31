const fs = require('fs').promises;
const path = require('path');

// Función para procesar archivos desde FormData en serverless
function parseMultipart(body, boundary) {
  const parts = [];
  const boundaryPattern = `--${boundary}`;
  const sections = body.split(boundaryPattern);
  
  for (let section of sections) {
    if (section.includes('Content-Disposition')) {
      const lines = section.split('\r\n');
      let name = '';
      let filename = '';
      let contentType = '';
      let content = '';
      
      // Parsear headers
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('Content-Disposition')) {
          const nameMatch = line.match(/name="([^"]+)"/);
          const filenameMatch = line.match(/filename="([^"]+)"/);
          if (nameMatch) name = nameMatch[1];
          if (filenameMatch) filename = filenameMatch[1];
        } else if (line.includes('Content-Type')) {
          contentType = line.split(': ')[1];
        } else if (line === '' && i < lines.length - 1) {
          // Contenido después de línea vacía
          content = lines.slice(i + 1, -1).join('\r\n');
          break;
        }
      }
      
      if (name) {
        parts.push({
          name,
          filename,
          contentType,
          content: filename ? Buffer.from(content, 'binary') : content
        });
      }
    }
  }
  
  return parts;
}

// Función para convertir archivos a base64 y generar URLs de datos
function processFiles(files) {
  const processedFiles = [];
  
  for (let file of files) {
    if (file.filename && file.content) {
      // Generar nombre único
      const uniqueName = `${Date.now()}-${file.filename}`;
      const base64 = file.content.toString('base64');
      const mimeType = file.contentType || 'image/jpeg';
      
      // Data URL para almacenamiento temporal
      const dataUrl = `data:${mimeType};base64,${base64}`;
      
      processedFiles.push({
        originalName: file.filename,
        uniqueName,
        dataUrl,
        size: file.content.length,
        mimeType
      });
    }
  }
  
  return processedFiles;
}

// Para esta implementación inicial, vamos a usar data URLs
// En una implementación más robusta, podrías integrar con:
// - Cloudinary
// - AWS S3
// - Vercel Blob
// - Supabase Storage

function generateImageUrls(processedFiles) {
  // Por ahora retornamos las data URLs
  // En producción, aquí subirías a un servicio externo
  return processedFiles.map(file => file.dataUrl);
}

// Middleware para parsear multipart/form-data en serverless
function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      resolve({ fields: {}, files: [] });
      return;
    }
    
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      reject(new Error('No boundary found in Content-Type'));
      return;
    }
    
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString('binary');
    });
    
    req.on('end', () => {
      try {
        const parts = parseMultipart(body, boundary);
        const fields = {};
        const files = [];
        
        parts.forEach(part => {
          if (part.filename) {
            files.push(part);
          } else {
            fields[part.name] = part.content;
          }
        });
        
        resolve({ fields, files });
      } catch (error) {
        reject(error);
      }
    });
    
    req.on('error', reject);
  });
}

module.exports = {
  parseFormData,
  processFiles,
  generateImageUrls
};