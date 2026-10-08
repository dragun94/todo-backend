function isLocalOrigin(origin) {
  if (origin === 'null') return true;
  try {
    const url = new URL(origin);
    return ['http:', 'https:'].includes(url.protocol) &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch { return false; }
}

function localCors(req, res, next) {
  const origin = req.get('Origin');
  res.vary('Origin');
  if (origin) {
    if (!isLocalOrigin(origin)) {
      return res.status(403).json({ error: '로컬 프런트엔드에서 요청해주세요.' });
    }
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
}

module.exports = localCors;
