function errorHandler(error, req, res, next) {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: '올바른 JSON 형식으로 요청해주세요.' });
  }
  next(error);
}

module.exports = errorHandler;
