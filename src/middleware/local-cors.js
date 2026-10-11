const { allowedOrigins } = require('../config/env');

function isLocalOrigin(origin) {
  if (origin === 'null') return true;
  try {
    const url = new URL(origin);
    return ['http:', 'https:'].includes(url.protocol) &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch { return false; }
}

function isAllowedOrigin(origin) {
  return isLocalOrigin(origin) || allowedOrigins.includes(origin);
}

function localCors(req, res, next) {
  const origin = req.get('Origin');
  res.vary('Origin');
  if (origin) {
    if (!isAllowedOrigin(origin)) {
      return res.status(403).json({ error: '허용되지 않은 주소에서 온 요청입니다.' });
    }
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
}

module.exports = localCors;
