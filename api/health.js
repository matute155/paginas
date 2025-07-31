module.exports = async (req, res) => {
  // Headers para CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  return res.status(200).json({ 
    status: 'ok', 
    message: 'Serverless functions funcionando correctamente',
    timestamp: new Date().toISOString()
  });
};